"""Migrate data from SQLite to PostgreSQL."""
import sys
from pathlib import Path

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# SQLite source
SQLITE_URL = "sqlite:///./omnishelf.db"
# PostgreSQL destination
POSTGRES_URL = "postgresql://sukritisehgal@localhost:5434/omnishelf"

print("🔄 Migrating data from SQLite to PostgreSQL...\n")

# Create engines
sqlite_engine = create_engine(SQLITE_URL)
postgres_engine = create_engine(POSTGRES_URL)

# Create sessions
SqliteSession = sessionmaker(bind=sqlite_engine)
PostgresSession = sessionmaker(bind=postgres_engine)

sqlite_session = SqliteSession()
postgres_session = PostgresSession()

try:
    # Migrate product_detections
    print("📦 Migrating product_detections...")
    detections = sqlite_session.execute(text("SELECT * FROM product_detections")).fetchall()

    if detections:
        for detection in detections:
            postgres_session.execute(
                text("""
                    INSERT INTO product_detections
                    (id, product_name, confidence, bbox_x1, bbox_y1, bbox_x2, bbox_y2, shelf_id, timestamp)
                    VALUES (:id, :product_name, :confidence, :bbox_x1, :bbox_y1, :bbox_x2, :bbox_y2, :shelf_id, :timestamp)
                    ON CONFLICT (id) DO NOTHING
                """),
                {
                    "id": detection[0],
                    "product_name": detection[1],
                    "confidence": detection[2],
                    "bbox_x1": detection[3],
                    "bbox_y1": detection[4],
                    "bbox_x2": detection[5],
                    "bbox_y2": detection[6],
                    "shelf_id": detection[7],
                    "timestamp": detection[8],
                }
            )
        postgres_session.commit()
        print(f"✅ Migrated {len(detections)} product detections")
    else:
        print("ℹ️  No product detections to migrate")

    # Migrate stock_snapshots
    print("\n📊 Migrating stock_snapshots...")
    snapshots = sqlite_session.execute(text("SELECT * FROM stock_snapshots")).fetchall()

    if snapshots:
        for snapshot in snapshots:
            postgres_session.execute(
                text("""
                    INSERT INTO stock_snapshots
                    (id, product_name, count, shelf_id, snapshot_time)
                    VALUES (:id, :product_name, :count, :shelf_id, :snapshot_time)
                    ON CONFLICT (id) DO NOTHING
                """),
                {
                    "id": snapshot[0],
                    "product_name": snapshot[1],
                    "count": snapshot[2],
                    "shelf_id": snapshot[3],
                    "snapshot_time": snapshot[4],
                }
            )
        postgres_session.commit()
        print(f"✅ Migrated {len(snapshots)} stock snapshots")
    else:
        print("ℹ️  No stock snapshots to migrate")

    # Skip planogram (empty in SQLite)
    print("\n📐 Skipping planogram (empty table)...")

    # Verify migration
    print("\n" + "━" * 60)
    print("✅ Migration Complete!")
    print("━" * 60)

    # Show final counts
    print("\n📋 PostgreSQL Final Counts:")
    result = postgres_session.execute(text("""
        SELECT
            (SELECT COUNT(*) FROM product_detections) as detections,
            (SELECT COUNT(*) FROM stock_snapshots) as snapshots,
            (SELECT COUNT(*) FROM planogram) as planogram
    """)).fetchone()

    print(f"   • product_detections: {result[0]}")
    print(f"   • stock_snapshots: {result[1]}")
    print(f"   • planogram: {result[2]}")

    print("\n💡 Next steps:")
    print("   1. Verify data in PostgreSQL")
    print("   2. Restart FastAPI if needed")
    print("   3. Test all dashboards")

except Exception as e:
    print(f"\n❌ Error during migration: {e}")
    postgres_session.rollback()
    sys.exit(1)
finally:
    sqlite_session.close()
    postgres_session.close()
    sqlite_engine.dispose()
    postgres_engine.dispose()
