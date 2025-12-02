import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="w-full bg-gradient-to-br from-[#e3f2fd] via-white to-[#f5f5f5] px-8 py-20">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <div className="inline-block bg-[#3498db]/10 text-[#3498db] px-4 py-2 rounded-full mb-4 text-[13px]" style={{ fontWeight: 600 }}>
            AI-Powered Shelf Monitoring
          </div>

          <h1 className="text-[48px] mb-4" style={{ fontWeight: 800, color: '#1f2933', lineHeight: 1.1 }}>
            Smart Retail Intelligence Platform
          </h1>

          <p className="text-[18px] text-[#6b7280] mb-8 leading-relaxed">
            Real-time shelf analytics, intelligent stock monitoring, and AI-powered customer assistance.
            Reduce stockouts by 70% and enhance shopping experiences.
          </p>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate?.("admin")}
              className="bg-[#3498db] text-white hover:bg-[#2980b9] px-8 h-12 rounded-lg"
            >
              Get Started
            </Button>
            <Button
              onClick={() => onNavigate?.("smartcart")}
              variant="outline"
              className="border-[#3498db] text-[#3498db] hover:bg-[#3498db]/10 px-8 h-12 rounded-lg"
            >
              Watch Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[#e5e7eb]">
            <div>
              <div className="text-[32px] text-[#3498db]" style={{ fontWeight: 800 }}>
                70%
              </div>
              <div className="text-[14px] text-[#6b7280]">
                Stockout Reduction
              </div>
            </div>
            <div>
              <div className="text-[32px] text-[#3498db]" style={{ fontWeight: 800 }}>
                95%
              </div>
              <div className="text-[14px] text-[#6b7280]">
                Inventory Accuracy
              </div>
            </div>
            <div>
              <div className="text-[32px] text-[#3498db]" style={{ fontWeight: 800 }}>
                2x
              </div>
              <div className="text-[14px] text-[#6b7280]">
                Faster Restocking
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Visual */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#e5e7eb]">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
              alt="Smart retail shelf monitoring"
              className="w-full h-[400px] object-cover rounded-2xl mb-6"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8f9fa] p-4 rounded-xl">
                <div className="text-[24px] text-[#3498db]" style={{ fontWeight: 700 }}>
                  24/7
                </div>
                <div className="text-[13px] text-[#6b7280]">
                  Live Monitoring
                </div>
              </div>
              
              <div className="bg-[#f8f9fa] p-4 rounded-xl">
                <div className="text-[24px] text-[#22c55e]" style={{ fontWeight: 700 }}>
                  Real-time
                </div>
                <div className="text-[13px] text-[#6b7280]">
                  AI Insights
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
