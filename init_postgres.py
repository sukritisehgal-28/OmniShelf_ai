"""Initialize PostgreSQL database for OmniShelf AI."""
import sys
from pathlib import Path

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT_DIR))

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, ProgrammingError
from backend.models import Base

# Database configuration
DB_USER = "sukritisehgal"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "omnishelf"

# Connection string without database (to create database)
ADMIN_DB_URL = f"postgresql://{DB_USER}@{DB_HOST}:{DB_PORT}/postgres"
# Connection string with database
DB_URL = f"postgresql://{DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

print("🐘 Initializing PostgreSQL for OmniShelf AI...\n")

# Step 1: Create database
print(f"📊 Step 1: Creating database '{DB_NAME}'...")
try:
    admin_engine = create_engine(ADMIN_DB_URL, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as conn:
        # Check if database exists
        result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname='{DB_NAME}'"))
        exists = result.scalar()

        if not exists:
            conn.execute(text(f"CREATE DATABASE {DB_NAME}"))
            print(f"✅ Database '{DB_NAME}' created successfully!")
        else:
            print(f"ℹ️  Database '{DB_NAME}' already exists")
    admin_engine.dispose()
except OperationalError as e:
    print(f"❌ Error connecting to PostgreSQL: {e}")
    print("\n💡 Please ensure PostgreSQL is running:")
    print("   brew services start postgresql")
    print("   OR check if password authentication is required")
    sys.exit(1)

# Step 2: Create tables
print(f"\n📊 Step 2: Creating tables in '{DB_NAME}'...")
try:
    engine = create_engine(DB_URL)
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

    # Verify tables
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT tablename FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename
        """))
        tables = [row[0] for row in result]

    print(f"\n📋 Tables created:")
    for table in tables:
        print(f"   - {table}")

    engine.dispose()
except Exception as e:
    print(f"❌ Error creating tables: {e}")
    sys.exit(1)

print("\n" + "━" * 60)
print("✅ PostgreSQL setup complete!")
print("━" * 60)
print(f"Database: {DB_NAME}")
print(f"Connection: {DB_URL}")
print(f"Tables: {len(tables)} created")
print("━" * 60)
print("\n💡 Next steps:")
print("   1. Migrate data from SQLite (if needed)")
print("   2. Restart FastAPI: uvicorn backend.main:app --reload --port 8001")
print("   3. Test endpoints at http://localhost:8001/health")
