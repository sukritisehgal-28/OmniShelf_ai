import { useNavigate } from "react-router-dom";
import { Briefcase, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface LoginSectionProps {
  onNavigate?: (page: string) => void;
}

export function LoginSection({ onNavigate }: LoginSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#f8f9fa] px-8 py-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[32px] mb-3" style={{ fontWeight: 700, color: '#1f2933' }}>
            Choose Your Portal
          </h2>
          <p className="text-[18px] text-[#6b7280]">
            Jump straight into the dashboards—no sign-in required for this demo.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 max-w-[1200px] mx-auto">
          {/* Admin Portal Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#e5e7eb]">
            <div className="mb-6">
              <p className="text-[11px] text-[#6b7280] tracking-wider mb-4" style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                For store managers & staff
              </p>
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-8 h-8 text-[#3498db]" />
                <h3 className="text-[24px]" style={{ fontWeight: 700, color: '#1f2933' }}>
                  Admin Portal
                </h3>
              </div>
              <p className="text-[14px] text-[#6b7280]">
                Access comprehensive dashboards, analytics, alerts, and inventory management tools.
              </p>
            </div>
            <div className="space-y-4 mb-6">
              <Button 
                onClick={() => {
                  onNavigate?.("admin");
                  navigate("/admin/dashboard");
                }}
                className="w-full bg-[#3498db] text-white hover:bg-[#2980b9] h-12 rounded-lg flex items-center justify-center gap-2"
              >
                Go to Admin Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-[13px] text-[#6b7280] text-center">
                Includes Overview, Inventory, Analytics, Alerts, Detection upload
              </p>
            </div>
            
            {/* Access pills */}
            <div className="pt-6 border-t border-[#e5e7eb]">
              <p className="text-[11px] text-[#6b7280] mb-3">ACCESS AFTER LOGIN:</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] bg-[#f8f9fa] text-[#1f2933] px-3 py-1 rounded-full border border-[#e5e7eb]">
                  Store Overview
                </span>
                <span className="text-[11px] bg-[#f8f9fa] text-[#1f2933] px-3 py-1 rounded-full border border-[#e5e7eb]">
                  Dashboard
                </span>
                <span className="text-[11px] bg-[#f8f9fa] text-[#1f2933] px-3 py-1 rounded-full border border-[#e5e7eb]">
                  Analytics
                </span>
                <span className="text-[11px] bg-[#f8f9fa] text-[#1f2933] px-3 py-1 rounded-full border border-[#e5e7eb]">
                  Alerts
                </span>
                <span className="text-[11px] bg-[#f8f9fa] text-[#1f2933] px-3 py-1 rounded-full border border-[#e5e7eb]">
                  SmartCart
                </span>
              </div>
            </div>
          </div>
          
          {/* Shopper Portal Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#e5e7eb]">
            <div className="mb-6">
              <p className="text-[11px] text-[#6b7280] tracking-wider mb-4" style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                For shoppers & customers
              </p>
              <div className="flex items-center gap-3 mb-3">
                <ShoppingCart className="w-8 h-8 text-[#22c55e]" />
                <h3 className="text-[24px]" style={{ fontWeight: 700, color: '#1f2933' }}>
                  SmartCart Assistant
                </h3>
              </div>
              <p className="text-[14px] text-[#6b7280]">
                Paste your shopping list to see shelf locations and real-time availability for every item.
              </p>
            </div>
            <div className="space-y-4 mb-6">
              <Button 
                onClick={() => {
                  onNavigate?.("smartcart");
                  navigate("/user/smartcart");
                }}
                className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a] h-14 rounded-lg text-[16px] flex items-center justify-center gap-2"
              >
                Open SmartCart Assistant
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <p className="text-[13px] text-center text-[#6b7280]">
                No account needed – start shopping immediately
              </p>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/admin/ai-model")}
                className="text-[13px] text-[#3498db] hover:underline"
              >
                View full AI metrics →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
