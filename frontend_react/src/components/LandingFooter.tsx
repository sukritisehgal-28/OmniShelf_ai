import { Package, Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react";

interface LandingFooterProps {
  onNavigate: (page: string) => void;
}

export function LandingFooter({ onNavigate }: LandingFooterProps) {
  return (
    <footer className="bg-[#2c3e50] text-white py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-[#3498db]" />
              <span className="text-[20px]" style={{ fontWeight: 700 }}>
                OmniShelf AI
              </span>
            </div>
            <p className="text-[14px] text-[#94a3b8] leading-relaxed mb-6">
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

          {/* Product Column */}
          <div>
            <h4 className="text-[16px] mb-4" style={{ fontWeight: 700 }}>
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate("features")}
                  className="text-[14px] text-[#94a3b8] hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate("smartcart")}
                  className="text-[14px] text-[#94a3b8] hover:text-white transition-colors"
                >
                  SmartCart Assistant
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate("admin")}
                  className="text-[14px] text-[#94a3b8] hover:text-white transition-colors"
                >
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button className="text-[14px] text-[#94a3b8] hover:text-white transition-colors">
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[16px] mb-4" style={{ fontWeight: 700 }}>
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <button className="text-[14px] text-[#94a3b8] hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-[14px] text-[#94a3b8] hover:text-white transition-colors">
                  Careers
                </button>
              </li>
              <li>
                <button className="text-[14px] text-[#94a3b8] hover:text-white transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button className="text-[14px] text-[#94a3b8] hover:text-white transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[16px] mb-4" style={{ fontWeight: 700 }}>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#3498db]" />
                <span className="text-[14px] text-[#94a3b8]">
                  hello@omnishelf.ai
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#3498db]" />
                <span className="text-[14px] text-[#94a3b8]">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#3498db] mt-1" />
                <span className="text-[14px] text-[#94a3b8]">
                  123 Retail Ave<br />
                  San Francisco, CA 94102
                </span>
              </li>
            </ul>
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
