// API Service Layer for OmniShelf AI Backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";

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
  stock_level: "LOW" | "MEDIUM" | "HIGH" | "OUT";
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

export interface AuthResponse {
  token: string;
  role: "admin" | "user";
  email: string;
}

export interface CsvDetectionSummary {
  files_processed: number;
  products: {
    product_name: string;
    display_name: string;
    count: number;
    stock_level: string;
  }[];
  totals: {
    high: number;
    medium: number;
    low: number;
    out: number;
  };
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
  qualitative_analysis?: {
    robustness_score_percent?: number;
    [key: string]: any;
  };
  success_criteria_evaluation?: Record<string, unknown>;
  tech_stack?: string[];
  last_updated?: string | null;
  run_name?: string;
}

// ============================================================================
// Auth API Endpoints
// ============================================================================

export async function adminLogin(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Admin login failed");
  return await response.json();
}

export async function adminSignup(email: string, password: string): Promise<AuthResponse> {
  console.log("Signup not implemented", email, password);
  throw new Error("Admin signup not implemented");
}

export async function userLogin(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("User login failed");
  return await response.json();
}

export async function userSignup(email: string, password: string): Promise<AuthResponse> {
  console.log("Signup not implemented", email, password);
  throw new Error("User signup not implemented");
}

// ============================================================================
// Admin API Endpoints
// ============================================================================

export interface ImageDetectionResult {
  detections: {
    product_name: string;
    confidence: number;
    bbox: number[];
  }[];
}

export async function detectFromImage(file: File): Promise<ImageDetectionResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Image detection failed: ${response.statusText}`);
  }
  return await response.json();
}

export async function detectFromCsv(file: File): Promise<CsvDetectionSummary> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/admin/detect-from-csv`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`CSV detection failed: ${response.statusText}`);
  }
  return await response.json();
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
  // Backend uses /shelf/{shelfId} which returns ShelfSummary format
  const response = await fetch(`${API_BASE_URL}/shelf/${shelfId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock for shelf ${shelfId}: ${response.statusText}`);
  }
  const data = await response.json();
  // Transform ShelfSummary.products to StockProduct format
  return (data?.products || []).map((p: any) => ({
    product_name: p.product_name,
    display_name: p.product_name,
    category: "Unknown",
    price: 0,
    total_count: p.total_count,
    last_seen: p.last_seen,
    shelf_breakdown: {},
    stock_level: p.total_count > 10 ? "HIGH" : p.total_count > 5 ? "MEDIUM" : "LOW",
    shelf_id: shelfId,
    inventory_value: 0,
  })) as StockProduct[];
}

export async function fetchStockByProduct(productName: string): Promise<StockProduct | null> {
  // Backend uses /stock/{product_name} which returns stock info directly
  const response = await fetch(`${API_BASE_URL}/stock/${encodeURIComponent(productName)}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch product ${productName}: ${response.statusText}`);
  }
  const data = await response.json();
  // Transform to StockProduct format
  return {
    product_name: data.product_name || productName,
    display_name: data.product_name || productName,
    category: "Unknown",
    price: 0,
    total_count: data.total_count || 0,
    last_seen: data.last_seen || "",
    shelf_breakdown: {},
    stock_level: data.stock_level || "LOW",
    shelf_id: data.shelf_ids?.[0] || "",
    inventory_value: 0,
  } as StockProduct;
}

// ============================================================================
// Recent Uploads API
// ============================================================================

export interface RecentUploadProduct {
  grozi_code: string;
  display_name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface RecentUploadSession {
  id: number;
  timestamp: string;
  date: string;
  time: string;
  products: RecentUploadProduct[];
  total_items: number;
  total_value: number;
  shelf_id: string;
}

export interface RecentUploadsResponse {
  sessions: RecentUploadSession[];
  total_sessions: number;
}

export async function fetchRecentUploads(): Promise<RecentUploadsResponse> {
  const response = await fetch(`${API_BASE_URL}/inventory/recent-uploads`);
  if (!response.ok) {
    throw new Error(`Failed to fetch recent uploads: ${response.statusText}`);
  }
  return (await response.json()) as RecentUploadsResponse;
}

// ============================================================================
// Detection API Endpoints
// ============================================================================

export async function fetchDetections(_limit: number = 100): Promise<Detection[]> {
  // Note: Backend only has POST /detections/ for creating, not GET for listing
  // Return empty array for now - detections are stored but not queryable via GET
  console.warn("fetchDetections: Backend does not expose GET /detections - returning empty array");
  return [];
}

export async function fetchDetectionsByShelf(shelfId: string): Promise<Detection[]> {
  // Note: Backend does not have GET /detections/shelf/{shelfId} endpoint
  console.warn(`fetchDetectionsByShelf: Backend does not expose this endpoint - returning empty array for shelf ${shelfId}`);
  return [];
}

// ============================================================================
// Snapshot API Endpoints
// ============================================================================

export async function fetchSnapshots(_limit: number = 50): Promise<Snapshot[]> {
  // Note: Backend does not have GET /snapshots endpoint
  console.warn("fetchSnapshots: Backend does not expose this endpoint - returning empty array");
  return [];
}

export async function fetchLatestSnapshot(): Promise<Snapshot | null> {
  // Note: Backend does not have GET /snapshots/latest endpoint
  console.warn("fetchLatestSnapshot: Backend does not expose this endpoint - returning null");
  return null;
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
  // Backend returns array directly, not wrapped in {alerts: []}
  return Array.isArray(data) ? data : (data?.alerts || []) as Alert[];
}

export async function resolveAlert(alertId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/resolve`, {
    method: "PUT",  // Backend uses PUT, not POST
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
