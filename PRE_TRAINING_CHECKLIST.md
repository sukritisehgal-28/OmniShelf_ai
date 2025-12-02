# OmniShelf AI - Pre-Training Final Checklist

**Date**: December 2, 2025
**Student**: Sukriti Sehgal
**Course**: Applied Computer Vision and Competitive Data Science

---

## 🎯 PROJECT OVERVIEW

### What You're Building
**OmniShelf AI** - An end-to-end retail shelf intelligence system that:
1. **Detects grocery products** on shelves using YOLOv11
2. **Generalizes from clean images to real shelves** (train-on-clean, test-on-real)
3. **Powers stock analytics** (LOW/MEDIUM/HIGH/OUT-OF-STOCK alerts)
4. **Enables SmartCart assistant** (customer product lookup)

### Academic Alignment
✅ **Custom Project Option** (with permission - not Kaggle competition)
✅ **Performance Optimization Focus** (5+ iterative experiments planned)
✅ **Submission & Reporting Ready** (experiment log + metrics tracking)
✅ **Comparable Scope & Rigor** to competitive challenges

---

## 📊 DATASET VERIFICATION

### Training Dataset: Grozi-120 ✓
- **Source**: Clean grocery product images (120 classes)
- **Total Images**: 1,350
- **Train Split**: 1,149 images (85%)
- **Val Split**: 201 images (15%)
- **Split Method**: Deterministic with seed=42 (reproducible)
- **Format**: YOLO annotations with symlinked images (no duplication)
- **Classes**: grozi_1 through grozi_120

### Evaluation Dataset: Real Shelves ✓
- **Baseline Images**: 45 real supermarket shelf photos
- **Stress-Test Images**: 135 augmented variants (6 augmentation types)
- **Total Eval Images**: 180
- **Purpose**: Test generalization (clean → real-world)
- **Augmentations**: Lighting, blur, occlusion, perspective, color cast, noise

---

## 🔧 TECHNICAL INFRASTRUCTURE

### Hardware & Environment ✓
- **Platform**: macOS (Darwin 25.0.0)
- **GPU**: Apple Silicon MPS (Metal Performance Shaders) - Available ✓
- **System RAM**: 8.0 GB
- **PyTorch**: 2.9.1 with MPS support
- **Ultralytics**: YOLOv11 installed and verified
- **Python**: 3.13 in virtual environment

### Training Configuration ✓
**Baseline (Experiment 1):**
```
Epochs: 50
Device: MPS (Apple Silicon GPU)
Image Size: 640×640
Batch Size: 16 (may reduce to 8 for 8GB RAM stability)
Optimizer: Adam
Learning Rate: 0.01
Workers: 8
Cache: RAM
Seed: 42 (reproducible)
```

**Augmentations Enabled:**
- ✅ HSV Color Jitter (h=0.015, s=0.7, v=0.4)
- ✅ Rotation (±10 degrees)
- ✅ Translation (±10%)
- ✅ Scaling (±50%)
- ✅ Shear (±2.0 degrees)
- ✅ Perspective (0.0001)
- ✅ Horizontal Flip (50% probability)
- ✅ Mosaic (100% - synthetic scenes)
- ✅ Mixup (10% - synthetic scenes)

**Note**: Blur augmentation applied during stress-test evaluation (not supported in training API)

### Scripts Ready ✓
1. **[yolo/train_yolo.py](yolo/train_yolo.py)** - Enhanced training with all augmentations
2. **[yolo/evaluate_real_shelves.py](yolo/evaluate_real_shelves.py)** - Real shelf + stress-test evaluation
3. **[yolo/compute_evaluation_metrics.py](yolo/compute_evaluation_metrics.py)** - Comprehensive metrics analysis
4. **[run_experiments.sh](run_experiments.sh)** - Automated hyperparameter tuning
5. **[experiments_log.md](experiments_log.md)** - Experiment tracking document

---

## 🎓 PROJECT REQUIREMENTS MAPPING

### From Your Project Proposal

