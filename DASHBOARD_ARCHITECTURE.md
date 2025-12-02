# OmniShelf AI - Dashboard Architecture

## 📐 Complete System Architecture

### **Application Structure**
```
OmniShelf AI Dashboard
├── Sidebar Navigation
│   ├── App Title: "OmniShelf AI"
│   ├── FastAPI URL Input (default: http://localhost:8001)
│   └── Page Selector Dropdown (5 pages)
└── Main Content Area (Dynamic based on page selection)
```

---

## 🎨 Page-by-Page Architecture

### **PAGE 1: Store Overview & Alerts**
**Purpose:** Combined view of inventory management and critical alerts
**Layout:** Vertical stack with priority-based sections

#### **Section 1: Critical Alerts (Top Priority)**
```
┌─────────────────────────────────────────────────────────┐
│ 🚨 Critical Alerts                                      │
├─────────────────────────────────────────────────────────┤
│ ⛔ [Red Banner] X product(s) OUT OF STOCK              │
│                                                          │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│ │❌ Product│  │❌ Product│  │❌ Product│  (3-col grid) │
│ │Name      │  │Name      │  │Name      │              │
│ │📍Shelf:A1│  │📍Shelf:B2│  │📍Shelf:C3│              │
│ │💰Price:  │  │💰Price:  │  │💰Price:  │              │
│ │$X.XX     │  │$X.XX     │  │$X.XX     │              │
│ │OUT STOCK │  │OUT STOCK │  │OUT STOCK │              │
│ └──────────┘  └──────────┘  └──────────┘              │
├─────────────────────────────────────────────────────────┤
│ ⚠️ [Yellow Banner] X product(s) LOW STOCK              │
│                                                          │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│ │⚠️ Product│  │⚠️ Product│  │⚠️ Product│  (3-col grid) │
│ │Name      │  │Name      │  │Name      │              │
│ │📍Shelf:A4│  │📍Shelf:B5│  │📍Shelf:C1│              │
│ │📦Stock:3 │  │📦Stock:2 │  │📦Stock:1 │              │
│ │💰Price:  │  │💰Price:  │  │💰Price:  │              │
│ └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```
**Colors:**
- OUT OF STOCK: Background #ffe6e6, Border-left #e74c3c (red)
- LOW STOCK: Background #fff4e6, Border-left #e67e22 (orange)

#### **Section 2: Store Performance Metrics**
```
┌─────────────────────────────────────────────────────────┐
│ 📈 Store Performance                                    │
├─────────────┬─────────────┬─────────────┬──────────────┤
│ Total       │ Total       │ Low Stock   │ Out of Stock │
│ Products    │ Inventory   │ Items       │              │
│             │ Value       │             │              │
│ [9]         │ [$255.91]   │ [5] ↓-5    │ [0]         │
└─────────────┴─────────────┴─────────────┴──────────────┘
```
**Metric Cards:** 4-column grid, equal width

