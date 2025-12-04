import { useState, useRef } from "react";
import { Upload, Camera, Loader2, Package, X, CheckCircle, AlertCircle } from "lucide-react";

interface Detection {
  bbox: { x1: number; y1: number; x2: number; y2: number };
  class_name: string;
  display_name: string;
  confidence: number;
  category: string;
  sku_confidence?: number;
}

interface ScanResult {
  total_products_found: number;
  products_identified: number;
  product_counts: Record<string, number>;
  detections: Detection[];
  image_size: { width: number; height: number };
}

export function ShelfScanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
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

  const handleScan = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:8002/predict/shelf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to scan shelf");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to scan shelf. Make sure the backend is running.");
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Candy & Chocolate": "bg-pink-100 text-pink-800",
      "Beverages": "bg-orange-100 text-orange-800",
      "Snacks": "bg-yellow-100 text-yellow-800",
      "Personal Care": "bg-purple-100 text-purple-800",
      "Food": "bg-green-100 text-green-800",
      "Health": "bg-red-100 text-red-800",
      "Household": "bg-blue-100 text-blue-800",
      "General": "bg-gray-100 text-gray-800",
      "Unknown": "bg-gray-100 text-gray-500",
    };
    return colors[category] || colors["General"];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-8 h-8" />
          <h2 className="text-[24px]" style={{ fontWeight: 800 }}>
            Shelf Scanner
          </h2>
        </div>
        <p className="text-blue-100 text-[14px]">
          Upload a shelf image to detect and count products using two-stage AI detection
        </p>
        <div className="mt-4 flex items-center gap-4 text-[12px]">
          <div style={{ backgroundColor: '#ffffff', color: '#1d4ed8', fontWeight: 600, padding: '4px 12px', borderRadius: '9999px' }}>
            Stage 1: SKU-110K Detection
          </div>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px' }}>→</span>
          <div style={{ backgroundColor: '#ffffff', color: '#4338ca', fontWeight: 600, padding: '4px 12px', borderRadius: '9999px' }}>
            Stage 2: Grozi-120 Classification
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
        <h3 className="text-[16px] text-[#111827] mb-4" style={{ fontWeight: 700 }}>
          Upload Shelf Image
        </h3>

        {!selectedImage ? (
          <div
            className="border-2 border-dashed border-[#d1d5db] rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
            <p className="text-[16px] text-[#374151] mb-2" style={{ fontWeight: 600 }}>
              Drop shelf image here or click to browse
            </p>
            <p className="text-[13px] text-[#6b7280]">
              Supports JPG, PNG, WEBP
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected shelf"
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

        {/* Upload Button - Always visible */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl text-[15px] hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 border border-gray-300"
          style={{ fontWeight: 600 }}
        >
          <Upload className="w-5 h-5" />
          {selectedImage ? "Choose Different Image" : "Select Image"}
        </button>

        {/* Scan Button - Only when image is selected */}
        {selectedImage && (
          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full mt-3 bg-blue-600 text-white py-4 rounded-xl text-[15px] hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ fontWeight: 700 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning Shelf...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Scan Shelf
              </>
            )}
          </button>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 text-[14px]">{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-500" />
                <span className="text-[13px] text-[#6b7280]">Products Found</span>
              </div>
              <p className="text-[32px] text-[#111827]" style={{ fontWeight: 800 }}>
                {result.total_products_found}
              </p>
              <p className="text-[12px] text-[#9ca3af]">by SKU-110K</p>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-[13px] text-[#6b7280]">Identified</span>
              </div>
              <p className="text-[32px] text-[#111827]" style={{ fontWeight: 800 }}>
                {result.products_identified}
              </p>
              <p className="text-[12px] text-[#9ca3af]">by Grozi-120</p>
            </div>

            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-purple-500" />
                <span className="text-[13px] text-[#6b7280]">Unique Products</span>
              </div>
              <p className="text-[32px] text-[#111827]" style={{ fontWeight: 800 }}>
                {Object.keys(result.product_counts).length}
              </p>
              <p className="text-[12px] text-[#9ca3af]">different items</p>
            </div>
          </div>

          {/* Product Counts */}
          {Object.keys(result.product_counts).length > 0 && (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
              <h3 className="text-[16px] text-[#111827] mb-4" style={{ fontWeight: 700 }}>
                📦 Product Inventory
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(result.product_counts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <div
                      key={name}
                      className="bg-[#f8f9fa] rounded-lg p-4 flex items-center justify-between"
                    >
                      <span className="text-[14px] text-[#374151] truncate" style={{ fontWeight: 500 }}>
                        {name}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-[13px]" style={{ fontWeight: 700 }}>
                        {count}x
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Detailed Detections */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
            <h3 className="text-[16px] text-[#111827] mb-4" style={{ fontWeight: 700 }}>
              🎯 Detection Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[12px] text-[#6b7280] border-b border-[#e5e7eb]">
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Confidence</th>
                    <th className="pb-3 font-semibold">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {result.detections
                    .filter(d => d.class_name !== "unknown")
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 20)
                    .map((det, idx) => (
                      <tr key={idx} className="border-b border-[#f1f5f9]">
                        <td className="py-3">
                          <span className="text-[14px] text-[#111827]" style={{ fontWeight: 600 }}>
                            {det.display_name}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[12px] px-2 py-1 rounded-full ${getCategoryColor(det.category)}`}>
                            {det.category}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${det.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-[12px] text-[#6b7280]">
                              {(det.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-[12px] text-[#6b7280]">
                          ({det.bbox.x1}, {det.bbox.y1})
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {result.detections.filter(d => d.class_name !== "unknown").length > 20 && (
                <p className="text-[12px] text-[#6b7280] mt-3 text-center">
                  Showing top 20 of {result.detections.filter(d => d.class_name !== "unknown").length} detections
                </p>
              )}
            </div>
          </div>

          {/* Unknown Products */}
          {result.detections.filter(d => d.class_name === "unknown").length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-[14px] text-yellow-800 mb-2" style={{ fontWeight: 700 }}>
                ⚠️ Unidentified Products
              </h3>
              <p className="text-[13px] text-yellow-700">
                {result.detections.filter(d => d.class_name === "unknown").length} products were detected but couldn't be identified. 
                These may be products not in the Grozi-120 training set.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
