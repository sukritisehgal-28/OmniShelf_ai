# OmniShelf AI - System Explanation & Enhancement Ideas

## 📊 Current System Architecture

### **1. Shelf Assignment Logic**
**Location:** `load_detections.py` (line 49)

```python
shelf_id=random.choice(shelves)  # Random assignment
```

**How it works:**
- **Shelves:** A1-A5, B1-B5, C1-C5 (15 locations total)
- **Assignment:** Currently RANDOM when loading detection data
- **Reality:** In a real system, this would come from:
  - YOLO bounding box Y-coordinate (vertical position in image)
  - Camera location metadata
  - Planogram database (predefined product locations)

### **2. Count Logic**
**Location:** `backend/crud.py` (line 116)

```python
"total_count": len(rows)  # Count all detections for this product
```

**How it works:**
- Each YOLO detection = 1 product instance
- System counts ALL detections in database for that product
- Example: If "Coca Cola" detected 13 times → count = 13

**Breakdown by shelf:**
```python
shelf_counts[row.shelf_id] += 1  # Count per shelf
# Result: {"A1": 3, "B1": 5, "C2": 5} = 13 total
```

### **3. Stock Level Logic**
**Location:** `backend/main.py` (line 30-44)

```python
def determine_stock_level(count: int, expected: Optional[int] = None) -> str:
    if count <= 0:
        return "OUT"

    # If we have expected stock from planogram
    if expected and expected > 0:
        ratio = count / expected
        if ratio >= 0.75:    # 75%+ = HIGH
            return "HIGH"
        if ratio >= 0.4:     # 40-75% = MEDIUM
            return "MEDIUM"
        return "LOW"         # < 40% = LOW

    # Fallback without planogram
    if count >= 15:
        return "HIGH"
    if count >= 6:
        return "MEDIUM"
    return "LOW"
```

**Example:**
- Product: Coca Cola
- Count: 13
- Expected: None (no planogram)
- Result: MEDIUM (count >= 6 but < 15)

---

## 🚀 Enhancement Ideas

### **🔥 High Priority Features**

#### **1. Real-time Camera Integration**
```
Why: Replace simulated data with live shelf monitoring
How:
- Connect IP cameras to shelves
- Run YOLO inference on camera feeds every 5 minutes
- Auto-update database with new detections
- Add camera_id field to track which camera saw what
```

**Implementation:**
- Create `camera_inference.py` to process live feeds
- Add background task in FastAPI to run inference periodically
- Store camera metadata (location, angle, shelf coverage)

#### **2. Smart Shelf Assignment from YOLO**
```
Why: Automatically determine shelf location from image position
How:
- Use bounding box Y-coordinate (vertical position)
- Top of image (y < 200) → Shelf A (top shelf)
- Middle (200 < y < 400) → Shelf B (middle)
- Bottom (y > 400) → Shelf C (bottom shelf)
```

**Code Example:**
```python
def assign_shelf_from_bbox(bbox_y1, bbox_y2, camera_location):
    center_y = (bbox_y1 + bbox_y2) / 2

    if center_y < 200:
        shelf_level = "A"  # Top shelf
    elif center_y < 400:
        shelf_level = "B"  # Middle shelf
    else:
        shelf_level = "C"  # Bottom shelf

    # Combine with camera aisle number
    shelf_id = f"{shelf_level}{camera_location['aisle']}"
    return shelf_id
```

#### **3. Planogram Management UI**
```
Why: Let store managers set expected stock levels
What to add:
- Planogram editor page in Streamlit
- Set expected stock for each product
- Define product placements on specific shelves
- Upload planogram images
```

**New Page:**
- `/planogram` - Drag-and-drop product placement
- Set min/max stock thresholds
- Configure alerts when stock is low

#### **4. Historical Analytics**
```
Why: Track stock changes over time
Features:
- Stock trend charts (last 7 days)
- Peak hours analysis
- Out-of-stock frequency
- Restock recommendations
```

