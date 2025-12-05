import { Outlet, useNavigate } from "react-router-dom";
import { Navigation } from "./Navigation";
import { ArrowLeft } from "lucide-react";

export function UserShell() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#f8f9fa]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navigation showAdminCta={false} />
      <div className="border-b border-[#e5e7eb] bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#4f46e5] flex items-center justify-center text-white text-[16px]" style={{ fontWeight: 800 }}>
              U
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[18px] text-[#0f172a]" style={{ fontWeight: 800 }}>Hello, Shopper!</span>
              <div className="flex items-center gap-2 text-[13px] text-[#6b7280]">
                <span className="text-[#10b981]" style={{ fontWeight: 700 }}>Online</span>
                <span className="text-[#9ca3af]">• Secure workspace</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 text-[13px] text-[#64748b] hover:text-[#2c3e50] hover:bg-[#f1f5f9] rounded-lg transition-colors"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
