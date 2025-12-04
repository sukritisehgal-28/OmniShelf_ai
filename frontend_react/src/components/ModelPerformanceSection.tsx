import { CheckCircle2, Gauge, ShieldCheck, Database } from "lucide-react";

export function ModelPerformanceSection() {
  const metrics = [
    {
      icon: Gauge,
      label: "mAP@50",
      value: "95.51%",
      description: "YOLOv11s on Grozi-120",
      color: "#3498db"
    },
    {
      icon: CheckCircle2,
      label: "Precision / Recall",
      value: "84.9% / 88.5%",
      description: "Validation metrics",
      color: "#10b981"
    },
    {
      icon: ShieldCheck,
      label: "Robustness",
      value: "100.6%",
      description: "Baseline vs stress-test",
      color: "#6366f1"
    },
    {
      icon: Database,
      label: "Model Footprint",
      value: "18 MB",
      description: "Optimized weights",
      color: "#f59e0b"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe]">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#3498db]/10 text-[#3498db] px-4 py-2 rounded-full mb-4 text-[13px]" style={{ fontWeight: 600 }}>
            POWERED BY AI
          </div>
          <h2 className="text-[42px] text-[#2c3e50] mb-4" style={{ fontWeight: 800 }}>
            State-of-the-Art Model Performance
          </h2>
          <p className="text-[18px] text-[#64748b] max-w-[700px] mx-auto">
            Our YOLOv11s model, trained on Google Colab T4 GPU, achieves industry-leading accuracy for retail shelf detection
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-8 hover:shadow-xl hover:border-[#3498db]/30 transition-all duration-300 group"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: metric.color }} />
                </div>
                
                <h3 className="text-[14px] text-[#64748b] mb-2 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  {metric.label}
                </h3>
                
                <div className="text-[32px] text-[#2c3e50] mb-2" style={{ fontWeight: 800 }}>
                  {metric.value}
                </div>
                
                <p className="text-[14px] text-[#94a3b8]">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