#### **Section 3: Stock Visualization**
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Per-Product Stock Counts                            │
├─────────────────────────────────────────────────────────┤
│ [Vertical Bar Chart]                                    │
│ Y-axis: Count (0-15)                                    │
│ X-axis: Product Names                                   │
│ Bars: Blue gradient                                     │
└─────────────────────────────────────────────────────────┘
```

#### **Section 4: Category Breakdown**
```
┌─────────────────────────────────────────────────────────┐
│ 🏷️ Inventory by Category                              │
├──────────────────────────┬──────────────────────────────┤
│ Count by Category        │ Value by Category            │
│ [Bar Chart]              │ [Bar Chart]                  │
│                          │                              │
│ Snacks          ████████ │ Snacks          ████████    │
│ Beverages       ████     │ Beverages       ████        │
│ Dairy           ██       │ Dairy           ████        │
└──────────────────────────┴──────────────────────────────┘
```
**Layout:** 2-column grid, equal width

#### **Section 5: Detailed Inventory Table**
```
┌─────────────────────────────────────────────────────────┐
│ 📋 Detailed Inventory Table                            │
├──────────────────────────┬──────────────────────────────┤
│ Filter by Category ▼     │ Filter by Stock Level ▼      │
│ [Multi-select dropdown]  │ [Multi-select dropdown]      │
└──────────────────────────┴──────────────────────────────┘
│                                                          │
│ Product    Category  Shelf Count Price  Value  Level    │
│ ────────────────────────────────────────────────────────│
│ Coca Cola  Beverages  B1   13   $1.89  $25.87 MEDIUM   │
│ Nutella    Spreads    B4   12   $5.99  $71.88 MEDIUM   │
│ Spaghetti  Pasta      B3    9   $2.49  $22.41 MEDIUM   │
│ [More rows...]                                          │
└─────────────────────────────────────────────────────────┘
```
**Table Features:**
- Color-coded "Level" column
- Sortable headers
- Full width responsive

#### **Section 6: Quick Actions**
```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Quick Actions                                        │
├────────────────────┬────────────────────┬───────────────┤
│ [📥 Export CSV]    │ [🔔 Generate      │ [📊 View     │
│                    │  Restock Orders]   │  Analytics]   │
└────────────────────┴────────────────────┴───────────────┘
```
**Layout:** 3-column grid, buttons equal width

---

### **PAGE 2: Store Dashboard**
**Purpose:** Simple inventory view without alerts
**Layout:** Cleaner focus on inventory data

#### **Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│ Store Dashboard                                         │
│ Real-time shelf analytics powered by OmniShelf AI       │
├─────────────────────────────────────────────────────────┤
│ [4 Metric Cards - Same as Page 1 Section 2]           │
├─────────────────────────────────────────────────────────┤
│ Per-product Stock Counts                                │
│ [Bar Chart - Full Width]                               │
├─────────────────────────────────────────────────────────┤
│ Shelf Inventory Table                                   │
│ [Data Table - Color-coded Stock Levels]                │
│ Product | Category | Shelf | Count | Price | Value |... │
└─────────────────────────────────────────────────────────┘
```

**Key Differences from Page 1:**
- No alert cards at top
- Simpler layout
- Focus on data table

---

### **PAGE 3: Analytics Dashboard**
**Purpose:** Historical trends and insights
**Layout:** Vertical sections with charts

