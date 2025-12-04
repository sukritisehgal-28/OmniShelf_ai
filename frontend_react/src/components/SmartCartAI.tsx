import { useState } from "react";
import { Search, ShoppingCart, MapPin, DollarSign, Package, ArrowLeft } from "lucide-react";
import { searchShoppingList } from "../services/api";

interface SmartCartAIProps {
  onNavigate: (page: string) => void;
}

interface SearchResult {
  item: string;
  found: boolean;
  product_name: string | null;
  display_name: string | null;
  shelf_id: string | null;
  stock_count: number;
  price: number;
  category: string | null;
  stock_level: string;
}

export function SmartCartAI({ onNavigate }: SmartCartAIProps) {
  const [items, setItems] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!items.trim()) {
      setError("Please enter at least one item");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Split by commas or newlines
      const itemList = items
        .split(/[,\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const response = await searchShoppingList(itemList);
      setResults(response);
    } catch (err) {
      setError("Failed to search products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStockLevelColor = (level: string) => {
    switch (level) {
      case "HIGH": return "bg-green-100 text-green-800 border-green-300";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "LOW": return "bg-orange-100 text-orange-800 border-orange-300";
      case "OUT": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStockLevelIcon = (level: string) => {
    switch (level) {
      case "HIGH": return "✓";
      case "MEDIUM": return "○";
      case "LOW": return "⚠";
      case "OUT": return "✕";
      default: return "?";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] px-8 py-4 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate("user_home")}
              className="flex items-center gap-2 px-4 py-2 text-[13px] text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors border border-[#e5e7eb]"
              style={{ fontWeight: 600 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-[24px] text-[#111827]" style={{ fontWeight: 800 }}>
                SmartCart AI Assistant
              </h1>
              <p className="text-[13px] text-[#6b7280]" style={{ fontWeight: 500 }}>
                Find products instantly with AI-powered search
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
            <ShoppingCart className="w-5 h-5" />
            <span style={{ fontWeight: 700 }}>AI Shopping Assistant</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto p-8 space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-[20px] text-[#111827] mb-2" style={{ fontWeight: 800 }}>
                How it works
              </h2>
              <p className="text-[14px] text-[#475569] mb-4" style={{ fontWeight: 500 }}>
                Enter product names (like "coffee", "milk", "chips") and our AI will recognize them,
                show you the aisle location, current stock level, and price. Separate items with commas or new lines.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[12px] text-[#475569]" style={{ fontWeight: 600 }}>
                    Find Aisle
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-[12px] text-[#475569]" style={{ fontWeight: 600 }}>
                    Check Stock
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-[12px] text-[#475569]" style={{ fontWeight: 600 }}>
                    See Price
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
          <label className="block text-[14px] text-[#111827] mb-3" style={{ fontWeight: 700 }}>
            Enter Your Shopping List
          </label>
          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="Example: coffee, milk, bread, chips, orange juice"
            className="w-full h-32 px-4 py-3 border border-[#cbd5e1] rounded-xl text-[14px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            style={{ fontWeight: 500 }}
          />

          {error && (
            <p className="mt-2 text-[12px] text-red-600" style={{ fontWeight: 600 }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl text-[14px] shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontWeight: 700 }}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Products
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[18px] text-[#111827] mb-4" style={{ fontWeight: 800 }}>
              Search Results ({results.length} items)
            </h3>

            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    result.found
                      ? "bg-white border-[#e5e7eb] hover:border-blue-300 hover:shadow-md"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {result.found ? (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-[16px] text-[#111827]" style={{ fontWeight: 700 }}>
                            {result.display_name}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] border ${getStockLevelColor(result.stock_level)}`}
                            style={{ fontWeight: 700 }}
                          >
                            {getStockLevelIcon(result.stock_level)} {result.stock_level}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <MapPin className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-[10px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                                AISLE
                              </p>
                              <p className="text-[13px] text-[#111827]" style={{ fontWeight: 700 }}>
                                {result.shelf_id || "Unknown"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Package className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-[10px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                                IN STOCK
                              </p>
                              <p className="text-[13px] text-[#111827]" style={{ fontWeight: 700 }}>
                                {result.stock_count} items
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <DollarSign className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-[10px] text-[#6b7280]" style={{ fontWeight: 600 }}>
                                PRICE
                              </p>
                              <p className="text-[13px] text-[#111827]" style={{ fontWeight: 700 }}>
                                ${result.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {result.category && (
                          <div className="mt-3">
                            <span className="text-[11px] text-[#6b7280] bg-gray-100 px-2 py-1 rounded" style={{ fontWeight: 600 }}>
                              {result.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Search className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-[14px] text-[#111827]" style={{ fontWeight: 700 }}>
                          "{result.item}" - Not Found
                        </p>
                        <p className="text-[12px] text-[#6b7280]" style={{ fontWeight: 500 }}>
                          This product is not in our database. Try a different name or check spelling.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Searches */}
        {results.length === 0 && !loading && (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[14px] text-[#111827] mb-3" style={{ fontWeight: 700 }}>
              Try these examples:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "coffee, milk, bread",
                "chips, soda, cookies",
                "pasta, tomato sauce, cheese",
                "cereal, yogurt, granola bars"
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setItems(example)}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-[12px] text-[#475569] hover:text-blue-700 transition-all"
                  style={{ fontWeight: 600 }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