#### ✅ Methodology (Section 4)
| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Train on Grozi-120 | ✅ Ready | 1,149 train images, seed=42 |
| 50-100 epochs | ✅ Ready | Configured for 50 epochs |
| Augmentations (blur, jitter, rotation, synthetic) | ✅ Ready | 9 augmentation types enabled |
| Hyperparameter tuning | ✅ Ready | 5 experiments planned |
| Track mAP, precision, recall | ✅ Ready | Automated metrics script |
| Real-shelf generalization testing | ✅ Ready | 45 baseline + 135 stress-test images |
| Compute mAP drop, counting error | ✅ Ready | compute_evaluation_metrics.py |
| Misclassification analysis | ✅ Ready | Included in metrics script |
| Qualitative error analysis | ✅ Ready | Robustness scoring implemented |

#### ✅ Success Metrics (Section 5)
| Metric | Target | Current | Tracking |
|--------|--------|---------|----------|
| Val mAP@50 | ≥85% | TBD | results.csv |
| Precision | ≥88% | TBD | results.csv |
| Recall | ≥85% | TBD | results.csv |
| Real shelf accuracy | ≥70% | TBD | evaluation_metrics_report.json |
| Counting error | ≤10% | TBD | evaluation_metrics_report.json |

### From Course Requirements (Custom Project)

#### ✅ Performance Optimization (Iterative)
**5 Planned Experiments**:
1. **Baseline** (50 epochs, Adam, lr=0.01, batch=16, img=640) - About to run
2. **Learning Rate Tuning** (0.001, 0.01, 0.1)
3. **Batch Size Tuning** (8, 16, 32)
4. **Image Size Tuning** (512, 640, 800)
5. **Optimizer Comparison** (Adam, SGD, AdamW)
6. **Augmentation Intensity** (light, medium, heavy)

**Documentation**:
- ✅ experiments_log.md tracks all results
- ✅ Each experiment auto-saves to experiments/ directory
- ✅ Failed approaches will be documented

#### ✅ Submission & Reporting
**Deliverables**:
- ✅ GitHub repo structure (ready)
- ⏳ Training metrics (will generate)
- ⏳ Evaluation report (compute_evaluation_metrics.py ready)
- ⏳ Experiment log (template ready in experiments_log.md)
- ⏳ 15-20 page report (after experiments complete)
- ⏳ 2-minute demo video (after experiments complete)

---

## 🚀 EXECUTION PLAN

### Phase 1: Baseline Training (NOW)
**Estimated Time**: 1.5-2.5 hours

**Command** (recommended for 8GB RAM):
```bash
source venv/bin/activate && \
OMNISHELF_YOLO_DEVICE=mps \
OMNISHELF_YOLO_EPOCHS=50 \
OMNISHELF_YOLO_BATCH=8 \
OMNISHELF_YOLO_WORKERS=4 \
python yolo/train_yolo.py
```

**Outputs**:
- `yolo/runs/detect/train/results.csv` - Training metrics per epoch
- `yolo/runs/detect/train/weights/best.pt` - Best model weights
- `yolo/runs/detect/train/weights/last.pt` - Final epoch weights
- Console output with final mAP, precision, recall

### Phase 2: Evaluation (After Training)
**Estimated Time**: 5-10 minutes

```bash
# Step 1: Evaluate on real shelves with stress-test
python yolo/evaluate_real_shelves.py --include-stress-test

# Step 2: Compute comprehensive metrics
python yolo/compute_evaluation_metrics.py
```

**Outputs**:
- `yolo/real_shelf_evaluation.csv` - Per-image detection results
- `yolo/evaluation_metrics_report.json` - Comprehensive analysis
- Console summary with all success criteria

### Phase 3: Update Documentation
**Estimated Time**: 15 minutes

1. Open `experiments_log.md`
2. Fill in Experiment 1 results section with:
   - Final mAP@50, Precision, Recall from results.csv
   - Real shelf performance from evaluation_metrics_report.json
   - Training time
   - Analysis of what worked/failed
3. Update status (✅/❌)
4. Document lessons learned

### Phase 4: Hyperparameter Tuning (Next Session)
**Estimated Time**: 8-12 hours (can run overnight/batch)

```bash
# Option 1: Run all experiments interactively
./run_experiments.sh

# Option 2: Run specific experiment manually
OMNISHELF_YOLO_DEVICE=mps OMNISHELF_YOLO_EPOCHS=50 \
OMNISHELF_YOLO_LR0=0.001 python yolo/train_yolo.py
```

---

