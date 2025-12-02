#!/bin/bash
# Automated hyperparameter tuning experiments for OmniShelf AI

set -e  # Exit on error

VENV_PATH="venv/bin/activate"
TRAIN_SCRIPT="yolo/train_yolo.py"
EVAL_SCRIPT="yolo/evaluate_real_shelves.py"
METRICS_SCRIPT="yolo/compute_evaluation_metrics.py"

echo "=================================================="
echo "OmniShelf AI - Automated Hyperparameter Tuning"
echo "=================================================="

# Source virtual environment
source "$VENV_PATH"

# Function to run training and evaluation
run_experiment() {
    local exp_name=$1
    local exp_num=$2
    shift 2
    local env_vars="$@"

    echo ""
    echo "=================================================="
    echo "Running Experiment $exp_num: $exp_name"
    echo "=================================================="
    echo "Environment: $env_vars"
    echo ""

    # Run training
    eval "$env_vars python $TRAIN_SCRIPT"

    # Run evaluation
    echo ""
    echo "Running evaluation on real shelves..."
    python "$EVAL_SCRIPT" --include-stress-test

    # Compute metrics
    echo ""
    echo "Computing evaluation metrics..."
    python "$METRICS_SCRIPT"

    # Backup results
    mkdir -p "experiments/exp_${exp_num}_${exp_name// /_}"
    cp yolo/runs/detect/train/results.csv "experiments/exp_${exp_num}_${exp_name// /_}/results.csv"
    cp yolo/real_shelf_evaluation.csv "experiments/exp_${exp_num}_${exp_name// /_}/real_shelf_evaluation.csv"
    cp yolo/evaluation_metrics_report.json "experiments/exp_${exp_num}_${exp_name// /_}/evaluation_metrics_report.json"

    echo ""
    echo "Experiment $exp_num completed! Results saved to experiments/exp_${exp_num}_${exp_name// /_}/"
    echo ""
}

# Create experiments directory
mkdir -p experiments

# Experiment 1: Baseline (already configured in script)
echo "Experiment 1 will be run manually with 50 epochs"

# Experiment 2: Learning Rate Variations
echo ""
read -p "Run Experiment 2 (Learning Rate: 0.001)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "LR_0.001" "2a" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_LR0=0.001"
fi

read -p "Run Experiment 2 (Learning Rate: 0.1)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "LR_0.1" "2b" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_LR0=0.1"
fi

# Experiment 3: Batch Size Variations
read -p "Run Experiment 3 (Batch Size: 8)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "Batch_8" "3a" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_BATCH=8"
fi

read -p "Run Experiment 3 (Batch Size: 32)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "Batch_32" "3b" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_BATCH=32"
fi

# Experiment 4: Image Size Variations
read -p "Run Experiment 4 (Image Size: 512)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "ImgSz_512" "4a" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_IMGSZ=512"
fi

read -p "Run Experiment 4 (Image Size: 800)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "ImgSz_800" "4b" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_IMGSZ=800"
fi

# Experiment 5: Optimizer Comparison
read -p "Run Experiment 5 (Optimizer: SGD)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "Optimizer_SGD" "5a" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_OPTIMIZER=SGD"
fi

read -p "Run Experiment 5 (Optimizer: AdamW)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "Optimizer_AdamW" "5b" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_OPTIMIZER=AdamW"
fi

# Experiment 6: Augmentation Intensity
read -p "Run Experiment 6 (Light Augmentations)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "Aug_Light" "6a" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_HSV_H=0.005 OMNISHELF_YOLO_HSV_S=0.3 OMNISHELF_YOLO_HSV_V=0.2 OMNISHELF_YOLO_DEGREES=5.0 OMNISHELF_YOLO_MOSAIC=0.5 OMNISHELF_YOLO_MIXUP=0.0"
fi

read -p "Run Experiment 6 (Heavy Augmentations)? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    run_experiment "Aug_Heavy" "6b" "OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 OMNISHELF_YOLO_HSV_H=0.03 OMNISHELF_YOLO_HSV_S=0.9 OMNISHELF_YOLO_HSV_V=0.6 OMNISHELF_YOLO_DEGREES=20.0 OMNISHELF_YOLO_MOSAIC=1.0 OMNISHELF_YOLO_MIXUP=0.2"
fi

echo ""
echo "=================================================="
echo "All selected experiments completed!"
echo "=================================================="
echo "Results saved in experiments/ directory"
echo "Update experiments_log.md with findings"