#### **Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Analytics Dashboard                                  │
│ Stock trends and insights over time                     │
├─────────────────────────────────────────────────────────┤
│ 📈 Stock Trends (Last 7 Days)                          │
│ [Line Chart - Total Inventory Over Time]               │
│ X-axis: Dates (Nov 24-29)                              │
│ Y-axis: Total Count                                     │
│ Line: Blue gradient                                     │
├─────────────────────────────────────────────────────────┤
│ 📦 Product-Level Trends                                │
│ Select products to view: [Multi-select Dropdown]        │
│ ☑ Coca Cola  ☑ Nutella  ☑ Spaghetti  ...              │
│                                                          │
│ [Multi-line Chart]                                      │
│ Each product = Different colored line                   │
│ Interactive hover tooltips                              │
│                                                          │
│ [Expandable] 📋 View Detailed Data                     │
│ └─ [Data table when expanded]                          │
├─────────────────────────────────────────────────────────┤
│ ⚡ Stock Velocity                                       │
│ Products with biggest changes in last 7 days           │
│                                                          │
│ Product       Change  Change %    Trend                 │
│ ─────────────────────────────────────────────────────── │
│ Coca Cola     +3      +30.0%      📈 Increasing        │
│ Nutella       -2      -16.7%      📉 Decreasing        │
│ Spaghetti      0       0.0%       ➡️ Stable            │
├──────────────────────────┬──────────────────────────────┤
│ 🏆 Biggest Increase      │ ⚠️ Biggest Decrease         │
│ Coca Cola                │ Nutella                      │
│ +30.0%                   │ -16.7%                       │
└──────────────────────────┴──────────────────────────────┘
```

**Chart Specifications:**
- Line charts: Smooth curves, grid lines
- Colors: Blue (#3498db), Green (#2ecc71), Red (#e74c3c)
- Interactive tooltips on hover

---

### **PAGE 4: Alerts & Notifications**
**Purpose:** Dedicated alerts management
**Layout:** Alert-focused with settings

#### **Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔔 Stock Alerts & Notifications                        │
│ Monitor critical stock levels and get insights          │
├─────────────────────────────────────────────────────────┤
│ 🚨 Critical Alerts                                      │
│                                                          │
│ ⛔ X product(s) OUT OF STOCK - Action required!        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [Expandable] ❌ Product Name                       │ │
│ │ └─ Shelf Location | Price | Last Seen              │ │
│ │    [🛒 Create Restock Order]                       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ⚠️ X product(s) with LOW stock - Restock soon!        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [Expandable] ⚠️ Product Name (X units left)       │ │
│ │ └─ Shelf Location | Current Stock | Price          │ │
│ └────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ⚙️ Alert Settings                                      │
├──────────────────────────┬──────────────────────────────┤
│ ☑ 📧 Email Alerts        │ Low Stock Threshold (%)     │
│ ☐ 📱 SMS Alerts          │ [Slider: 40]                │
│ ☑ 🔔 Push Notifications  │ Critical Stock Threshold    │
│                          │ [Number Input: 5]            │
└──────────────────────────┴──────────────────────────────┘
│                                                          │
│ 📜 Recent Alert History                                │
│ Time             Type         Product      Action       │
│ ─────────────────────────────────────────────────────── │
│ 2025-11-20 10:30 LOW STOCK    Coca Cola    Notif Sent  │
│ 2025-11-19 14:15 OUT OF STOCK Pringles     Order Made  │
│ [More rows...]                                          │
├─────────────────────────────────────────────────────────┤
│ [📥 Download Alert Report]                             │
└─────────────────────────────────────────────────────────┘
```

**Interaction Design:**
- Expandable sections for each alert
- Toggle switches for settings
- Slider and number input for thresholds

---

### **PAGE 5: SmartCart Assistant**
**Purpose:** Customer shopping helper
**Layout:** Simple input/output design

#### **Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│ SmartCart Assistant                                     │
│ Paste a shopping list to get shelf locations and stock  │
├─────────────────────────────────────────────────────────┤
│ Shopping List                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Coca Cola                                           │ │
│ │ Nutella Hazelnut Spread                             │ │
│ │ Barilla Spaghetti                                   │ │
│ │                                                      │ │
│ │                                                      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ [Find My Items]                                         │
├─────────────────────────────────────────────────────────┤
│ Shopping Route                                          │
│                                                          │
│ Product         Shelf Location  Available  Stock Level  │
│ ─────────────────────────────────────────────────────── │
│ Coca Cola       B1              13         MEDIUM       │
│ Nutella         B4              12         MEDIUM       │
│ Spaghetti       B3               9         MEDIUM       │
└─────────────────────────────────────────────────────────┘
│                                                          │
│ [Red Banner if items out of stock]                     │
│ ⛔ Out of stock: Product1, Product2                    │
└─────────────────────────────────────────────────────────┘
```

**User Flow:**
1. Enter products (one per line)
2. Click "Find My Items"
3. View table with shelf locations
4. See color-coded stock levels
5. Alert if any items unavailable

---

## 🎨 Design System

### **Color Palette**
```
Stock Levels:
├── HIGH   : #2ecc71 (Green)
├── MEDIUM : #f1c40f (Yellow/Gold)
├── LOW    : #e67e22 (Orange)
└── OUT    : #e74c3c (Red)

Alert Backgrounds:
├── OUT OF STOCK : #ffe6e6 (Light Red)
└── LOW STOCK    : #fff4e6 (Light Orange)

