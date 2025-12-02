# OmniShelf AI - Complete Project Overview

**Last Updated**: December 1, 2025
**Status**: ✅ Fully Functional - React Frontend + FastAPI Backend + PostgreSQL

---

## Project Summary

**OmniShelf AI** is an intelligent retail shelf monitoring system that uses YOLOv11 computer vision to track inventory in real-time. The system provides:
- Real-time stock level monitoring
- Analytics and trend tracking
- Alert/notification system for low stock
- SmartCart shopping assistant for customers
- Admin dashboards for store management

---

## Technology Stack

### Frontend (React)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Library**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Port**: 5173 (dev), 3002 (Docker)

### Backend (FastAPI)
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL (port 5434 native, 5432 Docker)
- **ML Model**: YOLOv11s (yolo11s.pt)
- **Port**: 8001 (native), 8002 (Docker)

### Database
- **Type**: PostgreSQL 16
- **Local**: Port 5434 (Homebrew)
- **Docker**: Port 5436 → 5432
- **Tables**: product_detections, stock_snapshots, planogram, alerts

---

## Directory Structure

```
omnishelf_ai/
├── frontend/                          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/               # 42 React components
│   │   │   ├── HeroSection.tsx      # Landing hero
│   │   │   ├── LoginSection.tsx     # Login page with admin/shopper
│   │   │   ├── AdminDashboard.tsx   # Main admin view
│   │   │   ├── StoreDashboard.tsx   # Store metrics
│   │   │   ├── AnalyticsDashboard.tsx # Analytics & trends
│   │   │   ├── AlertsPage.tsx       # Alerts & notifications
│   │   │   ├── SmartCartAssistant.tsx # Shopper shopping list
│   │   │   ├── DashboardMetrics.tsx # KPI cards
│   │   │   ├── StoreMetrics.tsx     # Store-level metrics
│   │   │   ├── InventoryTable.tsx   # Full inventory table
│   │   │   ├── CriticalAlerts.tsx   # Alert cards
│   │   │   └── ui/                  # 48 shadcn/ui components
│   │   ├── services/
│   │   │   └── api.ts               # API service layer
│   │   ├── types/                   # TypeScript types
│   │   ├── App.tsx                  # Main app (currently SmartCart only)
│   │   └── main.tsx                 # Entry point
│   ├── package.json                 # 219 npm packages
│   ├── vite.config.ts               # Vite config (port 5173)
│   ├── .env                         # VITE_API_BASE_URL=http://localhost:8002
│   └── node_modules/                # Dependencies installed
│
├── backend/                          # FastAPI REST API
│   ├── main.py                      # FastAPI app with all endpoints
│   ├── models.py                    # SQLAlchemy ORM models
│   ├── schemas.py                   # Pydantic schemas
│   ├── crud.py                      # Database operations
│   ├── database.py                  # Database connection
│   └── config.py                    # Configuration
│
├── frontend_streamlit_backup/        # OLD: Streamlit frontend (archived)
│   └── app.py                       # Original Streamlit app
│
├── yolo/                            # YOLOv11 training & inference
│   ├── train_yolo.py                # Model training
│   ├── evaluate_real_shelves.py     # Real shelf detection
│   ├── prepare_grozi_dataset.py     # Dataset preparation
│   └── utils.py                     # YOLO utilities
│
├── tests/                           # Unit tests
│   ├── test_api.py                  # API endpoint tests
│   └── test_detection.py            # Detection tests
│
├── Dockerfile.backend               # Backend Docker image (Node 20)
├── Dockerfile.frontend              # Frontend Docker image (Python 3.11)
├── docker-compose.yml               # Full stack orchestration
├── .env                             # Database: PostgreSQL port 5434
├── requirements.txt                 # Python dependencies
├── omnishelf.db                     # SQLite backup (64KB)
├── yolo11s.pt                       # YOLOv11 model weights (19MB)
├── product_mapping.py               # Grozi product metadata
├── generate_stock_history.py        # Generate sample data
├── migrate_sqlite_to_postgres.py    # Migration script
└── init_db.sql                      # Docker DB initialization
```

---

## React Components Breakdown

### Landing Page Components (Yes, they exist!)
✅ **HeroSection.tsx** - Hero with gradient background, CTA buttons
✅ **LoginSection.tsx** - Role-based login (Admin/Shopper portals)
✅ **FeatureHighlights.tsx** - Feature cards with icons
✅ **HowItWorks.tsx** - 3-step process
✅ **Footer.tsx** - Footer with links
✅ **Navigation.tsx** - Top navigation bar

