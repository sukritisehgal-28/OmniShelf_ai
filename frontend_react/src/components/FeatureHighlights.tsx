import { BarChart3, Bell, ShoppingCart } from "lucide-react";

export function FeatureHighlights() {
  const features = [
    {
      icon: <BarChart3 className="w-12 h-12 text-[#3498db]" />,
      title: "Real-Time Shelf Analytics",
      description: "Monitor stock levels across all aisles with instant visual insights and automated tracking powered by AI."
    },
    {
      icon: <Bell className="w-12 h-12 text-[#3498db]" />,
      title: "Smart Alerts for Store Teams",
      description: "Receive instant notifications when shelves run low or gaps are detected, keeping your team ahead of stockouts."
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-[#3498db]" />,
      title: "Guided Shopping Experience",
      description: "Help customers find products faster with SmartCart assistant and real-time shelf availability information."
    }
  ];

  return (
    <section id="features" className="w-full bg-white px-8 py-20">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-[32px] text-center mb-16" style={{ fontWeight: 700, color: '#1f2933' }}>
          Why OmniShelf AI?
        </h2>
        
        <div className="grid grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white border border-[#e5e7eb] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-[20px] mb-3" style={{ fontWeight: 600, color: '#1f2933' }}>
                {feature.title}
              </h3>
              <p className="text-[15px] text-[#6b7280]" style={{ lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
