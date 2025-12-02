"""Sanity checks for Grozi-120 YOLO annotations and train/val splits."""
from __future__ import annotations

import argparse
import json
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import yaml

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "dataset" / "grozi120"
IMAGES_DIR = DATA_DIR / "images"
LABELS_DIR = DATA_DIR / "labels"
DATA_YAML = DATA_DIR / "data.yaml"


@dataclass
class CheckResult:
    total_images: int
    total_labels: int
    missing_labels: List[str]
    missing_images: List[str]
    invalid_entries: List[Tuple[str, str]]
    class_counts: Dict[int, int]
    num_classes: int

    def to_dict(self) -> Dict[str, object]:
        return {
            "total_images": self.total_images,
            "total_labels": self.total_labels,
            "missing_labels": self.missing_labels,
            "missing_images": self.missing_images,
            "invalid_entries": self.invalid_entries,
            "class_counts": self.class_counts,
            "num_classes": self.num_classes,
        }


def load_config() -> Dict[str, object]:
    if not DATA_YAML.exists():
        raise FileNotFoundError(f"data.yaml not found at {DATA_YAML}")
    with open(DATA_YAML, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def parse_label_line(line: str, num_classes: int) -> Tuple[int, List[float]]:
    parts = line.strip().split()
    if len(parts) != 5:
        raise ValueError("label line should have 5 values: cls xc yc w h")
    cls = int(parts[0])
    if cls < 0 or cls >= num_classes:
        raise ValueError(f"class id {cls} outside [0, {num_classes - 1}]")
    vals = [float(v) for v in parts[1:]]
    x, y, w, h = vals
    for v in vals:
        if v < 0 or v > 1:
            raise ValueError(f"normalized coordinate out of range [0,1]: {v}")
    if w <= 0 or h <= 0:
        raise ValueError("width/height must be positive")
    return cls, vals


def check_dataset(num_classes: int) -> CheckResult:
    image_paths = sorted(p for p in IMAGES_DIR.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    label_paths = sorted(p for p in LABELS_DIR.iterdir() if p.suffix.lower() == ".txt")
    images_by_stem = {p.stem: p for p in image_paths}
    labels_by_stem = {p.stem: p for p in label_paths}

    missing_labels = [img.name for stem, img in images_by_stem.items() if stem not in labels_by_stem]
    missing_images = [lbl.name for stem, lbl in labels_by_stem.items() if stem not in images_by_stem]

    invalid_entries: List[Tuple[str, str]] = []
    class_counts: Counter[int] = Counter()

    for stem, label_path in labels_by_stem.items():
        if stem not in images_by_stem:
            continue
        text = label_path.read_text().strip()
        if not text:
            invalid_entries.append((label_path.name, "empty label file"))
            continue
        for line in text.splitlines():
            try:
                cls, _ = parse_label_line(line, num_classes)
                class_counts[cls] += 1
            except Exception as exc:  # noqa: BLE001
                invalid_entries.append((label_path.name, str(exc)))

    return CheckResult(
        total_images=len(image_paths),
        total_labels=len(label_paths),
        missing_labels=missing_labels,
        missing_images=missing_images,
        invalid_entries=invalid_entries,
        class_counts=dict(class_counts),
        num_classes=num_classes,
    )


def save_report(result: CheckResult, output: Path) -> None:
    output.write_text(json.dumps(result.to_dict(), indent=2))
    print(f"Sanity check report saved to {output}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate Grozi-120 YOLO labels and images.")
    parser.add_argument(
        "--output",
        type=Path,
        default=DATA_DIR / "label_sanity_report.json",
        help="Where to write a JSON summary of the checks.",
    )
    args = parser.parse_args()

    config = load_config()
    num_classes = int(config.get("nc", 0) or 0)
    if num_classes <= 0:
        raise ValueError(f"Invalid number of classes in data.yaml: {num_classes}")

    result = check_dataset(num_classes)
    print(f"Images: {result.total_images}, Labels: {result.total_labels}")
    print(f"Missing labels: {len(result.missing_labels)}, Missing images: {len(result.missing_images)}")
    print(f"Invalid label entries: {len(result.invalid_entries)}")
    print(f"Non-empty class counts (top 5): {sorted(result.class_counts.items())[:5]}")
    save_report(result, args.output)


if __name__ == "__main__":
    main()
