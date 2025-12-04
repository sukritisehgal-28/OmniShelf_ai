import { Package, Twitter, Linkedin, Github } from "lucide-react";

interface LandingFooterProps {
  onNavigate: (page: string) => void;
}

export function LandingFooter({ onNavigate }: LandingFooterProps) {
  return (
    <footer className="bg-[#2c3e50] text-white py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col items-center mb-12 text-center">
          {/* Brand Column */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-[#3498db]" />
              <span className="text-[20px]" style={{ fontWeight: 700 }}>
                OmniShelf AI
              </span>
            </div>
            <p className="text-[14px] text-[#94a3b8] leading-relaxed mb-6 max-w-md">
              Transforming retail operations with intelligent shelf monitoring and real-time analytics.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between">
          <p className="text-[13px] text-[#94a3b8]">
            © 2024 OmniShelf AI. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <button className="text-[13px] text-[#94a3b8] hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button className="text-[13px] text-[#94a3b8] hover:text-white transition-colors">
              Terms of Service
            </button>
            <button className="text-[13px] text-[#94a3b8] hover:text-white transition-colors">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
