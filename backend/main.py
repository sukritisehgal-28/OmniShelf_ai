"""FastAPI application exposing OmniShelf AI services."""
from __future__ import annotations

import sys
import csv
import json
import shutil
import tempfile
import hashlib
from pathlib import Path
from typing import List, Optional
from datetime import datetime

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend import crud, schemas
from backend.database import get_db, engine
from backend import models as db_models

# Add parent directory to path to import product_mapping
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from product_mapping import get_grozi_code, get_display_name, get_price, get_category, PRODUCT_NAME_MAP

try:
    from yolo.utils import load_model, run_inference, yolo_result_to_detections
    YOLO_AVAILABLE = True
except ImportError as e:  # pragma: no cover - only hit in minimal/container builds without yolo package
    print(f"Warning: YOLO utilities not available ({e}); /predict endpoint disabled.")
    YOLO_AVAILABLE = False
    load_model = run_inference = yolo_result_to_detections = None

# Try to load two-stage detector
try:
    from yolo.sku_grozi_detector import TwoStageShelfDetector
    TWO_STAGE_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Two-stage detector not available ({e})")
    TWO_STAGE_AVAILABLE = False
    TwoStageShelfDetector = None

# Create tables if they don't exist
db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="OmniShelf AI", version="1.0.0")

# Initialize YOLO model when utils are available
MODEL_PATH = Path(__file__).resolve().parents[1] / "yolo" / "runs" / "detect" / "train_colab" / "weights" / "best.pt"
if YOLO_AVAILABLE:
    try:
        yolo_model = load_model(MODEL_PATH)
    except Exception as e:
        print(f"Warning: Could not load YOLO model from {MODEL_PATH}: {e}")
        yolo_model = None
else:
    yolo_model = None

# Initialize two-stage detector
two_stage_detector = None
if TWO_STAGE_AVAILABLE:
    try:
        two_stage_detector = TwoStageShelfDetector()
        print("✅ Two-stage detector initialized!")
    except Exception as e:
        print(f"Warning: Could not initialize two-stage detector: {e}")
        two_stage_detector = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Password utilities (simple sha256 hashing for demo purposes)
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash


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


def load_model_metrics() -> dict:
    """Load evaluation metrics and model metadata for the UI."""
    metrics_path = Path(__file__).resolve().parents[1] / "yolo" / "evaluation_metrics_report.json"
    metrics: dict = {}
    if metrics_path.exists():
        try:
            metrics = json.loads(metrics_path.read_text())
        except Exception as exc:  # noqa: BLE001
            print(f"Warning: failed to read metrics file {metrics_path}: {exc}")
            metrics = {}

    weight_exists = MODEL_PATH.exists()
    weight_size_mb = round(MODEL_PATH.stat().st_size / 1e6, 2) if weight_exists else 0.0
    updated_at = datetime.fromtimestamp(metrics_path.stat().st_mtime).isoformat() if metrics_path.exists() else None

    return {
        "model_path": str(MODEL_PATH),
        "model_exists": weight_exists,
        "model_loaded": bool(yolo_model),
        "weights_size_mb": weight_size_mb,
        "metrics": metrics.get("validation_metrics", {}),
        "real_shelf_proxy_mAP": metrics.get("real_shelf_proxy_mAP"),
        "mAP_analysis": metrics.get("mAP_analysis", {}),
        "counting_analysis": metrics.get("counting_analysis", {}),
        "misclassification_analysis": metrics.get("misclassification_analysis", {}),
        "qualitative_analysis": metrics.get("qualitative_analysis", {}),
        "success_criteria_evaluation": metrics.get("success_criteria_evaluation", {}),
        "last_updated": updated_at,
        "run_name": "train_colab",
        "tech_stack": [
            "YOLOv11s",
            "FastAPI",
            "PostgreSQL",
            "React + TypeScript",
            "Streamlit",
            "Docker",
            "Colab T4 GPU",
        ],
    }


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


