"""
Two-Stage Shelf Detection System
================================
Stage 1: SKU-110K detects ALL products on shelf (generic "object" detection)
Stage 2: Grozi-120 classifies each detected product
Stage 3 (Optional): CLIP verifies/corrects classifications

This solves the domain gap problem - SKU-110K was trained on real shelf images!
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import cv2
import numpy as np
from ultralytics import YOLO

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from product_mapping import PRODUCT_NAME_MAP, get_display_name, get_category

# Model paths
SKU_MODEL_PATH = Path(__file__).parent / "runs/detect/sku110k_detector/weights/best.pt"
GROZI_MODEL_PATH = Path(__file__).parent / "runs/detect/train_colab/weights/best.pt"


class TwoStageShelfDetector:
    """
    Two-stage detection for real retail shelf images.
    
    Stage 1: SKU-110K finds all products (trained on 10k+ real shelf images)
    Stage 2: Grozi-120 identifies each product (120 specific products)
    Stage 3: CLIP verifies/corrects classifications (optional)
    """
    
    def __init__(
        self,
        sku_model_path: str = None,
        grozi_model_path: str = None,
        sku_confidence: float = 0.25,
        grozi_confidence: float = 0.3,
        use_clip_verification: bool = True,
    ):
        """
        Initialize both detection models.
        
        Args:
            sku_model_path: Path to SKU-110K model
            grozi_model_path: Path to Grozi-120 model
            sku_confidence: Confidence threshold for SKU detection
            grozi_confidence: Confidence threshold for Grozi classification
            use_clip_verification: Whether to use CLIP to verify results
        """
        self.sku_model_path = sku_model_path or str(SKU_MODEL_PATH)
        self.grozi_model_path = grozi_model_path or str(GROZI_MODEL_PATH)
        self.sku_confidence = sku_confidence
        self.grozi_confidence = grozi_confidence
        self.use_clip_verification = use_clip_verification
        
        print("🔄 Loading models...")
        
        # Stage 1: SKU-110K detector
        print("   Loading SKU-110K (shelf product detector)...")
        self.sku_model = YOLO(self.sku_model_path)
        print(f"   ✅ SKU-110K loaded! Classes: {list(self.sku_model.names.values())}")
        
        # Stage 2: Grozi-120 classifier
        print("   Loading Grozi-120 (product classifier)...")
        self.grozi_model = YOLO(self.grozi_model_path)
        print(f"   ✅ Grozi-120 loaded! Classes: {len(self.grozi_model.names)}")
        
        # Stage 3: CLIP verifier (optional)
        self.clip_verifier = None
        if use_clip_verification:
            try:
                from yolo.clip_verifier import CLIPVerifier
                self.clip_verifier = CLIPVerifier()
                if self.clip_verifier.enabled:
                    print("   ✅ CLIP Verifier enabled!")
                else:
                    print("   ⚠️ CLIP Verifier disabled (no API key)")
            except Exception as e:
                print(f"   ⚠️ CLIP Verifier not available: {e}")
        
        print("🎉 Two-stage detector ready!")
    
    def detect_products_on_shelf(self, image: np.ndarray) -> List[Dict]:
        """
        Stage 1: Use SKU-110K to find all products on shelf.
        
        Returns list of bounding boxes for each detected product.
        """
        results = self.sku_model(image, conf=self.sku_confidence, verbose=False)
        
        detections = []
        for r in results:
            if r.boxes is not None:
                for box in r.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    conf = float(box.conf[0])
                    
                    detections.append({
                        "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                        "confidence": conf,
                    })
        
        return detections
    
    def classify_product(self, crop: np.ndarray) -> Optional[Dict]:
        """
        Stage 2: Use Grozi-120 to classify a cropped product image.
        
        Returns classification result or None if no confident match.
        """
        # Resize crop to model input size
        crop_resized = cv2.resize(crop, (640, 640))
        
        # Run Grozi classification
        results = self.grozi_model(crop_resized, conf=self.grozi_confidence, verbose=False)
        
        best_match = None
        best_conf = 0
        
        for r in results:
            if r.boxes is not None and len(r.boxes) > 0:
                for box in r.boxes:
                    conf = float(box.conf[0])
                    if conf > best_conf:
                        best_conf = conf
                        cls_id = int(box.cls[0])
                        class_name = self.grozi_model.names[cls_id]
                        
                        best_match = {
                            "class_id": cls_id,
                            "class_name": class_name,
                            "confidence": conf,
                            "display_name": get_display_name(class_name),
                            "category": get_category(class_name),
                        }
        
        return best_match
    
    def detect(self, image_path: str) -> Dict:
        """
        Run full two-stage detection on a shelf image.
        
        Args:
            image_path: Path to shelf image
            
        Returns:
            Detection results with product identifications
        """
        print(f"\n📷 Processing: {image_path}")
        
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        h, w = image.shape[:2]
        print(f"   Image size: {w}x{h}")
        
        # Stage 1: Find all products
        print(f"\n🔍 Stage 1: SKU-110K detecting products (conf > {self.sku_confidence})...")
        product_boxes = self.detect_products_on_shelf(image)
        print(f"   Found {len(product_boxes)} products on shelf")
        
        # Stage 2: Classify each product
        print(f"\n🎯 Stage 2: Grozi-120 classifying products (conf > {self.grozi_confidence})...")
        
        detections = []
        identified = 0
        
        for i, product in enumerate(product_boxes):
            bbox = product["bbox"]
            x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            
            # Crop product from image
            crop = image[y1:y2, x1:x2]
            
            # Skip tiny crops
            if crop.shape[0] < 20 or crop.shape[1] < 20:
                continue
            
            # Classify
            classification = self.classify_product(crop)
            
            if classification:
                identified += 1
                detection = {
                    "bbox": bbox,
                    "sku_confidence": product["confidence"],
                    **classification
                }
                detections.append(detection)
            else:
                # Product detected but not identified (not in Grozi-120)
                detections.append({
                    "bbox": bbox,
                    "sku_confidence": product["confidence"],
                    "class_name": "unknown",
                    "display_name": "Unknown Product",
                    "confidence": 0,
                    "category": "Unknown",
                })
        
        print(f"   Identified {identified}/{len(product_boxes)} products")
        
        # Stage 3: CLIP verification (if enabled)
        if self.clip_verifier and self.clip_verifier.enabled and identified > 0:
            print(f"\n🔍 Stage 3: CLIP verifying {identified} classifications...")
            detections = self.clip_verifier.verify_batch(detections, image)
            
            # Count corrections
            corrections = sum(1 for d in detections if d.get("verified_by") == "clip_corrected")
            if corrections > 0:
                print(f"   ✅ CLIP corrected {corrections} misclassifications!")
            else:
                print(f"   ✅ CLIP verified all classifications")
        
        # Build result
        result = {
            "image_path": image_path,
            "image_size": {"width": w, "height": h},
            "total_products_found": len(product_boxes),
            "products_identified": identified,
            "detections": detections,
            "product_counts": self._count_products(detections),
            "clip_enabled": bool(self.clip_verifier and self.clip_verifier.enabled),
        }
        
        return result
    
    def _count_products(self, detections: List[Dict]) -> Dict[str, int]:
        """Count occurrences of each product."""
        counts = {}
        for det in detections:
            name = det.get("display_name", "Unknown")
            if name != "Unknown Product":
                counts[name] = counts.get(name, 0) + 1
        return dict(sorted(counts.items(), key=lambda x: x[1], reverse=True))
    
    def visualize(self, image_path: str, detections: List[Dict], output_path: str = None) -> str:
        """
        Draw detection results on image.
        
        Args:
            image_path: Path to original image
            detections: List of detection results
            output_path: Where to save visualization (optional)
            
        Returns:
            Path to saved visualization
        """
        image = cv2.imread(image_path)
        
        # Colors by category
        category_colors = {
            "Candy & Chocolate": (255, 0, 128),
            "Beverages": (255, 128, 0),
            "Snacks": (0, 255, 255),
            "Personal Care": (128, 0, 255),
            "Food": (0, 255, 0),
            "Health": (255, 0, 0),
            "Household": (0, 128, 255),
            "Unknown": (128, 128, 128),
            "General": (200, 200, 0),
        }
        
        for det in detections:
            bbox = det["bbox"]
            x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            
            category = det.get("category", "Unknown")
            color = category_colors.get(category, (128, 128, 128))
            
            # Draw bounding box
            thickness = 2 if det.get("confidence", 0) > 0.5 else 1
            cv2.rectangle(image, (x1, y1), (x2, y2), color, thickness)
            
            # Draw label
            display_name = det.get("display_name", "Unknown")[:25]
            conf = det.get("confidence", 0)
            
            if conf > 0:
                label = f"{display_name} ({conf:.0%})"
            else:
                label = "Unknown"
            
            font_scale = 0.4
            font_thickness = 1
            (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness)
            
            # Background for text
            cv2.rectangle(image, (x1, y1 - text_h - 6), (x1 + text_w + 4, y1), color, -1)
            cv2.putText(image, label, (x1 + 2, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), font_thickness)
        
        # Save
        if output_path is None:
            output_dir = Path(__file__).parent / "detection_results"
            output_dir.mkdir(exist_ok=True)
            filename = Path(image_path).stem + "_two_stage.jpg"
            output_path = str(output_dir / filename)
        
        cv2.imwrite(output_path, image)
        print(f"\n📊 Visualization saved: {output_path}")
        
        return output_path


def print_results(result: Dict):
    """Pretty print detection results."""
    print("\n" + "=" * 60)
    print("✅ TWO-STAGE DETECTION RESULTS")
    print("=" * 60)
    
    print(f"\n📦 Products found on shelf: {result['total_products_found']}")
    print(f"🎯 Products identified: {result['products_identified']}")
    
    counts = result["product_counts"]
    if counts:
        print(f"\n📋 Product inventory ({len(counts)} unique products):")
        for name, count in list(counts.items())[:15]:
            print(f"   {count}x {name}")
        
        if len(counts) > 15:
            print(f"   ... and {len(counts) - 15} more")
    
    # Show top confident detections
    detections = sorted(
        [d for d in result["detections"] if d.get("confidence", 0) > 0],
        key=lambda x: x["confidence"],
        reverse=True
    )[:10]
    
    if detections:
        print(f"\n🏆 Top confident detections:")
        for det in detections:
            print(f"   • {det['display_name']} ({det['confidence']:.1%}) - {det['category']}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python sku_grozi_detector.py <image_path> [sku_conf] [grozi_conf]")
        print("\nExample:")
        print("  python sku_grozi_detector.py test_images/shelf.jpg 0.25 0.3")
        sys.exit(1)
    
    image_path = sys.argv[1]
    sku_conf = float(sys.argv[2]) if len(sys.argv) > 2 else 0.25
    grozi_conf = float(sys.argv[3]) if len(sys.argv) > 3 else 0.3
    
    # Initialize detector
    detector = TwoStageShelfDetector(
        sku_confidence=sku_conf,
        grozi_confidence=grozi_conf
    )
    
    # Run detection
    result = detector.detect(image_path)
    
    # Visualize
    detector.visualize(image_path, result["detections"])
    
    # Print results
    print_results(result)
