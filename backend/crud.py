"""CRUD helpers for persistence layer."""
from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from typing import Any, Dict, Iterable, List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend import models
from backend.schemas import DetectionCreate, PlanogramCreate


def create_detection(db: Session, detection: DetectionCreate) -> models.ProductDetection:
    db_obj = models.ProductDetection(
        product_name=detection.product_name,
        confidence=detection.confidence,
        bbox_x1=detection.bbox_x1,
        bbox_y1=detection.bbox_y1,
        bbox_x2=detection.bbox_x2,
        bbox_y2=detection.bbox_y2,
        shelf_id=detection.shelf_id,
        timestamp=detection.timestamp or datetime.utcnow(),
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def bulk_create_detections(
    db: Session, detections: Iterable[DetectionCreate]
) -> List[models.ProductDetection]:
    db_objs: List[models.ProductDetection] = []
    for detection in detections:
        db_objs.append(
            models.ProductDetection(
                product_name=detection.product_name,
                confidence=detection.confidence,
                bbox_x1=detection.bbox_x1,
                bbox_y1=detection.bbox_y1,
                bbox_x2=detection.bbox_x2,
                bbox_y2=detection.bbox_y2,
                shelf_id=detection.shelf_id,
                timestamp=detection.timestamp or datetime.utcnow(),
            )
        )
    if not db_objs:
        return []
    db.add_all(db_objs)
    db.commit()
    for obj in db_objs:
        db.refresh(obj)
    return db_objs


def get_stock_counts(db: Session) -> List[Dict[str, Optional[str]]]:
    rows = (
        db.query(
            models.ProductDetection.product_name,
            func.count(models.ProductDetection.id).label("total_count"),
            func.max(models.ProductDetection.timestamp).label("last_seen"),
        )
        .group_by(models.ProductDetection.product_name)
        .all()
    )

    shelf_rows = (
        db.query(
            models.ProductDetection.product_name,
            models.ProductDetection.shelf_id,
            func.count(models.ProductDetection.id).label("count"),
        )
        .group_by(models.ProductDetection.product_name, models.ProductDetection.shelf_id)
        .all()
    )

    shelf_map: Dict[str, Dict[str, int]] = defaultdict(dict)
    for product_name, shelf_id, count in shelf_rows:
        if shelf_id is None:
            continue
        shelf_map[product_name][shelf_id] = count

    stock = []
    for product_name, total_count, last_seen in rows:
        stock.append(
            {
                "product_name": product_name,
                "total_count": total_count,
                "last_seen": last_seen,
                "shelf_breakdown": shelf_map.get(product_name, {}),
            }
        )
    return stock


def get_product_stock(db: Session, product_name: str) -> Optional[Dict[str, Any]]:
    rows = (
        db.query(models.ProductDetection)
        .filter(models.ProductDetection.product_name == product_name)
        .all()
    )
    if not rows:
        return None

    shelf_counts: Dict[str, int] = defaultdict(int)
    last_seen = None
    for row in rows:
        if row.shelf_id:
            shelf_counts[row.shelf_id] += 1
        if not last_seen or row.timestamp > last_seen:
            last_seen = row.timestamp
    return {
        "product_name": product_name,
        "total_count": len(rows),
        "shelf_ids": list(shelf_counts.keys()),
        "shelf_breakdown": shelf_counts,
        "last_seen": last_seen,
    }


def get_shelf_summary(db: Session, shelf_id: str) -> Dict[str, Any]:
    rows = (
        db.query(
            models.ProductDetection.product_name,
            func.count(models.ProductDetection.id).label("count"),
            func.max(models.ProductDetection.timestamp).label("last_seen"),
        )
        .filter(models.ProductDetection.shelf_id == shelf_id)
        .group_by(models.ProductDetection.product_name)
        .all()
    )
    products = [
        {
            "product_name": product_name,
            "total_count": count,
            "shelf_ids": [shelf_id],
            "last_seen": last_seen,
        }
        for product_name, count, last_seen in rows
    ]
    return {"shelf_id": shelf_id, "products": products}


def get_planogram_entry(db: Session, product_name: str) -> Optional[models.Planogram]:
    return (
        db.query(models.Planogram)
        .filter(models.Planogram.product_name == product_name)
        .first()
    )


def create_or_update_planogram(db: Session, planogram: PlanogramCreate) -> models.Planogram:
    existing = get_planogram_entry(db, planogram.product_name)
    if existing:
        existing.shelf_id = planogram.shelf_id
        existing.expected_stock = planogram.expected_stock
        db.commit()
        db.refresh(existing)
        return existing
    new_entry = models.Planogram(
        product_name=planogram.product_name,
        shelf_id=planogram.shelf_id,
        expected_stock=planogram.expected_stock,
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry


def create_alert(db: Session, alert: schemas.AlertCreate) -> models.Alert:
    db_obj = models.Alert(
        product_name=alert.product_name,
        alert_type=alert.alert_type,
        message=alert.message,
        resolved=alert.resolved,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_alerts(db: Session, resolved: bool = False) -> List[models.Alert]:
    return (
        db.query(models.Alert)
        .filter(models.Alert.resolved == resolved)
        .order_by(models.Alert.created_at.desc())
        .all()
    )


def resolve_alert(db: Session, alert_id: int) -> Optional[models.Alert]:
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if alert:
        alert.resolved = True
        db.commit()
        db.refresh(alert)
    return alert
