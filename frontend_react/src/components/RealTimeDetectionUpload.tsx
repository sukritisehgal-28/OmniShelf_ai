import { useState } from "react";
import { detectFromCsv, CsvDetectionSummary } from "../services/api";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { prettyProductName } from "../utils/product";

export function RealTimeDetectionUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<CsvDetectionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSummary(null); // Clear previous results
    
    try {
      console.log('Uploading file:', file.name);
      const result = await detectFromCsv(file);
      console.log('Detection result:', result);
      setSummary(result);
    } catch (e: any) {
      console.error('Detection error:', e);
      setError(e?.message || "Upload failed. Check that backend is running on port 8002 and YOLO model is loaded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[12px] text-[#6b7280]" style={{ fontWeight: 700 }}>Real-time Detection</p>
          <p className="text-[18px] text-[#0f172a]" style={{ fontWeight: 800 }}>Upload CSV → Run YOLO</p>
          <p className="text-[12px] text-[#6b7280] mt-1">CSV must have column: <code className="bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[#d97706]">image_path</code> with <strong>absolute paths</strong></p>
        </div>
        <div className="bg-[#ecf2ff] text-[#1f2937] px-3 py-1 rounded-full text-[12px]" style={{ fontWeight: 700 }}>
          Model: YOLOv11s (train_colab)
        </div>
      </div>

      {/* Instructions */}
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

      <div className="flex items-center gap-3 mb-3">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-[13px]"
        />
        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-[#3498db] text-white hover:bg-[#2980b9] h-10 px-4 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {loading ? "Processing..." : "Run Detection"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-[13px] mb-2">{error}</p>}

      {summary && (
        <div className="mt-4">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Files Processed", value: summary.files_processed },
              { label: "High", value: summary.totals.high },
              { label: "Medium", value: summary.totals.medium },
              { label: "Low/Out", value: summary.totals.low + summary.totals.out },
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
                {summary.products.map((p, idx) => (
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
