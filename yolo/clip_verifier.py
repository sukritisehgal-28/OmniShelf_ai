"""
CLIP/Vision API Verifier for Product Classification
====================================================
Uses OpenAI Vision (GPT-4o) to verify/correct Grozi-120 classifications.
"""

import os
import base64
from typing import Optional, Dict, List
import cv2
import numpy as np

from product_mapping import get_category

# Product list for verification (subset of popular products)
PRODUCT_CHOICES = [
    "Pringles Original",
    "Pringles Sour Cream & Onion", 
    "Lay's Classic Potato Chips",
    "Ruffles Sour Cream & Onion",
    "Doritos Nacho Cheese",
    "Kit Kat",
    "Snickers",
    "Twix",
    "M&M's",
    "Reese's",
    "Skittles",
    "Starburst",
    "Monster Energy",
    "Red Bull",
    "Coca-Cola",
    "Pepsi",
    "Mountain Dew",
    "Gatorade",
    "Cheerios",
    "Oreo",
    "Chips Ahoy",
    "Unknown Product",
]

# Map CLIP responses back to grozi codes
CLIP_TO_GROZI = {
    "pringles original": "grozi_36",
    "pringles sour cream & onion": "grozi_35",
    "pringles sour cream": "grozi_35",
    "pringles": "grozi_36",
    "lay's classic potato chips": "grozi_51",
    "lay's classic": "grozi_51",
    "lay's": "grozi_51",
    "lays": "grozi_51",
    "ruffles sour cream & onion": "grozi_117",
    "ruffles": "grozi_117",
    "doritos nacho cheese": "grozi_39",
    "doritos": "grozi_39",
    "kit kat": "grozi_30",
    "kitkat": "grozi_30",
    "snickers": "grozi_12",
    "twix": "grozi_11",
    "m&m's": "grozi_10",
    "m&ms": "grozi_10",
    "reese's": "grozi_31",
    "reeses": "grozi_31",
    "skittles": "grozi_38",
    "starburst": "grozi_37",
    "monster energy": "grozi_42",
    "monster": "grozi_42",
    "red bull": "grozi_61",
    "redbull": "grozi_61",
    "coca-cola": "grozi_54",
    "coke": "grozi_54",
    "pepsi": "grozi_59",
    "mountain dew": "grozi_105",
    "gatorade": "grozi_15",
    "cheerios": "grozi_4",
    "oreo": "grozi_107",
    "chips ahoy": "grozi_107",
}


class CLIPVerifier:
    """
    Verifies and corrects product classifications using OpenAI Vision API.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize the verifier.
        
        Args:
            api_key: OpenAI API key. If None, uses OPENAI_API_KEY env var.
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.enabled = bool(self.api_key)
        
        if self.enabled:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
                print("✅ CLIP Verifier initialized (using OpenAI Vision)")
            except ImportError:
                print("⚠️ OpenAI package not installed. Run: pip install openai")
                self.enabled = False
        else:
            print("⚠️ CLIP Verifier disabled (no OPENAI_API_KEY)")
    
    def _encode_image(self, image: np.ndarray) -> str:
        """Convert OpenCV image to base64."""
        _, buffer = cv2.imencode('.jpg', image)
        return base64.b64encode(buffer).decode('utf-8')
    
    def verify_product(
        self, 
        image_crop: np.ndarray, 
        grozi_prediction: str,
        grozi_confidence: float
    ) -> Dict:
        """
        Verify a Grozi-120 prediction using OpenAI Vision.
        
        Args:
            image_crop: Cropped product image (OpenCV format)
            grozi_prediction: What Grozi-120 predicted (e.g., "Lay's Classic")
            grozi_confidence: Grozi-120's confidence score
            
        Returns:
            Dict with verified result
        """
        if not self.enabled:
            return {
                "verified": False,
                "original_prediction": grozi_prediction,
                "final_prediction": grozi_prediction,
                "source": "grozi_only",
                "confidence": grozi_confidence,
            }
        
        try:
            base64_image = self._encode_image(image_crop)
            
            # Ask GPT-4o to identify the product
            prompt = f"""Look at this product image. Grozi-120 model predicted: "{grozi_prediction}" with {grozi_confidence*100:.1f}% confidence.

