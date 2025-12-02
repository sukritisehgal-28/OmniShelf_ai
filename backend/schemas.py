"""Pydantic schemas for FastAPI request/response bodies."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


class DetectionBase(BaseModel):
    product_name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    bbox_x1: float
    bbox_y1: float
    bbox_x2: float
    bbox_y2: float
    shelf_id: Optional[str] = None
    timestamp: Optional[datetime] = None


class DetectionCreate(DetectionBase):
    pass


class DetectionRead(DetectionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class PlanogramBase(BaseModel):
    product_name: str
    shelf_id: str
    expected_stock: int = Field(..., ge=0)


class PlanogramCreate(PlanogramBase):
    pass


class PlanogramRead(PlanogramBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class StockInfo(BaseModel):
    product_name: str
    total_count: int
    shelf_ids: List[str]
    last_seen: Optional[datetime]


class ShelfSummary(BaseModel):
    shelf_id: str
    products: List[StockInfo]


class ShoppingListRequest(BaseModel):
    items: List[str]


class ShoppingListItem(BaseModel):
    product_name: str
    shelf_id: Optional[str]
    stock_level: str
    count: int


class ShoppingListResponse(BaseModel):
    items: List[ShoppingListItem]


class AlertBase(BaseModel):
    product_name: str
    alert_type: str
    message: str
    resolved: bool = False


class AlertCreate(AlertBase):
    pass


class AlertRead(AlertBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductRead(BaseModel):
    product_name: str
    display_name: str
    category: str
    price: float


class StockSnapshotRead(BaseModel):
    id: int
    product_name: str
    count: int
    shelf_id: Optional[str]
    snapshot_time: datetime

    model_config = ConfigDict(from_attributes=True)
