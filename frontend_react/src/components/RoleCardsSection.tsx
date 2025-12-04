import { useNavigate } from "react-router-dom";
import { Shield, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface RoleCardsSectionProps {
  onNavigate?: (page: string) => void;
}

export function RoleCardsSection({ onNavigate }: RoleCardsSectionProps) {
  const navigate = useNavigate();
  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[#3498db]/10 text-[#3498db] px-4 py-2 rounded-full mb-4 text-[13px]" style={{ fontWeight: 600 }}>
            Get Started
          </div>
          <h2 className="text-[42px] text-[#2c3e50] mb-4" style={{ fontWeight: 800 }}>
            Choose Your Experience
          </h2>
          <p className="text-[18px] text-[#64748b] max-w-[700px] mx-auto">
            Select the portal that matches your role and start optimizing your retail experience.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 gap-8 max-w-[1100px] mx-auto">
          {/* Admin Portal Card */}
          <div className="bg-white rounded-3xl p-12 shadow-lg border-2 border-[#e2e8f0] hover:border-[#3498db] hover:shadow-2xl transition-all duration-300 group flex flex-col">
            <h3 className="text-[32px] text-[#2c3e50] mb-4" style={{ fontWeight: 800 }}>
              Admin Portal
            </h3>
            
            <p className="text-[16px] text-[#64748b] mb-8 leading-relaxed flex-grow">
              Comprehensive dashboard for store managers and administrators to monitor inventory, 
              track performance metrics, and manage alerts across all locations.
            </p>
            
            <Button
              onClick={() => {
                onNavigate?.("admin");
                navigate("/admin/dashboard");
              }}
              className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white py-6 rounded-xl text-[16px] shadow-md hover:shadow-lg transition-all gap-2"
              style={{ fontWeight: 600 }}
            >
              Access Admin Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* SmartCart Assistant Card */}
          <div className="bg-white rounded-3xl p-12 shadow-lg border-2 border-[#e2e8f0] hover:border-[#10b981] hover:shadow-2xl transition-all duration-300 group flex flex-col">
            <h3 className="text-[32px] text-[#2c3e50] mb-4" style={{ fontWeight: 800 }}>
              SmartCart Assistant
            </h3>
            
            <p className="text-[16px] text-[#64748b] mb-8 leading-relaxed flex-grow">
              Customer-facing tool that helps shoppers quickly locate products, check availability, 
              and navigate the store efficiently with AI-powered assistance.
            </p>
            
            <Button
              onClick={() => {
                onNavigate?.("smartcart");
                navigate("/user/smartcart");
              }}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-6 rounded-xl text-[16px] shadow-md hover:shadow-lg transition-all gap-2"
              style={{ fontWeight: 600 }}
            >
              Try SmartCart Assistant
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
