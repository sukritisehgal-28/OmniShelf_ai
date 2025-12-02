-- Initialize database tables
CREATE TABLE IF NOT EXISTS product_detections (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    bbox_x1 DOUBLE PRECISION NOT NULL,
    bbox_y1 DOUBLE PRECISION NOT NULL,
    bbox_x2 DOUBLE PRECISION NOT NULL,
    bbox_y2 DOUBLE PRECISION NOT NULL,
    shelf_id VARCHAR(255),
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_name ON product_detections (product_name);
CREATE INDEX IF NOT EXISTS idx_shelf_id ON product_detections (shelf_id);

CREATE TABLE IF NOT EXISTS planogram (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) UNIQUE NOT NULL,
    shelf_id VARCHAR(255) NOT NULL,
    expected_stock INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stock_snapshots (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    count INTEGER NOT NULL,
    shelf_id VARCHAR(255),
    snapshot_time TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_snapshot_product ON stock_snapshots (product_name);
CREATE INDEX IF NOT EXISTS idx_snapshot_time ON stock_snapshots (snapshot_time);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_alert_product ON alerts (product_name);
CREATE INDEX IF NOT EXISTS idx_alert_resolved ON alerts (resolved);
