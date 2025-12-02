"""Load evaluation detections into the database."""
from __future__ import annotations

import sys
from pathlib import Path
from datetime import datetime
import random

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))

from backend.database import SessionLocal
from backend.models import ProductDetection, Base
from backend.database import engine
import pandas as pd
from sqlalchemy import text

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Load evaluation CSV
csv_path = ROOT_DIR / "yolo" / "real_shelf_evaluation.csv"
df = pd.read_csv(csv_path)

# Filter out no detections
df = df[df["class_name"] != "_no_detections_"]

print(f"Loading {len(df)} detections into database...")

db = SessionLocal()
try:
    # Clear existing detections
    db.query(ProductDetection).delete()
    db.commit()

    # Generate random shelf IDs (A1-A5, B1-B5, C1-C5)
    shelves = [f"{row}{col}" for row in "ABC" for col in range(1, 6)]

    # Insert detections
    for idx, row in df.iterrows():
        detection = ProductDetection(
            product_name=row["class_name"],
            confidence=row["avg_confidence"],
            bbox_x1=random.uniform(0, 400),  # Simulated bounding box
            bbox_y1=random.uniform(0, 400),
            bbox_x2=random.uniform(400, 800),
            bbox_y2=random.uniform(400, 800),
            shelf_id=random.choice(shelves),
            timestamp=datetime.now()
        )
        db.add(detection)

    db.commit()
    print(f"✅ Successfully loaded {len(df)} detections!")

    # Show summary
    result = db.execute(text("SELECT COUNT(*) FROM product_detections"))
    count = result.scalar()
    print(f"Total detections in database: {count}")

finally:
    db.close()
