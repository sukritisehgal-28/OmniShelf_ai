import { useState, useRef } from "react";
import { Upload, Search, Package, MapPin, DollarSign, X, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";

interface VisualSearchProps {
  onNavigate?: (page: string) => void;
}

interface SearchResult {
  found: boolean;
  message?: string;
  product?: {
    product_name: string;
    display_name: string;
    category: string;
    price: number;
    aisle?: string;
    stock_count?: number;
    shelf_id?: string;
    stock_level?: string;
  };
}

export function VisualSearch({ onNavigate: _onNavigate }: VisualSearchProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const handleSearch = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // First, identify the product
      const response = await fetch(`${API_BASE_URL}/predict/product`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to identify product");
      }

      const data = await response.json();

      if (data.found && data.product) {
        // Get stock info for the identified product
        try {
          const stockResponse = await fetch(
            `${API_BASE_URL}/stock/${data.product.product_name}`
          );
          if (stockResponse.ok) {
            const stockData = await stockResponse.json();
            data.product.stock_count = stockData.total_count || 0;
            data.product.shelf_id = stockData.shelf_id || "Unknown";
            data.product.stock_level = stockData.stock_level || "OUT";
          }
        } catch {
          // Stock info not available
          data.product.stock_count = 0;
          data.product.stock_level = "Unknown";
        }
      }

      setResult(data);
    } catch (err) {
      setError("Failed to search. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  return (
    <div className="min-h-screen bg-[#f8f9fa]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Steps Section - Similar to SmartCartSteps */}
      <div className="bg-white border-b border-[#e5e7eb] py-6">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#3498db]" />
              </div>
              <p className="text-[14px] text-[#6b7280]">Upload a product photo</p>
            </div>
            <div className="w-8 h-[2px] bg-[#e5e7eb]"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center">
                <Search className="w-6 h-6 text-[#3498db]" />
              </div>
              <p className="text-[14px] text-[#6b7280]">AI identifies the product</p>
            </div>
            <div className="w-8 h-[2px] bg-[#e5e7eb]"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#3498db]" />
              </div>
              <p className="text-[14px] text-[#6b7280]">See location and availability</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[800px] mx-auto p-8">
        {/* Upload Section */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 shadow-sm mb-6">
          <h2 className="text-[18px] text-[#111827] mb-4" style={{ fontWeight: 700 }}>
            Upload Product Image
          </h2>
          
          {!selectedImage ? (
            <div
              className="border-2 border-dashed border-[#d1d5db] rounded-xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
              <p className="text-[16px] text-[#374151] mb-2" style={{ fontWeight: 600 }}>
                Drop your image here or click to browse
              </p>
              <p className="text-[13px] text-[#6b7280]">
                Supports JPG, PNG, WEBP
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected product"
                className="w-full max-h-[400px] object-contain rounded-xl border border-[#e5e7eb]"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedImage && (
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '24px',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find This Product
                </>
              )}
            </button>
          )}

          {error && (
            <p className="mt-4 text-red-500 text-[14px] text-center">{error}</p>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white border border-[#e5e7eb] rounded-2xl p-8 shadow-sm">
            {result.found && result.product ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-[18px] text-[#111827]" style={{ fontWeight: 700 }}>
                    Product Found!
                  </h2>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
                  <h3 className="text-[22px] text-[#111827] mb-2" style={{ fontWeight: 800 }}>
                    {result.product.display_name}
                  </h3>
                  <p className="text-[14px] text-[#6b7280]">{result.product.category}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Stock Level */}
                  <div className="bg-[#f8f9fa] rounded-xl p-4 text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-[12px] mb-2 border ${getStockLevelColor(result.product.stock_level || "Unknown")}`} style={{ fontWeight: 600 }}>
                      {result.product.stock_level || "Unknown"}
                    </div>
                    <p className="text-[24px] text-[#111827]" style={{ fontWeight: 800 }}>
                      {result.product.stock_count ?? "?"}
                    </p>
                    <p className="text-[12px] text-[#6b7280]">In Stock</p>
                  </div>

                  {/* Aisle */}
                  <div className="bg-[#f8f9fa] rounded-xl p-4 text-center">
                    <MapPin className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-[18px] text-[#111827]" style={{ fontWeight: 800 }}>
                      {result.product.aisle || result.product.shelf_id || "Aisle 1"}
                    </p>
                    <p className="text-[12px] text-[#6b7280]">Location</p>
                  </div>

                  {/* Price */}
                  <div className="bg-[#f8f9fa] rounded-xl p-4 text-center">
                    <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <p className="text-[24px] text-[#111827]" style={{ fontWeight: 800 }}>
                      ${result.product.price?.toFixed(2) || "?"}
                    </p>
                    <p className="text-[12px] text-[#6b7280]">Price</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-[18px] text-[#374151] mb-2" style={{ fontWeight: 700 }}>
                  Product Not Found
                </h3>
                <p className="text-[14px] text-[#6b7280]">
                  {result.message || "We couldn't identify this product. Try uploading a clearer image."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-[14px] text-blue-800 mb-3" style={{ fontWeight: 700 }}>
            📸 Tips for best results
          </h3>
          <ul className="space-y-2 text-[13px] text-blue-700">
            <li>• Take a clear, well-lit photo of the product</li>
            <li>• Make sure the product label is visible</li>
            <li>• Avoid blurry or dark images</li>
            <li>• One product per image works best</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
