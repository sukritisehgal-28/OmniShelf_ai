import { useState, useRef } from "react";
import { Upload, Camera, Loader2, Package, X, CheckCircle, AlertCircle, ShieldCheck, Eye, Plus } from "lucide-react";
import { inventoryEvents } from "../services/inventoryEvents";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";

interface Verification {
  verified: boolean;
  original_prediction: string;
  clip_prediction: string;
  agrees: boolean;
  final_prediction: string;
  source: string;
  confidence: number;
}

interface Detection {
  bbox: { x1: number; y1: number; x2: number; y2: number };
  class_name: string;
  display_name: string;
  confidence: number;
  category: string;
  sku_confidence?: number;
  verification?: Verification;
  verified_by?: string;
}

interface ScanResult {
  total_products_found: number;
  products_identified: number;
  product_counts: Record<string, number>;
  detections: Detection[];
  image_size: { width: number; height: number };
  clip_enabled?: boolean;
}

export function ShelfScanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingToInventory, setAddingToInventory] = useState(false);
  const [inventoryMessage, setInventoryMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
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

      const response = await fetch(`${API_BASE_URL}/predict/shelf`, {
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

  const handleAddToInventory = async () => {
    if (!result) return;
    
    setAddingToInventory(true);
    setInventoryMessage(null);
    
    try {
      // Build inventory updates from product counts
      const updates = Object.entries(result.product_counts).map(([name, count]) => ({
        name,
        quantity: count,
      }));
      
      const response = await fetch(`${API_BASE_URL}/inventory/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update inventory");
      }
      
      // Emit event to notify inventory components to refresh
      inventoryEvents.emit();
      
      setInventoryMessage({ type: 'success', text: `Successfully added ${Object.keys(result.product_counts).length} products to inventory!` });
    } catch (err) {
      setInventoryMessage({ type: 'error', text: 'Failed to update inventory. Please try again.' });
      console.error(err);
    } finally {
      setAddingToInventory(false);
    }
  };

  // Count CLIP corrections
  const getClipStats = () => {
    if (!result) return { verified: 0, corrected: 0 };
    const verified = result.detections.filter(d => d.verified_by === 'clip_verified').length;
    const corrected = result.detections.filter(d => d.verified_by === 'clip_corrected').length;
    return { verified, corrected };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ background: 'linear-gradient(to bottom right, #1e3a5f, #2c3e50)', borderRadius: '16px', padding: '24px' }}>
        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-8 h-8" style={{ color: '#ffffff' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
            Shelf Scanner
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#ffffff' }}>
          Upload a shelf image to detect and count products using AI detection with verification
        </p>
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <div style={{ backgroundColor: '#ffffff', color: '#1e3a5f', fontWeight: 600, padding: '6px 14px', borderRadius: '9999px', fontSize: '12px' }}>
            Stage 1: SKU-110K Detection
          </div>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '20px' }}>→</span>
          <div style={{ backgroundColor: '#ffffff', color: '#1e3a5f', fontWeight: 600, padding: '6px 14px', borderRadius: '9999px', fontSize: '12px' }}>
            Stage 2: Grozi-120 Classification
          </div>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '20px' }}>→</span>
          <div style={{ backgroundColor: '#ffffff', color: '#1e3a5f', fontWeight: 600, padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye className="w-3.5 h-3.5" />
            Stage 3: OpenAI Verification
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

        {/* Run Model Button - Only when image is selected */}
        {selectedImage && (
          <button
            onClick={handleScan}
            disabled={loading}
            style={{ 
              width: '100%', 
              marginTop: '16px', 
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
                Running Detection...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Run Model
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
                {Object.values(result.product_counts).reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-[12px] text-[#9ca3af]">after verification</p>
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

          {/* CLIP Verification Banner */}
          {getClipStats().corrected > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-emerald-100 rounded-full p-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[14px] text-emerald-800" style={{ fontWeight: 600 }}>
                  ✓ Verified with OpenAI
                </p>
                <p className="text-[13px] text-emerald-700">
                  {getClipStats().corrected} product{getClipStats().corrected !== 1 ? 's' : ''} correctly identified!
                </p>
              </div>
            </div>
          )}

          {/* Product Counts */}
          {Object.keys(result.product_counts).length > 0 && (
            <div className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] text-[#111827]" style={{ fontWeight: 700 }}>
                  📦 Product Inventory
                </h3>
                <button
                  onClick={handleAddToInventory}
                  disabled={addingToInventory}
                  style={{
                    backgroundColor: addingToInventory ? '#9ca3af' : '#10b981',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: addingToInventory ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {addingToInventory ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add to Inventory
                    </>
                  )}
                </button>
              </div>
              
              {inventoryMessage && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  inventoryMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {inventoryMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-[13px] ${
                    inventoryMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {inventoryMessage.text}
                  </span>
                </div>
              )}
              
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
                  </tr>
                </thead>
                <tbody>
                  {result.detections
                    .filter(d => d.class_name !== "unknown" && d.display_name !== "Unknown Product")
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
                      </tr>
                    ))}
                </tbody>
              </table>
              {result.detections.filter(d => d.class_name !== "unknown" && d.display_name !== "Unknown Product").length > 20 && (
                <p className="text-[12px] text-[#6b7280] mt-3 text-center">
                  Showing top 20 of {result.detections.filter(d => d.class_name !== "unknown" && d.display_name !== "Unknown Product").length} detections
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
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