## ⚠️ IMPORTANT NOTES

### Resource Management (8GB RAM)
- **Batch size 16** may cause memory issues → Start with **batch=8**
- **Workers=4** safer than 8 for stability
- **Cache=RAM** already configured (faster training)
- If training crashes: Reduce batch to 4, workers to 2

### Training Monitoring
Watch for these during training:
- ✅ **Increasing mAP@50** (target: 0.85+)
- ✅ **Decreasing loss** (box_loss, cls_loss, dfl_loss)
- ⚠️ **Memory warnings** (reduce batch if seen)
- ⚠️ **NaN losses** (reduce learning rate if seen)

### Expected Results
**Realistic expectations for 50 epochs**:
- Val mAP@50: 0.70-0.85 (70-85%)
- Real shelf drop: 10-30% (generalization gap)
- May need 2-3 iterations to hit 85% target

### What Makes This "Comparable Scope & Rigor"
✅ **120-class detection** (complex multi-class problem)
✅ **1,350+ training images** (substantial dataset)
✅ **Train-on-clean, test-on-real** (industry-standard challenge)
✅ **5+ optimization experiments** (iterative improvement)
✅ **Stress-test evaluation** (robustness validation)
✅ **Full pipeline** (data → training → deployment → analytics)
✅ **Quantitative metrics** (mAP, precision, recall, counting error)
✅ **Documentation** (experiment log, failure analysis)

This rivals typical Kaggle competition complexity (e.g., 100+ class image classification, domain adaptation challenges).

---

## ✅ FINAL APPROVAL CHECKLIST

- [x] Dataset prepared and validated (1,350 images, 85/15 split)
- [x] Real shelf evaluation set ready (45 baseline + 135 stress-test)
- [x] Training script configured with all augmentations
- [x] GPU (MPS) available and tested
- [x] Evaluation metrics script ready
- [x] Experiment tracking log created
- [x] Automated experiment runner ready
- [x] Project proposal aligned with course requirements
- [x] Success criteria defined (mAP≥85%, Precision≥88%, Recall≥85%)
- [x] 5+ optimization experiments planned

---

## 🎯 WHAT YOU'RE DOING (SUMMARY)

### The Core Challenge
**Train a model on clean product images, make it work on messy real shelves**

This is a **domain adaptation** problem - one of the hardest challenges in computer vision. Your model will see perfect product photos during training, but must detect products in:
- Cluttered shelves
- Poor lighting
- Occlusion (products blocking each other)
- Varying perspectives
- Motion blur
- Color distortions

### Why It's Academically Valid
1. **Not a Kaggle competition, but comparable complexity**
   - 120-class multi-object detection (harder than binary classification)
   - Domain shift problem (clean → real)
   - Requires iterative optimization (5+ experiments)

2. **Demonstrates core CV/ML skills**
   - Data pipeline engineering (reproducible splits, augmentations)
   - Model training & hyperparameter tuning
   - Evaluation methodology (mAP, precision, recall)
   - Failure analysis & documentation

3. **Real-world application**
   - Solves actual retail problem (stock monitoring)
   - End-to-end system (detection → database → API → dashboard)
   - Production-ready infrastructure (Docker, FastAPI, React)

### Expected Learning Outcomes
After completing all experiments, you will have:
- ✅ Trained 6+ YOLOv11 models with different configurations
- ✅ Documented what worked and what failed (critical for report)
- ✅ Achieved measurable performance improvements (mAP tracking)
- ✅ Understood augmentation impact on generalization
- ✅ Learned hyperparameter tuning methodology
- ✅ Built reproducible ML pipeline

---

## 🚦 READY TO START

**Command to begin training**:
```bash
source venv/bin/activate && \
OMNISHELF_YOLO_DEVICE=mps \
OMNISHELF_YOLO_EPOCHS=50 \
OMNISHELF_YOLO_BATCH=8 \
OMNISHELF_YOLO_WORKERS=4 \
python yolo/train_yolo.py
```

**Estimated completion**: 1.5-2.5 hours
**Next steps after training**: Evaluation → Metrics → Documentation → Hyperparameter tuning

---

**Last Updated**: December 2, 2025, 3:30 AM
**Status**: ✅ ALL SYSTEMS GO - READY TO TRAIN
