# Current UI/Frontend Status - OmniShelf AI

**Generated**: December 1, 2025

---

## Answer: Which UI is Being Used?

### ✅ **ACTIVE**: `/frontend/` - React App (Port 3002)

**Status**: Running and partially connected to backend
**URL**: http://localhost:3002
**Process**: Vite dev server (PID 63706)
**Type**: React 18 + TypeScript + Vite

---

## Detailed Breakdown

### 1. `/frontend/` ✅ ACTIVE (React)
```
Location: /Users/sukritisehgal/omnishelf_ai/frontend/
Port: 3002 (running)
Backend: http://localhost:8002 (configured, but backend on 8001)
Status: ⚠️ RUNNING but MISCONFIGURED
Type: React + TypeScript + Vite
Components: 42 React components
Dependencies: 219 packages installed
API Layer: ✅ Exists at src/services/api.ts
```

**Issue**: Frontend expects backend on port 8002, but backend is running on port 8001

**Files**:
- `.env`: `VITE_API_BASE_URL=http://localhost:8002` ❌ Wrong port
- `src/services/api.ts`: Has API functions
- `src/App.tsx`: Only renders SmartCart component
- `vite.config.ts`: Port 3002

### 2. `/frontend_streamlit_backup/` ❌ ARCHIVED (Streamlit)
```
Location: /Users/sukritisehgal/omnishelf_ai/frontend_streamlit_backup/
Port: N/A (not running)
Status: ARCHIVED - Old Streamlit frontend
Type: Python Streamlit
```

This is the OLD frontend that was replaced. Not in use.

### 3. `/Design OmniShelf AI Landing Page/` ❌ UNUSED (React)
```
Location: /Users/sukritisehgal/omnishelf_ai/Design OmniShelf AI Landing Page/
Port: N/A (not running)
Status: DUPLICATE - leftover from migration
Type: React + TypeScript + Vite
```

This is a **duplicate/leftover** folder from when we migrated. It should have been deleted but wasn't.

### 4. `/Design OmniShelf AI Landing Page (1)/` ❌ UNUSED (React)
```
Location: /Users/sukritisehgal/omnishelf_ai/Design OmniShelf AI Landing Page (1)/
Port: N/A (not running)
Status: DUPLICATE - another leftover
Type: React + TypeScript + Vite
```

Another **duplicate/leftover** folder.

### 5. Other Streamlit Processes ⚠️ RUNNING (Different Projects)
```
Port 8502: OmniShelf Streamlit (old, should be stopped)
Port 8501: secure-med-notes-ai project
Port 8600: Another OmniShelf Streamlit instance
Port 8505: Another OmniShelf Streamlit instance
```

Multiple old Streamlit processes are still running from previous sessions.

---

## Backend Status

### ✅ **RUNNING**: FastAPI on Port 8001
```
URL: http://localhost:8001
Health: {"status":"ok"} ✅
Database: PostgreSQL port 5434
Data: 43 detections, 126 snapshots
API Docs: http://localhost:8001/docs
```

### ❌ **NOT RUNNING**: FastAPI on Port 8002
```
Expected by frontend but not running
```

---

## Connection Status

| Component | Status | Port | Connected To |
|-----------|--------|------|--------------|
| React Frontend | ✅ Running | 3002 | ❌ Port 8002 (doesn't exist) |
| FastAPI Backend | ✅ Running | 8001 | ✅ PostgreSQL 5434 |
| PostgreSQL | ✅ Running | 5434 | ✅ Backend |

**Problem**: Frontend is configured to connect to `http://localhost:8002` but backend is on `http://localhost:8001`

---

## What's Actually Working?

### ✅ Working:
1. React UI renders at http://localhost:3002
2. Backend API responds at http://localhost:8001
3. Database has data (43 detections, 126 snapshots)
4. API service layer exists in frontend

### ❌ Not Working:
1. Frontend → Backend connection (wrong port)
2. API calls from React components (will fail)
3. Data won't load in React UI

---

## To Fix the Connection

### Option 1: Update Frontend to Use Port 8001 (Recommended)

Update `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8001
```

Then restart frontend:
```bash
# Kill current process
pkill -f "vite"

# Restart
cd frontend
npm run dev
```

### Option 2: Start Backend on Port 8002

```bash
# Stop current backend on 8001
# Start on 8002
uvicorn backend.main:app --reload --port 8002
```

---

## To Clean Up Leftover Folders

```bash
# Remove duplicate Design folders
rm -rf "Design OmniShelf AI Landing Page"
rm -rf "Design OmniShelf AI Landing Page (1)"

# Stop old Streamlit processes
pkill -f "streamlit.*8502"
pkill -f "streamlit.*8600"
pkill -f "streamlit.*8505"
```

---

## Summary

**Which UI folder is being used?**
- **Active**: `/frontend/` (React on port 3002)
- **Archived**: `/frontend_streamlit_backup/` (old Streamlit)
- **Leftover duplicates**: The two "Design OmniShelf AI Landing Page" folders

**Is it fully connected to backend?**
- **NO** ❌ - Frontend expects backend on port 8002, but backend runs on 8001
- **Fix**: Update `frontend/.env` to `VITE_API_BASE_URL=http://localhost:8001`

**React components exist?**
- **YES** ✅ - All 42 components including login, dashboards, SmartCart

**API integration exists?**
- **YES** ✅ - API service layer at `frontend/src/services/api.ts`
- But needs port fix to actually work
