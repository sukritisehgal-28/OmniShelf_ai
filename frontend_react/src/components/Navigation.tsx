import { Package } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  onNavigate: (page: string) => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  return (
    <nav className="w-full h-[72px] bg-white border-b border-[#e5e7eb] px-8 flex items-center justify-between sticky top-0 z-50">
      <button onClick={() => onNavigate("home")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Package className="w-7 h-7 text-[#3498db]" />
        <span className="text-[20px]" style={{ fontWeight: 700 }}>OmniShelf AI</span>
      </button>
      
      <div className="flex items-center gap-8">
        <a href="#features" className="text-[14px] text-[#6b7280] hover:text-[#1f2933] transition-colors">Features</a>
        <a href="#how-it-works" className="text-[14px] text-[#6b7280] hover:text-[#1f2933] transition-colors">How it Works</a>
        <a href="#contact" className="text-[14px] text-[#6b7280] hover:text-[#1f2933] transition-colors">Contact</a>
        <Button 
          onClick={() => onNavigate("admin")}
          className="bg-[#3498db] text-white hover:bg-[#2980b9] rounded-lg px-6"
        >
          Admin Login
        </Button>
      </div>
    </nav>
  );
}