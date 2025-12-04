import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { TabBar } from "./ui/TabBar";
import { Grid2x2, Boxes, LineChart, Sparkles, Bell } from "lucide-react";

export function AdminShell() {
  const tabs = [
    { label: "Dashboard", to: "/admin/dashboard", icon: Grid2x2, variant: "admin" as const },
    { label: "Inventory", to: "/admin/inventory", icon: Boxes, variant: "admin" as const },
    { label: "Analytics", to: "/admin/analytics", icon: LineChart, variant: "admin" as const },
    { label: "AI & Model", to: "/admin/ai-model", icon: Sparkles, variant: "admin" as const },
    { label: "Alerts", to: "/admin/alerts", icon: Bell, variant: "admin" as const },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navigation />
      <div className="border-b border-[#e5e7eb] bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3 text-[13px] text-[#475569]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0f172a]">Secure workspace</span>
            <span>• Store Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="font-semibold text-[#0f172a]">Store:</span>
            <span>Demo Store</span>
          </div>
        </div>
        <TabBar tabs={tabs} />
      </div>
      <Outlet />
    </div>
  );
}
