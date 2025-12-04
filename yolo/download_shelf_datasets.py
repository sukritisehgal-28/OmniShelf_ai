"""
Download shelf datasets from Roboflow for fine-tuning Grozi-120 model.
Run: python yolo/download_shelf_datasets.py

You'll need to get your API key from: https://app.roboflow.com/settings/api
"""

import os
import shutil
import random
from pathlib import Path

# ============================================
# SET YOUR ROBOFLOW API KEY HERE
# ============================================
API_KEY = "YOUR_API_KEY_HERE"  # Get from https://app.roboflow.com/settings/api
# ============================================

# Datasets to download (workspace/project format)
DATASETS = [
    # Candy/Chocolate - has Snickers, Twix, Skittles, Starburst
    {"workspace": "workenv-dayet", "project": "candy-g6wfi", "version": 4, "grozi_products": ["snickers", "twix", "skittles", "starburst"]},
    
    # Snickers First Model - has Snickers, Twix
    {"workspace": "shelfhero", "project": "snickers-first-model-pdqct", "version": 7, "grozi_products": ["snickers", "twix"]},
    
    # Chocolate Detection - has Kit Kat, Snickers
    {"workspace": "chocolate-detection", "project": "chocolate-detection-41qji", "version": 1, "grozi_products": ["kitkat", "snickers"]},
    
    # Pringles Detection
    {"workspace": "pringles-detection", "project": "pringles-detection-l1fgq", "version": 1, "grozi_products": ["pringles"]},
    
    # Chips with Pringles, Lays, Doritos
    {"workspace": "sukru-can-ercoban", "project": "chips-3s7e7", "version": 1, "grozi_products": ["pringles", "lays"]},
    
    # Gatorade
    {"workspace": "hkyolo-xvxjj", "project": "gatorade-rxfzu", "version": 1, "grozi_products": ["gatorade"]},
    
    # Red Bull  
    {"workspace": "yoon-qox06", "project": "red-bull-a0jci", "version": 1, "grozi_products": ["redbull"]},
    
    # Monster Energy
    {"workspace": "yolo-5kwgh", "project": "monster-bn5fz", "version": 1, "grozi_products": ["monster"]},
]

# How many images to sample from each dataset
IMAGES_PER_DATASET = 10

# Output directory
OUTPUT_DIR = Path("/Users/sukritisehgal/omnishelf_ai/yolo/dataset/shelf_finetune")


def download_datasets():
    """Download and combine datasets from Roboflow."""
    
    if API_KEY == "YOUR_API_KEY_HERE":
        print("❌ ERROR: Please set your Roboflow API key!")
        print("   1. Go to: https://app.roboflow.com/settings/api")
        print("   2. Copy your API key")
        print("   3. Paste it in this script (line 14)")
        return
    
    try:
        from roboflow import Roboflow
    except ImportError:
        print("❌ ERROR: roboflow not installed. Run: pip install roboflow")
        return
    
    # Create output directories
    images_dir = OUTPUT_DIR / "images"
    labels_dir = OUTPUT_DIR / "labels"
    images_dir.mkdir(parents=True, exist_ok=True)
    labels_dir.mkdir(parents=True, exist_ok=True)
    
    rf = Roboflow(api_key=API_KEY)
    
    total_images = 0
    
    for dataset_info in DATASETS:
        workspace = dataset_info["workspace"]
        project_name = dataset_info["project"]
        version = dataset_info["version"]
        products = dataset_info["grozi_products"]
        
        print(f"\n📥 Downloading: {workspace}/{project_name}")
        print(f"   Products: {', '.join(products)}")
        
        try:
            # Download dataset
            project = rf.workspace(workspace).project(project_name)
            dataset = project.version(version).download("yolov8", location=f"/tmp/roboflow_{project_name}")
            
            # Find downloaded images
            download_path = Path(f"/tmp/roboflow_{project_name}")
            
            # Look for images in train/valid/test folders
            all_images = []
            for split in ["train", "valid", "test"]:
                img_folder = download_path / split / "images"
                if img_folder.exists():
                    all_images.extend(list(img_folder.glob("*.*")))
            
            # Also check root images folder
            root_img_folder = download_path / "images"
            if root_img_folder.exists():
                all_images.extend(list(root_img_folder.glob("*.*")))
            
            if not all_images:
                print(f"   ⚠️  No images found in {download_path}")
                continue
            
            # Sample random images
            sample_size = min(IMAGES_PER_DATASET, len(all_images))
            sampled_images = random.sample(all_images, sample_size)
            
            # Copy images and labels
            for img_path in sampled_images:
                # Generate unique filename
                new_name = f"{project_name}_{img_path.name}"
                
                # Copy image
                dst_img = images_dir / new_name
                shutil.copy(img_path, dst_img)
                
                # Try to copy corresponding label
                label_name = img_path.stem + ".txt"
                for split in ["train", "valid", "test", ""]:
                    label_path = download_path / split / "labels" / label_name if split else download_path / "labels" / label_name
                    if label_path.exists():
                        dst_label = labels_dir / (Path(new_name).stem + ".txt")
                        shutil.copy(label_path, dst_label)
                        break
                
                total_images += 1
            
            print(f"   ✅ Copied {sample_size} images")
            
            # Cleanup temp folder
            shutil.rmtree(download_path, ignore_errors=True)
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            continue
    
    print(f"\n{'='*50}")
    print(f"✅ Downloaded {total_images} total images")
    print(f"📁 Images saved to: {images_dir}")
    print(f"📁 Labels saved to: {labels_dir}")
    print(f"\n⚠️  NOTE: You'll need to re-label these images with Grozi-120 class IDs")
    print(f"   The downloaded labels use the original dataset's class IDs")


if __name__ == "__main__":
    download_datasets()
