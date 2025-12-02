import { Package } from "lucide-react";

interface SmartCartNavProps {
  onNavigate: (page: string) => void;
}

export function SmartCartNav({ onNavigate }: SmartCartNavProps) {
  return (
    <nav className="bg-white border-b border-[#e5e7eb]">
      <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Package className="w-7 h-7 text-[#3498db]" />
          <span className="text-[20px] text-[#111827]" style={{ fontWeight: 700 }}>
            OmniShelf AI
          </span>
        </button>
        
        {/* Back Link */}
        <button 
          onClick={() => onNavigate("home")}
          className="text-[14px] text-[#3498db] hover:text-[#2980b9] transition-colors"
          style={{ fontWeight: 600 }}
        >
          Back to Home
        </button>
      </div>
    </nav>
  );
}