Is this prediction correct? If not, what is the actual product?

Choose from these options:
{', '.join(PRODUCT_CHOICES)}

Respond with ONLY the product name, nothing else."""

            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ]
                }],
                max_tokens=50,
                temperature=0.1
            )
            
            clip_answer = response.choices[0].message.content.strip()
            
            # Check if CLIP agrees with Grozi
            grozi_lower = grozi_prediction.lower()
            clip_lower = clip_answer.lower()
            
            # Determine agreement (fuzzy match)
            agrees = (
                clip_lower in grozi_lower or 
                grozi_lower in clip_lower or
                clip_lower.split()[0] in grozi_lower  # First word match
            )
            
            # Map CLIP answer to grozi code
            grozi_code = None
            for key, code in CLIP_TO_GROZI.items():
                if key in clip_lower:
                    grozi_code = code
                    break
            
            return {
                "verified": True,
                "original_prediction": grozi_prediction,
                "clip_prediction": clip_answer,
                "agrees": agrees,
                "final_prediction": grozi_prediction if agrees else clip_answer,
                "final_grozi_code": grozi_code,
                "source": "grozi_verified" if agrees else "clip_corrected",
                "confidence": grozi_confidence if agrees else 0.85,  # CLIP gets 85% confidence
            }
            
        except Exception as e:
            print(f"⚠️ CLIP verification failed: {e}")
            return {
                "verified": False,
                "original_prediction": grozi_prediction,
                "final_prediction": grozi_prediction,
                "source": "grozi_only",
                "confidence": grozi_confidence,
                "error": str(e),
            }
    
    def verify_batch(
        self, 
        detections: List[Dict],
        image: np.ndarray
    ) -> List[Dict]:
        """
        Verify all detections in a batch.
        
        Args:
            detections: List of detection dicts with bbox and class_name
            image: Full shelf image
            
        Returns:
            Updated detections with verified predictions
        """
        if not self.enabled:
            return detections
        
        verified_detections = []
        
        for det in detections:
            # Skip unknown products
            if det.get("class_name") == "unknown":
                verified_detections.append(det)
                continue
            
            # Extract crop
            bbox = det.get("bbox", {})
            x1, y1 = bbox.get("x1", 0), bbox.get("y1", 0)
            x2, y2 = bbox.get("x2", 0), bbox.get("y2", 0)
            
            if x2 > x1 and y2 > y1:
                crop = image[y1:y2, x1:x2]
                
                if crop.size > 0:
                    # Verify this detection
                    result = self.verify_product(
                        crop,
                        det.get("display_name", det.get("class_name", "")),
                        det.get("confidence", 0)
                    )
                    
                    # Update detection with verified result
                    det["verification"] = result
                    det["display_name"] = result["final_prediction"]
                    det["confidence"] = result["confidence"]
                    det["verified_by"] = result["source"]
                    
                    if result.get("final_grozi_code"):
                        det["class_name"] = result["final_grozi_code"]
                        # Also update the category based on the corrected grozi code
                        det["category"] = get_category(result["final_grozi_code"])
            
            verified_detections.append(det)
        
        return verified_detections

# Singleton instance
_verifier = None

def get_verifier() -> CLIPVerifier:
    """Get or create the CLIP verifier singleton."""
    global _verifier
    if _verifier is None:
        _verifier = CLIPVerifier()
    return _verifier


def verify_detection(image_crop: np.ndarray, prediction: str, confidence: float) -> Dict:
    """Convenience function to verify a single detection."""
    verifier = get_verifier()
    return verifier.verify_product(image_crop, prediction, confidence)
