# OmniShelf AI - Quick Start Guide

**Get the entire system running in 3 simple steps.**

---

## 1. Start the Database 🗄️
We use Docker to run PostgreSQL without messy local installation.

```bash
# In the project root
docker compose up -d
```
*   **Check:** Run `docker ps`. You should see `omnishelf_ai-db-1` running on port **5436**.

---

## 2. Start the Backend API 🧠
The brain of the operation. Handles AI detection and database queries.

```bash
# Open a new terminal in project root
source venv/bin/activate  # Windows: venv\Scripts\activate

# Start the server
uvicorn backend.main:app --host 0.0.0.0 --port 8002 --reload
```
*   **Check:** Visit [http://localhost:8002/docs](http://localhost:8002/docs) to see the API Swagger UI.

---

## 3. Start the Frontend Dashboard 💻
The beautiful interface for Admins and Users.

```bash
# Open a new terminal
cd frontend_react

# Install dependencies (only needed first time)
npm install

# Run the dev server
npm run dev
```
*   **Check:** The terminal will show a URL (usually [http://localhost:3002](http://localhost:3002) or `3003`). Click it to open the app!

---

## 🛑 Troubleshooting

**"Connection Refused" on Frontend?**
*   Make sure the Backend is running on port **8002**.
*   Check if the Frontend is trying to connect to `localhost:8001`. If so, update `frontend_react/src/services/api.ts`.

**"Database connection failed"?**
*   Ensure Docker is running.
*   Check if port **5436** is free.

**"Module not found"?**
*   Ensure you activated the virtual environment (`source venv/bin/activate`) before running the backend.
