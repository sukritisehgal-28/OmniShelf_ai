"""Utility helpers for running YOLO inference and parsing detections."""
from __future__ import annotations

from pathlib import Path
from typing import Iterable, List, Dict, Any, Union

import numpy as np
from ultralytics import YOLO


def load_model(weights_path: Union[str, Path]) -> YOLO:
    """Load a YOLO model from disk."""
    weights_path = Path(weights_path)
    if not weights_path.exists():
        raise FileNotFoundError(f"Weights file not found: {weights_path}")
    return YOLO(str(weights_path))


def run_inference(image_path: Union[str, Path], model: YOLO, **kwargs) -> Any:
    """Run YOLO inference on a single image and return the raw result object."""
    image_path = Path(image_path)
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")
    results = model.predict(source=str(image_path), verbose=False, **kwargs)
    if not results:
        raise RuntimeError("YOLO returned no results")
    return results[0]


def yolo_result_to_detections(result: Any) -> List[Dict[str, Any]]:
    """Convert a YOLO result object into a serializable list of detections."""
    detections: List[Dict[str, Any]] = []
    boxes = getattr(result, "boxes", None)
    if boxes is None:
        return detections

    confs = boxes.conf.cpu().numpy() if hasattr(boxes.conf, "cpu") else np.array(boxes.conf)
    xyxy = boxes.xyxy.cpu().numpy() if hasattr(boxes.xyxy, "cpu") else np.array(boxes.xyxy)
    classes = boxes.cls.cpu().numpy().astype(int) if hasattr(boxes.cls, "cpu") else np.array(boxes.cls).astype(int)

    names = result.names if hasattr(result, "names") else {}

    for idx, cls_id in enumerate(classes):
        bbox = xyxy[idx].tolist()
        detections.append(
            {
                "product_name": names.get(cls_id, str(cls_id)),
                "confidence": float(confs[idx]),
                "bbox": [float(coord) for coord in bbox],
            }
        )
    return detections


def run_inference_to_detections(image_path: Union[str, Path], weights_path: Union[str, Path]) -> List[Dict[str, Any]]:
    """Convenience helper to load a model, run inference, and parse detections."""
    model = load_model(weights_path)
    result = run_inference(image_path, model)
    return yolo_result_to_detections(result)


__all__ = [
    "load_model",
    "run_inference",
    "yolo_result_to_detections",
    "run_inference_to_detections",
]
