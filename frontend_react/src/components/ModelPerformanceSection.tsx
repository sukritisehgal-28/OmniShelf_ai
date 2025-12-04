import { CheckCircle2, Gauge, ShieldCheck, Database } from "lucide-react";

const MODEL_METRICS = [
  { label: "mAP@50", value: "95.51%", desc: "YOLOv11s on Grozi-120", icon: Gauge, tone: "bg-blue-50 text-[#1f2937]" },
  { label: "Precision / Recall", value: "84.9% / 88.5%", desc: "Validation metrics", icon: CheckCircle2, tone: "bg-emerald-50 text-[#1f2937]" },
  { label: "Robustness", value: "100.6%", desc: "Baseline vs stress-test", icon: ShieldCheck, tone: "bg-indigo-50 text-[#1f2937]" },
  { label: "Model Footprint", value: "18 MB", desc: "Optimized weights", icon: Database, tone: "bg-amber-50 text-[#1f2937]" },
];

export function ModelPerformanceSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#dbeafe] text-[#1e40af] px-4 py-2 rounded-full text-[13px] mb-4" style={{ fontWeight: 700 }}>
            🚀 POWERED BY AI
          </div>
          <h2 className="text-[42px] text-[#0f172a] mb-4" style={{ fontWeight: 900 }}>
            State-of-the-Art Model Performance
          </h2>
          <p className="text-[18px] text-[#475569] max-w-2xl mx-auto">
            Our YOLOv11s model, trained on Google Colab T4 GPU, achieves industry-leading accuracy for retail shelf detection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {MODEL_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className={`rounded-2xl p-6 border border-[#e2e8f0] ${metric.tone} shadow-lg hover:shadow-xl transition-shadow`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] text-[#475569]" style={{ fontWeight: 700 }}>{metric.label}</p>
                  <div className="bg-white/80 rounded-lg p-2.5 border border-white/60">
                    <Icon className="w-5 h-5 text-[#334155]" />
                  </div>
                </div>
                <p className="text-[28px] text-[#0f172a] mb-1" style={{ fontWeight: 800 }}>{metric.value}</p>
                <p className="text-[12px] text-[#475569]">{metric.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#e5e7eb] shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[24px] text-[#0f172a]" style={{ fontWeight: 800 }}>Training Details</h3>
              <p className="text-[14px] text-[#6b7280] mt-1">50 epochs • 9.82 hours • Google Colab T4</p>
            </div>
            <div className="bg-[#f1f5f9] px-4 py-2 rounded-full">
              <span className="text-[13px] text-[#334155]" style={{ fontWeight: 700 }}>YOLOv11s</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0]">
              <p className="text-[12px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>Dataset</p>
              <p className="text-[20px] text-[#0f172a]" style={{ fontWeight: 700 }}>Grozi-120</p>
              <p className="text-[12px] text-[#6b7280] mt-1">576 train, 100 val images</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0]">
              <p className="text-[12px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>Training Time</p>
              <p className="text-[20px] text-[#0f172a]" style={{ fontWeight: 700 }}>9.82 hours</p>
              <p className="text-[12px] text-[#6b7280] mt-1">50 epochs, batch size 16</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0]">
              <p className="text-[12px] text-[#6b7280] mb-1" style={{ fontWeight: 600 }}>Hardware</p>
              <p className="text-[20px] text-[#0f172a]" style={{ fontWeight: 700 }}>Tesla T4</p>
              <p className="text-[12px] text-[#6b7280] mt-1">16GB VRAM, Google Colab</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
