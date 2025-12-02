"""Create deterministic train/val splits for Grozi-120 without duplicating data."""
from __future__ import annotations

import argparse
import os
import random
import shutil
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import yaml

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "dataset" / "grozi120"
IMAGES_DIR = DATA_DIR / "images"
LABELS_DIR = DATA_DIR / "labels"
DATA_YAML = DATA_DIR / "data.yaml"
SPLIT_DIR = DATA_DIR / "splits"


def load_yaml() -> Dict[str, object]:
    if not DATA_YAML.exists():
        raise FileNotFoundError(f"data.yaml not found at {DATA_YAML}")
    with open(DATA_YAML, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def find_pairs() -> List[Tuple[Path, Path]]:
    images = sorted(p for p in IMAGES_DIR.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    pairs: List[Tuple[Path, Path]] = []
    for img in images:
        label = LABELS_DIR / f"{img.stem}.txt"
        if not label.exists():
            continue
        pairs.append((img, label))
    if not pairs:
        raise RuntimeError(f"No (image, label) pairs found in {IMAGES_DIR}")
    return pairs


def prepare_split_dirs() -> Dict[str, Dict[str, Path]]:
    split_paths = {
        "train": {
            "images": IMAGES_DIR / "train",
            "labels": LABELS_DIR / "train",
        },
        "val": {
            "images": IMAGES_DIR / "val",
            "labels": LABELS_DIR / "val",
        },
    }
    for split in split_paths.values():
        for path in split.values():
            if path.exists():
                shutil.rmtree(path)
            path.mkdir(parents=True, exist_ok=True)
    SPLIT_DIR.mkdir(parents=True, exist_ok=True)
    return split_paths


def symlink_pairs(pairs: Iterable[Tuple[Path, Path]], dest_img_dir: Path, dest_lbl_dir: Path) -> None:
    for img, lbl in pairs:
        dest_img = dest_img_dir / img.name
        dest_lbl = dest_lbl_dir / lbl.name
        if dest_img.exists() or dest_img.is_symlink():
            dest_img.unlink()
        if dest_lbl.exists() or dest_lbl.is_symlink():
            dest_lbl.unlink()
        os.symlink(img.resolve(), dest_img)
        os.symlink(lbl.resolve(), dest_lbl)


def write_split_files(train_pairs: List[Tuple[Path, Path]], val_pairs: List[Tuple[Path, Path]]) -> None:
    train_file = SPLIT_DIR / "train.txt"
    val_file = SPLIT_DIR / "val.txt"
    train_file.write_text("\n".join(p[0].name for p in train_pairs))
    val_file.write_text("\n".join(p[0].name for p in val_pairs))


def update_data_yaml(config: Dict[str, object], seed: int, val_ratio: float) -> None:
    config["path"] = "./yolo/dataset/grozi120"
    config["train"] = "images/train"
    config["val"] = "images/val"
    meta = config.get("meta", {}) or {}
    meta.update({"split_seed": seed, "val_ratio": val_ratio})
    config["meta"] = meta
    with open(DATA_YAML, "w", encoding="utf-8") as fh:
        yaml.safe_dump(config, fh)


def create_split(val_ratio: float, seed: int) -> None:
    pairs = find_pairs()
    random.seed(seed)
    random.shuffle(pairs)
    val_size = max(1, int(len(pairs) * val_ratio))
    val_pairs = pairs[:val_size]
    train_pairs = pairs[val_size:]

    split_dirs = prepare_split_dirs()
    symlink_pairs(train_pairs, split_dirs["train"]["images"], split_dirs["train"]["labels"])
    symlink_pairs(val_pairs, split_dirs["val"]["images"], split_dirs["val"]["labels"])
    write_split_files(train_pairs, val_pairs)

    config = load_yaml()
    update_data_yaml(config, seed, val_ratio)
    print(f"Created train/val split -> Train: {len(train_pairs)}, Val: {len(val_pairs)}")
    print(f"Updated data.yaml to point to images/train and images/val")


def main() -> None:
    parser = argparse.ArgumentParser(description="Create deterministic train/val splits for Grozi-120.")
    parser.add_argument("--val-ratio", type=float, default=0.15, help="Portion of samples to use for validation.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility.")
    args = parser.parse_args()

    if not 0 < args.val_ratio < 1:
        raise ValueError("--val-ratio must be between 0 and 1.")
    create_split(args.val_ratio, args.seed)


if __name__ == "__main__":
    main()
