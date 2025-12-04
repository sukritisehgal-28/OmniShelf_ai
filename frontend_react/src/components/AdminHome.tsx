import { useState } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { DashboardMetrics } from "./DashboardMetrics";
import { StockVisualization } from "./StockVisualization";
import { InventoryTable } from "./InventoryTable";
import { AnalyticsSummaryCards } from "./AnalyticsSummaryCards";
import { CriticalAlerts } from "./CriticalAlerts";
import { ModelPerformancePanel } from "./ModelPerformancePanel";
import { SecondaryCharts } from "./SecondaryCharts";
import { DashboardSummary } from "./DashboardSummary";
import { RealAnalyticsDashboard } from "./RealAnalyticsDashboard";
import { ShelfScanner } from "./ShelfScanner";

interface AdminHomeProps {
  onNavigate: (page: string) => void;
  email?: string;
}

const TABS = ["Dashboard", "Shelf Scanner", "Inventory"] as const;

export function AdminHome({ onNavigate, email: _email }: AdminHomeProps) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Dashboard");

  return (
    <div className="min-h-screen bg-[#f8f9fa]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header className="bg-white border-b border-[#e5e7eb] px-8 py-4 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-[#3498db]" />
            <span className="text-[22px] text-[#2c3e50]" style={{ fontWeight: 700 }}>
              OmniShelf AI
            </span>
          </div>

          {/* Tabs Section */}
          <div className="flex items-center gap-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-6 py-2.5 rounded-lg text-[14px] transition-all ${
                  active === tab 
                    ? "bg-[#3498db] text-white shadow-md" 
                    : "bg-transparent text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#2c3e50]"
                }`}
                style={{ fontWeight: 600 }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Back Button */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 px-4 py-2 text-[14px] text-[#64748b] hover:text-[#2c3e50] hover:bg-[#f1f5f9] rounded-lg transition-colors"
            style={{ fontWeight: 600 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-8 space-y-8">
        {active === "Dashboard" && (
          <div className="space-y-6">
            <ModelPerformancePanel />
            <DashboardMetrics />
            <SecondaryCharts />
            <DashboardSummary />
            
            {/* Quick Preview: Analytics */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] text-[#111827]" style={{ fontWeight: 800 }}>Stock Analytics</h3>
              </div>
              <AnalyticsSummaryCards />
            </div>
            
            {/* Quick Preview: Critical Alerts */}
            <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] text-[#111827]" style={{ fontWeight: 800 }}>Inventory Alerts</h3>
                <button
                  onClick={() => setActive("Inventory")}
                  className="text-[13px] text-[#0ea5e9] hover:text-[#0284c7]" style={{ fontWeight: 600 }}
                >
                  View Inventory →
                </button>
              </div>
              <CriticalAlerts />
            </div>
          </div>
        )}

        {active === "Shelf Scanner" && (
          <ShelfScanner />
        )}

        {active === "Inventory" && (
          <div className="space-y-6">
            <InventoryTable />
          </div>
        )}
      </main>
    </div>
  );
}
