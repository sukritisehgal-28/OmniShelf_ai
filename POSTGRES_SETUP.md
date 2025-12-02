# PostgreSQL Setup for OmniShelf AI

OmniShelf now defaults to PostgreSQL. Use the SQLite notes below only as a legacy fallback for quick demos.

## 🐘 Quick Setup Guide

### Option 1: Set PostgreSQL Password (Recommended)

1. **Set a password for your PostgreSQL user:**
   ```bash
   psql postgres
   ```

2. **Inside psql, run:**
   ```sql
   ALTER USER sukritisehgal WITH PASSWORD 'your_secure_password';
   CREATE DATABASE omnishelf;
   \q
   ```

3. **Update `.env` file:**
   ```
   DATABASE_URL=postgresql://sukritisehgal:your_secure_password@localhost:5434/omnishelf
   ```

4. **Install PostgreSQL Python driver:**
   ```bash
   source venv/bin/activate
   pip install psycopg2-binary
   ```

5. **Initialize database tables:**
   ```bash
   python init_postgres.py
   ```

### Option 2: Use Trust Authentication (Development Only)

1. **Edit PostgreSQL config:**
   ```bash
   # Find pg_hba.conf location
   psql postgres -c "SHOW hba_file;"

   # Edit the file (example path)
   nano /opt/homebrew/var/postgresql@14/pg_hba.conf
   ```

2. **Change this line:**
   ```
   # FROM:
   local   all             all                                     md5

   # TO:
   local   all             all                                     trust
   ```

3. **Restart PostgreSQL:**
   ```bash
   brew services restart postgresql
   ```

4. **Create database:**
   ```bash
   createdb omnishelf
   python init_postgres.py
   ```

### Option 3: Legacy SQLite Fallback (not recommended)

Prefer PostgreSQL. If you must run a quick demo without Postgres:

1. **Update `.env`:**
   ```
   DATABASE_URL=sqlite:///./omnishelf.db
   ```

2. **Restart FastAPI.**

---

## Current Status

✅ Default database set to PostgreSQL
✅ Init script created (`init_postgres.py`)
❌ Configure Postgres auth if you have not already

## Next Steps

**Choose one option above and follow the steps!**

After setup:
1. Restart FastAPI: `uvicorn backend.main:app --reload --port 8001`
2. Tables will be auto-created
3. Migrate data if needed (see DATA_MIGRATION.md)

---

## Troubleshooting

**Error: "fe_sendauth: no password supplied"**
→ Follow Option 1 or Option 2 above

**Error: "database does not exist"**
→ Run: `createdb omnishelf` or use SQL: `CREATE DATABASE omnishelf;`

**Error: "psycopg2 not installed"**
→ Run: `pip install psycopg2-binary`

**Need SQLite temporarily?**
→ Change `.env` to: `DATABASE_URL=sqlite:///./omnishelf.db` (demo only; switch back to Postgres after)
