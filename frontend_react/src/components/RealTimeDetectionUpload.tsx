import { useState } from "react";
import { detectFromCsv, detectFromImage, CsvDetectionSummary, ImageDetectionResult } from "../services/api";
import { Button } from "./ui/button";
import { Upload, Image, FileText } from "lucide-react";
import { prettyProductName } from "../utils/product";

type UploadMode = "image" | "csv";

export function RealTimeDetectionUpload() {
  const [mode, setMode] = useState<UploadMode>("image");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [csvSummary, setCsvSummary] = useState<CsvDetectionSummary | null>(null);
  const [imageResult, setImageResult] = useState<ImageDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setCsvSummary(null);
    setImageResult(null);
    
    // Create preview for images
    if (selectedFile && mode === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const handleModeChange = (newMode: UploadMode) => {
    setMode(newMode);
    setFile(null);
    setImagePreview(null);
    setCsvSummary(null);
    setImageResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setCsvSummary(null);
    setImageResult(null);
    
    try {
      if (mode === "image") {
        console.log('Uploading image:', file.name);
        const result = await detectFromImage(file);
        console.log('Image detection result:', result);
        setImageResult(result);
      } else {
        console.log('Uploading CSV:', file.name);
        const result = await detectFromCsv(file);
        console.log('CSV detection result:', result);
        setCsvSummary(result);
      }
    } catch (e: any) {
      console.error('Detection error:', e);
      setError(e?.message || "Upload failed. Check that backend is running on port 8002 and YOLO model is loaded.");
    } finally {
      setLoading(false);
    }
  };

  // Group detections by product name for image results
  const groupedDetections = imageResult?.detections.reduce((acc, det) => {
    const name = det.product_name || "Unknown";
    if (!acc[name]) {
      acc[name] = { count: 0, avgConfidence: 0, detections: [] };
    }
    acc[name].count++;
    acc[name].detections.push(det);
    acc[name].avgConfidence = 
      acc[name].detections.reduce((sum, d) => sum + d.confidence, 0) / acc[name].count;
    return acc;
  }, {} as Record<string, { count: number; avgConfidence: number; detections: typeof imageResult.detections }>);

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[12px] text-[#6b7280]" style={{ fontWeight: 700 }}>Real-time Detection</p>
          <p className="text-[24px] text-[#0f172a]" style={{ fontWeight: 800 }}>AI-Powered Shelf Analysis</p>
          <p className="text-[14px] text-[#6b7280] mt-1">Upload an image or CSV to detect products using YOLOv11s</p>
        </div>
        <div className="bg-[#3498db]/10 text-[#3498db] px-4 py-2 rounded-full text-[13px]" style={{ fontWeight: 700 }}>
          Model: YOLOv11s (95.5% mAP)
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleModeChange("image")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] transition-all ${
            mode === "image" 
              ? "bg-[#3498db] text-white shadow-md" 
              : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
          }`}
          style={{ fontWeight: 600 }}
        >
          <Image className="w-5 h-5" />
          Single Image
        </button>
        <button
          onClick={() => handleModeChange("csv")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] transition-all ${
            mode === "csv" 
              ? "bg-[#3498db] text-white shadow-md" 
              : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
          }`}
          style={{ fontWeight: 600 }}
        >
          <FileText className="w-5 h-5" />
          Batch CSV
        </button>
      </div>

      {/* Model Capabilities Info */}
      <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-lg p-3 mb-6">
        <p className="text-[12px] text-[#0369a1]" style={{ fontWeight: 600 }}>
          🎯 <strong>Supported Products:</strong> This model detects 120 packaged grocery items including:
        </p>
        <p className="text-[11px] text-[#0284c7] mt-1">
          Pasta (Barilla) • Cereals (Kellogg's, Cheerios) • Snacks (Pringles, Doritos, Oreos) • 
          Beverages (Coca-Cola, Gatorade) • Condiments (Heinz, Hellmann's) • Coffee (Folgers, Starbucks)
        </p>
        <p className="text-[11px] text-[#64748b] mt-1 italic">
          ❌ Does NOT support: Fresh produce, meat, dairy, bakery, or unlabeled items
        </p>
      </div>

      {/* Upload Section */}
      {mode === "image" ? (
        <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 mb-6 hover:border-[#3498db] transition-colors">
          <div className="text-center">
            {imagePreview ? (
              <div className="mb-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
              </div>
            ) : (
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-[#f1f5f9] rounded-full flex items-center justify-center mb-4">
                  <Image className="w-8 h-8 text-[#64748b]" />
                </div>
                <p className="text-[16px] text-[#0f172a]" style={{ fontWeight: 600 }}>Drop your shelf image here</p>
                <p className="text-[13px] text-[#64748b] mt-1">or click to browse (JPG, PNG)</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label 
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] rounded-lg cursor-pointer transition-colors text-[14px]"
              style={{ fontWeight: 600 }}
            >
              <Upload className="w-4 h-4" />
              {file ? "Change Image" : "Select Image"}
            </label>
            {file && <p className="text-[13px] text-[#10b981] mt-3">✓ {file.name}</p>}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="bg-[#fffbeb] border border-[#fbbf24] rounded-lg p-4 mb-4">
            <p className="text-[13px] text-[#92400e]" style={{ fontWeight: 600 }}>
              📝 CSV Format Example:
            </p>
            <pre className="text-[11px] text-[#78350f] mt-2 bg-[#fef3c7] p-2 rounded overflow-x-auto">
{`image_path
/Users/you/project/yolo/dataset/grozi120/images/val/class000_web2.jpg
/Users/you/project/yolo/dataset/grozi120/images/val/class001_web5.jpg`}
            </pre>
            <p className="text-[11px] text-[#92400e] mt-2">
              ⚠️ Use <strong>absolute paths</strong> (starting with / or ~). Relative paths won't work.
            </p>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="text-[13px]"
          />
        </div>
      )}

      {/* Run Button */}
      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-[#3498db] text-white hover:bg-[#2980b9] h-12 text-[16px] flex items-center justify-center gap-2 mb-4"
        style={{ fontWeight: 600 }}
      >
        <Upload className="w-5 h-5" />
        {loading ? "Processing with YOLO..." : "Run Detection"}
      </Button>

      {error && (
        <div className="bg-[#fee2e2] border border-[#fca5a5] rounded-lg p-4 mb-4">
          <p className="text-[#991b1b] text-[13px]">{error}</p>
        </div>
      )}

      {/* Image Detection Results */}
      {imageResult && groupedDetections && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] text-[#0f172a]" style={{ fontWeight: 800 }}>Detection Results</h3>
            <span className="bg-[#10b981]/10 text-[#10b981] px-3 py-1 rounded-full text-[13px]" style={{ fontWeight: 600 }}>
              {imageResult.detections.length} items detected
            </span>
          </div>

          {/* Low Confidence Warning */}
          {imageResult.detections.length > 0 && 
           imageResult.detections.reduce((sum, d) => sum + d.confidence, 0) / imageResult.detections.length < 0.5 && (
            <div className="bg-[#fef3c7] border border-[#fbbf24] rounded-lg p-4 mb-4">
              <p className="text-[13px] text-[#92400e]" style={{ fontWeight: 700 }}>
                ⚠️ Low Confidence Detection
              </p>
              <p className="text-[12px] text-[#a16207] mt-1">
                The model is uncertain about these results. This may happen if the image contains products 
                the model wasn't trained on. This model recognizes <strong>120 packaged grocery products</strong> 
                (cereals, snacks, beverages, canned goods, etc.) - not fresh produce, meat, or dairy sections.
              </p>
            </div>
          )}

          {/* No Detections Info */}
          {imageResult.detections.length === 0 && (
            <div className="bg-[#f0f9ff] border border-[#0ea5e9] rounded-lg p-4 mb-4">
              <p className="text-[13px] text-[#0369a1]" style={{ fontWeight: 700 }}>
                ℹ️ No Products Detected
              </p>
              <p className="text-[12px] text-[#0284c7] mt-1">
                The model didn't find any recognized products. Try uploading an image of a packaged goods shelf 
                (cereals, snacks, beverages, pasta, canned goods, etc.).
              </p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#f0fdf4] rounded-xl p-4 border border-[#86efac]">
              <p className="text-[12px] text-[#15803d]" style={{ fontWeight: 600 }}>Total Products</p>
              <p className="text-[28px] text-[#15803d]" style={{ fontWeight: 800 }}>{imageResult.detections.length}</p>
            </div>
            <div className="bg-[#eff6ff] rounded-xl p-4 border border-[#93c5fd]">
              <p className="text-[12px] text-[#1d4ed8]" style={{ fontWeight: 600 }}>Unique Classes</p>
              <p className="text-[28px] text-[#1d4ed8]" style={{ fontWeight: 800 }}>{Object.keys(groupedDetections).length}</p>
            </div>
            <div className="bg-[#fef3c7] rounded-xl p-4 border border-[#fbbf24]">
              <p className="text-[12px] text-[#92400e]" style={{ fontWeight: 600 }}>Avg Confidence</p>
              <p className="text-[28px] text-[#92400e]" style={{ fontWeight: 800 }}>
                {(imageResult.detections.reduce((sum, d) => sum + d.confidence, 0) / imageResult.detections.length * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-[#f1f5f9] rounded-xl p-4 border border-[#cbd5e1]">
              <p className="text-[12px] text-[#475569]" style={{ fontWeight: 600 }}>Model</p>
              <p className="text-[16px] text-[#0f172a] mt-1" style={{ fontWeight: 800 }}>YOLOv11s</p>
            </div>
          </div>

          {/* Detection Table */}
          <div className="overflow-x-auto border border-[#e5e7eb] rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-[#f8f9fa]">
                <tr>
                  <th className="px-4 py-3 text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>Product Class</th>
                  <th className="px-4 py-3 text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>Count</th>
                  <th className="px-4 py-3 text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>Avg Confidence</th>
                  <th className="px-4 py-3 text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>Stock Level</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedDetections)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([className, data], idx) => {
                    const stockLevel = data.count >= 5 ? "HIGH" : data.count >= 3 ? "MEDIUM" : "LOW";
                    const stockColor = stockLevel === "HIGH" ? "text-[#15803d] bg-[#f0fdf4]" 
                      : stockLevel === "MEDIUM" ? "text-[#92400e] bg-[#fef3c7]" 
                      : "text-[#991b1b] bg-[#fee2e2]";
                    return (
                      <tr key={className} className={idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                        <td className="px-4 py-3 text-[14px] text-[#0f172a]" style={{ fontWeight: 600 }}>
                          {className.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#0f172a]" style={{ fontWeight: 700 }}>{data.count}</td>
                        <td className="px-4 py-3 text-[14px] text-[#0f172a]">{(data.avgConfidence * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[11px] ${stockColor}`} style={{ fontWeight: 600 }}>
                            {stockLevel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Detection Results */}
      {csvSummary && (
        <div className="mt-6">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Files Processed", value: csvSummary.files_processed },
              { label: "High", value: csvSummary.totals.high },
              { label: "Medium", value: csvSummary.totals.medium },
              { label: "Low/Out", value: csvSummary.totals.low + csvSummary.totals.out },
            ].map((card) => (
              <div key={card.label} className="bg-[#f8fafc] rounded-xl p-3 border border-[#e2e8f0]">
                <p className="text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>{card.label}</p>
                <p className="text-[20px] text-[#0f172a]" style={{ fontWeight: 800 }}>{card.value}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto border border-[#e5e7eb] rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-[#f8f9fa]">
                <tr>
                  <th className="px-4 py-2 text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>Product</th>
                  <th className="px-4 py-2 text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>Count</th>
                  <th className="px-4 py-2 text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>Stock Level</th>
                </tr>
              </thead>
              <tbody>
                {csvSummary.products.map((p, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                    <td className="px-4 py-2 text-[13px] text-[#0f172a]">
                      {prettyProductName(p.display_name, p.product_name)}
                    </td>
                    <td className="px-4 py-2 text-[13px] text-[#0f172a]">{p.count}</td>
                    <td className="px-4 py-2 text-[12px] text-[#475569]">{p.stock_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
