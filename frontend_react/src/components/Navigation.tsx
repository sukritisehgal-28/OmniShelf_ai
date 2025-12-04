import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  showAdminCta?: boolean;
}

export function Navigation({ showAdminCta = true }: NavigationProps) {
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
    <nav className="w-full h-[72px] bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between sticky top-0 z-50">
      <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Package className="w-7 h-7 text-[#3498db]" />
        <span className="text-[20px]" style={{ fontWeight: 700 }}>OmniShelf AI</span>
      </button>
      
      <div className="flex items-center gap-8">
        <button onClick={() => scrollToId("features")} className="text-[14px] text-[#6b7280] hover:text-[#1f2933] transition-colors">Features</button>
        <button onClick={() => scrollToId("how-it-works")} className="text-[14px] text-[#6b7280] hover:text-[#1f2933] transition-colors">How it Works</button>
        <button onClick={() => scrollToId("contact")} className="text-[14px] text-[#6b7280] hover:text-[#1f2933] transition-colors">Contact</button>
        {showAdminCta && (
          <Button 
            onClick={() => navigate("/admin/dashboard")}
            className="bg-[#3498db] text-white hover:bg-[#2980b9] rounded-lg px-6"
          >
            Admin Login
          </Button>
        )}
      </div>
    </nav>
  );
}
