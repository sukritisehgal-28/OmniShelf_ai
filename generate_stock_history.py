"""Generate historical stock snapshots for analytics."""
from __future__ import annotations

import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))

from backend.database import SessionLocal
from backend.models import StockSnapshot, ProductDetection, Base
from backend.database import engine
from sqlalchemy import text

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Get all products
    products = db.execute(text("SELECT DISTINCT product_name FROM product_detections")).fetchall()

    print(f"Generating 7 days of historical data for {len(products)} products...")

    # Generate snapshots for the last 7 days
    for days_ago in range(7, 0, -1):
        snapshot_time = datetime.now() - timedelta(days=days_ago)

        for (product_name,) in products:
            # Get current count
            current_count = db.query(ProductDetection).filter(
                ProductDetection.product_name == product_name
            ).count()

            # Simulate historical variation (±30%)
            variation = random.uniform(0.7, 1.3)
            historical_count = max(0, int(current_count * variation))

            # Get a shelf for this product
            shelf = db.query(ProductDetection.shelf_id).filter(
                ProductDetection.product_name == product_name,
                ProductDetection.shelf_id.isnot(None)
            ).first()

            shelf_id = shelf[0] if shelf else None

            snapshot = StockSnapshot(
                product_name=product_name,
                count=historical_count,
                shelf_id=shelf_id,
                snapshot_time=snapshot_time
            )
            db.add(snapshot)

        print(f"✓ Created snapshots for {snapshot_time.strftime('%Y-%m-%d')}")

    db.commit()
    print(f"\n✅ Successfully generated 7 days of stock history!")

    # Show summary
    total_snapshots = db.execute(text("SELECT COUNT(*) FROM stock_snapshots")).scalar()
    print(f"Total snapshots in database: {total_snapshots}")

finally:
    db.close()