@app.post("/smartcart/search")
def smartcart_search(request: schemas.ShoppingListRequest, db: Session = Depends(get_db)):
    """
    SmartCart AI: User enters product names/keywords, model recognizes them
    and returns availability, aisle location, price, and stock level.
    """
    results = []

    for raw_item in request.items:
        item_name = raw_item.strip().lower()
        if not item_name:
            continue

        # Try to find matching product by display name
        grozi_code = get_grozi_code(item_name)

        # If not found directly, try fuzzy search in product names
        if grozi_code == item_name:  # No match found
            # Search through all product display names
            found = False
            for code, display in PRODUCT_NAME_MAP.items():
                if item_name in display.lower():
                    grozi_code = code
                    found = True
                    break

            if not found:
                # No product found
                results.append({
                    "item": raw_item,
                    "found": False,
                    "product_name": None,
                    "display_name": None,
                    "shelf_id": None,
                    "stock_count": 0,
                    "price": 0.0,
                    "category": None,
                    "stock_level": "OUT"
                })
                continue

        # Product found - get details
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

        results.append({
            "item": raw_item,
            "found": True,
            "product_name": grozi_code,
            "display_name": get_display_name(grozi_code),
            "shelf_id": shelf_id,
            "stock_count": count,
            "price": get_price(grozi_code),
            "category": get_category(grozi_code),
            "stock_level": stock_level
        })

    return {"results": results}


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


@app.get("/analytics/summary")
def analytics_summary(db: Session = Depends(get_db)):
    """Get analytics summary with aggregated metrics."""
    from collections import defaultdict

    stock_entries = crud.get_stock_counts(db)

    total_products = len(stock_entries)
    total_stock_items = sum(entry["total_count"] for entry in stock_entries)

    # Calculate stock levels
    stock_by_level = {"HIGH": 0, "MEDIUM": 0, "LOW": 0, "OUT": 0}
    stock_by_category = defaultdict(int)
    total_value = 0.0

    for entry in stock_entries:
        grozi_code = entry["product_name"]
        count = entry["total_count"]

        planogram = crud.get_planogram_entry(db, grozi_code)
        expected = planogram.expected_stock if planogram else None
        stock_level = determine_stock_level(count, expected)
        stock_by_level[stock_level] += 1

        category = get_category(grozi_code)
        stock_by_category[category] += count

        price = get_price(grozi_code)
        total_value += count * price

    # Get stock trend (simplified - last 7 days)
    from backend.models import StockSnapshot
    from datetime import datetime, timedelta

    cutoff_date = datetime.now() - timedelta(days=7)
    snapshots = (
        db.query(StockSnapshot)
        .filter(StockSnapshot.snapshot_time >= cutoff_date)
        .order_by(StockSnapshot.snapshot_time)
        .all()
    )

    daily_totals = defaultdict(int)
    for snapshot in snapshots:
        date_key = snapshot.snapshot_time.strftime("%Y-%m-%d")
        daily_totals[date_key] += snapshot.count

    stock_trend = [{"date": date, "count": count} for date, count in sorted(daily_totals.items())]

    return {
        "total_products": total_products,
        "total_stock_items": total_stock_items,
        "low_stock_count": stock_by_level["LOW"],
        "out_of_stock_count": stock_by_level["OUT"],
        "high_stock_count": stock_by_level["HIGH"],
        "medium_stock_count": stock_by_level["MEDIUM"],
        "total_value": round(total_value, 2),
        "stock_by_category": dict(stock_by_category),
        "stock_trend": stock_trend
    }


@app.get("/model/metrics")
def model_metrics():
    """Expose model evaluation metrics and load status for the frontend."""
    return load_model_metrics()


@app.post("/alerts/generate")
def generate_alerts(db: Session = Depends(get_db)):
    """Generate alerts for low stock and out of stock products."""
    stock_entries = crud.get_stock_counts(db)
    alerts_created = []

    for entry in stock_entries:
        grozi_code = entry["product_name"]
        count = entry["total_count"]
        display_name = get_display_name(grozi_code)

        # Check if alert already exists for this product
        existing_alert = db.query(db_models.Alert).filter(
            db_models.Alert.product_name == grozi_code,
            db_models.Alert.resolved == False
        ).first()

        if existing_alert:
            continue  # Don't create duplicate alerts

        alert_data = None
        if count == 0:
            alert_data = schemas.AlertCreate(
                product_name=grozi_code,
                alert_type="OUT_OF_STOCK",
                message=f"{display_name} is out of stock"
            )
        elif count <= 5:
            alert_data = schemas.AlertCreate(
                product_name=grozi_code,
                alert_type="LOW_STOCK",
                message=f"{display_name} is running low ({count} items remaining)"
            )

        if alert_data:
            alert = crud.create_alert(db, alert_data)
            alerts_created.append(alert)

    return {"alerts_generated": len(alerts_created), "alerts": alerts_created}


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": bool(yolo_model),
        "model_exists": MODEL_PATH.exists(),
        "model_path": str(MODEL_PATH),
    }


