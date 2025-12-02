import { Camera, Bell, ShoppingCart, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="w-10 h-10 text-[#3498db]" />,
      title: "Scan & Detect",
      description: "AI cameras continuously monitor shelves and detect product levels."
    },
    {
      icon: <Bell className="w-10 h-10 text-[#3498db]" />,
      title: "Analyze & Alert",
      description: "Smart algorithms analyze data and send alerts to your team instantly."
    },
    {
      icon: <ShoppingCart className="w-10 h-10 text-[#3498db]" />,
      title: "Guide Shoppers",
      description: "SmartCart helps customers find products and check availability live."
    }
  ];

  return (
    <section id="how-it-works" className="w-full bg-white px-8 py-20">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-[32px] text-center mb-16" style={{ fontWeight: 700, color: '#1f2933' }}>
          How It Works
        </h2>
        
        <div className="flex items-center justify-center gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center text-center max-w-[280px]">
                <div className="w-20 h-20 rounded-full bg-[#f8f9fa] border-2 border-[#3498db] flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-[18px] mb-2" style={{ fontWeight: 600, color: '#1f2933' }}>
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#6b7280]">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <ArrowRight className="w-8 h-8 text-[#e5e7eb] mx-4 mt-[-60px]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
