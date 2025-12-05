"""SQLAlchemy ORM models for OmniShelf AI."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Boolean, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class ProductDetection(Base):
    __tablename__ = "product_detections"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True, nullable=False)
    confidence = Column(Float, nullable=False)
    bbox_x1 = Column(Float, nullable=False)
    bbox_y1 = Column(Float, nullable=False)
    bbox_x2 = Column(Float, nullable=False)
    bbox_y2 = Column(Float, nullable=False)
    shelf_id = Column(String, index=True, nullable=True)
    session_id = Column(String, index=True, nullable=True)  # Unique ID per save click
    timestamp = Column(DateTime, default=func.now(), nullable=False)


class Planogram(Base):
    __tablename__ = "planogram"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, unique=True, nullable=False)
    shelf_id = Column(String, nullable=False)
    expected_stock = Column(Integer, nullable=False, default=0)


class StockSnapshot(Base):
    __tablename__ = "stock_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True, nullable=False)
    count = Column(Integer, nullable=False)
    shelf_id = Column(String, nullable=True)
    snapshot_time = Column(DateTime, default=func.now(), nullable=False, index=True)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True, nullable=False)
    alert_type = Column(String, nullable=False)  # "LOW_STOCK", "OUT_OF_STOCK"
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    resolved = Column(Boolean, default=False, nullable=False)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class UserAccount(Base):
    __tablename__ = "user_accounts"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
