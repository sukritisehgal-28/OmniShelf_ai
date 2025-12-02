import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="w-full bg-[#2c3e50] px-8 py-12">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-white" />
          <span className="text-[18px] text-white" style={{ fontWeight: 700 }}>
            OmniShelf AI
          </span>
        </div>
        
        <div className="flex items-center gap-8">
          <a href="#privacy" className="text-[14px] text-[#e5e7eb] hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#terms" className="text-[14px] text-[#e5e7eb] hover:text-white transition-colors">
            Terms
          </a>
          <a href="#support" className="text-[14px] text-[#e5e7eb] hover:text-white transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
