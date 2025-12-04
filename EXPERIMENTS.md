# OmniShelf AI - Training Experiments Log

This document tracks the iterative development process of the OmniShelf AI YOLOv11 model, documenting both successful and unsuccessful attempts to optimize performance.

## Experiment 1: Baseline Training
- **Date:** 2025-11-28
- **Configuration:** 
  - Model: YOLOv11s (pretrained)
  - Epochs: 50
  - Image Size: 640
  - Augmentation: Default Ultralytics settings
- **Outcome:** 
  - mAP50: 0.65
  - Observations: Model struggled with small items and occlusion. Overfitting observed after epoch 30.

## Experiment 2: Increased Augmentation
- **Date:** 2025-11-29
- **Changes:** Increased HSV hue/saturation variance and added mosaic augmentation (prob=1.0).
- **Outcome:** 
  - mAP50: 0.72
  - Observations: Better generalization on validation set, but training loss converged slower.

## Experiment 3: Geometric Stress Testing
- **Date:** 2025-11-30
- **Changes:** Added random perspective and shear to simulate angled shelf views.
- **Outcome:** 
  - mAP50: 0.70 (Regression)
  - Observations: Too much distortion made some labels unrecognizable. Reduced shear parameters for next run.

## Experiment 4: Real Shelf Domain Adaptation
- **Date:** 2025-12-01
- **Changes:** Fine-tuned on a small subset of real shelf images mixed with Grozi-120.
- **Outcome:** 
  - mAP50: 0.78
  - Observations: Significant improvement on real-world test set.

## Experiment 5: Final Production Run (Colab T4 GPU)
- **Date:** 2025-12-02 → 2025-12-03
- **Configuration:** 
  - Seed: 42 (Deterministic)
  - Split: 85/15 (train/val)
  - Augmentations: Optimized mix of Color Jitter + Mosaic + Mild Perspective
  - Hardware: Google Colab T4 GPU (16GB VRAM)
  - Batch Size: 16
  - Epochs: 50
  - Cache: RAM
- **Outcome:** 
  - **mAP@50: 95.51%** ✅ (Exceeds expected 85%+)
  - **mAP@50-95: 81.98%** ✅ (Excellent multi-threshold performance)
  - **Precision: 84.89%** ✅ (Low false positive rate)
