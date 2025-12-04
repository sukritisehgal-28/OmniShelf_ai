# Database Setup Guide (PostgreSQL + Docker)

OmniShelf AI uses a containerized PostgreSQL database for reliability and ease of setup.

## 🐳 Docker Setup (Recommended)

The easiest way to run the database is via Docker Compose.

### 1. Start the Database
```bash
docker compose up -d
```
This starts a PostgreSQL 15 container mapping port **5432** (container) to **5436** (host).

### 2. Connection Details
If you want to connect using a GUI tool like **DBeaver**, **TablePlus**, or **pgAdmin**, use these credentials:

*   **Host:** `localhost`
*   **Port:** `5436`
*   **Database:** `omnishelf`
*   **User:** `omnishelf_user`
*   **Password:** `omnishelf_password`

*(These values are defined in `docker-compose.yml`)*

### 3. Resetting the Database
If you need to wipe all data and start fresh:

```bash
# Stop the container and remove the volume
docker compose down -v

# Restart (will re-initialize with empty tables)
docker compose up -d
```

---

## 🐍 Python Connection

The backend connects using `SQLAlchemy`. The connection string is automatically handled in `backend/database.py`, but for reference it is:

```
postgresql://omnishelf_user:omnishelf_password@localhost:5436/omnishelf
```

## 🛠️ Troubleshooting

**"Port 5436 is already in use"**
If you cannot start the container, another service might be using port 5436.
1.  Open `docker-compose.yml`.
2.  Change `"5436:5432"` to `"5437:5432"`.
3.  Update `backend/database.py` to use port 5437.
