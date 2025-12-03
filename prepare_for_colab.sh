#!/bin/bash
# Script to prepare OmniShelf AI for Google Colab training

echo "========================================"
echo "Preparing OmniShelf AI for Colab"
echo "========================================"

# Create a clean directory for Colab
COLAB_DIR="omnishelf_colab"
rm -rf $COLAB_DIR
mkdir -p $COLAB_DIR

echo "Copying essential files..."

# Copy YOLO training files
cp -r yolo/ $COLAB_DIR/
rm -rf $COLAB_DIR/yolo/runs/  # Remove old training runs to save space

# Copy requirements
echo "ultralytics" > $COLAB_DIR/requirements.txt
echo "pandas" >> $COLAB_DIR/requirements.txt
echo "pyyaml" >> $COLAB_DIR/requirements.txt
echo "python-dotenv" >> $COLAB_DIR/requirements.txt

# Create README for Colab
cat > $COLAB_DIR/README.md << 'EOF'
# OmniShelf AI - Colab Training Package

## Quick Start in Google Colab

1. Upload this folder to Google Drive
2. In Colab, run:

```python
from google.colab import drive
drive.mount('/content/drive')

!cp -r /content/drive/MyDrive/omnishelf_colab /content/
%cd /content/omnishelf_colab

!pip install -r requirements.txt

!OMNISHELF_YOLO_DEVICE=0 OMNISHELF_YOLO_BATCH=16 OMNISHELF_YOLO_CACHE=ram python yolo/train_yolo.py
```

See colab_setup.md for detailed instructions.
EOF

# Copy the setup guide
cp colab_setup.md $COLAB_DIR/

# Create zip file
echo "Creating zip file..."
zip -r omnishelf_colab.zip $COLAB_DIR/ -q

echo ""
echo "✅ Done! Created omnishelf_colab.zip"
echo ""
echo "Next steps:"
echo "1. Upload omnishelf_colab.zip to Google Drive"
echo "2. Follow instructions in colab_setup.md"
echo ""
echo "Zip file size:"
du -h omnishelf_colab.zip
