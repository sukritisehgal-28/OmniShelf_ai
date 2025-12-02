# Complete Figma AI Prompt - OmniShelf AI (Landing Page + Dashboards)

## 🎨 Full Application Design Prompt

```
Design a complete modern retail intelligence web application called "OmniShelf AI" with 6 total pages:
1. Landing/Login Page (NEW)
2. Store Overview & Alerts (Admin)
3. Store Dashboard (Admin)
4. Analytics Dashboard (Admin)
5. Alerts & Notifications (Admin)
6. SmartCart Assistant (Public/Shopper)

Use a clean, professional design with emphasis on data visualization and role-based access.

==================================================
GLOBAL DESIGN SYSTEM
==================================================

TYPOGRAPHY:
- Font family: Inter or similar modern sans-serif
- Hero headline: 40-48px, bold, #1f2933
- Page titles: 28px, bold, #2c3e50
- Section headers: 20px, semi-bold, #2c3e50
- Body text: 14px, regular, #6b7280
- Captions: 12px, regular, #888
- Metric values: 36px, bold, primary color

COLOR PALETTE:
Primary Colors:
- Primary Blue: #3498db
- Dark Navy: #2c3e50
- Dark Text: #1f2933
- Body Gray: #6b7280
- Light Gray: #ecf0f1

Stock Level Colors:
- HIGH: #2ecc71 (green)
- MEDIUM: #f1c40f (yellow-gold)
- LOW: #e67e22 (orange)
- OUT: #e74c3c (red)

Accent Colors:
- Success: #10b981 (green)
- Warning: #f59e0b (amber)
- Danger: #ef4444 (red)

Alert Backgrounds:
- Critical: #ffe6e6 with #e74c3c left border
- Warning: #fff4e6 with #e67e22 left border
- Success: #d4edda with #2ecc71 left border

Neutrals:
- Border: #e5e7eb
- Background: #f8f9fa
- White: #ffffff

COMPONENT STANDARDS:
- Border radius (small): 8px
- Border radius (medium): 12px
- Border radius (large): 20px
- Card shadow: 0 2px 8px rgba(0,0,0,0.08)
- Card hover shadow: 0 4px 12px rgba(0,0,0,0.12)
- Button height: 44px
- Input height: 44px

==================================================
PAGE 0: LANDING / LOGIN PAGE (NEW)
==================================================

Frame: 1920x1080px desktop, 12-column grid layout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: TOP NAVIGATION BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Height: 72px
Background: White
Border bottom: 1px solid #e5e7eb

Left side:
- Logo icon + "OmniShelf AI" text (20px, bold, #1f2933)
- Icon: Simple shelf/box icon in blue (#3498db)

Right side (horizontal navigation):
- Text links: "Features" | "How it Works" | "Contact" (14px, gray, 32px spacing)
- Primary button: "Admin Login" (blue background, white text, rounded)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: HERO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: Subtle gradient (white to very light blue #f0f9ff)
Padding: 80px vertical, centered content

Left side (50% width):
Main headline (48px, bold, #1f2933):
"OmniShelf AI: Intelligent Shelf Monitoring for Modern Retail"

Subheadline (18px, medium, #6b7280):
"Track stock levels, detect gaps, and guide shoppers in real time with computer vision–powered shelf analytics."

CTA Buttons (horizontal, 16px gap):
Button 1: "Login as Admin" (primary blue, 48px height, rounded)
Button 2: "Try SmartCart as Shopper" (outline blue, 48px height, rounded)

Trust text below buttons (12px, gray):
"Built for grocery, convenience, and retail stores."

Right side (50% width):
Dashboard preview mockup illustration:
- Card showing shelf image thumbnail (grocery products)
- Mini bar chart with colored bars (green/yellow/red)
- Small "Low stock" and "Out of stock" tags visible
- Subtle screenshot-style border and shadow
- Make it feel like a peek at the internal dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: FEATURE HIGHLIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: White
Padding: 80px vertical

Section title (centered, 32px, bold):
"Why OmniShelf AI?"

3-column grid (equal width, 24px gap):

Card 1:
Icon: 📊 (large, 48px)
Title: "Real-Time Shelf Analytics" (18px, semi-bold)
Description: "Monitor stock levels across shelves with live, vision-powered updates."
Card style: White background, border radius 16px, shadow, 32px padding

Card 2:
Icon: 🔔
Title: "Smart Alerts for Store Teams"
Description: "Automatic notifications for low and out-of-stock products so you never miss a refill."

Card 3:
Icon: 🛒
Title: "Guided Shopping Experience"
Description: "SmartCart Assistant helps shoppers find items, check availability, and plan their route."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: ROLE-BASED LOGIN (KEY SECTION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: Light gray (#f8f9fa)
Padding: 100px vertical

Section title (centered, 32px, bold):
"Log in to OmniShelf AI"

Subtitle (centered, 16px, gray):
"Choose your portal to continue."

Two large cards side-by-side (48% width each, 4% gap):

━━━ CARD A: ADMIN PORTAL ━━━
Background: White
Border: 1px solid #e5e7eb
Border radius: 20px
Padding: 40px
Shadow: 0 10px 30px rgba(0,0,0,0.08)
Hover: Lift effect + blue border (#3498db)

Header:
- Small label: "FOR STORE MANAGERS & STAFF" (10px, uppercase, gray, letter-spacing 1px)
- Icon: 🧑‍💼 (large, 40px)
- Title: "Admin Portal" (24px, bold, dark)

Description (15px, gray, 120px line-height):
"Access full store dashboards: shelf analytics, alerts, trends, and inventory insights."

Login Form:
Input 1: "Work Email"
- Border: 1px solid #e5e7eb
- Border radius: 8px
- Height: 48px
- Padding: 12px
- Focus: Blue border

Input 2: "Password"
- Same style as email

Checkbox: "☐ Remember me" (small, gray)

Button: "Sign in as Admin"
- Background: #3498db
- Text: White, bold
- Height: 48px
- Border radius: 8px
- Full width
- Hover: Darker blue #2980b9

Helper text below button (12px, gray):
"Forgot password?" (link, blue)

Access Preview (small section at bottom):
Text: "After login, you'll see:" (12px, gray)
Horizontal pill list:
- "Store Overview" | "Analytics" | "Alerts" | "SmartCart"
- Each as small rounded pill (gray background, dark text, 8px padding)

━━━ CARD B: SHOPPER PORTAL ━━━
Same card styling as Admin

Header:
- Small label: "FOR SHOPPERS & CUSTOMERS"
- Icon: 🛒 (large, 40px)
- Title: "SmartCart Assistant" (24px, bold, dark)

Description (15px, gray):
"Paste your shopping list and get shelf locations, availability, and a guided route through the store."

Entry UX (simpler - no strict login):
Text (14px, gray):
"No account needed. Start using SmartCart to plan your shopping."

Large Button: "Continue to SmartCart"
- Background: #10b981 (green)
- Text: White, bold
- Height: 56px (larger than admin button)
- Border radius: 8px
- Full width

Optional email field (lighter emphasis):
Input: "Email (optional for saving lists)"
- Same input style but lighter border
- Below main button OR above

Helper text (12px, gray):
"You won't see internal store dashboards. This experience is limited to SmartCart Assistant only."

Access badge:
Small pill: "Limited Access" (gray background, subtle border)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: White
Padding: 80px vertical

Section title (centered, 32px, bold):
"How OmniShelf AI Works"

3-step horizontal timeline:
Each step connected with dotted line

Step 1:
Number badge: "1" (circle, 48px, blue background, white text)
Title: "Scan & Detect" (18px, semi-bold)
Text: "Shelf images are captured and processed to detect products and stock levels."
Icon: 📷

Step 2:
Number badge: "2"
Title: "Analyze & Alert"
Text: "The system flags low or missing items for store teams with real-time alerts."
Icon: 🔔

Step 3:
Number badge: "3"
Title: "Guide Shoppers"
Text: "SmartCart Assistant uses the latest shelf data to help shoppers find what they need."
Icon: 🛒

Visual flow: Use subtle arrows or connecting lines between steps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: FOOTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Height: 200px
Background: #2c3e50 (dark navy)
Text: White

Left side:
- OmniShelf AI logo (white version)
- Copyright text (12px, gray)

Right side:
- Links: "Privacy" | "Terms" | "Support" (14px, white, underline on hover)

==================================================
ADMIN DASHBOARD PAGES (Pages 1-4)
==================================================

SHARED LAYOUT FOR ALL ADMIN PAGES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Left Sidebar: 280px width, dark navy (#2c3e50), fixed, full height

Sidebar components:
1. Logo at top: "OmniShelf AI" (24px, white, bold)
2. User section: Small avatar + "Admin" label
3. Navigation menu (5 items):
   - "Store Overview & Alerts"
   - "Store Dashboard"
   - "Analytics Dashboard"
   - "Alerts & Notifications"
   - "SmartCart Assistant"

Menu item style:
- Inactive: White text, 14px, 16px padding, 8px margin
- Active: Blue background (#3498db), bold, rounded corners
- Hover: Light blue background (#34495e)

Main content area: 1640px width
- Background: #f8f9fa (light gray)
- Padding: 32px
- Max content width: 1400px centered

Top bar in main area:
- Breadcrumbs (if applicable)
- User profile + logout on right

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 1: STORE OVERVIEW & ALERTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header:
- Title: "📊 Store Overview & Alerts" (28px, bold)
- Subtitle: "Real-time shelf analytics and critical stock notifications"

SECTION 1 - Critical Alerts (if applicable):
Red banner: "⛔ 3 product(s) OUT OF STOCK - Immediate action required!"
- Background: #ffe6e6
- Text: #e74c3c
- Full width, 12px padding, rounded

Alert Cards Grid (3 columns, 16px gap):
Each OUT OF STOCK card:
- Background: #ffe6e6
- Left border: 4px solid #e74c3c
- Border radius: 8px
- Padding: 16px
- Content:
  * "❌ Product Name" (16px, bold)
  * "📍 Shelf: A1"
  * "💰 Price: $5.99"
  * "OUT OF STOCK" (bold, red)

Yellow banner: "⚠️ 5 product(s) with LOW stock - Restock soon!"
- Background: #fff4e6
- Text: #e67e22

LOW STOCK cards (same 3-column grid):
- Background: #fff4e6
- Left border: 4px solid #e67e22
- Content:
  * "⚠️ Product Name"
  * "📍 Shelf: B4"
  * "📦 Stock: 3 units"
  * "💰 Price: $2.99"

If no alerts:
Green success message: "✅ All products are well-stocked!"

Divider line

SECTION 2 - Store Performance Metrics:
Title: "📈 Store Performance"

4-column grid (equal width, 16px gap):

Metric Card 1:
- Label: "Total Products" (12px, uppercase, gray)
- Value: "9" (36px, bold, dark)
- Background: White
- Border radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 24px

Metric Card 2:
- Label: "Total Inventory Value"
- Value: "$255.91"

Metric Card 3:
- Label: "Low Stock Items"
- Value: "5"
- Delta: "-5" (red, with down arrow)

Metric Card 4:
- Label: "Out of Stock"
- Value: "0"

SECTION 3 - Stock Visualization:
Title: "📊 Per-Product Stock Counts"

Vertical bar chart:
- Height: 320px
- Full width
- Bars: Blue gradient (#3498db)
- X-axis: Product names (rotated 45°)
- Y-axis: Count (0-15)
- Grid lines: Light gray dotted
- Hover tooltips

SECTION 4 - Category Breakdown:
Title: "🏷️ Inventory by Category"

2-column layout (equal width, 16px gap):
Left: "Count by Category" bar chart
Right: "Value by Category" bar chart
Both horizontal bars, colored by category

SECTION 5 - Detailed Inventory Table:
Title: "📋 Detailed Inventory Table"

Filters (2-column above table):
- Filter by Category (multi-select dropdown)
- Filter by Stock Level (multi-select dropdown)

Table:
- Full width
- Header: Dark background (#2c3e50), white text, bold
- Columns: Product | Category | Shelf | Count | Price | Value | Stock Level
- Alternating row colors: White / #fafafa
- Stock Level column: Colored pills
  * HIGH: Green background
  * MEDIUM: Yellow background
  * LOW: Orange background
  * OUT: Red background
- Hover state: #f0f0f0
- Border: 1px solid #e0e0e0
- Border radius: 8px

Legend below: "🟢 HIGH | 🟡 MEDIUM | 🟠 LOW | 🔴 OUT"

SECTION 6 - Quick Actions:
Title: "⚡ Quick Actions"

3-column grid (equal width, 16px gap):
Button 1: "📥 Export Inventory Report (CSV)"
- Outline style, blue border
- Hover: Filled blue

Button 2: "🔔 Generate Restock Orders"
- Outline style, orange border

Button 3: "📊 View Analytics"
- Outline style, gray border

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 2: STORE DASHBOARD (SIMPLIFIED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header:
- Title: "Store Dashboard"
- Subtitle: "Real-time shelf analytics powered by OmniShelf AI"

Same 4 metric cards as Page 1

Full-width bar chart:
- Title: "Per-product Stock Counts"
- Same style as Page 1

Full-width table:
- Title: "Shelf Inventory Table"
- Same design as Page 1
- No filters (show all products)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 3: ANALYTICS DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header:
- Title: "📊 Analytics Dashboard"
- Subtitle: "Stock trends and insights over time"

SECTION 1 - Overall Trends:
Title: "📈 Stock Trends (Last 7 Days)"

Line chart:
- Full width
- Height: 300px
- X-axis: Dates (Nov 24-29)
- Y-axis: Total count
- Line: Blue (#3498db), 2px thickness
- Area fill: Light blue gradient
- Grid: Dotted gray
- Points: 6px circles on data
- Hover tooltips with exact values

SECTION 2 - Product-Level Trends:
Title: "📦 Product-Level Trends"

Multi-select dropdown: "Select products to view"
- Shows checkboxes
- Default: 3 products selected

Multi-line chart:
- Full width, 300px height
- Each product = different colored line:
  * Coca Cola: Blue
  * Nutella: Orange
  * Spaghetti: Green
- Legend top right
- Interactive hover tooltips

Expandable section: "📋 View Detailed Data"
- Collapsed by default
- Chevron icon on right
- Expands to show data table

SECTION 3 - Stock Velocity:
Title: "⚡ Stock Velocity"
Subtitle: "Products with the biggest changes in the last 7 days"

Table (4 columns):
- Product | Change | Change % | Trend
- Sorted by Change descending
- Change values colored: +green, -red, 0=gray
- Trend column:
  * "📈 Increasing" (green text)
  * "📉 Decreasing" (red text)
  * "➡️ Stable" (gray text)

Bottom metrics (2-column):
Left card:
- Title: "🏆 Biggest Increase"
- Product name (18px, bold)
- Change % (24px, green, bold)

Right card:
- Title: "⚠️ Biggest Decrease"
- Product name (18px, bold)
- Change % (24px, red, bold)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE 4: ALERTS & NOTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header:
- Title: "🔔 Stock Alerts & Notifications"
- Subtitle: "Monitor critical stock levels and get actionable insights"

SECTION 1 - Critical Alerts:
Title: "🚨 Critical Alerts"

Expandable alert rows:
Each OUT OF STOCK item as expandable accordion:
- Collapsed: "❌ Product Name" with chevron
- Background: #ffe6e6
- Expanded shows:
  * 3-column metrics: Shelf Location | Price | Last Seen
  * Button: "🛒 Create Restock Order" (blue, rounded)

Each LOW STOCK item:
- Collapsed: "⚠️ Product Name (X units left)"
- Background: #fff4e6
- Expanded shows same 3-column metrics

SECTION 2 - Alert Settings:
Title: "⚙️ Alert Settings"

2-column layout:
Left column:
- "☑ 📧 Email Alerts" (toggle switch, ON)
- "☐ 📱 SMS Alerts" (toggle switch, OFF)
- "☑ 🔔 Push Notifications" (toggle switch, ON)

Right column:
- "Low Stock Threshold (%)" - Slider, value: 40
- "Critical Stock Threshold" - Number input, value: 5

SECTION 3 - Alert History:
Title: "📜 Recent Alert History"

Table:
- Columns: Time | Type | Product | Action
- Type shown as colored pills:
  * "LOW STOCK" (orange)
  * "OUT OF STOCK" (red)
- Alternating row colors
- Recent entries at top

Export button below:
"📥 Download Alert Report" - Blue button, full width

==================================================
PAGE 5: SMARTCART ASSISTANT (PUBLIC)
==================================================

NO SIDEBAR - Full width layout
Background: White

Top nav bar (same as landing page):
- OmniShelf AI logo
- "Back to Main" link on right

Header (centered):
- Title: "SmartCart Assistant"
- Subtitle: "Paste a shopping list to get shelf locations and live stock signals"

SECTION 1 - Input:
Label: "Shopping List" (14px, bold)

Text area:
- Width: 100% (max 800px centered)
- Height: 200px
- Border: 1px solid #ddd
- Border radius: 8px
- Padding: 16px
- Placeholder text (gray):
  "Coca Cola
   Nutella Hazelnut Spread
   Barilla Spaghetti"

Button below:
"Find My Items"
- Background: #10b981 (green)
- Text: White, bold
- Height: 56px
- Full width (max 800px)
- Border radius: 8px

SECTION 2 - Results:
Title: "Shopping Route" (20px, bold)

Table:
- Columns: Product | Shelf Location | Available | Stock Level
- Full width (max 1000px centered)
- Stock Level: Colored pills (green/yellow/orange/red)
- Clean, spacious design
- Row padding: 20px
- Hover effect

Error banner (if items out of stock):
"⛔ Out of stock: Product1, Product2"
- Red background (#ffe6e6)
- Full width
- 16px padding
- Border radius: 8px

==================================================
RESPONSIVE BEHAVIOR
==================================================

Desktop (1920px):
- Show all columns
- Full charts and tables
- 2-column login cards side-by-side

Tablet (768-1200px):
- 2-column metric cards
- Stacked login cards
- Horizontal scroll tables

Mobile (<768px):
- Single column everything
- Stacked metric cards
- Full-width buttons
- Horizontal scroll tables

==================================================
INTERACTIONS & STATES
==================================================

All transitions: 200ms ease-in-out

Hover states:
- Cards: Lift + stronger shadow
- Buttons: Darken background
- Table rows: Light gray background

Focus states:
- Blue outline (#3498db)
- 2px offset

Loading states:
- Skeleton screens (gray animated pulse)

Empty states:
- Illustration + helpful text
- "No data available" message

Error states:
- Red banner with retry button

==================================================
FINAL NOTES
==================================================

Create 6 separate frames in Figma:
1. Landing/Login Page (public)
2. Store Overview & Alerts (admin)
3. Store Dashboard (admin)
4. Analytics Dashboard (admin)
5. Alerts & Notifications (admin)
6. SmartCart Assistant (public)

Show clear visual distinction between:
- Admin pages (with dark sidebar)
- Public pages (no sidebar, simpler nav)

This is a production-ready design for OmniShelf AI with role-based access control.
```
