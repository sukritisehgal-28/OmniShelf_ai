"""
Script to fix product_mapping.py using OpenAI Vision (GPT-4o) to identify actual product names.

This script:
1. Takes one sample image from each Grozi-120 class
2. Sends it to OpenAI Vision API to identify the product
3. Generates a corrected product_mapping.py

Usage:
    export OPENAI_API_KEY="your-api-key"
    python scripts/fix_product_mapping.py

Get your API key at: https://platform.openai.com/api-keys
"""

import os
import sys
import json
import time
import base64
from pathlib import Path

# Check for API key
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("=" * 60)
    print("ERROR: OPENAI_API_KEY environment variable not set!")
    print()
    print("To get an API key:")
    print("1. Go to https://platform.openai.com/api-keys")
    print("2. Click 'Create new secret key'")
    print("3. Run: export OPENAI_API_KEY='your-key-here'")
    print("4. Then run this script again")
    print("=" * 60)
    sys.exit(1)

try:
    from openai import OpenAI
except ImportError:
    print("Installing openai...")
    os.system(f"{sys.executable} -m pip install openai")
    from openai import OpenAI

# Configure OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
IMAGES_DIR = PROJECT_ROOT / "yolo" / "dataset" / "grozi120" / "images"
OUTPUT_FILE = PROJECT_ROOT / "product_mapping_corrected.py"

def get_sample_image_for_class(class_num: int) -> Path | None:
    """Find a sample image for the given class number."""
    # Images are named like class000_web1.jpg, class001_web2.jpg, etc.
    class_prefix = f"class{class_num:03d}_"
    
    # Search in train, val, and root images folder
    search_dirs = [
        IMAGES_DIR / "train",
        IMAGES_DIR / "val", 
        IMAGES_DIR,
    ]
    
    for search_dir in search_dirs:
        if not search_dir.exists():
            continue
        for img_path in search_dir.glob(f"{class_prefix}*.jpg"):
            return img_path
        for img_path in search_dir.glob(f"{class_prefix}*.png"):
            return img_path
    
    return None


def identify_product_with_openai(image_path: Path) -> str:
    """Use OpenAI Vision (GPT-4o) to identify the product in the image."""
    try:
        # Load and encode image as base64
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
        
        # Determine mime type
        suffix = image_path.suffix.lower()
        mime_type = "image/jpeg" if suffix in [".jpg", ".jpeg"] else "image/png"
        
        # Create the request
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using gpt-4o-mini for cost efficiency
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Look at this product image and identify the product.

Respond with ONLY the product name in this exact format:
PRODUCT: [Brand Name] [Product Name]

Examples:
- PRODUCT: Doublemint Chewing Gum
- PRODUCT: Coca-Cola Classic
- PRODUCT: Kellogg's Corn Flakes
- PRODUCT: Heinz Tomato Ketchup

If you cannot identify the product clearly, respond with:
PRODUCT: Unknown Product

Do not include any other text, just the product name."""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{image_data}",
                                "detail": "low"  # Use low detail for faster/cheaper processing
                            }
                        }
                    ]
                }
            ],
            max_tokens=100
        )
        
        # Parse the response
        text = response.choices[0].message.content.strip()
        if text.startswith("PRODUCT:"):
            product_name = text.replace("PRODUCT:", "").strip()
            return product_name
        else:
            # Try to extract product name anyway
            return text.split("\n")[0].strip()
            
    except Exception as e:
        print(f"  Error identifying {image_path.name}: {e}")
        return "Unknown Product"


def main():
    print("=" * 60)
    print("Grozi-120 Product Mapping Correction Tool")
    print("Using OpenAI Vision (GPT-4o-mini) to identify actual product names")
    print("=" * 60)
    print()
    
    # Collect all class mappings
    mappings = {}
    errors = []
    
    print(f"Processing 120 classes...")
    print()
    
    for class_num in range(120):
        grozi_name = f"grozi_{class_num + 1}"  # grozi_1 to grozi_120
        
        # Find sample image
        image_path = get_sample_image_for_class(class_num)
        
        if image_path is None:
            print(f"  [{class_num + 1:3d}/120] {grozi_name}: No image found!")
            errors.append(grozi_name)
            mappings[grozi_name] = f"Unknown Product (Class {class_num + 1})"
            continue
        
        # Identify product with OpenAI
        print(f"  [{class_num + 1:3d}/120] {grozi_name}: Analyzing {image_path.name}...", end=" ", flush=True)
        
        product_name = identify_product_with_openai(image_path)
        mappings[grozi_name] = product_name
        
        print(f"→ {product_name}")
        
        # Rate limiting - be nice to the API
        time.sleep(0.3)
    
    print()
    print("=" * 60)
    print(f"Completed! Identified {120 - len(errors)} products.")
    if errors:
        print(f"Could not find images for: {errors}")
    print("=" * 60)
    print()
    
    # Generate the new mapping file
    output_content = '''"""
Corrected Grozi-120 Product Mapping
Generated using OpenAI Vision (GPT-4o) to identify actual product names.
"""

PRODUCT_NAME_MAP = {
'''
    
    for grozi_name, product_name in mappings.items():
        # Escape quotes in product name
        escaped_name = product_name.replace('"', '\\"')
        output_content += f'    "{grozi_name}": "{escaped_name}",\n'
    
    output_content += '''}

# For backwards compatibility
PRODUCT_PRICES = {name: 0.00 for name in PRODUCT_NAME_MAP}
PRODUCT_CATEGORIES = {name: "General" for name in PRODUCT_NAME_MAP}
'''
    
    # Write the file
    with open(OUTPUT_FILE, "w") as f:
        f.write(output_content)
    
    print(f"✓ Saved corrected mapping to: {OUTPUT_FILE}")
    print()
    print("To use the new mapping, run:")
    print(f"  cp {OUTPUT_FILE} {PROJECT_ROOT / 'product_mapping.py'}")
    print()
    
    # Also print a preview
    print("Preview of first 10 mappings:")
    print("-" * 40)
    for i, (k, v) in enumerate(mappings.items()):
        if i >= 10:
            break
        print(f"  {k}: {v}")
    print("  ...")


if __name__ == "__main__":
    main()
