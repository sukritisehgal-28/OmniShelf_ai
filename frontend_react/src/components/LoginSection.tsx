import { Briefcase, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface LoginSectionProps {
  onNavigate: (page: string) => void;
}

export function LoginSection({ onNavigate }: LoginSectionProps) {
  return (
    <section className="w-full bg-[#f8f9fa] px-8 py-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[32px] mb-3" style={{ fontWeight: 700, color: '#1f2933' }}>
            Log in to OmniShelf AI
          </h2>
          <p className="text-[18px] text-[#6b7280]">
            Choose your portal to continue.
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
            
            {/* Login Form */}
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="work-email" className="text-[13px] text-[#1f2933] mb-2 block">
                  Work Email
                </Label>
                <Input 
                  id="work-email"
                  type="email" 
                  placeholder="your.email@store.com"
                  className="h-11 rounded-lg border-[#e5e7eb]"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-[13px] text-[#1f2933] mb-2 block">
                  Password
                </Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••"
                  className="h-11 rounded-lg border-[#e5e7eb]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-[13px] text-[#6b7280] cursor-pointer">
                  Remember me
                </Label>
              </div>
              
              <Button 
                onClick={() => onNavigate("admin")}
                className="w-full bg-[#3498db] text-white hover:bg-[#2980b9] h-12 rounded-lg"
              >
                Sign in as Admin
              </Button>
              
              <div className="text-center">
                <a href="#" className="text-[13px] text-[#3498db] hover:underline">
                  Forgot password?
                </a>
              </div>
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
            
            {/* Shopper actions */}
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="shopper-email" className="text-[13px] text-[#1f2933] mb-2 block">
                  Email (optional for saving lists)
                </Label>
                <Input 
                  id="shopper-email"
                  type="email" 
                  placeholder="your.email@example.com"
                  className="h-11 rounded-lg border-[#e5e7eb]"
                />
              </div>
              
              <Button 
                onClick={() => onNavigate("smartcart")}
                className="w-full bg-[#22c55e] text-white hover:bg-[#16a34a] h-14 rounded-lg text-[16px]"
              >
                Continue to SmartCart
              </Button>
              
              <p className="text-[13px] text-center text-[#6b7280]">
                No account needed – start shopping immediately
              </p>
            </div>
            
            {/* Limited access indicator */}
            <div className="pt-6 border-t border-[#e5e7eb]">
              <div className="flex items-center justify-center">
                <span className="text-[11px] bg-[#f8f9fa] text-[#6b7280] px-4 py-2 rounded-full border border-[#e5e7eb]">
                  Limited access – SmartCart only
                </span>
              </div>
            </div>
            
            {/* Add some vertical spacing for visual balance */}
            <div className="mt-8"></div>
          </div>
        </div>
      </div>
    </section>
  );
}