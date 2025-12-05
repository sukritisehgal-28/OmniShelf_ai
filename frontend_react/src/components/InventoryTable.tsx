import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { fetchStockSummary, fetchRecentUploads, RecentUploadSession } from "../services/api";
import { Clock, Package, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { inventoryEvents } from "../services/inventoryEvents";

interface InventoryItem {
  product: string;
  category: string;
  shelf: string;
  count: number;
  price: number;
  value: number;
  stockLevel: "HIGH" | "MEDIUM" | "LOW" | "OUT";
}

export function InventoryTable() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockLevelFilter, setStockLevelFilter] = useState<string>("all");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  // Check if we should start on recent tab (inventory was just saved)
  const [viewMode, setViewMode] = useState<"inventory" | "recent">(() => 
    inventoryEvents.checkPendingRefresh() ? "recent" : "inventory"
  );
  const [recentUploads, setRecentUploads] = useState<RecentUploadSession[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [expandedSession, setExpandedSession] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchStockSummary();

        // Filter out "Unknown Product" entries and transform to inventory format
        const inventory: InventoryItem[] = products
          .filter(p => p.display_name !== "Unknown Product" && p.name !== "unknown_product")
          .map(p => {
          let stockLevel: "HIGH" | "MEDIUM" | "LOW" | "OUT";
          if (p.total_count === 0) stockLevel = "OUT";
          else if (p.total_count >= 10) stockLevel = "HIGH";
          else if (p.total_count >= 6) stockLevel = "MEDIUM";
          else stockLevel = "LOW";

          return {
            product: p.display_name,
            category: p.category,
            shelf: p.shelf_id,
            count: p.total_count,
            price: p.price,
            value: p.inventory_value,
            stockLevel
          };
        });

        setInventoryData(inventory);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Subscribe to inventory update events - auto-refresh and switch to recent tab
  useEffect(() => {
    const unsubscribe = inventoryEvents.subscribe(() => {
      // Switch to recent uploads tab and refresh
      setViewMode("recent");
      setRecentLoading(true);
      fetchRecentUploads()
        .then(data => {
          // Filter out Unknown Products and sort by most recent
          const filteredSessions = data.sessions.map(session => ({
            ...session,
            products: session.products.filter(p => 
              p.display_name !== "Unknown Product" && p.grozi_code !== "unknown_product"
            )
          })).filter(session => session.products.length > 0);
          const sortedSessions = [...filteredSessions].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setRecentUploads(sortedSessions);
        })
        .catch(error => console.error("Failed to refresh recent uploads:", error))
        .finally(() => setRecentLoading(false));
    });
    return unsubscribe;
  }, []);

  // Load recent uploads when view mode changes - always refresh to show latest
  useEffect(() => {
    if (viewMode === "recent") {
      const loadRecentUploads = async () => {
        setRecentLoading(true);
        try {
          const data = await fetchRecentUploads();
          // Filter out Unknown Products and sort by most recent
          const filteredSessions = data.sessions.map(session => ({
            ...session,
            products: session.products.filter(p => 
              p.display_name !== "Unknown Product" && p.grozi_code !== "unknown_product"
            )
          })).filter(session => session.products.length > 0);
          const sortedSessions = [...filteredSessions].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setRecentUploads(sortedSessions);
        } catch (error) {
          console.error("Failed to load recent uploads:", error);
        } finally {
          setRecentLoading(false);
        }
      };
      loadRecentUploads();
    }
  }, [viewMode]);

  const filteredData = inventoryData.filter(item => {
    const categoryMatch = categoryFilter === "all" || item.category === categoryFilter;
    const stockMatch = stockLevelFilter === "all" || item.stockLevel === stockLevelFilter;
    return categoryMatch && stockMatch;
  });

  const getStockLevelBadge = (level: string) => {
    const styles = {
      HIGH: "bg-green-100 text-green-700 border-green-300",
      MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
      LOW: "bg-orange-100 text-orange-700 border-orange-300",
      OUT: "bg-red-100 text-red-700 border-red-300",
    };

    return (
      <Badge 
        variant="outline" 
        className={`${styles[level as keyof typeof styles]} text-[11px] px-2 py-1`}
        style={{ fontWeight: 600 }}
      >
        {level}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] text-[#1f2933]" style={{ fontWeight: 700 }}>
          {viewMode === "inventory" ? "Detailed Inventory Table" : "Recent Uploads"}
        </h2>
        
        {/* View Toggle Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("inventory")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              viewMode === "inventory"
                ? "bg-[#2c3e50] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Package className="w-4 h-4" />
            Current Inventory
          </button>
          <button
            onClick={() => setViewMode("recent")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              viewMode === "recent"
                ? "bg-[#2c3e50] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            Recent Uploads
          </button>
        </div>
      </div>
      
      {viewMode === "inventory" ? (
        <>
          {/* Filters */}
          <div className="flex gap-4 relative z-20">
            <div className="w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        
        <div className="w-48">
          <Select value={stockLevelFilter} onValueChange={setStockLevelFilter}>
            <SelectTrigger className="h-10 bg-white">
              <SelectValue placeholder="Stock Level" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="OUT">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6b7280]">Loading inventory...</div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center text-[#6b7280]">No products found</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#2c3e50]">
                <th className="text-left px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Product
                </th>
                <th className="text-left px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Category
                </th>
                <th className="text-left px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Shelf
                </th>
                <th className="text-right px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Count
                </th>
                <th className="text-right px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Price
                </th>
                <th className="text-right px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Value
                </th>
                <th className="text-center px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                  Stock Level
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr 
                  key={index}
                  className={`
                    border-b border-[#e5e7eb] transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'}
                    hover:bg-[#f1f5f9]
                  `}
                >
                  <td className="px-6 py-4 text-[13px] text-[#1f2933]">
                    {item.product}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#6b7280]">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#6b7280]">
                    {item.shelf === "shelf_scan" ? "Scanned" : item.shelf}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#1f2933] text-right" style={{ fontWeight: 600 }}>
                    {item.count}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#1f2933] text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#1f2933] text-right" style={{ fontWeight: 600 }}>
                    ${item.value.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStockLevelBadge(item.stockLevel)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Legend */}
        {!loading && filteredData.length > 0 && (
          <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#e5e7eb]">
            <p className="text-[11px] text-[#6b7280]">
              Stock Level Legend: <span className="text-green-600" style={{ fontWeight: 600 }}>HIGH</span> (10+ units) |
              <span className="text-yellow-600 ml-1" style={{ fontWeight: 600 }}>MEDIUM</span> (6-9 units) |
              <span className="text-orange-600 ml-1" style={{ fontWeight: 600 }}>LOW</span> (1-5 units) |
              <span className="text-red-600 ml-1" style={{ fontWeight: 600 }}>OUT</span> (0 units)
            </p>
          </div>
        )}
      </div>
        </>
      ) : (
        /* Recent Uploads View */
        <div className="space-y-4">
          {recentLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 text-center text-[#6b7280]">
              Loading recent uploads...
            </div>
          ) : recentUploads.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8 text-center">
              <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-[#6b7280]">No recent uploads found</p>
              <p className="text-[12px] text-gray-400 mt-1">Upload inventory via Shelf Scanner to see history here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUploads.map((session) => (
                <div 
                  key={session.id}
                  className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden"
                >
                  {/* Session Header - Clickable */}
                  <button
                    onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#e8f4fd] rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#2c3e50]" />
                      </div>
                      <div className="text-left">
                        <p className="text-[14px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                          {session.date} at {session.time}
                        </p>
                        <p className="text-[12px] text-gray-500">
                          {session.products.length} product{session.products.length !== 1 ? 's' : ''} • {session.total_items} total items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[14px] text-[#1f2933]" style={{ fontWeight: 600 }}>
                          ${session.total_value.toFixed(2)}
                        </p>
                        <p className="text-[11px] text-gray-400">Total Value</p>
                      </div>
                      {expandedSession === session.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {/* Expanded Product Details */}
                  {expandedSession === session.id && (
                    <div className="border-t border-[#e5e7eb]">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left px-6 py-3 text-[12px] text-gray-500" style={{ fontWeight: 600 }}>Product</th>
                            <th className="text-left px-6 py-3 text-[12px] text-gray-500" style={{ fontWeight: 600 }}>Category</th>
                            <th className="text-right px-6 py-3 text-[12px] text-gray-500" style={{ fontWeight: 600 }}>Qty</th>
                            <th className="text-right px-6 py-3 text-[12px] text-gray-500" style={{ fontWeight: 600 }}>Price</th>
                            <th className="text-right px-6 py-3 text-[12px] text-gray-500" style={{ fontWeight: 600 }}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {session.products.map((product, idx) => (
                            <tr 
                              key={product.grozi_code}
                              className={`border-t border-[#e5e7eb] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'}`}
                            >
                              <td className="px-6 py-3 text-[13px] text-[#1f2933]">{product.display_name}</td>
                              <td className="px-6 py-3 text-[13px] text-gray-500">{product.category}</td>
                              <td className="px-6 py-3 text-[13px] text-[#1f2933] text-right" style={{ fontWeight: 600 }}>{product.quantity}</td>
                              <td className="px-6 py-3 text-[13px] text-gray-500 text-right">${product.price.toFixed(2)}</td>
                              <td className="px-6 py-3 text-[13px] text-[#1f2933] text-right" style={{ fontWeight: 600 }}>
                                ${(product.price * product.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Info Footer */}
          {recentUploads.length > 0 && (
            <div className="text-center text-[12px] text-gray-400">
              Showing uploads from the last 30 days
            </div>
          )}
        </div>
      )}
    </div>
  );
}
