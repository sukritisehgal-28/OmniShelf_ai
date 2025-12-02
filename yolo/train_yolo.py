"""Training script for YOLOv11 on the Grozi-120 dataset."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict

from ultralytics import YOLO

DATA_CONFIG = Path(__file__).resolve().parent / "dataset" / "grozi120" / "data.yaml"
PRETRAINED_WEIGHTS = "yolo11s.pt"
DEVICE = os.getenv("OMNISHELF_YOLO_DEVICE", "auto")
EPOCHS = int(os.getenv("OMNISHELF_YOLO_EPOCHS", "50"))
IMGSZ = int(os.getenv("OMNISHELF_YOLO_IMGSZ", "640"))
BATCH = int(os.getenv("OMNISHELF_YOLO_BATCH", "8"))  # Reduced to 8 for 8GB RAM stability
WORKERS = int(os.getenv("OMNISHELF_YOLO_WORKERS", "4"))  # Reduced to 4 for stability
CACHE_MODE = os.getenv("OMNISHELF_YOLO_CACHE", "ram")
SEED = int(os.getenv("OMNISHELF_YOLO_SEED", "42"))
OPTIMIZER = os.getenv("OMNISHELF_YOLO_OPTIMIZER", "Adam")
LR0 = float(os.getenv("OMNISHELF_YOLO_LR0", "0.01"))

# Augmentation parameters (as per project proposal)
# Color jitter (HSV)
HSV_H = float(os.getenv("OMNISHELF_YOLO_HSV_H", "0.015"))  # Hue
HSV_S = float(os.getenv("OMNISHELF_YOLO_HSV_S", "0.7"))    # Saturation
HSV_V = float(os.getenv("OMNISHELF_YOLO_HSV_V", "0.4"))    # Value

# Geometric augmentations
DEGREES = float(os.getenv("OMNISHELF_YOLO_DEGREES", "10.0"))      # Rotation
TRANSLATE = float(os.getenv("OMNISHELF_YOLO_TRANSLATE", "0.1"))   # Translation
SCALE = float(os.getenv("OMNISHELF_YOLO_SCALE", "0.5"))           # Scaling
SHEAR = float(os.getenv("OMNISHELF_YOLO_SHEAR", "2.0"))           # Shear
PERSPECTIVE = float(os.getenv("OMNISHELF_YOLO_PERSPECTIVE", "0.0001"))  # Perspective

# Flips
FLIPUD = float(os.getenv("OMNISHELF_YOLO_FLIPUD", "0.0"))   # Vertical flip probability
FLIPLR = float(os.getenv("OMNISHELF_YOLO_FLIPLR", "0.5"))   # Horizontal flip probability

# Synthetic scenes (mosaic, mixup)
MOSAIC = float(os.getenv("OMNISHELF_YOLO_MOSAIC", "1.0"))   # Mosaic probability
MIXUP = float(os.getenv("OMNISHELF_YOLO_MIXUP", "0.1"))     # Mixup probability

# Image quality augmentations (note: blur augmentation created in evaluate stress-test)
# BLUR parameter not supported in current ultralytics version


def format_metrics(metrics: Dict[str, Any]) -> str:
    if not metrics:
        return "No metrics available."
    keys = ["metrics/mAP50", "metrics/mAP50-95", "metrics/precision(B)", "metrics/recall(B)"]
    parts = []
    for key in keys:
        if key in metrics:
            parts.append(f"{key}: {metrics[key]:.4f}")
    if not parts:
        parts = [f"{k}: {v}" for k, v in metrics.items()]
    return " | ".join(parts)


def train() -> None:
    if not DATA_CONFIG.exists():
        raise FileNotFoundError(f"Dataset YAML missing at {DATA_CONFIG}")

    model = YOLO(PRETRAINED_WEIGHTS)
    cache_value: Any
    if CACHE_MODE.lower() in {"false", "0", "none"}:
        cache_value = False
    elif CACHE_MODE.lower() in {"true", "1"}:
        cache_value = True
    else:
        cache_value = CACHE_MODE

    print("Training Configuration:")
    print(f"  Epochs: {EPOCHS}, Batch: {BATCH}, Image Size: {IMGSZ}")
    print(f"  Optimizer: {OPTIMIZER}, LR: {LR0}")
    print(f"  Device: {DEVICE}, Workers: {WORKERS}, Cache: {CACHE_MODE}")
    print(f"  Seed: {SEED}")
    print(f"  Augmentations:")
    print(f"    HSV: h={HSV_H}, s={HSV_S}, v={HSV_V}")
    print(f"    Geometric: degrees={DEGREES}, translate={TRANSLATE}, scale={SCALE}")
    print(f"    Flips: fliplr={FLIPLR}, flipud={FLIPUD}")
    print(f"    Synthetic: mosaic={MOSAIC}, mixup={MIXUP}")

    results = model.train(
        data=str(DATA_CONFIG),
        seed=SEED,
        imgsz=IMGSZ,
        epochs=EPOCHS,
        batch=BATCH,
        optimizer=OPTIMIZER,
        lr0=LR0,
        device=DEVICE,
        cache=cache_value,
        workers=WORKERS,
        project=str(Path(__file__).resolve().parent / "runs"),
        name="detect/train",
        # Augmentation parameters
        hsv_h=HSV_H,
        hsv_s=HSV_S,
        hsv_v=HSV_V,
        degrees=DEGREES,
        translate=TRANSLATE,
        scale=SCALE,
        shear=SHEAR,
        perspective=PERSPECTIVE,
        flipud=FLIPUD,
        fliplr=FLIPLR,
        mosaic=MOSAIC,
        mixup=MIXUP,
    )
    metrics = getattr(results, "metrics", {})
    print("Training completed. Key metrics:")
    print(format_metrics(metrics))


if __name__ == "__main__":
    train()