### Admin Dashboard Components (Yes, they exist!)
✅ **AdminDashboard.tsx** - Main admin container
✅ **AdminSidebar.tsx** - Sidebar navigation
✅ **StoreDashboard.tsx** - Store overview
✅ **AnalyticsDashboard.tsx** - Analytics view
✅ **AlertsPage.tsx** - Alerts & notifications

### Metrics Components
✅ **DashboardMetrics.tsx** - KPI cards (4-column grid)
✅ **StoreMetrics.tsx** - Store-level metrics
✅ **DashboardSummary.tsx** - Summary stats
✅ **VelocityHighlights.tsx** - Stock velocity

### Chart Components
✅ **TotalStockChart.tsx** - Total stock chart
✅ **MainStockChart.tsx** - Main stock visualization
✅ **ProductLevelTrends.tsx** - Product trends
✅ **CategoryBreakdown.tsx** - Category breakdown charts
✅ **SecondaryCharts.tsx** - Additional charts
✅ **StockVisualization.tsx** - Stock visualization

### Table Components
✅ **InventoryTable.tsx** - Full inventory with filters
✅ **ShelfInventoryTable.tsx** - Shelf-level inventory
✅ **StockVelocityTable.tsx** - Stock velocity table
✅ **DetailedDataSection.tsx** - Detailed data view

### Alert Components
✅ **ActiveAlertsList.tsx** - Active alerts list
✅ **AlertCard.tsx** - Individual alert card
✅ **AlertFilters.tsx** - Alert filtering
✅ **AlertHistory.tsx** - Historical alerts
✅ **AlertSettings.tsx** - Alert configuration
✅ **CriticalAlerts.tsx** - Critical alerts section

### SmartCart Components (Shopper Portal)
✅ **SmartCartAssistant.tsx** - Main SmartCart view
✅ **SmartCartNav.tsx** - Shopper top navigation
✅ **ShoppingListInput.tsx** - Shopping list input
✅ **SmartCartResults.tsx** - Search results with locations
✅ **SmartCartSteps.tsx** - Step-by-step guide
✅ **RouteSummary.tsx** - Optimal shopping route

### Filter & Action Components
✅ **DashboardFilters.tsx** - Dashboard filters
✅ **AnalyticsFilters.tsx** - Analytics filters
✅ **QuickActions.tsx** - Quick action buttons

### UI Components (48 shadcn/ui components)
All standard UI components from shadcn/ui are included in `src/components/ui/`

---

## Backend API Endpoints

### Health
- `GET /health` - Health check

### Products
- `GET /products` - Get all products with metadata
- `POST /detections/` - Create product detections

### Stock
- `GET /stock` - Get stock summary (alias for /stock/summary)
- `GET /stock/summary` - Get all products with stock levels
- `GET /stock/{product_name}` - Get specific product stock
- `GET /stock/history` - Get raw stock snapshots

### Alerts
- `GET /alerts` - Get alerts (query param: resolved=false)
- `POST /alerts` - Create alert
- `PUT /alerts/{alert_id}/resolve` - Resolve alert

### Analytics
- `GET /analytics` - Stock history (alias for /analytics/stock-history)
- `GET /analytics/stock-history?days=7` - Get stock history for N days

### Shelves
- `GET /shelf/{shelf_id}` - Get shelf summary

### SmartCart
- `POST /shopping-list` - Process shopping list, return locations

---

## Database Schema

### product_detections
```sql
id: integer (PK)
product_name: varchar (grozi code)
confidence: float
bbox_x1, bbox_y1, bbox_x2, bbox_y2: float
shelf_id: varchar
timestamp: timestamp
```

### stock_snapshots
```sql
id: integer (PK)
product_name: varchar
count: integer
shelf_id: varchar
snapshot_time: timestamp
```

### planogram
```sql
id: integer (PK)
product_name: varchar
expected_stock: integer
shelf_id: varchar
created_at: timestamp
```

### alerts
```sql
id: integer (PK)
product_name: varchar
alert_type: varchar
message: text
resolved: boolean
created_at: timestamp
```

---

## Current Data (PostgreSQL)

- **Product Detections**: 43 records
- **Stock Snapshots**: 126 records (Nov 24-29, 2025)
- **Planogram**: 0 records
- **Top Products**: grozi_19 (13), grozi_29 (12), grozi_6 (9)

---

## Running the Application

### Development (Native)

**Backend**:
```bash
uvicorn backend.main:app --reload --port 8001
# Runs on http://localhost:8001
# API Docs: http://localhost:8001/docs
```

**Frontend**:
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Production (Docker)

```bash
docker compose up --build
```

Services:
- **Frontend**: http://localhost:3002
- **Backend**: http://localhost:8002
- **Database**: localhost:5436 (PostgreSQL)

