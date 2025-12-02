# OmniShelf AI - Training Experiments Log

## Project Requirements
- **Target mAP@50**: ≥85% on Grozi-120 validation
- **Target Precision**: ≥88%
- **Target Recall**: ≥85%
- **Real Shelf Generalization**: ≥70% accuracy

---

## Experiment 0: Baseline (1 Epoch - Previous Run)
**Date**: Previous session
**Purpose**: Initial sanity check
**Configuration**:
- Epochs: 1
- Device: CPU
- Image Size: 384
- Batch: 8
- Augmentations: None

**Results**:
- mAP@50: 0.0201 (2%)
- mAP@50-95: 0.0084 (0.84%)
- Status: ❌ Failed (insufficient training)

**Lessons Learned**:
- 1 epoch insufficient for any meaningful learning
- Need GPU acceleration and proper augmentations
- Baseline established for comparison

---

## Experiment 1: Full Training with Augmentations
**Date**: [To be filled after training]
**Purpose**: Full 50-epoch training with comprehensive augmentations as per project proposal
**Configuration**:
- Epochs: 50
- Device: MPS (Apple Silicon GPU)
- Image Size: 640
- Batch: 16
- Optimizer: Adam
- Learning Rate: 0.01
- Workers: 8
- Cache: RAM
- Seed: 42

**Augmentations**:
- HSV: h=0.015, s=0.7, v=0.4 (color jitter)
- Rotation: ±10 degrees
- Translation: ±10%
- Scale: ±50%
- Shear: ±2.0 degrees
- Perspective: 0.0001
- Horizontal Flip: 50%
- Mosaic: 100%
- Mixup: 10%

**Results**: [To be filled]
- mAP@50:
- mAP@50-95:
- Precision:
- Recall:
- Training Time:
- Status:

**Analysis**: [To be filled]

**Lessons Learned**: [To be filled]

---

## Experiment 2: Learning Rate Tuning
**Status**: Planned
**Purpose**: Find optimal learning rate
**Variations to test**:
- LR=0.001 (conservative)
- LR=0.01 (baseline)
- LR=0.1 (aggressive)

---

## Experiment 3: Batch Size Tuning
**Status**: Planned
**Purpose**: Optimize batch size for MPS GPU
**Variations to test**:
- Batch=8 (small)
- Batch=16 (baseline)
- Batch=32 (large, if memory allows)

---

## Experiment 4: Image Size Tuning
**Status**: Planned
**Purpose**: Balance accuracy vs speed
**Variations to test**:
- Image Size=512 (fast)
- Image Size=640 (baseline)
- Image Size=800 (high quality, if memory allows)

---

## Experiment 5: Optimizer Comparison
**Status**: Planned
**Purpose**: Compare optimizer performance
**Variations to test**:
- Adam (adaptive, baseline)
- SGD (momentum-based)
- AdamW (Adam with weight decay)

---

## Experiment 6: Augmentation Intensity
**Status**: Planned
**Purpose**: Find optimal augmentation balance
**Variations to test**:
- Light: Reduced augmentation parameters
- Medium: Current baseline
- Heavy: Increased augmentation parameters

---

## Summary of Findings
[To be filled after all experiments]

### Best Configuration:
- [To be determined]

### Failed Approaches:
- [To be documented]

### Recommendations:
- [To be documented]

---

## Notes
- All experiments use seed=42 for reproducibility
- Training on Apple Silicon MPS GPU
- Dataset: Grozi-120 (1,150 train / 202 val images)
- Evaluation: Real shelf images (baseline + stress-test)
