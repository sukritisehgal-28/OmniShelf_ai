"""
Two-Stage Shelf Detection System
================================
Stage 1: Generic object detection to find all products on shelf
Stage 2: Crop each detection and classify with Grozi-120 model

This works on real shelf images without retraining!
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Tuple
import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from product_mapping import PRODUCT_NAME_MAP, get_display_name, get_category

# Paths
GROZI_MODEL_PATH = Path(__file__).parent / "runs/detect/train_colab/weights/best.pt"
GENERIC_MODEL_PATH = "yolov8n.pt"  # Pre-trained on COCO (80 classes)


class TwoStageDetector:
    """
    Two-stage detection for real shelf images.
    
    Stage 1: Generic YOLOv8 finds "bottle", "cup", "cell phone" (product-like objects)
    Stage 2: Grozi model classifies each cropped region
    """
    
    # COCO classes that look like retail products
    PRODUCT_LIKE_CLASSES = {
        39: "bottle",
        40: "wine glass", 
        41: "cup",
        42: "fork",
        43: "knife",
        44: "spoon",
        45: "bowl",
        46: "banana",
        47: "apple",
        48: "sandwich",
        49: "orange",
        50: "broccoli",
        51: "carrot",
        52: "hot dog",
        53: "pizza",
        54: "donut",
        55: "cake",
        67: "cell phone",  # Sometimes detects product boxes
        73: "book",        # Can detect boxes
        74: "clock",
        75: "vase",
        76: "scissors",
        77: "teddy bear",
        78: "hair drier",
        79: "toothbrush",
    }
    
    def __init__(self, grozi_model_path: str = None, use_sliding_window: bool = True):
        """
        Initialize both detection models.
        
        Args:
            grozi_model_path: Path to trained Grozi-120 model
            use_sliding_window: Use sliding window for dense shelves
        """
        self.grozi_model_path = grozi_model_path or str(GROZI_MODEL_PATH)
        self.use_sliding_window = use_sliding_window
        
        print("Loading models...")
        
        # Stage 1: Generic detector (YOLOv8 nano - fast)
        print("  Loading generic detector (YOLOv8n)...")
        self.generic_model = YOLO(GENERIC_MODEL_PATH)
        
        # Stage 2: Grozi classifier
        print(f"  Loading Grozi model from {self.grozi_model_path}...")
        self.grozi_model = YOLO(self.grozi_model_path)
        
        print("Models loaded!")
    
    def detect_shelf(
        self, 
        image_path: str,
        conf_threshold: float = 0.3,
        classification_conf: float = 0.5,
        use_sliding_window: bool = None,
        window_size: Tuple[int, int] = (416, 416),
        stride: int = 200,
        visualize: bool = False
    ) -> Dict[str, Any]:
        """
        Run two-stage detection on a shelf image.
        
        Args:
            image_path: Path to shelf image
            conf_threshold: Confidence threshold for generic detection
            classification_conf: Confidence threshold for Grozi classification
            use_sliding_window: Override instance setting
            window_size: Size of sliding window
            stride: Stride for sliding window
            visualize: Whether to save visualization
            
        Returns:
            Dictionary with detections and metadata
        """
        use_sw = use_sliding_window if use_sliding_window is not None else self.use_sliding_window
        
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            return {"error": f"Could not load image: {image_path}"}
        
        h, w = image.shape[:2]
        
        all_detections = []
        
        # Method 1: Generic object detection
        generic_detections = self._stage1_generic_detection(image, conf_threshold)
        
        # Method 2: Sliding window (for dense shelves)
        if use_sw:
            sw_detections = self._stage1_sliding_window(
                image, window_size, stride, classification_conf
            )
            all_detections.extend(sw_detections)
        
        # Classify generic detections with Grozi model
        for det in generic_detections:
            x1, y1, x2, y2 = det["bbox"]
            
            # Add padding around detection
            pad = 20
            x1 = max(0, x1 - pad)
            y1 = max(0, y1 - pad)
            x2 = min(w, x2 + pad)
            y2 = min(h, y2 + pad)
            
            # Crop and classify
            crop = image[y1:y2, x1:x2]
            if crop.size == 0:
                continue
                
            classification = self._stage2_classify(crop, classification_conf)
            
            if classification:
                all_detections.append({
                    "product_name": classification["product_name"],
                    "grozi_class": classification["grozi_class"],
                    "confidence": classification["confidence"],
                    "bbox": [x1, y1, x2, y2],
                    "category": get_category(classification["grozi_class"]),
                    "method": "generic_detection"
                })
        
        # Remove duplicates (NMS across all detections)
        final_detections = self._nms_across_methods(all_detections)
        
        # Create result
        result = {
            "image_path": image_path,
            "image_size": {"width": w, "height": h},
            "total_detections": len(final_detections),
            "detections": final_detections,
            "unique_products": list(set(d["product_name"] for d in final_detections))
        }
        
        # Visualize if requested
        if visualize:
            vis_path = self._visualize(image, final_detections, image_path)
            result["visualization_path"] = vis_path
        
        return result
    
    def _stage1_generic_detection(
        self, 
        image: np.ndarray, 
        conf_threshold: float
    ) -> List[Dict]:
        """
        Stage 1: Use generic YOLO to find product-like objects.
        """
        results = self.generic_model(image, conf=conf_threshold, verbose=False)
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                
                # Only keep product-like classes
                if cls_id in self.PRODUCT_LIKE_CLASSES:
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    detections.append({
                        "bbox": [x1, y1, x2, y2],
                        "generic_class": self.PRODUCT_LIKE_CLASSES[cls_id],
                        "generic_conf": float(box.conf[0])
                    })
        
        return detections
    
    def _stage1_sliding_window(
        self,
        image: np.ndarray,
        window_size: Tuple[int, int],
        stride: int,
        conf_threshold: float
    ) -> List[Dict]:
        """
        Stage 1 Alternative: Sliding window approach for dense shelves.
        """
        h, w = image.shape[:2]
        win_w, win_h = window_size
        
        detections = []
        
        for y in range(0, h - win_h + 1, stride):
            for x in range(0, w - win_w + 1, stride):
                # Extract window
                window = image[y:y+win_h, x:x+win_w]
                
                # Run Grozi model on window
                results = self.grozi_model(
                    window, 
                    conf=conf_threshold, 
                    verbose=False,
                    imgsz=416
                )
                
                for result in results:
                    boxes = result.boxes
                    for box in boxes:
                        # Get bbox in window coordinates
                        bx1, by1, bx2, by2 = map(int, box.xyxy[0].tolist())
                        
                        # Convert to image coordinates
                        x1 = x + bx1
                        y1 = y + by1
                        x2 = x + bx2
                        y2 = y + by2
                        
                        cls_id = int(box.cls[0])
                        grozi_class = f"grozi_{cls_id}"
                        
                        detections.append({
                            "product_name": get_display_name(grozi_class),
                            "grozi_class": grozi_class,
                            "confidence": float(box.conf[0]),
                            "bbox": [x1, y1, x2, y2],
                            "category": get_category(grozi_class),
                            "method": "sliding_window"
                        })
        
        return detections
    
    def _stage2_classify(
        self, 
        crop: np.ndarray, 
        conf_threshold: float
    ) -> Dict[str, Any]:
        """
        Stage 2: Classify a cropped region with Grozi model.
        """
        # Resize crop to model input size
        crop_resized = cv2.resize(crop, (416, 416))
        
        # Run Grozi model
        results = self.grozi_model(
            crop_resized,
            conf=conf_threshold,
            verbose=False,
            imgsz=416
        )
        
        best_detection = None
        best_conf = 0
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                conf = float(box.conf[0])
                if conf > best_conf:
                    cls_id = int(box.cls[0])
                    grozi_class = f"grozi_{cls_id}"
                    best_detection = {
                        "grozi_class": grozi_class,
                        "product_name": get_display_name(grozi_class),
                        "confidence": conf
                    }
                    best_conf = conf
        
        return best_detection
    
    def _nms_across_methods(
        self, 
        detections: List[Dict], 
        iou_threshold: float = 0.5
    ) -> List[Dict]:
        """
        Non-maximum suppression across all detection methods.
        """
        if not detections:
            return []
        
        # Sort by confidence
        detections = sorted(detections, key=lambda x: x["confidence"], reverse=True)
        
        keep = []
        while detections:
            best = detections.pop(0)
            keep.append(best)
            
            # Remove overlapping detections
            remaining = []
            for det in detections:
                iou = self._compute_iou(best["bbox"], det["bbox"])
                if iou < iou_threshold:
                    remaining.append(det)
            
            detections = remaining
        
        return keep
    
    def _compute_iou(self, box1: List[int], box2: List[int]) -> float:
        """Compute IoU between two boxes."""
        x1 = max(box1[0], box2[0])
        y1 = max(box1[1], box2[1])
        x2 = min(box1[2], box2[2])
        y2 = min(box1[3], box2[3])
        
        if x2 <= x1 or y2 <= y1:
            return 0.0
        
        intersection = (x2 - x1) * (y2 - y1)
        area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
        area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
        union = area1 + area2 - intersection
        
        return intersection / union if union > 0 else 0.0
    
    def _visualize(
        self, 
        image: np.ndarray, 
        detections: List[Dict],
        original_path: str
    ) -> str:
        """Save visualization with bounding boxes."""
        vis_image = image.copy()
        
        # Colors for different categories
        colors = {
            "Beverages": (255, 0, 0),      # Blue
            "Snacks": (0, 255, 0),          # Green
            "Candy": (0, 0, 255),            # Red
            "Health": (255, 255, 0),         # Cyan
            "Personal Care": (255, 0, 255),  # Magenta
            "Household": (0, 255, 255),      # Yellow
            "Food": (128, 128, 255),         # Light red
            "Unknown": (128, 128, 128),      # Gray
        }
        
        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            category = det.get("category", "Unknown")
            color = colors.get(category, (128, 128, 128))
            
            # Draw box
            cv2.rectangle(vis_image, (x1, y1), (x2, y2), color, 2)
            
            # Draw label
            label = f"{det['product_name'][:20]} ({det['confidence']:.0%})"
            label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)[0]
            
            cv2.rectangle(
                vis_image, 
                (x1, y1 - label_size[1] - 10),
                (x1 + label_size[0], y1),
                color, -1
            )
            cv2.putText(
                vis_image, label,
                (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1
            )
        
        # Save
        output_dir = Path(original_path).parent / "two_stage_results"
        output_dir.mkdir(exist_ok=True)
        output_path = output_dir / f"detected_{Path(original_path).name}"
        cv2.imwrite(str(output_path), vis_image)
        
        return str(output_path)


def test_on_real_shelves():
    """Test the two-stage detector on real shelf images."""
    
    # Initialize detector
    detector = TwoStageDetector(use_sliding_window=True)
    
    # Find real shelf images
    real_shelves_dir = Path(__file__).parent / "dataset/real_shelves/images"
    
    if not real_shelves_dir.exists():
        print(f"Real shelves directory not found: {real_shelves_dir}")
        return
    
    images = list(real_shelves_dir.glob("*.jpg")) + list(real_shelves_dir.glob("*.png"))
    
    if not images:
        print("No images found in real_shelves directory")
        return
    
    print(f"\nTesting on {len(images)} real shelf images...")
    print("=" * 80)
    
    total_detections = 0
    
    for img_path in images[:5]:  # Test first 5
        print(f"\n📷 Processing: {img_path.name}")
        
        result = detector.detect_shelf(
            str(img_path),
            conf_threshold=0.3,
            classification_conf=0.4,
            use_sliding_window=True,
            visualize=True
        )
        
        if "error" in result:
            print(f"  ❌ Error: {result['error']}")
            continue
        
        print(f"  Found {result['total_detections']} products:")
        
        for det in result["detections"]:
            print(f"    • {det['product_name']} ({det['confidence']:.1%}) [{det['method']}]")
        
        if result.get("visualization_path"):
            print(f"  📊 Visualization saved: {result['visualization_path']}")
        
        total_detections += result["total_detections"]
    
    print("\n" + "=" * 80)
    print(f"Total detections across all images: {total_detections}")


def test_single_image(image_path: str):
    """Test on a single image."""
    detector = TwoStageDetector(use_sliding_window=True)
    
    print(f"\n🔍 Analyzing: {image_path}")
    print("=" * 80)
    
    result = detector.detect_shelf(
        image_path,
        conf_threshold=0.25,
        classification_conf=0.35,
        use_sliding_window=True,
        window_size=(320, 320),
        stride=150,
        visualize=True
    )
    
    if "error" in result:
        print(f"❌ Error: {result['error']}")
        return
    
    print(f"\n📦 Detected {result['total_detections']} products:\n")
    
    # Group by product
    product_counts = {}
    for det in result["detections"]:
        name = det["product_name"]
        if name not in product_counts:
            product_counts[name] = {"count": 0, "max_conf": 0}
        product_counts[name]["count"] += 1
        product_counts[name]["max_conf"] = max(product_counts[name]["max_conf"], det["confidence"])
    
    for name, info in sorted(product_counts.items(), key=lambda x: -x[1]["max_conf"]):
        print(f"  {info['count']}x {name} (conf: {info['max_conf']:.1%})")
    
    print(f"\n📊 Unique products: {len(result['unique_products'])}")
    
    if result.get("visualization_path"):
        print(f"📁 Visualization: {result['visualization_path']}")
    
    return result


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Two-Stage Shelf Detection")
    parser.add_argument("--image", type=str, help="Path to single image")
    parser.add_argument("--test-real", action="store_true", help="Test on real shelf images")
    
    args = parser.parse_args()
    
    if args.image:
        test_single_image(args.image)
    elif args.test_real:
        test_on_real_shelves()
    else:
        print("Usage:")
        print("  python two_stage_detector.py --image /path/to/shelf.jpg")
        print("  python two_stage_detector.py --test-real")
        print("\nRunning demo on real shelves...")
        test_on_real_shelves()
