import { useEffect, useState } from "react";
import { CheckCircle2, Gauge, ShieldCheck, Database, AlertTriangle } from "lucide-react";
import { fetchModelMetrics, ModelMetrics } from "../services/api";

export function ModelPerformancePanel() {
  const [data, setData] = useState<ModelMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModelMetrics()
      .then(setData)
      .catch((err: any) => setError(err?.message || "Failed to load model metrics"));
  }, []);

  const MODEL_METRICS = [
    { label: "mAP@50", value: data?.metrics?.["val_mAP50"] ? `${(data.metrics["val_mAP50"] * 100).toFixed(2)}%` : "—", desc: "Detection Accuracy", icon: Gauge, tone: "bg-blue-50 text-[#1f2937]" },
    { label: "Precision / Recall", value: data?.metrics?.val_precision !== undefined && data.metrics?.val_recall !== undefined ? `${(data.metrics.val_precision * 100).toFixed(1)}% / ${(data.metrics.val_recall * 100).toFixed(1)}%` : "—", desc: "Classification Quality", icon: CheckCircle2, tone: "bg-emerald-50 text-[#1f2937]" },
    { label: "Robustness", value: data?.qualitative_analysis?.robustness_score_percent ? `${data.qualitative_analysis.robustness_score_percent.toFixed(1)}%` : "—", desc: "Stress-test Performance", icon: ShieldCheck, tone: "bg-indigo-50 text-[#1f2937]" },
    { label: "Model Size", value: data?.weights_size_mb ? `${data.weights_size_mb} MB` : "—", desc: data?.model_exists ? "Optimized & Ready" : "Loading...", icon: Database, tone: "bg-amber-50 text-[#1f2937]" },
  ];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[18px] text-[#111827]" style={{ fontWeight: 800 }}>Model Performance</p>
        </div>
        <div className="text-[12px] bg-[#f1f5f9] px-3 py-1 rounded-full text-[#334155]" style={{ fontWeight: 700 }}>
          {data?.run_name ? `YOLOv11s • ${data.run_name}` : "YOLOv11s • latest"}
        </div>
      </div>

      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2 text-[12px]">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MODEL_METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className={`rounded-xl p-4 border border-[#e2e8f0] ${metric.tone}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] text-[#475569]" style={{ fontWeight: 700 }}>{metric.label}</p>
                <div className="bg-white/80 rounded-lg p-2 border border-white/60">
                  <Icon className="w-4 h-4 text-[#334155]" />
                </div>
              </div>
              <p className="text-[22px] text-[#0f172a]" style={{ fontWeight: 800 }}>{metric.value}</p>
              <p className="text-[11px] text-[#475569] mt-1">{metric.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
