import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "./ui/button";

interface LandingNavProps {
  onNavigate?: (page: string) => void;
}

export function LandingNav({ onNavigate }: LandingNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToId = useCallback(
    (id: string) => {
      const doScroll = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      };
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(doScroll, 50);
      } else {
        doScroll();
      }
    },
    [location.pathname, navigate]
  );

  return (
    <nav className="bg-white border-b border-[#e5e7eb]">
      <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-[#3498db]" />
          <span className="text-[22px] text-[#2c3e50]" style={{ fontWeight: 700 }}>
            OmniShelf AI
          </span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              onNavigate?.("home");
              navigate("/");
            }}
            className="text-[14px] text-[#2c3e50] hover:text-[#3498db] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Home
          </button>
          <button 
            onClick={() => {
              onNavigate?.("features");
              scrollToId("features");
            }}
            className="text-[14px] text-[#2c3e50] hover:text-[#3498db] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Features
          </button>
          <button 
            onClick={() => {
              onNavigate?.("solutions");
              scrollToId("how-it-works");
            }}
            className="text-[14px] text-[#2c3e50] hover:text-[#3498db] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Solutions
          </button>
          <Button
            onClick={() => {
              onNavigate?.("smartcart");
              navigate("/user/smartcart");
            }}
            className="bg-[#3498db] hover:bg-[#2980b9] text-white px-6 py-2 rounded-lg transition-all"
            style={{ fontWeight: 600 }}
          >
            Try SmartCart
          </Button>
        </div>
      </div>
    </nav>
  );
}
