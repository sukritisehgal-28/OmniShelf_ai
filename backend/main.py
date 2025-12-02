"""FastAPI application exposing OmniShelf AI services."""
from __future__ import annotations

import sys
import shutil
import tempfile
from pathlib import Path
from typing import List, Optional

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend import crud, schemas
from backend.database import get_db

# Add parent directory to path to import product_mapping
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from product_mapping import get_grozi_code, get_display_name, get_price, get_category, PRODUCT_NAME_MAP
from yolo.utils import load_model, run_inference, yolo_result_to_detections

app = FastAPI(title="OmniShelf AI", version="1.0.0")

# Initialize YOLO model
MODEL_PATH = Path(__file__).resolve().parents[1] / "yolo" / "runs" / "detect" / "train" / "weights" / "best.pt"
try:
    yolo_model = load_model(MODEL_PATH)
except Exception as e:
    print(f"Warning: Could not load YOLO model from {MODEL_PATH}: {e}")
    yolo_model = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def determine_stock_level(count: int, expected: Optional[int] = None) -> str:
    if count <= 0:
        return "OUT"
    if expected and expected > 0:
        ratio = count / expected
        if ratio >= 0.75:
            return "HIGH"
        if ratio >= 0.4:
            return "MEDIUM"
        return "LOW"
    if count >= 15:
        return "HIGH"
    if count >= 6:
        return "MEDIUM"
    return "LOW"


@app.post("/detections/", response_model=List[schemas.DetectionRead])
def create_detections(
    detections: List[schemas.DetectionCreate], db: Session = Depends(get_db)
):
    created = crud.bulk_create_detections(db, detections)
    return created


@app.get("/stock/summary")
def stock_summary(db: Session = Depends(get_db)):
    stock_entries = crud.get_stock_counts(db)
    payload = []
    for entry in stock_entries:
        planogram = crud.get_planogram_entry(db, entry["product_name"])
        expected = planogram.expected_stock if planogram else None
        shelf_breakdown = entry.get("shelf_breakdown", {})
        primary_shelf = None
        if planogram:
            primary_shelf = planogram.shelf_id
        elif shelf_breakdown:
            primary_shelf = max(shelf_breakdown, key=shelf_breakdown.get)
        
        # Enrich with metadata
        grozi_code = entry["product_name"]
        payload.append(
            {
                "product_name": grozi_code,
                "display_name": get_display_name(grozi_code),
                "category": get_category(grozi_code),
                "price": get_price(grozi_code),
                "total_count": entry["total_count"],
                "last_seen": entry["last_seen"],
                "shelf_breakdown": shelf_breakdown,
                "stock_level": determine_stock_level(entry["total_count"], expected),
                "shelf_id": primary_shelf,
                "inventory_value": entry["total_count"] * get_price(grozi_code),
            }
        )
    return {"products": payload}


@app.get("/stock")
def get_stock_alias(db: Session = Depends(get_db)):
    """Alias for /stock/summary to match frontend expectations."""
    summary = stock_summary(db)
    return summary["products"]


@app.get("/products", response_model=List[schemas.ProductRead])
def get_products():
    """Get all products with metadata."""
    products = []
    for grozi_code in PRODUCT_NAME_MAP.keys():
        products.append({
            "product_name": grozi_code,
            "display_name": get_display_name(grozi_code),
            "category": get_category(grozi_code),
            "price": get_price(grozi_code)
        })
    return products


@app.get("/alerts", response_model=List[schemas.AlertRead])
def get_alerts(resolved: bool = False, db: Session = Depends(get_db)):
    return crud.get_alerts(db, resolved=resolved)


@app.post("/alerts", response_model=schemas.AlertRead)
def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    return crud.create_alert(db, alert)


@app.put("/alerts/{alert_id}/resolve", response_model=schemas.AlertRead)
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = crud.resolve_alert(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@app.get("/stock/{product_name}")
def get_stock(product_name: str, db: Session = Depends(get_db)):
    stock = crud.get_product_stock(db, product_name)
    if not stock:
        raise HTTPException(status_code=404, detail="Product not found")
    stock_level = determine_stock_level(stock["total_count"])
    return {**stock, "stock_level": stock_level}


@app.get("/stock/history", response_model=List[schemas.StockSnapshotRead])
def get_stock_history_raw(db: Session = Depends(get_db)):
    """Get raw stock snapshots for the frontend history view."""
    from backend.models import StockSnapshot
    # Return last 1000 snapshots to avoid overloading
    return db.query(StockSnapshot).order_by(StockSnapshot.snapshot_time.desc()).limit(1000).all()


@app.get("/shelf/{shelf_id}", response_model=schemas.ShelfSummary)
def shelf_summary(shelf_id: str, db: Session = Depends(get_db)):
    summary = crud.get_shelf_summary(db, shelf_id)
    products = []
    for product in summary["products"]:
        products.append(
            schemas.StockInfo(
                product_name=product["product_name"],
                total_count=product["total_count"],
                shelf_ids=product["shelf_ids"],
                last_seen=product["last_seen"],
            )
        )
    return schemas.ShelfSummary(shelf_id=shelf_id, products=products)


@app.post("/shopping-list", response_model=schemas.ShoppingListResponse)
def shopping_list(
    request: schemas.ShoppingListRequest, db: Session = Depends(get_db)
):
    response_items = []
    for raw_item in request.items:
        product_name = raw_item.strip()
        if not product_name:
            continue
        # Convert display name to grozi code if needed (for reverse lookup)
        grozi_code = get_grozi_code(product_name)

        planogram = crud.get_planogram_entry(db, grozi_code)
        stock = crud.get_product_stock(db, grozi_code)
        count = stock["total_count"] if stock else 0
        shelf_id: Optional[str] = None
        if planogram:
            shelf_id = planogram.shelf_id
        elif stock and stock["shelf_ids"]:
            shelf_id = stock["shelf_ids"][0]
        expected = planogram.expected_stock if planogram else None
        stock_level = determine_stock_level(count, expected)
        response_items.append(
            schemas.ShoppingListItem(
                product_name=grozi_code,  # Store grozi code for consistency
                shelf_id=shelf_id,
                stock_level=stock_level,
                count=count,
            )
        )
    return schemas.ShoppingListResponse(items=response_items)


@app.get("/analytics/stock-history")
def stock_history(days: int = 7, db: Session = Depends(get_db)):
    """Get stock history for the last N days."""
    from backend.models import StockSnapshot
    from datetime import datetime, timedelta
    from collections import defaultdict

    cutoff_date = datetime.now() - timedelta(days=days)

    snapshots = (
        db.query(StockSnapshot)
        .filter(StockSnapshot.snapshot_time >= cutoff_date)
        .order_by(StockSnapshot.snapshot_time)
        .all()
    )

    # Group by product and date
    history = defaultdict(lambda: defaultdict(int))
    for snapshot in snapshots:
        date_key = snapshot.snapshot_time.strftime("%Y-%m-%d")
        history[snapshot.product_name][date_key] = snapshot.count

    return {"history": dict(history)}


@app.get("/analytics")
def analytics_alias(days: int = 7, db: Session = Depends(get_db)):
    """Alias for /analytics/stock-history to match frontend expectations."""
    return stock_history(days, db)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    """Run inference on an uploaded image."""
    if not yolo_model:
        raise HTTPException(status_code=503, detail="YOLO model not available")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = Path(tmp.name)
        
    try:
        result = run_inference(tmp_path, yolo_model)
        detections = yolo_result_to_detections(result)
        return {"detections": detections}
    finally:
        if tmp_path.exists():
            tmp_path.unlink()


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8002, reload=True)
