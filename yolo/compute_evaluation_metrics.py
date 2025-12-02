"""Comprehensive evaluation metrics for OmniShelf AI project.

Computes:
- mAP drop (clean validation vs real shelf)
- Counting error
- Misclassification patterns
- Qualitative error analysis
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd
from ultralytics import YOLO


def load_validation_metrics(runs_dir: Path) -> Dict[str, float]:
    """Load validation metrics from the latest training run."""
    results_file = runs_dir / "detect" / "train" / "results.csv"
    if not results_file.exists():
        print(f"Warning: No results.csv found at {results_file}")
        return {}

    df = pd.read_csv(results_file)
    # Get metrics from the last epoch
    last_row = df.iloc[-1]

    return {
        "val_mAP50": last_row.get("metrics/mAP50(B)", 0.0),
        "val_mAP50-95": last_row.get("metrics/mAP50-95(B)", 0.0),
        "val_precision": last_row.get("metrics/precision(B)", 0.0),
        "val_recall": last_row.get("metrics/recall(B)", 0.0),
    }


def load_real_shelf_detections(csv_path: Path) -> pd.DataFrame:
    """Load real shelf evaluation results."""
    if not csv_path.exists():
        raise FileNotFoundError(f"Real shelf evaluation CSV not found: {csv_path}")
    return pd.read_csv(csv_path)


def compute_map_drop(val_metrics: Dict[str, float], real_map: float) -> Dict[str, float]:
    """Compute mAP drop from validation to real shelf."""
    val_map = val_metrics.get("val_mAP50", 0.0)
    drop = val_map - real_map
    drop_percent = (drop / val_map * 100) if val_map > 0 else 0.0

    return {
        "val_mAP50": val_map,
        "real_mAP50": real_map,
        "mAP_drop": drop,
        "mAP_drop_percent": drop_percent,
    }


def compute_counting_error(detections_df: pd.DataFrame, ground_truth: Dict[str, int] | None = None) -> Dict[str, float]:
    """Compute counting error metrics.

    If ground_truth is provided, compares against it.
    Otherwise, provides detection statistics.
    """
    if ground_truth is None:
        # Without ground truth, provide detection statistics
        total_detections = detections_df["count"].sum()
        avg_detections_per_image = detections_df.groupby("image_name")["count"].sum().mean()

        return {
            "total_detections": int(total_detections),
            "avg_detections_per_image": float(avg_detections_per_image),
            "note": "Ground truth not provided - showing detection statistics only",
        }

    # With ground truth, compute actual counting error
    errors = []
    for image_name, true_count in ground_truth.items():
        predicted_count = detections_df[detections_df["image_name"] == image_name]["count"].sum()
        error = abs(predicted_count - true_count)
        errors.append(error)

    avg_error = sum(errors) / len(errors) if errors else 0.0
    error_percent = (avg_error / sum(ground_truth.values()) * 100) if ground_truth else 0.0

    return {
        "average_counting_error": avg_error,
        "counting_error_percent": error_percent,
        "total_images": len(ground_truth),
    }


def analyze_misclassifications(detections_df: pd.DataFrame) -> Dict[str, any]:
    """Analyze misclassification patterns."""
    # Get class distribution
    class_counts = detections_df.groupby("class_name")["count"].sum().sort_values(ascending=False)

    # Identify dominant classes
    total_detections = class_counts.sum()
    top_5_classes = class_counts.head(5)
    top_5_percent = (top_5_classes.sum() / total_detections * 100) if total_detections > 0 else 0.0

    # Classes with no detections (if we have class list)
    detected_classes = set(detections_df["class_name"].unique())

    # Per-dataset analysis
    dataset_stats = {}
    for dataset in detections_df["dataset"].unique():
        dataset_df = detections_df[detections_df["dataset"] == dataset]
        dataset_stats[dataset] = {
            "total_detections": int(dataset_df["count"].sum()),
            "num_classes_detected": len(dataset_df["class_name"].unique()),
            "avg_confidence": float(dataset_df["avg_confidence"].mean()),
        }

    return {
        "total_detections": int(total_detections),
        "num_classes_detected": len(detected_classes),
        "top_5_classes": top_5_classes.to_dict(),
        "top_5_coverage_percent": float(top_5_percent),
        "dataset_breakdown": dataset_stats,
        "detection_bias": f"{'High bias detected' if top_5_percent > 70 else 'Moderate distribution'}",
    }


def qualitative_analysis(detections_df: pd.DataFrame) -> Dict[str, any]:
    """Perform qualitative error analysis."""
    # Analyze confidence distributions
    avg_confidence = detections_df["avg_confidence"].mean()
    low_confidence_threshold = 0.5
    low_confidence_detections = len(detections_df[detections_df["avg_confidence"] < low_confidence_threshold])

    # Per-image analysis
    images_with_detections = detections_df.groupby("image_name")["count"].sum()
    images_with_no_detections = len(detections_df[detections_df["count"] == 0].groupby("image_name"))

    # Baseline vs stress-test comparison
    baseline_df = detections_df[detections_df["dataset"] == "baseline"]
    stress_df = detections_df[detections_df["dataset"] == "stress_test"]

    baseline_avg_detections = baseline_df["count"].mean() if len(baseline_df) > 0 else 0
    stress_avg_detections = stress_df["count"].mean() if len(stress_df) > 0 else 0

    robustness_score = (stress_avg_detections / baseline_avg_detections * 100) if baseline_avg_detections > 0 else 0

    return {
        "avg_confidence": float(avg_confidence),
        "low_confidence_detections": int(low_confidence_detections),
        "images_analyzed": len(images_with_detections),
        "images_with_no_detections": int(images_with_no_detections),
        "baseline_avg_detections_per_image": float(baseline_avg_detections),
        "stress_test_avg_detections_per_image": float(stress_avg_detections),
        "robustness_score_percent": float(robustness_score),
        "robustness_assessment": (
            "Excellent" if robustness_score > 80 else
            "Good" if robustness_score > 60 else
            "Moderate" if robustness_score > 40 else
            "Poor"
        ),
    }


def generate_report(
    val_metrics: Dict[str, float],
    detections_df: pd.DataFrame,
    output_path: Path,
) -> None:
    """Generate comprehensive evaluation report."""

    # Note: For real mAP, we'd need ground truth annotations
    # For now, we'll use average confidence as a proxy
    real_map_proxy = detections_df["avg_confidence"].mean()

    report = {
        "validation_metrics": val_metrics,
        "real_shelf_proxy_mAP": float(real_map_proxy),
        "mAP_analysis": {
            "note": "Real shelf mAP requires ground truth annotations",
            "proxy_metric": "Using average detection confidence",
            "val_mAP50": val_metrics.get("val_mAP50", 0.0),
            "real_shelf_avg_confidence": float(real_map_proxy),
        },
        "counting_analysis": compute_counting_error(detections_df),
        "misclassification_analysis": analyze_misclassifications(detections_df),
        "qualitative_analysis": qualitative_analysis(detections_df),
        "success_criteria_evaluation": {
            "target_val_mAP50": 0.85,
            "achieved_val_mAP50": val_metrics.get("val_mAP50", 0.0),
            "meets_target": val_metrics.get("val_mAP50", 0.0) >= 0.85,
            "target_precision": 0.88,
            "achieved_precision": val_metrics.get("val_precision", 0.0),
            "target_recall": 0.85,
            "achieved_recall": val_metrics.get("val_recall", 0.0),
        },
    }

    # Write JSON report
    with open(output_path, "w") as f:
        json.dump(report, f, indent=2)

    print(f"\nEvaluation report saved to: {output_path}")

    # Print summary
    print("\n" + "="*60)
    print("EVALUATION METRICS SUMMARY")
    print("="*60)

    print("\n1. VALIDATION METRICS (Grozi-120):")
    for key, value in val_metrics.items():
        print(f"   {key}: {value:.4f}")

    print("\n2. REAL SHELF PERFORMANCE:")
    print(f"   Average Confidence: {real_map_proxy:.4f}")
    print(f"   Note: Ground truth annotations needed for true mAP calculation")

    counting = report["counting_analysis"]
    print("\n3. COUNTING STATISTICS:")
    print(f"   Total Detections: {counting['total_detections']}")
    print(f"   Avg Detections/Image: {counting['avg_detections_per_image']:.2f}")

    misclass = report["misclassification_analysis"]
    print("\n4. CLASSIFICATION PATTERNS:")
    print(f"   Classes Detected: {misclass['num_classes_detected']}")
    print(f"   Top 5 Coverage: {misclass['top_5_coverage_percent']:.1f}%")
    print(f"   Detection Bias: {misclass['detection_bias']}")
    print(f"   Top 5 Classes:")
    for cls, count in list(misclass["top_5_classes"].items())[:5]:
        print(f"     - {cls}: {count}")

    qual = report["qualitative_analysis"]
    print("\n5. ROBUSTNESS ANALYSIS:")
    print(f"   Baseline Avg Detections: {qual['baseline_avg_detections_per_image']:.2f}")
    print(f"   Stress-Test Avg Detections: {qual['stress_test_avg_detections_per_image']:.2f}")
    print(f"   Robustness Score: {qual['robustness_score_percent']:.1f}%")
    print(f"   Assessment: {qual['robustness_assessment']}")

    success = report["success_criteria_evaluation"]
    print("\n6. SUCCESS CRITERIA (Project Proposal):")
    print(f"   Val mAP@50: {success['achieved_val_mAP50']:.4f} (target: {success['target_val_mAP50']}) {'✓' if success['meets_target'] else '✗'}")
    print(f"   Precision: {success['achieved_precision']:.4f} (target: {success['target_precision']}) {'✓' if success['achieved_precision'] >= success['target_precision'] else '✗'}")
    print(f"   Recall: {success['achieved_recall']:.4f} (target: {success['target_recall']}) {'✓' if success['achieved_recall'] >= success['target_recall'] else '✗'}")

    print("\n" + "="*60)


def main() -> None:
    """Main evaluation function."""
    base_dir = Path(__file__).resolve().parent
    runs_dir = base_dir / "runs"
    eval_csv = base_dir / "real_shelf_evaluation.csv"
    output_json = base_dir / "evaluation_metrics_report.json"

    print("Loading metrics...")

    # Load validation metrics
    val_metrics = load_validation_metrics(runs_dir)
    if not val_metrics:
        print("Warning: Could not load validation metrics. Proceeding with available data.")

    # Load real shelf detections
    try:
        detections_df = load_real_shelf_detections(eval_csv)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please run: python yolo/evaluate_real_shelves.py --include-stress-test")
        return

    # Generate report
    generate_report(val_metrics, detections_df, output_json)


if __name__ == "__main__":
    main()
