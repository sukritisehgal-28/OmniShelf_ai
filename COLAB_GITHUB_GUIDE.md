# OmniShelf AI - Training Guide (Colab + GitHub)

## Overview
Train your YOLOv11 model on Google Colab's free Tesla T4 GPU.

**Timeline**: ~3.5 hours total
- Setup: 10 minutes
- Training: 2-3 hours (50 epochs)
- Download: 5 minutes

---

## Step 1: Prepare Repository

### 1.1 Push Code to GitHub
Ensure your local code is pushed to a GitHub repository.
```bash
git add .
git commit -m "Ready for training"
git push origin main
```

### 1.2 Check .gitignore
Ensure `yolo/runs/` and `__pycache__/` are ignored so you don't upload massive files or junk.

---

## Step 2: Open in Google Colab

1.  Go to [Google Colab](https://colab.research.google.com/).
2.  Click **File > New Notebook**.
3.  **Runtime > Change runtime type > T4 GPU**.

---

## Step 3: Training Script

Copy and paste the following into a Colab cell to clone your repo and start training:

```python
# 1. Clone Repository
!git clone https://github.com/YOUR_USERNAME/omnishelf-ai.git
%cd omnishelf-ai

# 2. Install Dependencies
!pip install ultralytics

# 3. Train Model
from ultralytics import YOLO

# Load a model
model = YOLO('yolo11s.pt')  # load a pretrained model

# Train the model
results = model.train(
    data='yolo/dataset/grozi120/data.yaml', 
    epochs=50, 
    imgsz=640, 
    batch=16, 
    project='yolo/runs/detect', 
    name='train_colab'
)
```

---

## Step 4: Save Results

After training finishes, download your best weights:

```python
from google.colab import files
files.download('yolo/runs/detect/train_colab/weights/best.pt')
```

Rename this file to `yolo11s_custom.pt` and place it in your local `omnishelf_ai/` folder.
