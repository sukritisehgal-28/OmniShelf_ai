# OmniShelf AI - GitHub + Google Colab Training Guide

## Overview
Train your YOLOv11 model on Google Colab's free Tesla T4 GPU using GitHub for deployment.

**Timeline**: ~3.5 hours total
- Setup: 10 minutes
- Training: 2-3 hours (50 epochs)
- Download: 5 minutes

---

## Step 1: Push to GitHub (5 minutes)

### 1.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `omnishelf-ai` (or any name you prefer)
3. Set to **Private** (recommended for academic projects)
4. **DO NOT** initialize with README
5. Click **Create repository**

### 1.2 Initialize Git and Push
```bash
cd /Users/sukritisehgal/omnishelf_ai

# Initialize git (if not already done)
git init

# Create .gitignore to exclude unnecessary files
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/

# Training outputs (don't upload runs to GitHub)
yolo/runs/

# Large files
*.zip
*.pt
*.weights

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Environment
.env
EOF

# Add all files
git add .

# Commit
git commit -m "Initial commit: OmniShelf AI YOLOv11 training project"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/omnishelf-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important**: Replace `YOUR_USERNAME` with your actual GitHub username!

---

## Step 2: Open Google Colab (2 minutes)

1. Go to https://colab.research.google.com/
2. Sign in with your Google account
3. Click **File → New Notebook**
4. Click **Runtime → Change runtime type**
5. Select **T4 GPU** from Hardware accelerator dropdown
6. Click **Save**

---

## Step 3: Run Training in Colab

Copy and paste each cell below into your Colab notebook and run them in order.

### Cell 1: Verify GPU
```python
import torch
print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
print(f"✅ CUDA Available: {torch.cuda.is_available()}")
print(f"✅ VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
```

Expected output:
```
✅ GPU: Tesla T4
✅ CUDA Available: True
✅ VRAM: 16.0 GB
```

### Cell 2: Install Dependencies
```python
!pip install -q ultralytics pandas pyyaml python-dotenv
print("✅ Dependencies installed")
```

### Cell 3: Clone Your Repository
```python
# Replace YOUR_USERNAME and REPO_NAME with your actual values
!git clone https://github.com/YOUR_USERNAME/omnishelf-ai.git
%cd omnishelf-ai

# Verify dataset exists
!ls -lh yolo/dataset/grozi120/
```

**Important**:
- Replace `YOUR_USERNAME` with your GitHub username
- Replace `omnishelf-ai` with your repository name if different

### Cell 4: Verify Dataset Configuration
```python
import yaml
from pathlib import Path

# Check data.yaml
with open('yolo/dataset/grozi120/data.yaml') as f:
    config = yaml.safe_load(f)
    print(f"✅ Classes: {config['nc']}")
    print(f"✅ Train path: {config['train']}")
    print(f"✅ Val path: {config['val']}")

# Count images
train_dir = Path('yolo/dataset/grozi120/images/train')
val_dir = Path('yolo/dataset/grozi120/images/val')
print(f"✅ Train images: {len(list(train_dir.glob('*.jpg')))}")
print(f"✅ Val images: {len(list(val_dir.glob('*.jpg')))}")
```

Expected output:
```
✅ Classes: 120
✅ Train path: images/train
✅ Val path: images/val
✅ Train images: 680
✅ Val images: 120
```

### Cell 5: Start Training 🚀
```python
!OMNISHELF_YOLO_DEVICE=0 \
OMNISHELF_YOLO_EPOCHS=50 \
OMNISHELF_YOLO_BATCH=16 \
OMNISHELF_YOLO_WORKERS=2 \
OMNISHELF_YOLO_CACHE=ram \
OMNISHELF_YOLO_RUN_NAME=train_colab \
OMNISHELF_YOLO_PLOTS=false \
OMNISHELF_YOLO_SAVE_PERIOD=5 \
python yolo/train_yolo.py
```

**What these settings mean**:
- `DEVICE=0`: Use GPU 0 (the T4)
- `EPOCHS=50`: Full training run
- `BATCH=16`: Process 16 images at once (4x your Mac's capacity)
- `WORKERS=2`: Data loading threads
- `CACHE=ram`: Cache dataset in RAM (12GB available, dataset is 56MB)
- `RUN_NAME=train_colab`: Output folder name
- `PLOTS=false`: Disable plot generation to save time
- `SAVE_PERIOD=5`: Save checkpoint every 5 epochs

**Expected timeline**: 2-3 hours for 50 epochs

---

## Step 4: Monitor Progress (Optional)

While training runs, you can monitor progress in a **separate cell**:

### Cell 6: Real-time Monitoring
```python
import pandas as pd
from IPython.display import clear_output
import time

while True:
    try:
        df = pd.read_csv('yolo/runs/train_colab/results.csv')
        clear_output(wait=True)

        print("=" * 80)
        print(f"📊 TRAINING PROGRESS: {len(df)}/50 EPOCHS ({len(df)/50*100:.1f}%)")
        print("=" * 80)

        latest = df.iloc[-1]
        best_idx = df['metrics/mAP50(B)'].idxmax()
        best = df.iloc[best_idx]

        print(f"\n📈 Current Metrics (Epoch {int(latest['epoch'])})")
        print(f"   mAP@50:     {latest['metrics/mAP50(B)']:.4f}")
        print(f"   mAP@50-95:  {latest['metrics/mAP50-95(B)']:.4f}")
        print(f"   Precision:  {latest['metrics/precision(B)']:.4f}")
        print(f"   Recall:     {latest['metrics/recall(B)']:.4f}")

        print(f"\n🏆 Best Results")
        print(f"   Best mAP@50: {best['metrics/mAP50(B)']:.4f} (epoch {int(best['epoch'])})")

        print(f"\n⏱️  Timing")
        print(f"   Time elapsed: {df['time'].sum() / 3600:.2f} hours")
        print(f"   Estimated remaining: {(50 - len(df)) * df['time'].mean() / 3600:.2f} hours")

        print("\nLast 5 epochs:")
        print(df[['epoch', 'metrics/mAP50(B)', 'metrics/precision(B)', 'metrics/recall(B)']].tail(5).to_string(index=False))

        time.sleep(30)  # Update every 30 seconds
    except FileNotFoundError:
        print("⏳ Waiting for training to start...")
        time.sleep(10)
    except KeyboardInterrupt:
        print("\n⚠️  Monitoring stopped")
        break
```

To stop monitoring: Click the **Stop** button in Colab

---

## Step 5: View Final Results

After training completes (Cell 5 finishes):

### Cell 7: Display Final Metrics
```python
import pandas as pd

df = pd.read_csv('yolo/runs/train_colab/results.csv')

print("=" * 80)
print("✅ TRAINING COMPLETE!")
print("=" * 80)

final = df.iloc[-1]
best_idx = df['metrics/mAP50(B)'].idxmax()
best = df.iloc[best_idx]

print(f"\n📈 Final Results (Epoch 50):")
print(f"   mAP@50:     {final['metrics/mAP50(B)']:.4f}")
print(f"   mAP@50-95:  {final['metrics/mAP50-95(B)']:.4f}")
print(f"   Precision:  {final['metrics/precision(B)']:.4f}")
print(f"   Recall:     {final['metrics/recall(B)']:.4f}")

print(f"\n🏆 Best Model (Saved as best.pt):")
print(f"   Best mAP@50: {best['metrics/mAP50(B)']:.4f} (epoch {int(best['epoch'])})")

print(f"\n⏱️  Total Training Time: {df['time'].sum() / 3600:.2f} hours")

print(f"\n💾 Model Locations:")
print(f"   yolo/runs/train_colab/weights/best.pt  ← Use this for inference")
print(f"   yolo/runs/train_colab/weights/last.pt  ← Final epoch weights")
```

---

## Step 6: Download Trained Model

### Cell 8: Download Results to Your Computer
```python
from google.colab import files
import shutil

# Download best model (most important file)
print("📥 Downloading best.pt...")
files.download('yolo/runs/train_colab/weights/best.pt')

# Create results package with all training outputs
print("📦 Creating results package...")
!zip -r colab_training_results.zip yolo/runs/train_colab/ -q
print("📥 Downloading complete training results...")
files.download('colab_training_results.zip')

print("\n✅ Downloads complete!")
print("\nYou now have:")
print("  1. best.pt - Best model weights")
print("  2. colab_training_results.zip - Full training logs, plots, and checkpoints")
```

**What you'll download**:
1. `best.pt` (~12MB) - Your trained model
2. `colab_training_results.zip` (~50MB) - All results including:
   - `weights/best.pt` and `weights/last.pt`
   - `results.csv` - Metrics for all 50 epochs
   - Training logs
   - Checkpoints from every 5th epoch

---

## Step 7: Use the Model on Your Mac

After downloading `best.pt`:

```bash
# Copy best.pt to your local yolo directory
cp ~/Downloads/best.pt /Users/sukritisehgal/omnishelf_ai/yolo/runs/train_colab/weights/

# Run evaluation on real shelves
source venv/bin/activate
cd /Users/sukritisehgal/omnishelf_ai

python yolo/evaluate.py \
  --model yolo/runs/train_colab/weights/best.pt \
  --stress-test

# Compute evaluation metrics
python yolo/compute_evaluation_metrics.py \
  --results yolo/runs/train_colab/results.csv \
  --detections yolo/runs/stress_test/detections.csv
```

---

## Troubleshooting

### Issue: "Runtime disconnected"
**Cause**: Colab free tier disconnects after 12 hours of inactivity

**Solution**: Resume from checkpoint
```python
!OMNISHELF_YOLO_PRETRAINED=yolo/runs/train_colab/weights/last.pt \
OMNISHELF_YOLO_DEVICE=0 \
OMNISHELF_YOLO_EPOCHS=50 \
OMNISHELF_YOLO_BATCH=16 \
OMNISHELF_YOLO_RUN_NAME=train_colab \
python yolo/train_yolo.py
```

### Issue: "Out of memory"
**Cause**: Rare on T4 with batch=16

**Solution**: Reduce batch size
```python
!OMNISHELF_YOLO_BATCH=12 ...  # Instead of 16
```

### Issue: "Dataset not found"
**Cause**: Repository didn't clone properly

**Solution**: Check repository is public or you're authenticated
```python
# For private repos, use personal access token
!git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/omnishelf-ai.git
```

---

## What Happens Next

After training completes:

1. ✅ Download `best.pt` and `colab_training_results.zip`
2. ✅ Run evaluation on real shelves (stress-test)
3. ✅ Compute all metrics (mAP drop, counting error, misclassifications)
4. ✅ Run hyperparameter tuning experiments (5 experiments)
5. ✅ Document everything in `experiments_log.md`
6. ✅ Write final 15-20 page report
7. ✅ Record 2-minute demo video

**Expected Results**:
- Validation mAP@50: ≥85% (trained on clean images)
- Real shelf mAP@50: 50-70% (domain gap)
- mAP drop: 15-35% (acceptable for train-on-clean, test-on-real)

---

## Quick Reference: All Colab Cells in Order

1. Verify GPU
2. Install dependencies
3. Clone repository
4. Verify dataset
5. Start training (2-3 hours)
6. Monitor progress (optional, run in parallel)
7. View final results
8. Download model and results

**Total hands-on time**: 15 minutes
**Total wait time**: 2-3 hours
**Total time**: ~3 hours
