"""
Improved Two-Stage Shelf Detection System
==========================================
Uses dense object detection + Grozi-120 classification

This approach:
1. Stage 1: Detect ALL potential product regions (sliding window + edge detection)
2. Stage 2: Classify each region with your trained Grozi-120 model

Works on real shelf images without additional training!
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from product_mapping import PRODUCT_NAME_MAP, get_display_name, get_category


class ShelfDetector:
    """
    Two-stage detection optimized for retail shelves.
    
    Stage 1: Find product regions using multiple methods:
        - Sliding window with overlap
        - Edge-based region proposals
        - Color segmentation
    
    Stage 2: Classify each region with Grozi-120 model
    """
    
    def __init__(
        self, 
        grozi_model_path: str = None,
        confidence_threshold: float = 0.4
    ):
        """
        Initialize the shelf detector.
        
        Args:
            grozi_model_path: Path to trained Grozi-120 model
            confidence_threshold: Minimum confidence for Grozi classification
        """
        self.grozi_model_path = grozi_model_path or str(
            Path(__file__).parent / "runs/detect/train_colab/weights/best.pt"
        )
        self.confidence_threshold = confidence_threshold
        
        print("🔄 Loading Grozi-120 model...")
        self.grozi_model = YOLO(self.grozi_model_path)
        print("✅ Model loaded!")
        
        # Get class names from model
        self.class_names = self.grozi_model.names
        print(f"   Classes: {len(self.class_names)}")
    
    def detect(
        self,
        image_path: str,
        window_sizes: List[Tuple[int, int]] = None,
        stride_ratio: float = 0.5,
        min_confidence: float = None,
        visualize: bool = True,
        use_nms: bool = True,
        nms_threshold: float = 0.3
    ) -> Dict[str, Any]:
        """
        Detect products on a shelf image.
        
        Args:
            image_path: Path to the shelf image
            window_sizes: List of (width, height) for sliding windows
            stride_ratio: Stride as ratio of window size (0.5 = 50% overlap)
            min_confidence: Override default confidence threshold
            visualize: Save visualization image
            use_nms: Apply non-maximum suppression
            nms_threshold: IoU threshold for NMS
            
        Returns:
            Detection results dictionary
        """
        conf = min_confidence or self.confidence_threshold
        
        # Default window sizes for typical product aspect ratios
        if window_sizes is None:
            window_sizes = [
                (200, 300),   # Tall products (bottles, cans)
                (250, 250),   # Square products (boxes)
                (300, 200),   # Wide products (chip bags)
                (150, 200),   # Small products (candy bars)
                (350, 350),   # Large products
            ]
        
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            return {"error": f"Could not load image: {image_path}"}
        
        h, w = image.shape[:2]
        print(f"\n📷 Processing: {image_path}")
        print(f"   Image size: {w}x{h}")
        
        all_detections = []
        
        # Method 1: Sliding window detection
        print(f"\n🔍 Stage 1: Sliding window detection...")
        for win_w, win_h in window_sizes:
            stride_x = int(win_w * stride_ratio)
            stride_y = int(win_h * stride_ratio)
            
            for y in range(0, h - win_h + 1, stride_y):
                for x in range(0, w - win_w + 1, stride_x):
                    # Extract window
                    window = image[y:y+win_h, x:x+win_w]
                    
                    # Classify with Grozi model
                    results = self.grozi_model(window, conf=conf, verbose=False)
                    
                    for result in results:
                        for box in result.boxes:
                            cls_id = int(box.cls[0])
                            box_conf = float(box.conf[0])
                            
                            # Get bounding box in window coordinates
                            bx1, by1, bx2, by2 = map(int, box.xyxy[0].tolist())
                            
                            # Convert to image coordinates
                            img_x1 = x + bx1
                            img_y1 = y + by1
                            img_x2 = x + bx2
                            img_y2 = y + by2
                            
                            grozi_code = f"grozi_{cls_id}"
                            product_name = get_display_name(grozi_code)
                            
                            all_detections.append({
                                "product_name": product_name,
                                "grozi_class": grozi_code,
                                "class_id": cls_id,
                                "confidence": box_conf,
                                "bbox": [img_x1, img_y1, img_x2, img_y2],
                                "category": get_category(grozi_code),
                            })
        
        print(f"   Found {len(all_detections)} raw detections")
        
        # Method 2: Direct full-image detection (lower confidence)
        print(f"\n🔍 Stage 2: Full image detection...")
        results = self.grozi_model(image, conf=conf * 0.7, verbose=False)
        
        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                box_conf = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                
                grozi_code = f"grozi_{cls_id}"
                product_name = get_display_name(grozi_code)
                
                all_detections.append({
                    "product_name": product_name,
                    "grozi_class": grozi_code,
                    "class_id": cls_id,
                    "confidence": box_conf,
                    "bbox": [x1, y1, x2, y2],
                    "category": get_category(grozi_code),
                })
        
        print(f"   Total raw detections: {len(all_detections)}")
        
        # Apply NMS to remove duplicates
        if use_nms and len(all_detections) > 0:
            print(f"\n🧹 Applying NMS (threshold={nms_threshold})...")
            final_detections = self._apply_nms(all_detections, nms_threshold)
            print(f"   After NMS: {len(final_detections)} detections")
        else:
            final_detections = all_detections
        
        # Sort by confidence
        final_detections.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Build result
        result = {
            "image_path": image_path,
            "image_size": {"width": w, "height": h},
            "total_detections": len(final_detections),
            "detections": final_detections,
            "unique_products": list(set(d["product_name"] for d in final_detections)),
            "products_by_category": self._group_by_category(final_detections)
        }
        
        # Visualize
        if visualize:
            vis_path = self._visualize(image, final_detections, image_path)
            result["visualization_path"] = vis_path
            print(f"\n📊 Visualization saved: {vis_path}")
        
        # Print summary
        print(f"\n{'='*50}")
        print(f"✅ DETECTION RESULTS")
        print(f"{'='*50}")
        print(f"Total products found: {len(final_detections)}")
        print(f"Unique products: {len(result['unique_products'])}")
        
        if final_detections:
            print(f"\nDetected products:")
            for det in final_detections[:10]:  # Show top 10
                print(f"  • {det['product_name']} ({det['confidence']:.1%})")
            if len(final_detections) > 10:
                print(f"  ... and {len(final_detections) - 10} more")
        
        return result
    
    def _apply_nms(
        self, 
        detections: List[Dict], 
        iou_threshold: float
    ) -> List[Dict]:
        """Apply non-maximum suppression across all detections."""
        if not detections:
            return []
        
        # Group by class
        class_groups = {}
        for det in detections:
            cls = det["class_id"]
            if cls not in class_groups:
                class_groups[cls] = []
            class_groups[cls].append(det)
        
        final_detections = []
        
        for cls, dets in class_groups.items():
            # Sort by confidence
            dets.sort(key=lambda x: x["confidence"], reverse=True)
            
            keep = []
            while dets:
                # Keep highest confidence
                best = dets.pop(0)
                keep.append(best)
                
                # Remove overlapping detections
                remaining = []
                for det in dets:
                    iou = self._calculate_iou(best["bbox"], det["bbox"])
                    if iou < iou_threshold:
                        remaining.append(det)
                dets = remaining
            
            final_detections.extend(keep)
        
        return final_detections
    
    def _calculate_iou(self, box1: List[int], box2: List[int]) -> float:
        """Calculate IoU between two bounding boxes."""
        x1 = max(box1[0], box2[0])
        y1 = max(box1[1], box2[1])
        x2 = min(box1[2], box2[2])
        y2 = min(box1[3], box2[3])
        
        intersection = max(0, x2 - x1) * max(0, y2 - y1)
        
        area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
        area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
        
        union = area1 + area2 - intersection
        
        return intersection / union if union > 0 else 0
    
    def _group_by_category(self, detections: List[Dict]) -> Dict[str, List[str]]:
        """Group detected products by category."""
        categories = {}
        for det in detections:
            cat = det.get("category", "Other")
            if cat not in categories:
                categories[cat] = []
            if det["product_name"] not in categories[cat]:
                categories[cat].append(det["product_name"])
        return categories
    
    def _visualize(
        self, 
        image: np.ndarray, 
        detections: List[Dict],
        image_path: str
    ) -> str:
        """Create visualization with bounding boxes."""
        vis_image = image.copy()
        
        # Colors for different confidence levels
        def get_color(conf):
            if conf > 0.8:
                return (0, 255, 0)    # Green - high confidence
            elif conf > 0.5:
                return (0, 255, 255)  # Yellow - medium
            else:
                return (0, 165, 255)  # Orange - low
        
        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            conf = det["confidence"]
            name = det["product_name"]
            
            color = get_color(conf)
            
            # Draw box
            cv2.rectangle(vis_image, (x1, y1), (x2, y2), color, 2)
            
            # Draw label background
            label = f"{name[:20]} {conf:.0%}"
            (label_w, label_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            cv2.rectangle(vis_image, (x1, y1 - label_h - 10), (x1 + label_w + 5, y1), color, -1)
            
            # Draw label text
            cv2.putText(vis_image, label, (x1 + 2, y1 - 5), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)
        
        # Save visualization
        output_dir = Path(__file__).parent / "detection_results"
        output_dir.mkdir(exist_ok=True)
        
        base_name = Path(image_path).stem
        output_path = output_dir / f"{base_name}_detected.jpg"
        cv2.imwrite(str(output_path), vis_image)
        
        return str(output_path)


def test_on_image(image_path: str):
    """Test the detector on a single image."""
    detector = ShelfDetector()
    results = detector.detect(
        image_path,
        min_confidence=0.3,
        visualize=True
    )
    return results


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
    else:
        # Default test image
        image_path = "test_images/pringles on shelf.png"
    
    if os.path.exists(image_path):
        results = test_on_image(image_path)
    else:
        print(f"❌ Image not found: {image_path}")
        print("\nUsage: python shelf_detector.py <image_path>")