---

## Environment Configuration

### Backend `.env`
```env
DATABASE_URL=postgresql://sukritisehgal@localhost:5434/omnishelf
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:8002
```

### Docker `docker-compose.yml`
```yaml
services:
  db: postgres:16 (port 5436:5432)
  backend: FastAPI (port 8002:8002)
  frontend: React Vite (port 3002:3002)
```

---

## Key Features

### ✅ Completed Features

1. **Landing Page**
   - Hero section with CTA buttons
   - Feature highlights
   - How it works section
   - Role-based login UI (Admin/Shopper)

2. **Admin Dashboards**
   - Store Dashboard with metrics
   - Analytics Dashboard with trends
   - Alerts & Notifications page
   - Inventory tables with filters

3. **SmartCart Assistant**
   - Shopping list input
   - Product location lookup
   - Optimal route display
   - Stock availability check

4. **Backend API**
   - All CRUD operations
   - Stock tracking
   - Alert management
   - Analytics endpoints
   - CORS enabled

5. **Database**
   - PostgreSQL with real data
   - 43 product detections
   - 126 historical snapshots
   - Full schema defined

### ⚠️ Missing/Not Implemented

1. **React Routing**
   - No react-router-dom installed
   - App.tsx only renders SmartCart
   - Need to add routing for all pages

2. **Authentication**
   - Login UI exists but not functional
   - No JWT/session management
   - No protected routes

3. **API Integration**
   - API service layer exists
   - Components show mock/static data
   - Need to connect components to API

4. **State Management**
   - No global state management
   - Using only local useState
   - Consider Zustand or Context API

---

## Next Steps (Required)

### 1. Add React Router
```bash
cd frontend
npm install react-router-dom
```

Update `App.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { LoginSection } from './components/LoginSection';
import { AdminDashboard } from './components/AdminDashboard';
import { SmartCartAssistant } from './components/SmartCartAssistant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><HeroSection /><LoginSection /></>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/smartcart" element={<SmartCartAssistant />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. Connect Components to API

Update components to fetch real data:
```typescript
import { useEffect, useState } from 'react';
import api from '@/services/api';

function StoreDashboard() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    api.fetchStockSummary().then(data => setStock(data));
  }, []);

  // Render with real data
}
```

### 3. Implement Authentication

Add auth context and protect routes:
```typescript
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Call backend /auth/login
    // Store JWT token
    // Set user state
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 4. Test All Pages

Visit and verify:
- http://localhost:5173/ (Landing + Login)
- http://localhost:5173/admin (Admin Dashboard)
- http://localhost:5173/smartcart (SmartCart)

---

## Documentation Files

- **README.md** - Project overview
- **REACT_MIGRATION_COMPLETE.md** - Frontend migration guide
- **DASHBOARD_ARCHITECTURE.md** - Dashboard design specs
- **FIGMA_AI_COMPLETE_PROMPT.md** - Figma design prompt
- **POSTGRES_SETUP.md** - PostgreSQL setup guide
- **SYSTEM_EXPLANATION.md** - System architecture
- **PROJECT_COMPLETE_OVERVIEW.md** - This file

---

## Answer to Your Question

### "Does the React code have code for all the pages including login?"

**YES! ✅ All pages exist as React components:**

1. **Landing Page**: ✅ HeroSection.tsx, FeatureHighlights.tsx, HowItWorks.tsx
2. **Login Page**: ✅ LoginSection.tsx (Admin & Shopper portals with forms)
3. **Admin Dashboard**: ✅ AdminDashboard.tsx, AdminSidebar.tsx
4. **Store Dashboard**: ✅ StoreDashboard.tsx, StoreMetrics.tsx, InventoryTable.tsx
5. **Analytics Dashboard**: ✅ AnalyticsDashboard.tsx, charts, trends
6. **Alerts Page**: ✅ AlertsPage.tsx, AlertCard.tsx, CriticalAlerts.tsx
7. **SmartCart**: ✅ SmartCartAssistant.tsx, ShoppingListInput.tsx, Results

**Total**: 42 components covering all pages

**Current Issue**: App.tsx only renders SmartCart. Need to:
1. Install react-router-dom
2. Set up routes in App.tsx
3. Connect components to API
4. Implement authentication logic

---

## Port Configuration

### Native Development
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:8001 (FastAPI)
- Database: localhost:5434 (PostgreSQL)

### Docker
- Frontend: http://localhost:3002
- Backend: http://localhost:8002
- Database: localhost:5436 → 5432

---

**Project Status**: Ready for integration work. All components exist, backend is functional, database has data. Need to wire everything together with routing and API calls.
