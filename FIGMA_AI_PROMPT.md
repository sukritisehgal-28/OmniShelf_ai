# Figma AI Design Prompt for OmniShelf AI Dashboard

## 🎨 Complete Figma AI Prompt

```
Design a modern retail inventory management dashboard called "OmniShelf AI" with 5 main pages.
Use a clean, professional design system with data visualization emphasis.

DESIGN SPECIFICATIONS:

=== LAYOUT ===
- Frame size: 1920x1080px (desktop view)
- Left sidebar: 280px width, dark navy (#2c3e50)
- Main content area: 1640px width, light gray background (#f8f9fa)
- Top padding: 32px
- Content max-width: 1400px centered

=== SIDEBAR NAVIGATION ===
Position: Fixed left, full height
Background: Dark navy (#2c3e50)
Components:
1. App logo/title at top: "OmniShelf AI" (24px, white, bold)
2. API URL input field (small, subtle)
3. Navigation menu (5 items):
   - "Store Overview & Alerts" (highlighted as active)
   - "Store Dashboard"
   - "Analytics Dashboard"
   - "Alerts & Notifications"
   - "SmartCart Assistant"

Menu items style:
- Inactive: White text, 14px, 16px padding
- Active: Blue accent (#3498db), bold, left border indicator
- Hover: Light blue background (#34495e)

=== COLOR SYSTEM ===
Stock Level Colors:
- HIGH: #2ecc71 (green)
- MEDIUM: #f1c40f (yellow-gold)
- LOW: #e67e22 (orange)
- OUT: #e74c3c (red)

Alert Backgrounds:
- Critical (OUT): #ffe6e6 with #e74c3c left border
- Warning (LOW): #fff4e6 with #e67e22 left border
- Success: #d4edda with #2ecc71 left border

Primary Palette:
- Primary: #3498db (blue)
- Success: #2ecc71 (green)
- Warning: #f39c12 (orange-yellow)
- Danger: #e74c3c (red)
- Dark: #2c3e50
- Gray: #7f8c8d
- Light: #ecf0f1

=== TYPOGRAPHY ===
Font family: Inter or similar modern sans-serif
Hierarchy:
- Page titles: 28px, bold, dark (#2c3e50)
- Section headers: 20px, semi-bold, dark
- Body text: 14px, regular, gray (#555)
- Captions: 12px, regular, light gray (#888)
- Metric values: 36px, bold, primary color
- Table text: 13px, regular

=== PAGE 1: STORE OVERVIEW & ALERTS ===

TOP SECTION - Critical Alerts:
[Full width container, 24px margin bottom]
- Section title: "🚨 Critical Alerts" (20px, bold)
- Red banner: "⛔ 3 product(s) OUT OF STOCK - Immediate action required!"
  (Red background #ffe6e6, red text #e74c3c, 12px padding, rounded corners)

Alert Cards Grid (3 columns, 16px gap):
Each card:
- Background: #ffe6e6 (light red)
- Left border: 4px solid #e74c3c
- Border radius: 8px
- Padding: 16px
- Content:
  * Product name (16px, bold, dark)
  * "📍 Shelf: A1" (14px, gray)
  * "💰 Price: $5.99" (14px, gray)
  * "OUT OF STOCK" (14px, bold, red)

Yellow banner below: "⚠️ 5 product(s) with LOW stock - Restock soon!"
(Yellow background #fff4e6, orange text #e67e22)

Low stock cards (same 3-column grid):
- Background: #fff4e6 (light orange)
- Left border: 4px solid #e67e22
- Content similar but shows stock count: "📦 Stock: 3 units"

METRICS SECTION:
[4-column grid, equal width, 16px gap]
Section title: "📈 Store Performance"

Each metric card:
- Background: White
- Border: 1px solid #e0e0e0
- Border radius: 12px
- Padding: 24px
- Box shadow: 0 2px 8px rgba(0,0,0,0.08)
- Layout:
  * Label (12px, gray, uppercase)
  * Value (36px, bold, dark)
  * Delta indicator if applicable (14px, colored with arrow)

Metrics:
1. "Total Products" - Value: 9
2. "Total Inventory Value" - Value: $255.91
3. "Low Stock Items" - Value: 5 (red -5 delta)
4. "Out of Stock" - Value: 0

CHART SECTION 1:
[Full width container]
Title: "📊 Per-Product Stock Counts"
- Vertical bar chart
- Height: 320px
- Bars: Blue gradient (#3498db)
- Grid lines: Light gray
- X-axis: Product names (rotated 45°)
- Y-axis: Count values (0-15)
- Bar width: 48px
- Gap between bars: 16px

CHART SECTION 2:
[2-column layout, 16px gap]
Title: "🏷️ Inventory by Category"

Left chart: "Count by Category"
Right chart: "Value by Category"
Both:
- Horizontal bar charts
- Height: 280px
- Bars: Gradient colors
- Labels on left, values on right

TABLE SECTION:
Title: "📋 Detailed Inventory Table"

Filters (2-column, 16px gap above table):
- Left: "Filter by Category" (multi-select dropdown)
- Right: "Filter by Stock Level" (multi-select dropdown)

Table design:
- Full width
- Header: Dark background (#2c3e50), white text, bold
- Alternating row colors: White and #fafafa
- Row padding: 16px vertical, 12px horizontal
- Hover state: #f0f0f0
- Columns: Product | Category | Shelf | Count | Price | Value | Stock Level
- Stock Level column: Colored pills matching stock level colors
- Border: 1px solid #e0e0e0
- Border radius: 8px (outer)

QUICK ACTIONS:
[3-column grid, 16px gap]
Title: "⚡ Quick Actions"

Buttons (equal width):
1. "📥 Export Inventory Report (CSV)" - Blue outline
2. "🔔 Generate Restock Orders" - Orange outline
3. "📊 View Analytics" - Gray outline

Button style:
- Height: 48px
- Border radius: 8px
- Border: 2px solid (color varies)
- Hover: Filled with color, white text
- Font: 14px, semi-bold

=== PAGE 2: STORE DASHBOARD ===
[Simpler version without alerts]

Header:
- Title: "Store Dashboard" (28px, bold)
- Subtitle: "Real-time shelf analytics powered by OmniShelf AI" (14px, gray)

Same metrics section as Page 1

Full-width bar chart:
- Title: "Per-product Stock Counts"
- Same style as Page 1

Full-width table:
- Title: "Shelf Inventory Table"
- Same design as Page 1 but without filters
- Shows all products

Legend below table:
"Stock level legend: 🟢 HIGH (green), 🟡 MEDIUM (yellow), 🟠 LOW (orange), 🔴 OUT (red)"

=== PAGE 3: ANALYTICS DASHBOARD ===

Header:
- Title: "📊 Analytics Dashboard" (28px, bold)
- Subtitle: "Stock trends and insights over time" (14px, gray)

SECTION 1: Overall Trends
Title: "📈 Stock Trends (Last 7 Days)"
- Line chart, full width, height 300px
- X-axis: Dates (Nov 24-29)
- Y-axis: Total count
- Line: Blue (#3498db), 2px thickness
- Area fill: Light blue gradient
- Grid: Dotted gray lines
- Points: 6px circles on data points
- Hover tooltips showing exact values

SECTION 2: Product-Level Trends
Title: "📦 Product-Level Trends"
- Multi-select dropdown: "Select products to view"
- Default selected: 3 products with checkboxes
- Multi-line chart below (full width, 300px height)
- Each product = different color line:
  * Coca Cola: Blue (#3498db)
  * Nutella: Orange (#e67e22)
  * Spaghetti: Green (#2ecc71)
- Legend on top right
- Interactive tooltips

Expandable section below:
- "📋 View Detailed Data" (collapsed by default)
- Expand icon on right
- When expanded: shows data table

SECTION 3: Stock Velocity
Title: "⚡ Stock Velocity"
Subtitle: "Products with the biggest changes in the last 7 days"

Table design:
- 4 columns: Product | Change | Change % | Trend
- Sorted by Change (descending)
- Change values: Colored (+green, -red, 0=gray)
- Trend column: Emoji + text
  * 📈 Increasing (green text)
  * 📉 Decreasing (red text)
  * ➡️ Stable (gray text)

Bottom metrics (2-column):
Left card:
- "🏆 Biggest Increase"
- Product name (18px, bold)
- Change % (24px, green, bold)

Right card:
- "⚠️ Biggest Decrease"
- Product name (18px, bold)
- Change % (24px, red, bold)

=== PAGE 4: ALERTS & NOTIFICATIONS ===

Header:
- Title: "🔔 Stock Alerts & Notifications"
- Subtitle: "Monitor critical stock levels and get actionable insights"

CRITICAL ALERTS SECTION:
Same alert cards as Page 1, but in expandable accordions:

Each alert as expandable row:
- Collapsed: "❌ Product Name" with expand arrow
- Expanded: Shows 3-column metrics:
  * Shelf Location
  * Price
  * Last Seen
- Button below: "🛒 Create Restock Order" (blue, rounded)

SETTINGS SECTION:
Title: "⚙️ Alert Settings"

2-column layout:
Left column:
- Checkbox: "📧 Email Alerts" (checked)
- Checkbox: "📱 SMS Alerts" (unchecked)
- Checkbox: "🔔 Push Notifications" (checked)

Right column:
- Number slider: "Low Stock Threshold (%)" - Value: 40
- Number input: "Critical Stock Threshold" - Value: 5

HISTORY SECTION:
Title: "📜 Recent Alert History"

Table:
- Columns: Time | Type | Product | Action
- Time: Gray, 13px
- Type: Colored pill (LOW STOCK=orange, OUT OF STOCK=red)
- Recent entries at top
- Alternating row colors

Export button below:
"📥 Download Alert Report" - Blue button, full width

=== PAGE 5: SMARTCART ASSISTANT ===

Header:
- Title: "SmartCart Assistant"
- Subtitle: "Paste a shopping list to get shelf locations and live stock signals"

INPUT SECTION:
Label: "Shopping List" (14px, bold)
Text area:
- Width: 100%
- Height: 200px
- Border: 1px solid #ddd
- Border radius: 8px
- Padding: 16px
- Placeholder text (gray):
  "Coca Cola
   Nutella Hazelnut Spread
   Barilla Spaghetti"

Button below:
"Find My Items" - Large blue button, full width, 56px height

RESULTS SECTION:
Title: "Shopping Route" (20px, bold)

Table:
- Columns: Product | Shelf Location | Available | Stock Level
- Stock Level: Colored pills
- Row padding: 20px
- Clean, spacious design
- Hover effect on rows

Error banner (if applicable):
"⛔ Out of stock: Product1, Product2"
- Red background
- Full width
- 16px padding
- Rounded corners

=== GENERAL UI ELEMENTS ===

Buttons:
Primary:
- Background: #3498db
- Text: White
- Hover: #2980b9
- Height: 44px
- Border radius: 8px

Secondary:
- Background: White
- Border: 2px solid #3498db
- Text: #3498db
- Hover: Fill with #3498db, text white

Input Fields:
- Border: 1px solid #ddd
- Border radius: 6px
- Padding: 12px
- Focus: Blue border (#3498db)
- Height: 44px

Dropdowns:
- Same as input fields
- Chevron icon on right
- Multi-select: Checkboxes inside

Cards:
- Background: White
- Border: 1px solid #e0e0e0
- Border radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Hover: Shadow 0 4px 12px rgba(0,0,0,0.12)

=== ICONS ===
Use modern, minimalist icons throughout:
- 📊 Charts
- 🚨 Alerts
- ⚡ Quick actions
- 📍 Location
- 💰 Money
- 📦 Box/package
- 🔔 Notifications
- 📈 Trending up
- 📉 Trending down
- ✅ Success
- ❌ Error
- ⚠️ Warning

Icon size: 20px for inline, 24px for standalone

=== SPACING & GRID ===
Base unit: 8px
- Small gap: 8px
- Medium gap: 16px
- Large gap: 24px
- Section gap: 32px
- Page padding: 32px all sides

Grid system:
- 12-column grid
- Gutter: 16px
- Max content width: 1400px

=== RESPONSIVE NOTES ===
Desktop (1920px): Show all columns, full charts
Tablet (768-1200px): 2-column metrics, stacked cards
Mobile (<768px): Single column, horizontal scroll tables

=== INTERACTIONS ===
- Smooth transitions: 200ms ease-in-out
- Hover states on all interactive elements
- Focus states with blue outline
- Loading states: Skeleton screens
- Empty states: Illustration + helpful text
- Error states: Red banner with retry button

Create this as a complete, production-ready design system with all 5 pages as separate frames in Figma.
```

