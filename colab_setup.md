# OmniShelf AI - Google Colab Training Guide

## Step 1: Upload to Google Drive

### Option A: Direct Upload (Easiest)
1. Create a zip file of essential training files
2. Upload to Google Drive
3. Extract in Colab

### Option B: GitHub (Recommended for Version Control)
1. Push code to GitHub
2. Clone in Colab

---

## Step 2: Google Colab Setup

### Open Colab and Enable GPU
1. Go to https://colab.research.google.com/
2. Click **File → New Notebook**
3. Click **Runtime → Change runtime type**
4. Select **T4 GPU** from dropdown
5. Click **Save**

---

## Step 3: Run Training in Colab

Copy-paste these cells into your Colab notebook:

### Cell 1: Mount Google Drive (if using Drive upload)
```python
from google.colab import drive
drive.mount('/content/drive')
```

### Cell 2: Install Dependencies
```python
!pip install ultralytics pandas pyyaml python-dotenv
```

### Cell 3: Setup Project (Choose ONE method)

**Method A: From Google Drive**
```python
import zipfile
import shutil

# Extract uploaded zip
!unzip /content/drive/MyDrive/omnishelf_ai.zip -d /content/
%cd /content/omnishelf_ai
```

**Method B: From GitHub**
```python
!git clone https://github.com/YOUR_USERNAME/omnishelf_ai.git
%cd omnishelf_ai
```

### Cell 4: Verify Setup
```python
!ls yolo/dataset/grozi120/
!python -c "import torch; print(f'GPU: {torch.cuda.get_device_name(0)}'); print(f'CUDA: {torch.cuda.is_available()}')"
```

### Cell 5: Run Training
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

### Cell 6: Monitor Progress (Run in separate cell while training)
```python
import pandas as pd
from IPython.display import clear_output
import time

while True:
    try:
        df = pd.read_csv('yolo/runs/train_colab/results.csv')
        clear_output(wait=True)
        print(f"Progress: {len(df)}/50 epochs")
        print(f"\nBest mAP@50: {df['metrics/mAP50(B)'].max():.4f}")
        print(f"Current mAP@50: {df['metrics/mAP50(B)'].iloc[-1]:.4f}")
        print("\nLast 3 epochs:")
        print(df[['epoch', 'metrics/mAP50(B)', 'metrics/precision(B)', 'metrics/recall(B)']].tail(3))
        time.sleep(30)
    except:
        print("Waiting for training to start...")
        time.sleep(10)
```

### Cell 7: Download Results
```python
from google.colab import files
import shutil

# Download best model
files.download('yolo/runs/train_colab/weights/best.pt')

# Create results package
!zip -r colab_results.zip yolo/runs/train_colab/
files.download('colab_results.zip')
```

---

## Expected Timeline

- Setup: 5 minutes
- Training: 2-3 hours
- Download: 2 minutes

**Total: ~3 hours** (vs 40+ hours on your Mac if it worked)

---

## Troubleshooting

### "Runtime disconnected"
- Colab free tier disconnects after 12 hours
- With save_period=5, you can resume from checkpoint

### "Out of memory"
- Reduce batch from 16 to 12:
  ```
  OMNISHELF_YOLO_BATCH=12
  ```

### Resume interrupted training
```python
!OMNISHELF_YOLO_PRETRAINED=yolo/runs/train_colab/weights/last.pt \
OMNISHELF_YOLO_DEVICE=0 \
OMNISHELF_YOLO_EPOCHS=50 \
OMNISHELF_YOLO_BATCH=16 \
python yolo/train_yolo.py
```
