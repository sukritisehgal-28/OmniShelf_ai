"""Run evaluation on real supermarket shelf images using the trained YOLO model."""
from __future__ import annotations

import shutil
import sys
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Sequence, Tuple

import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from yolo.utils import load_model, run_inference, yolo_result_to_detections

MODEL_PATH = Path(__file__).resolve().parent / "runs" / "detect" / "train" / "weights" / "best.pt"
REAL_SHELF_DIR = Path(__file__).resolve().parent / "dataset" / "real_shelves" / "images"
STRESS_TEST_DIR = Path(__file__).resolve().parent / "dataset" / "real_shelves" / "stress_test"
OUTPUT_CSV = Path(__file__).resolve().parent / "real_shelf_evaluation.csv"
REAL_SHELF_DATASET_ID = "humansintheloop/supermarket-shelves-dataset"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def _download_real_shelf_dataset() -> None:
    """Download and populate the real shelf images using KaggleHub."""
    try:
        import kagglehub
    except ImportError:
        print(
            "kagglehub is not installed. Install it with `pip install kagglehub` to download "
            "the Supermarket Shelves dataset automatically."
        )
        return

    print(f"Downloading {REAL_SHELF_DATASET_ID} via KaggleHub...")
    dataset_path = Path(kagglehub.dataset_download(REAL_SHELF_DATASET_ID))
    print(f"Dataset available at {dataset_path}")

    image_files = []
    for ext in IMAGE_EXTENSIONS:
        image_files.extend(dataset_path.rglob(f"*{ext}"))

    if not image_files:
        print("No image files discovered in the downloaded dataset.")
        return

    REAL_SHELF_DIR.mkdir(parents=True, exist_ok=True)
    copied = 0
    for src in image_files:
        dest = REAL_SHELF_DIR / src.name
        if dest.exists():
            continue
        shutil.copy(src, dest)
        copied += 1
    print(f"Copied {copied} images into {REAL_SHELF_DIR}")


def _gather_images(image_dir: Path) -> List[Path]:
    return sorted(
        p for p in image_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"}
    )


def _evaluate_split(model, image_paths: Sequence[Path], dataset_name: str, use_tta: bool = False) -> List[Dict[str, object]]:
    records: List[Dict[str, object]] = []
    for image_path in image_paths:
        # Enable Test Time Augmentation (TTA) if requested
        result = run_inference(image_path, model, augment=use_tta)
        detections = yolo_result_to_detections(result)

        per_class = defaultdict(lambda: {"count": 0, "total_conf": 0.0})
        for det in detections:
            cls = det["product_name"]
            per_class[cls]["count"] += 1
            per_class[cls]["total_conf"] += det["confidence"]

        if not per_class:
            records.append(
                {
                    "dataset": dataset_name,
                    "image_name": image_path.name,
                    "class_name": "_no_detections_",
                    "count": 0,
                    "avg_confidence": 0.0,
                }
            )
            continue

        for cls, stats in per_class.items():
            avg_conf = stats["total_conf"] / max(stats["count"], 1)
            records.append(
                {
                    "dataset": dataset_name,
                    "image_name": image_path.name,
                    "class_name": cls,
                    "count": stats["count"],
                    "avg_confidence": round(avg_conf, 4),
                }
            )
    return records


def evaluate_real_shelves(include_stress_test: bool = False, use_tta: bool = False, output_csv: Path = OUTPUT_CSV) -> None:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Trained weights not found at {MODEL_PATH}. Run yolo/train_yolo.py first."
        )
    if not REAL_SHELF_DIR.exists() or not any(REAL_SHELF_DIR.glob("*")):
        _download_real_shelf_dataset()
    if not REAL_SHELF_DIR.exists():
        raise FileNotFoundError(f"Real shelf directory not found: {REAL_SHELF_DIR}")

    model = load_model(MODEL_PATH)

    splits: List[Tuple[str, Path]] = [("baseline", REAL_SHELF_DIR)]
    if include_stress_test and STRESS_TEST_DIR.exists():
        splits.append(("stress_test", STRESS_TEST_DIR))
    elif include_stress_test:
        print(f"Requested stress-test split but {STRESS_TEST_DIR} does not exist; skipping.")

    all_records: List[Dict[str, object]] = []
    for name, image_dir in splits:
        image_paths = _gather_images(image_dir)
        if not image_paths:
            raise RuntimeError(f"No images found in {image_dir}")
        print(f"Evaluating {len(image_paths)} images from '{name}' at {image_dir} (TTA={use_tta})")
        all_records.extend(_evaluate_split(model, image_paths, name, use_tta=use_tta))

    df = pd.DataFrame(all_records)
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_csv, index=False)
    print(f"Saved evaluation summary to {output_csv}")
    per_dataset = df.groupby(["dataset", "class_name"])["count"].sum().sort_values(ascending=False)
    print(per_dataset)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Evaluate trained YOLO model on real shelf images.")
    parser.add_argument(
        "--include-stress-test",
        action="store_true",
        help="Also evaluate the augmented stress-test images (if generated).",
    )
    parser.add_argument(
        "--tta",
        action="store_true",
        help="Enable Test Time Augmentation (TTA) for ensemble-like performance improvement.",
    )
    parser.add_argument(
        "--output-csv",
        type=Path,
        default=OUTPUT_CSV,
        help="Where to write the evaluation summary CSV.",
    )
    args = parser.parse_args()
    evaluate_real_shelves(
        include_stress_test=args.include_stress_test,
        use_tta=args.tta,
        output_csv=args.output_csv
    )
