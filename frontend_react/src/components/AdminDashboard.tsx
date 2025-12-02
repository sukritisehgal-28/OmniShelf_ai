import { AdminSidebar } from "./AdminSidebar";
import { CriticalAlerts } from "./CriticalAlerts";
import { StoreMetrics } from "./StoreMetrics";
import { StockVisualization } from "./StockVisualization";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { InventoryTable } from "./InventoryTable";
import { QuickActions } from "./QuickActions";

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <AdminSidebar activePage="overview" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-[28px] text-[#1f2933] mb-2" style={{ fontWeight: 700 }}>
              Store Overview & Alerts
            </h1>
            <p className="text-[14px] text-[#6b7280]">
              Real-time shelf analytics and critical stock notifications
            </p>
          </div>
          
          {/* Critical Alerts Section */}
          <CriticalAlerts />
          
          {/* Store Performance Metrics */}
          <StoreMetrics />
          
          {/* Stock Visualization */}
          <StockVisualization />
          
          {/* Category Breakdown */}
          <CategoryBreakdown />
          
          {/* Inventory Table */}
          <InventoryTable />
          
          {/* Quick Actions */}
          <QuickActions />
        </div>
      </main>
    </div>
  );
}