# Minimum confidence threshold for reliable detections
MIN_CONFIDENCE_THRESHOLD = 0.50  # 50% - filter out low-confidence guesses
# IoU threshold for Non-Maximum Suppression (lower = stricter, removes more overlaps)
NMS_IOU_THRESHOLD = 0.3  # 30% overlap threshold


@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    """Run inference on an uploaded image using single-stage Grozi model."""
    if not YOLO_AVAILABLE or not yolo_model:
        raise HTTPException(status_code=503, detail="YOLO model not available")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = Path(tmp.name)
        
    try:
        # Run inference with confidence threshold and class-agnostic NMS
        result = run_inference(
            tmp_path, 
            yolo_model, 
            conf=MIN_CONFIDENCE_THRESHOLD,
            iou=NMS_IOU_THRESHOLD,
            agnostic_nms=True  # Apply NMS across all classes to remove overlapping boxes
        )
        detections = yolo_result_to_detections(result)
        return {"detections": detections}
    finally:
        if tmp_path.exists():
            tmp_path.unlink()


@app.post("/predict/shelf")
async def predict_shelf_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Two-stage shelf detection:
    Stage 1: SKU-110K finds all products on shelf
    Stage 2: Grozi-120 identifies each product
    
    Also updates inventory in database.
    """
    if not two_stage_detector:
        raise HTTPException(status_code=503, detail="Two-stage detector not available")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = Path(tmp.name)
    
    try:
        # Run two-stage detection
        result = two_stage_detector.detect(str(tmp_path))
        
        # Update inventory based on detections
        product_counts = result.get("product_counts", {})
        detections_for_db = []
        
        for det in result.get("detections", []):
            if det.get("class_name") and det["class_name"] != "unknown":
                grozi_code = det["class_name"]
                bbox = det.get("bbox", {})
                
                detections_for_db.append(schemas.DetectionCreate(
                    product_name=grozi_code,
                    confidence=det.get("confidence", 0),
                    bbox_x1=bbox.get("x1", 0),
                    bbox_y1=bbox.get("y1", 0),
                    bbox_x2=bbox.get("x2", 0),
                    bbox_y2=bbox.get("y2", 0),
                    shelf_id="shelf_scan",
                ))
        
        # Bulk create detections
        if detections_for_db:
            crud.bulk_create_detections(db, detections_for_db)
        
        return {
            "total_products_found": result.get("total_products_found", 0),
            "products_identified": result.get("products_identified", 0),
            "product_counts": product_counts,
            "detections": result.get("detections", []),
            "image_size": result.get("image_size", {}),
        }
    finally:
        if tmp_path.exists():
            tmp_path.unlink()


@app.post("/predict/product")
async def predict_single_product(file: UploadFile = File(...)):
    """
    Visual Search: Customer uploads a product image, model identifies it.
    Uses only Grozi-120 (single product, not shelf).
    """
    if not YOLO_AVAILABLE or not yolo_model:
        raise HTTPException(status_code=503, detail="YOLO model not available")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = Path(tmp.name)
    
    try:
        # Run inference
        result = run_inference(
            tmp_path, 
            yolo_model, 
            conf=0.3,  # Lower threshold for single product
            iou=0.5
        )
        detections = yolo_result_to_detections(result)
        
        if not detections:
            return {
                "found": False,
                "message": "Could not identify the product. Try a clearer image.",
                "product": None
            }
        
        # Get best detection
        best = max(detections, key=lambda d: d.get("confidence", 0))
        grozi_code = best.get("class_name", "")
        
        return {
            "found": True,
            "product": {
                "product_name": grozi_code,
                "display_name": get_display_name(grozi_code),
                "category": get_category(grozi_code),
                "price": get_price(grozi_code),
                "confidence": best.get("confidence", 0),
            }
        }
    finally:
        if tmp_path.exists():
            tmp_path.unlink()


@app.post("/admin/detect-from-csv")
async def detect_from_csv(file: UploadFile = File(...)):
    """
    Admin-only endpoint: Upload a CSV with a column 'image_path' (local paths).
    Runs YOLO inference on each image and returns aggregate metrics.
    """
    if not YOLO_AVAILABLE or not yolo_model:
        raise HTTPException(status_code=503, detail="YOLO model not available")

    temp_dir = Path(tempfile.mkdtemp())
    processed = 0
    per_product = {}

    try:
        csv_path = temp_dir / file.filename
        content = await file.read()
        csv_path.write_bytes(content)

        with csv_path.open() as f:
            reader = csv.DictReader(f)
            if "image_path" not in reader.fieldnames:
                raise HTTPException(status_code=400, detail="CSV must contain 'image_path' column")

            for row in reader:
                img_path = Path(row["image_path"]).expanduser()
                if not img_path.exists():
                    continue
                try:
                    result = run_inference(img_path, yolo_model)
                    detections = yolo_result_to_detections(result)
                    for det in detections:
                        name = det.get("product_name") or det.get("class_name")
                        if not name:
                            continue
                        per_product[name] = per_product.get(name, 0) + 1
                    processed += 1
                except Exception:
                    continue

        summary = []
        for product, count in per_product.items():
            summary.append(
                {
                    "product_name": product,
                    "display_name": get_display_name(product),
                    "count": count,
                    "stock_level": determine_stock_level(count),
                }
            )

        return {
            "files_processed": processed,
            "products": summary,
            "totals": {
                "high": len([p for p in summary if p["stock_level"] == "HIGH"]),
                "medium": len([p for p in summary if p["stock_level"] == "MEDIUM"]),
                "low": len([p for p in summary if p["stock_level"] == "LOW"]),
                "out": len([p for p in summary if p["stock_level"] == "OUT"]),
            },
        }
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


@app.post("/auth/admin/signup")
def admin_signup(request: schemas.SignupRequest, db: Session = Depends(get_db)):
    existing = crud.get_admin_by_email(db, request.email)
    if existing:
        raise HTTPException(status_code=400, detail="Admin already exists")
    admin = crud.create_admin_user(db, request.email, hash_password(request.password))
    return schemas.AuthResponse(email=admin.email, role="admin", token=f"admin-{admin.email}")


@app.post("/auth/admin/login")
def admin_login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    admin = crud.get_admin_by_email(db, request.email)
    if not admin or not verify_password(request.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return schemas.AuthResponse(email=admin.email, role="admin", token=f"admin-{admin.email}")


@app.post("/auth/user/signup")
def user_signup(request: schemas.SignupRequest, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, request.email)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    user = crud.create_user_account(db, request.email, hash_password(request.password))
    return schemas.AuthResponse(email=user.email, role="user", token=f"user-{user.email}")


@app.post("/auth/user/login")
def user_login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, request.email)
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return schemas.AuthResponse(email=user.email, role="user", token=f"user-{user.email}")


@app.on_event("startup")
def seed_mock_users():
    """Seed mock admin and user accounts for quick login."""
    from backend.database import SessionLocal
    db = SessionLocal()
    try:
        admin_mocks = [
            ("admin1@example.com", "adminpass1"),
            ("admin2@example.com", "adminpass2"),
            ("admin3@example.com", "adminpass3"),
        ]
        for email, pwd in admin_mocks:
            if not crud.get_admin_by_email(db, email):
                crud.create_admin_user(db, email, hash_password(pwd))

        user_mocks = [
            ("user1@example.com", "userpass1"),
            ("user2@example.com", "userpass2"),
            ("user3@example.com", "userpass3"),
        ]
        for email, pwd in user_mocks:
            if not crud.get_user_by_email(db, email):
                crud.create_user_account(db, email, hash_password(pwd))
    finally:
        db.close()


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8002, reload=True)