**Database changes:**
```sql
CREATE TABLE stock_snapshots (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR,
    count INTEGER,
    shelf_id VARCHAR,
    snapshot_time TIMESTAMP
);
```

#### **5. Alert System**
```
Why: Notify managers when action needed
Triggers:
- Product goes OUT of stock
- Stock drops below 20% of expected
- Product detected in wrong shelf
- New product detected (not in database)
```

**Implementation:**
```python
# Email/SMS alerts
def check_and_alert(product, count, expected):
    if count == 0:
        send_alert(f"OUT OF STOCK: {product}")
    elif expected and (count / expected) < 0.2:
        send_alert(f"LOW STOCK: {product} only {count} left")
```

### **⭐ Medium Priority Features**

#### **6. Product Expiry Tracking**
- Use OCR to read expiry dates from packages
- Alert when products near expiration
- FIFO (First In First Out) recommendations

#### **7. Pricing Integration**
- Add price field to products
- Show total value of inventory
- Price comparison alerts
- Revenue per shelf analytics

#### **8. Customer Analytics**
- Track which products are frequently searched together
- Popular shopping lists
- Suggest product bundles
- Recommend alternatives for out-of-stock items

#### **9. Mobile App**
- Customer shopping assistant app
- Scan barcode → get shelf location
- AR navigation to products
- Digital shopping list sync

#### **10. Theft Detection**
- Compare stock before/after hours
- Alert on suspicious stock drops
- Integration with security cameras
- Highlight high-theft items

### **💡 Advanced Features**

#### **11. AI-Powered Restocking**
- Predict when products will run out
- Auto-generate purchase orders
- Optimize shelf space allocation
- Seasonal demand forecasting

#### **12. Multi-Store Dashboard**
- Compare stock across multiple locations
- Transfer inventory between stores
- Chain-wide analytics
- Central procurement

#### **13. Supplier Integration**
- Direct ordering from suppliers
- Delivery tracking
- Invoice management
- Auto-reorder on low stock

#### **14. Smart Promotions**
- Detect slow-moving products
- Suggest discounts/promotions
- Track promotion effectiveness
- A/B test shelf placements

---

## 🔧 Technical Improvements

### **Performance**
- Add Redis caching for stock queries
- Database indexing optimization
- Batch YOLO inference
- CDN for product images

### **Scalability**
- Microservices architecture
- Message queue (RabbitMQ/Kafka) for detections
- Horizontal scaling of API servers
- Time-series database for analytics

### **Security**
- User authentication (JWT tokens)
- Role-based access control (Manager/Staff/Customer)
- API rate limiting
- Audit logging

### **Monitoring**
- Prometheus + Grafana dashboards
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring

---

## 📈 Sample Metrics Dashboard

```
Store Performance (Last 24 Hours)
├── Total Products Monitored: 9
├── Average Stock Level: MEDIUM
├── Out of Stock Items: 0
├── Low Stock Alerts: 5
├── Detections Processed: 43
├── Camera Uptime: 99.8%
└── Customer Searches: 127

Top Products by Stock Count:
1. Coca Cola - 13 units (MEDIUM) 📊
2. Nutella - 12 units (MEDIUM) 🍫
3. Barilla Spaghetti - 9 units (MEDIUM) 🍝

Alerts Requiring Action:
⚠️ Pringles Original - Only 3 units left
⚠️ Philadelphia Cream Cheese - 2 units (restock soon)
```

---

## 🎯 Quick Wins (Can Implement Now)

1. **Add Planogram Data** - Create sample planogram entries
2. **Stock Trends Chart** - Show 7-day history
3. **Export to CSV** - Download inventory reports
4. **Search Function** - Find products quickly
5. **Barcode Scanner** - Add barcode to product mapping
6. **Low Stock Alerts** - Email notifications
7. **Category Tags** - Snacks, Beverages, Canned Goods
8. **Price Display** - Show product prices
9. **Image Thumbnails** - Display product photos
10. **Shelf Map** - Visual store layout

Let me know which features you'd like to implement first! 🚀