Primary Colors:
├── Primary Blue  : #3498db
├── Success Green : #2ecc71
├── Warning Yellow: #f39c12
└── Danger Red    : #e74c3c

Neutrals:
├── Dark Gray  : #2c3e50
├── Gray       : #7f8c8d
└── Light Gray : #ecf0f1
```

### **Typography**
```
Headers:
├── Page Title      : 24px, Bold
├── Section Title   : 18px, Semi-bold
└── Subsection      : 16px, Medium

Body:
├── Regular Text    : 14px, Regular
├── Caption         : 12px, Regular
└── Table Text      : 13px, Regular

Numbers:
└── Metric Values   : 32px, Bold
```

### **Spacing**
```
Sections : 32px vertical gap
Cards    : 16px padding, 8px gap
Metrics  : 20px padding
Tables   : 12px row padding
Buttons  : 12px horizontal, 8px vertical
```

### **Component Patterns**

#### **Metric Card**
```
┌──────────────┐
│ Label        │ (12px gray)
│ 123          │ (32px bold)
│ +5 ↑         │ (14px green delta)
└──────────────┘
Background: White
Border: 1px #ecf0f1
Border-radius: 8px
Shadow: 0 2px 4px rgba(0,0,0,0.1)
```

#### **Alert Card**
```
┌─────────────────────────┐
│ ├─── 4px colored border │
│ ❌ Product Name         │
│ 📍 Shelf: A1            │
│ 💰 Price: $5.99         │
│ OUT OF STOCK            │
└─────────────────────────┘
Border-radius: 5px
Padding: 10px
```

#### **Data Table**
```
Striped rows (alternating #fafafa)
Hover state: #f5f5f5
Header: Bold, #2c3e50
Cell padding: 12px
Border: 1px #e0e0e0
```

---

## 📱 Responsive Behavior

### **Desktop (> 1200px)**
- 4-column metric cards
- 3-column alert cards
- 2-column category charts
- Full-width tables

### **Tablet (768px - 1200px)**
- 2-column metric cards
- 2-column alert cards
- Stacked category charts
- Scrollable tables

### **Mobile (< 768px)**
- Stacked metric cards (1 column)
- Stacked alert cards (1 column)
- All charts full-width
- Horizontal scroll tables

---

## 🔄 Data Flow

```
Frontend (Streamlit) → API (FastAPI) → Database (PostgreSQL)

Page Load:
1. Streamlit renders sidebar
2. User selects page
3. Page component fetches data from API
4. API queries PostgreSQL database
5. Data returned as JSON
6. Streamlit renders visualizations

Real-time Updates:
- Auto-refresh every 30 seconds
- Manual refresh via sidebar
- Cache bust on user interaction
```

---

## 🎯 Key User Interactions

### **Store Overview & Alerts**
1. View critical alerts at glance
2. Filter inventory by category/level
3. Export CSV reports
4. Generate restock orders

### **Analytics Dashboard**
1. View 7-day trends
2. Select specific products
3. Expand detailed data
4. Compare velocity metrics

### **Alerts Page**
1. Configure alert preferences
2. Set threshold values
3. Create restock orders
4. Download alert history

### **SmartCart**
1. Paste shopping list
2. Find shelf locations
3. Check stock availability
4. See out-of-stock warnings

---

## 📊 Data Models

### **Product Object**
```json
{
  "product_name": "grozi_19",
  "display_name": "Coca Cola",
  "price": 1.89,
  "category": "Beverages",
  "total_count": 13,
  "shelf_id": "B1",
  "stock_level": "MEDIUM",
  "inventory_value": 25.87,
  "shelf_breakdown": {
    "A1": 3,
    "B1": 5,
    "C2": 5
  }
}
```

### **Stock History Object**
```json
{
  "history": {
    "grozi_19": {
      "2025-11-24": 15,
      "2025-11-25": 14,
      "2025-11-26": 13
    }
  }
}
```

---

This architecture supports a scalable, user-friendly retail intelligence platform.
