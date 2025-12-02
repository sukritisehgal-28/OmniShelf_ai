#!/bin/bash

# Setup PostgreSQL for OmniShelf AI

echo "🐘 Setting up PostgreSQL for OmniShelf AI..."

# Create database (will prompt for password if needed)
echo "Creating 'omnishelf' database..."
createdb omnishelf 2>/dev/null && echo "✅ Database created successfully!" || echo "⚠️  Database may already exist"

# Create tables using Python/SQLAlchemy
echo "Creating database tables..."
cd /Users/sukritisehgal/omnishelf_ai
source venv/bin/activate

python3 << 'PYTHON_SCRIPT'
from backend.database import engine
from backend.models import Base

print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully!")
PYTHON_SCRIPT

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ PostgreSQL setup complete!"
echo ""
echo "Database: omnishelf"
echo "Connection: postgresql://sukritisehgal@localhost:5434/omnishelf"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