---

## 📋 Quick Reference Summary

**Use this condensed prompt if character limit is an issue:**

```
Create a retail dashboard "OmniShelf AI" with 5 pages. Modern design, 1920x1080px.

Sidebar: 280px, dark navy (#2c3e50), white text, 5 nav items
Main: Light gray bg (#f8f9fa), max-width 1400px

Colors:
- Stock levels: Green (#2ecc71), Yellow (#f1c40f), Orange (#e67e22), Red (#e74c3c)
- Alerts: Light red/orange backgrounds with colored left borders

Pages:
1. Store Overview & Alerts: Alert cards grid (3-col), 4 metric cards, bar charts, filterable table, 3 action buttons
2. Store Dashboard: Clean inventory view, 4 metrics, chart, table
3. Analytics: 7-day line chart, multi-product trends, velocity table, top performers
4. Alerts & Notifications: Expandable alert cards, settings (checkboxes/sliders), history table
5. SmartCart: Text area input, "Find Items" button, results table with colored stock pills

Typography: Inter font, 28px titles, 14px body
Components: Rounded cards (12px), white backgrounds, subtle shadows, blue (#3498db) primary buttons
Charts: Line/bar charts with hover tooltips, colored by stock level
Tables: Striped rows, colored pills for stock status

Clean, professional, data-focused design.
```

---

This prompt provides complete specifications for recreating the OmniShelf AI dashboard in Figma!
