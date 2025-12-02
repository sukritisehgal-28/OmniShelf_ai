"""Generate stress-test augmentations for real supermarket shelf images."""
from __future__ import annotations

import argparse
import csv
import random
from pathlib import Path
from typing import Callable, Iterable, List, Tuple

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent
DEFAULT_INPUT = ROOT / "dataset" / "real_shelves" / "images"
DEFAULT_OUTPUT = ROOT / "dataset" / "real_shelves" / "stress_test"

# --- Augmentation primitives ------------------------------------------------- #


def _adjust_lighting(img: np.ndarray) -> Tuple[np.ndarray, str]:
    alpha = random.uniform(0.6, 1.3)  # contrast
    beta = random.uniform(-40, 40)  # brightness
    out = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)
    return out, f"light_{alpha:.2f}_{beta:.0f}"


def _add_gaussian_blur(img: np.ndarray) -> Tuple[np.ndarray, str]:
    k = random.choice([3, 5, 7])
    out = cv2.GaussianBlur(img, (k, k), sigmaX=0)
    return out, f"blur_k{k}"


def _add_perspective(img: np.ndarray) -> Tuple[np.ndarray, str]:
    h, w = img.shape[:2]
    margin = int(0.08 * min(h, w))
    src = np.float32(
        [
            [random.randint(0, margin), random.randint(0, margin)],
            [w - random.randint(1, margin), random.randint(0, margin)],
            [random.randint(0, margin), h - random.randint(1, margin)],
            [w - random.randint(1, margin), h - random.randint(1, margin)],
        ]
    )
    dst = np.float32(
        [
            [0, 0],
            [w - 1, 0],
            [0, h - 1],
            [w - 1, h - 1],
        ]
    )
    matrix = cv2.getPerspectiveTransform(src, dst)
    out = cv2.warpPerspective(img, matrix, (w, h), borderMode=cv2.BORDER_REPLICATE)
    return out, "perspective"


def _add_occlusion(img: np.ndarray) -> Tuple[np.ndarray, str]:
    h, w = img.shape[:2]
    num_boxes = random.randint(1, 3)
    out = img.copy()
    for idx in range(num_boxes):
        box_w = random.randint(int(0.08 * w), int(0.2 * w))
        box_h = random.randint(int(0.08 * h), int(0.2 * h))
        x1 = random.randint(0, max(1, w - box_w))
        y1 = random.randint(0, max(1, h - box_h))
        color = [int(c) for c in np.mean(img, axis=(0, 1))]
        cv2.rectangle(out, (x1, y1), (x1 + box_w, y1 + box_h), color, thickness=-1)
    return out, f"occlusion{num_boxes}"


def _add_color_cast(img: np.ndarray) -> Tuple[np.ndarray, str]:
    shift = np.array(
        [random.randint(-20, 30), random.randint(-20, 30), random.randint(-20, 30)],
        dtype=np.int16,
    )
    out = np.clip(img.astype(np.int16) + shift, 0, 255).astype(np.uint8)
    return out, f"color_{shift[0]}_{shift[1]}_{shift[2]}"


def _add_noise(img: np.ndarray) -> Tuple[np.ndarray, str]:
    noise = np.random.normal(0, random.uniform(5, 18), img.shape).astype(np.float32)
    out = np.clip(img.astype(np.float32) + noise, 0, 255).astype(np.uint8)
    return out, "noise"


AUGMENTATIONS: List[Callable[[np.ndarray], Tuple[np.ndarray, str]]] = [
    _adjust_lighting,
    _add_gaussian_blur,
    _add_perspective,
    _add_occlusion,
    _add_color_cast,
    _add_noise,
]


# --- Core logic -------------------------------------------------------------- #


def load_images(input_dir: Path) -> List[Path]:
    return sorted(
        p for p in input_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"}
    )


def apply_random_transforms(image: np.ndarray, max_ops: int = 3) -> Tuple[np.ndarray, List[str]]:
    num_ops = random.randint(1, max_ops)
    ops = random.sample(AUGMENTATIONS, num_ops)
    out = image
    names: List[str] = []
    for op in ops:
        out, name = op(out)
        names.append(name)
    return out, names


def augment_dataset(
    input_dir: Path, output_dir: Path, variants_per_image: int, seed: int
) -> None:
    random.seed(seed)
    np.random.seed(seed)
    images = load_images(input_dir)
    if not images:
        raise RuntimeError(f"No images found in {input_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_dir / "manifest.csv"
    rows: List[List[str]] = []

    for image_path in images:
        image = cv2.imread(str(image_path))
        if image is None:
            print(f"Skipping unreadable image: {image_path}")
            continue
        for idx in range(variants_per_image):
            aug_img, ops = apply_random_transforms(image)
            ops_tag = "+".join(ops)
            dest_name = f"{image_path.stem}_aug{idx+1}_{ops_tag}.jpg"
            dest_path = output_dir / dest_name
            cv2.imwrite(str(dest_path), aug_img)
            rows.append([image_path.name, dest_name, ops_tag])

    with manifest_path.open("w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["source_image", "augmented_image", "operations"])
        writer.writerows(rows)
    print(f"Augmented {len(rows)} images -> {output_dir}")
    print(f"Manifest written to {manifest_path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create stress-test augmentations for real shelf evaluation images."
    )
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=DEFAULT_INPUT,
        help="Directory containing original real shelf images.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Directory to store augmented stress-test images.",
    )
    parser.add_argument(
        "--variants-per-image",
        type=int,
        default=4,
        help="How many augmented variants to create per source image.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducibility.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    augment_dataset(args.input_dir, args.output_dir, args.variants_per_image, args.seed)


if __name__ == "__main__":
    main()
