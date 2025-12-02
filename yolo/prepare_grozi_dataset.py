"""Utility script to convert the Grozi-120 in vitro dataset into YOLO format."""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np
import yaml

ROOT = Path(__file__).resolve().parent
IN_VITRO_DIR = ROOT / "dataset" / "grozi120" / "inVitro"
IMAGES_DIR = ROOT / "dataset" / "grozi120" / "images"
LABELS_DIR = ROOT / "dataset" / "grozi120" / "labels"
DATA_YAML = ROOT / "dataset" / "grozi120" / "data.yaml"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Prepare Grozi-120 dataset for YOLO training.")
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Delete existing images/labels before writing new files.",
    )
    return parser.parse_args()


def reset_output_dirs(overwrite: bool) -> None:
    for directory in (IMAGES_DIR, LABELS_DIR):
        if directory.exists() and overwrite:
            shutil.rmtree(directory)
        directory.mkdir(parents=True, exist_ok=True)


def discover_class_dirs() -> List[Path]:
    if not IN_VITRO_DIR.exists():
        raise FileNotFoundError(
            f"Expected in vitro dataset under {IN_VITRO_DIR}. Upload/extract Grozi data first."
        )
    class_dirs = [p for p in IN_VITRO_DIR.iterdir() if p.is_dir()]
    if not class_dirs:
        raise RuntimeError(f"No class folders found inside {IN_VITRO_DIR}")
    return sorted(class_dirs, key=lambda p: int(p.name))


def find_mask(image_path: Path, masks_dir: Path) -> Optional[Path]:
    digits = "".join(ch for ch in image_path.stem if ch.isdigit())
    candidates = []
    if digits:
        candidates.extend(
            [
                masks_dir / f"mask{digits}.png",
                masks_dir / f"mask{digits}.jpg",
                masks_dir / f"mask{digits}.jpeg",
            ]
        )
    candidates.append(masks_dir / f"{image_path.stem}.png")
    candidates.append(masks_dir / f"{image_path.stem}.jpg")
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def mask_to_bbox(mask_path: Path) -> Optional[Tuple[int, int, int, int]]:
    mask = cv2.imread(str(mask_path), cv2.IMREAD_GRAYSCALE)
    if mask is None:
        return None
    ys, xs = np.where(mask > 0)
    if len(xs) == 0 or len(ys) == 0:
        return None
    x1, x2 = xs.min(), xs.max()
    y1, y2 = ys.min(), ys.max()
    return x1, y1, x2, y2


def write_label(label_path: Path, class_id: int, bbox: Tuple[int, int, int, int], image_shape: Tuple[int, int]) -> None:
    x1, y1, x2, y2 = bbox
    w = x2 - x1 + 1
    h = y2 - y1 + 1
    img_h, img_w = image_shape
    x_center = (x1 + x2) / 2 / img_w
    y_center = (y1 + y2) / 2 / img_h
    width = w / img_w
    height = h / img_h
    label_path.write_text(f"{class_id} {x_center:.6f} {y_center:.6f} {width:.6f} {height:.6f}\n")


def process_class_dir(class_dir: Path, class_id: int) -> Tuple[int, int]:
    web_dir = class_dir / "web"
    jpeg_dir = web_dir / "JPEG"
    png_dir = web_dir / "PNG"
    masks_dir = web_dir / "masks"
    images = []
    for directory in (jpeg_dir, png_dir):
        if directory.exists():
            images.extend(
                p for p in directory.iterdir() if p.is_file() and not p.name.lower().startswith("thumbs")
            )
    processed = 0
    skipped = 0
    for image_path in sorted(images):
        mask_path = find_mask(image_path, masks_dir)
        if not mask_path:
            skipped += 1
            continue
        bbox = mask_to_bbox(mask_path)
        if not bbox:
            skipped += 1
            continue
        image = cv2.imread(str(image_path))
        if image is None:
            skipped += 1
            continue
        img_h, img_w = image.shape[:2]
        dest_name = f"class{class_id:03d}_{image_path.name}"
        dest_image_path = IMAGES_DIR / dest_name
        cv2.imwrite(str(dest_image_path), image)
        label_path = LABELS_DIR / f"{dest_image_path.stem}.txt"
        write_label(label_path, class_id, bbox, (img_h, img_w))
        processed += 1
    return processed, skipped


def update_data_yaml(num_classes: int, class_dirs: List[Path]) -> None:
    names = {idx: f"grozi_{path.name}" for idx, path in enumerate(class_dirs)}
    content: Dict[str, object] = {
        "path": "./yolo/dataset/grozi120",
        "train": "images",
        "val": "images",
        "nc": num_classes,
        "names": names,
    }
    with open(DATA_YAML, "w", encoding="utf-8") as fh:
        yaml.safe_dump(content, fh)


def main() -> None:
    args = parse_args()
    reset_output_dirs(args.overwrite)
    class_dirs = discover_class_dirs()
    summary = []
    for class_id, class_dir in enumerate(class_dirs):
        processed, skipped = process_class_dir(class_dir, class_id)
        summary.append((class_dir.name, processed, skipped))
        print(f"Class {class_dir.name}: processed {processed}, skipped {skipped}")
    update_data_yaml(len(class_dirs), class_dirs)
    total_images = sum(p for _, p, _ in summary)
    print(f"Prepared {total_images} images across {len(class_dirs)} classes.")


if __name__ == "__main__":
    main()
