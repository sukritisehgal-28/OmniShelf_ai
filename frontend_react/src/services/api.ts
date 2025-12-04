// API Service Layer for OmniShelf AI Backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

// ============================================================================
// Type Definitions
// ============================================================================

export interface StockProduct {
  product_name: string;
  display_name: string;
  category: string;
  price: number;
  total_count: number;
  last_seen: string;
  shelf_breakdown: Record<string, number>;
  stock_level: "LOW" | "MEDIUM" | "HIGH";
  shelf_id: string;
  inventory_value: number;
}

export interface Detection {
  id: number;
  snapshot_id: number;
  class_id: number;
  class_name: string;
  confidence: number;
  bbox_x1: number;
  bbox_y1: number;
  bbox_x2: number;
  bbox_y2: number;
  shelf_id: string;
  created_at: string;
}

export interface Snapshot {
  id: number;
  filename: string;
  timestamp: string;
  camera_id: string;
  created_at: string;
}

export interface Alert {
  id: number;
  product_name: string;
  alert_type: string;
  severity: string;
  message: string;
  shelf_id: string;
  stock_count: number;
  threshold: number;
  created_at: string;
  resolved: boolean;
}

export interface AnalyticsData {
  total_products: number;
  total_stock_items: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_value: number;
  stock_by_category: Record<string, number>;
  stock_trend: Array<{ date: string; count: number }>;
}

// ============================================================================
// Model Metrics
// ============================================================================

export interface ModelMetrics {
  model_path: string;
  model_exists: boolean;
  model_loaded: boolean;
  weights_size_mb: number;
  metrics: Record<string, number>;
  real_shelf_proxy_mAP?: number;
  success_criteria_evaluation?: Record<string, unknown>;
  tech_stack?: string[];
  last_updated?: string | null;
  run_name?: string;
}

// ============================================================================
// Stock API Endpoints
// ============================================================================

export async function fetchStockSummary(): Promise<StockProduct[]> {
  const response = await fetch(`${API_BASE_URL}/stock/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock summary: ${response.statusText}`);
  }
  const data = await response.json();
  return (data?.products || []) as StockProduct[];
}

export async function fetchStockByShelf(shelfId: string): Promise<StockProduct[]> {
  const response = await fetch(`${API_BASE_URL}/stock/shelf/${shelfId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock for shelf ${shelfId}: ${response.statusText}`);
  }
  const data = await response.json();
  return (data?.products || []) as StockProduct[];
}

export async function fetchStockByProduct(productName: string): Promise<StockProduct | null> {
  const response = await fetch(`${API_BASE_URL}/stock/product/${productName}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch product ${productName}: ${response.statusText}`);
  }
  return (await response.json()) as StockProduct;
}

// ============================================================================
// Detection API Endpoints
// ============================================================================

export async function fetchDetections(limit: number = 100): Promise<Detection[]> {
  const response = await fetch(`${API_BASE_URL}/detections?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch detections: ${response.statusText}`);
  }
  const data = await response.json();
  return (data?.detections || []) as Detection[];
}

export async function fetchDetectionsByShelf(shelfId: string): Promise<Detection[]> {
  const response = await fetch(`${API_BASE_URL}/detections/shelf/${shelfId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch detections for shelf ${shelfId}: ${response.statusText}`);
  }
  const data = await response.json();
  return (data?.detections || []) as Detection[];
}

// ============================================================================
// Snapshot API Endpoints
// ============================================================================

export async function fetchSnapshots(limit: number = 50): Promise<Snapshot[]> {
  const response = await fetch(`${API_BASE_URL}/snapshots?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch snapshots: ${response.statusText}`);
  }
  const data = await response.json();
  return (data?.snapshots || []) as Snapshot[];
}

export async function fetchLatestSnapshot(): Promise<Snapshot | null> {
  const response = await fetch(`${API_BASE_URL}/snapshots/latest`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch latest snapshot: ${response.statusText}`);
  }
  return (await response.json()) as Snapshot;
}

// ============================================================================
// Alert API Endpoints
// ============================================================================

export async function fetchAlerts(resolved: boolean = false): Promise<Alert[]> {
  const response = await fetch(`${API_BASE_URL}/alerts?resolved=${resolved}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch alerts: ${response.statusText}`);
  }
  const data = await response.json();
  return (data?.alerts || []) as Alert[];
}

export async function resolveAlert(alertId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/resolve`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to resolve alert ${alertId}: ${response.statusText}`);
  }
}

// ============================================================================
// Analytics API Endpoints
// ============================================================================

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const response = await fetch(`${API_BASE_URL}/analytics/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics: ${response.statusText}`);
  }
  return (await response.json()) as AnalyticsData;
}

export async function fetchModelMetrics(): Promise<ModelMetrics> {
  const response = await fetch(`${API_BASE_URL}/model/metrics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch model metrics: ${response.statusText}`);
  }
  return (await response.json()) as ModelMetrics;
}

// ============================================================================
// SmartCart API Endpoints
// ============================================================================

export interface ShoppingListItem {
  item_name: string;
  quantity?: number;
}

export interface ShoppingListResult {
  item: string;
  found: boolean;
  product_name?: string;
  display_name?: string;
  shelf_id?: string;
  stock_count?: number;
  price?: number;
  category?: string;
}

export async function searchShoppingList(
  items: string[]
): Promise<ShoppingListResult[]> {
  const response = await fetch(`${API_BASE_URL}/smartcart/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) {
    throw new Error(`Failed to search shopping list: ${response.statusText}`);
  }
  const data = await response.json();
  return (data?.results || []) as ShoppingListResult[];
}

// ============================================================================
// Health Check
// ============================================================================

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return await response.json();
}
