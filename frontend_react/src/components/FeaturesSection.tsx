import { Camera, Bell, TrendingUp, ShoppingCart, BarChart3, Clock } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Camera,
      title: "AI Vision Recognition",
      description: "Advanced computer vision to detect stock levels, product placement, and shelf conditions in real-time.",
      color: "#3498db"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Instant notifications for low stock, misplaced items, and pricing discrepancies before they impact sales.",
      color: "#ef4444"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Machine learning algorithms forecast demand patterns and optimize inventory levels automatically.",
      color: "#10b981"
    },
    {
      icon: ShoppingCart,
      title: "SmartCart Assistant",
      description: "Customer-facing AI that helps shoppers find products quickly and checks real-time availability.",
      color: "#8b5cf6"
    },
    {
      icon: BarChart3,
      title: "Real-time Dashboards",
      description: "Comprehensive analytics and KPIs across all stores with drill-down capabilities for deep insights.",
      color: "#f59e0b"
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Continuous shelf surveillance with automated reports and actionable recommendations.",
      color: "#06b6d4"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#3498db]/10 text-[#3498db] px-4 py-2 rounded-full mb-4 text-[13px]" style={{ fontWeight: 600 }}>
            Platform Features
          </div>
          <h2 className="text-[42px] text-[#2c3e50] mb-4" style={{ fontWeight: 800 }}>
            Everything You Need for Smart Retail
          </h2>
          <p className="text-[18px] text-[#64748b] max-w-[700px] mx-auto">
            Comprehensive tools to monitor, analyze, and optimize your retail operations with cutting-edge AI technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-8 hover:shadow-xl hover:border-[#3498db]/30 transition-all duration-300 group"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                
                <h3 className="text-[20px] text-[#2c3e50] mb-3" style={{ fontWeight: 700 }}>
                  {feature.title}
                </h3>
                
                <p className="text-[15px] text-[#64748b] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
