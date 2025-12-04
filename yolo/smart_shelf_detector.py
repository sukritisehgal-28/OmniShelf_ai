"""
Smart Shelf Detection System
============================
Uses edge detection + contour analysis to find product regions,
then classifies with Grozi-120 model.

This is more effective than sliding window because it finds actual product boundaries.
"""

import os
import sys
from pathlib import Path
from typing import List, Dict, Tuple
import cv2
import numpy as np
from ultralytics import YOLO

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from product_mapping import PRODUCT_NAME_MAP, get_display_name, get_category

# Paths
GROZI_MODEL_PATH = Path(__file__).parent / "runs/detect/train_colab/weights/best.pt"


class SmartShelfDetector:
    """
    Intelligent shelf detection using:
    1. Edge detection to find product boundaries
    2. Selective search for region proposals
    3. Grozi-120 classification with high confidence threshold
    """
    
    def __init__(
        self,
        grozi_model_path: str = None,
        confidence_threshold: float = 0.6,  # Higher threshold for accuracy
        min_region_size: int = 50,
        max_region_size: int = 400,
    ):
        self.grozi_model_path = grozi_model_path or str(GROZI_MODEL_PATH)
        self.confidence_threshold = confidence_threshold
        self.min_size = min_region_size
        self.max_size = max_region_size
        
        print("🔄 Loading Grozi-120 model...")
        self.model = YOLO(self.grozi_model_path)
        print(f"✅ Model loaded! Classes: {len(self.model.names)}")
    
    def find_product_regions(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """
        Find potential product regions using edge detection and contours.
        
        Returns list of (x, y, w, h) bounding boxes.
        """
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply bilateral filter to reduce noise while keeping edges
        blurred = cv2.bilateralFilter(gray, 9, 75, 75)
        
        # Edge detection
        edges = cv2.Canny(blurred, 30, 100)
        
        # Dilate to connect nearby edges
        kernel = np.ones((5, 5), np.uint8)
        dilated = cv2.dilate(edges, kernel, iterations=2)
        
        # Find contours
        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        regions = []
        h, w = image.shape[:2]
        
        for contour in contours:
            x, y, cw, ch = cv2.boundingRect(contour)
            
            # Filter by size
            if cw < self.min_size or ch < self.min_size:
                continue
            if cw > self.max_size or ch > self.max_size:
                continue
            
            # Filter by aspect ratio (products are roughly square to 1:3)
            aspect = max(cw, ch) / max(min(cw, ch), 1)
            if aspect > 4:
                continue
            
            # Add padding
            pad = 10
            x1 = max(0, x - pad)
            y1 = max(0, y - pad)
            x2 = min(w, x + cw + pad)
            y2 = min(h, y + ch + pad)
            
            regions.append((x1, y1, x2 - x1, y2 - y1))
        
        return regions
    
    def generate_grid_regions(self, image: np.ndarray, grid_size: int = 150, overlap: float = 0.3) -> List[Tuple[int, int, int, int]]:
        """
        Generate grid-based regions for more complete coverage.
        """
        h, w = image.shape[:2]
        stride = int(grid_size * (1 - overlap))
        
        regions = []
        for y in range(0, h - grid_size + 1, stride):
            for x in range(0, w - grid_size + 1, stride):
                regions.append((x, y, grid_size, grid_size))
        
        # Also add multi-scale
        for scale in [0.7, 1.3]:
            size = int(grid_size * scale)
            stride_s = int(size * (1 - overlap))
            for y in range(0, h - size + 1, stride_s):
                for x in range(0, w - size + 1, stride_s):
                    regions.append((x, y, size, size))
        
        return regions
    
    def classify_region(self, image: np.ndarray, region: Tuple[int, int, int, int]) -> Dict:
        """
        Classify a single region using Grozi model.
        """
        x, y, w, h = region
        crop = image[y:y+h, x:x+w]
        
        # Resize crop to model input size
        crop_resized = cv2.resize(crop, (640, 640))
        
        # Run inference
        results = self.model(crop_resized, verbose=False)
        
        best_detection = None
        best_conf = 0
        
        for r in results:
            if r.boxes is not None and len(r.boxes) > 0:
                for box in r.boxes:
                    conf = float(box.conf[0])
                    if conf > best_conf:
                        best_conf = conf
                        cls_id = int(box.cls[0])
                        class_name = self.model.names[cls_id]
                        best_detection = {
                            "class_id": cls_id,
                            "class_name": class_name,
                            "confidence": conf,
                            "display_name": get_display_name(class_name),
                            "category": get_category(class_name),
                        }
        
        return best_detection
    
    def detect(self, image_path: str, use_contours: bool = True, use_grid: bool = True) -> Dict:
        """
        Detect products on a shelf image.
        """
        print(f"\n📷 Processing: {image_path}")
        
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        h, w = image.shape[:2]
        print(f"   Image size: {w}x{h}")
        
        # Collect candidate regions
        regions = []
        
        if use_contours:
            print("🔍 Finding contour-based regions...")
            contour_regions = self.find_product_regions(image)
            print(f"   Found {len(contour_regions)} contour regions")
            regions.extend(contour_regions)
        
        if use_grid:
            print("🔍 Generating grid regions...")
            grid_regions = self.generate_grid_regions(image, grid_size=150)
            print(f"   Generated {len(grid_regions)} grid regions")
            regions.extend(grid_regions)
        
        # Remove duplicate/overlapping regions
        regions = self._merge_regions(regions)
        print(f"   After merging: {len(regions)} unique regions")
        
        # Classify each region
        print(f"🎯 Classifying regions (conf > {self.confidence_threshold})...")
        
        detections = []
        for i, region in enumerate(regions):
            if (i + 1) % 50 == 0:
                print(f"   Processed {i+1}/{len(regions)} regions...")
            
            result = self.classify_region(image, region)
            
            if result and result["confidence"] >= self.confidence_threshold:
                x, y, w, h = region
                result["bbox"] = {
                    "x1": x, "y1": y,
                    "x2": x + w, "y2": y + h,
                    "width": w, "height": h
                }
                detections.append(result)
        
        # Apply NMS
        print(f"🧹 Applying NMS...")
        detections = self._nms(detections, iou_threshold=0.4)
        print(f"   Final detections: {len(detections)}")
        
        # Create result
        result = {
            "image_path": image_path,
            "image_size": {"width": w, "height": h},
            "detections": detections,
            "product_counts": self._count_products(detections),
        }
        
        return result
    
    def _merge_regions(self, regions: List[Tuple], overlap_threshold: float = 0.7) -> List[Tuple]:
        """Merge highly overlapping regions."""
        if not regions:
            return []
        
        # Sort by area
        regions = sorted(regions, key=lambda r: r[2] * r[3], reverse=True)
        
        merged = []
        for region in regions:
            x1, y1, w1, h1 = region
            
            is_duplicate = False
            for x2, y2, w2, h2 in merged:
                # Calculate IoU
                xi1 = max(x1, x2)
                yi1 = max(y1, y2)
                xi2 = min(x1 + w1, x2 + w2)
                yi2 = min(y1 + h1, y2 + h2)
                
                if xi1 < xi2 and yi1 < yi2:
                    intersection = (xi2 - xi1) * (yi2 - yi1)
                    area1 = w1 * h1
                    area2 = w2 * h2
                    union = area1 + area2 - intersection
                    iou = intersection / union if union > 0 else 0
                    
                    if iou > overlap_threshold:
                        is_duplicate = True
                        break
            
            if not is_duplicate:
                merged.append(region)
        
        return merged
    
    def _nms(self, detections: List[Dict], iou_threshold: float = 0.4) -> List[Dict]:
        """Apply Non-Maximum Suppression."""
        if not detections:
            return []
        
        # Sort by confidence
        detections = sorted(detections, key=lambda d: d["confidence"], reverse=True)
        
        keep = []
        for det in detections:
            bbox1 = det["bbox"]
            
            is_duplicate = False
            for kept in keep:
                bbox2 = kept["bbox"]
                
                # Calculate IoU
                xi1 = max(bbox1["x1"], bbox2["x1"])
                yi1 = max(bbox1["y1"], bbox2["y1"])
                xi2 = min(bbox1["x2"], bbox2["x2"])
                yi2 = min(bbox1["y2"], bbox2["y2"])
                
                if xi1 < xi2 and yi1 < yi2:
                    intersection = (xi2 - xi1) * (yi2 - yi1)
                    area1 = bbox1["width"] * bbox1["height"]
                    area2 = bbox2["width"] * bbox2["height"]
                    union = area1 + area2 - intersection
                    iou = intersection / union if union > 0 else 0
                    
                    if iou > iou_threshold:
                        is_duplicate = True
                        break
            
            if not is_duplicate:
                keep.append(det)
        
        return keep
    
    def _count_products(self, detections: List[Dict]) -> Dict[str, int]:
        """Count occurrences of each product."""
        counts = {}
        for det in detections:
            name = det["display_name"]
            counts[name] = counts.get(name, 0) + 1
        return dict(sorted(counts.items(), key=lambda x: x[1], reverse=True))
    
    def visualize(self, image_path: str, detections: List[Dict], output_path: str = None):
        """Draw detections on image."""
        image = cv2.imread(image_path)
        
        # Color by category
        category_colors = {
            "Candy & Chocolate": (255, 0, 128),    # Pink
            "Beverages": (255, 128, 0),            # Orange  
            "Snacks": (0, 255, 255),               # Yellow
            "Personal Care": (128, 0, 255),        # Purple
            "Food": (0, 255, 0),                   # Green
            "Health": (255, 0, 0),                 # Red
            "Household": (0, 128, 255),            # Light Blue
            "Other": (128, 128, 128),              # Gray
        }
        
        for det in detections:
            bbox = det["bbox"]
            x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            
            category = det.get("category", "Other")
            color = category_colors.get(category, (128, 128, 128))
            
            # Draw box
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
            
            # Draw label
            label = f"{det['display_name'][:20]} ({det['confidence']:.0%})"
            font_scale = 0.4
            thickness = 1
            (text_w, text_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)
            
            cv2.rectangle(image, (x1, y1 - text_h - 4), (x1 + text_w + 2, y1), color, -1)
            cv2.putText(image, label, (x1 + 1, y1 - 2), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (255, 255, 255), thickness)
        
        # Save
        if output_path is None:
            output_dir = Path(__file__).parent / "detection_results"
            output_dir.mkdir(exist_ok=True)
            filename = Path(image_path).stem + "_smart_detected.jpg"
            output_path = str(output_dir / filename)
        
        cv2.imwrite(output_path, image)
        print(f"📊 Visualization saved: {output_path}")
        
        return output_path


def print_results(result: Dict):
    """Pretty print detection results."""
    print("\n" + "=" * 50)
    print("✅ DETECTION RESULTS")
    print("=" * 50)
    
    detections = result["detections"]
    counts = result["product_counts"]
    
    print(f"Total products found: {len(detections)}")
    print(f"Unique products: {len(counts)}")
    
    if counts:
        print("\n📦 Product counts:")
        for name, count in list(counts.items())[:15]:
            print(f"   {count}x {name}")
        
        if len(counts) > 15:
            print(f"   ... and {len(counts) - 15} more")
    
    print("\n🎯 Top detections by confidence:")
    top_dets = sorted(detections, key=lambda d: d["confidence"], reverse=True)[:10]
    for det in top_dets:
        print(f"   • {det['display_name']} ({det['confidence']:.1%}) - {det['category']}")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python smart_shelf_detector.py <image_path> [confidence_threshold]")
        print("\nExample:")
        print("  python smart_shelf_detector.py test_images/shelf.jpg 0.7")
        sys.exit(1)
    
    image_path = sys.argv[1]
    confidence = float(sys.argv[2]) if len(sys.argv) > 2 else 0.65
    
    detector = SmartShelfDetector(confidence_threshold=confidence)
    
    result = detector.detect(image_path)
    
    # Visualize
    detector.visualize(image_path, result["detections"])
    
    # Print results
    print_results(result)
