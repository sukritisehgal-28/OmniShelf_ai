import { AdminSidebar } from "./AdminSidebar";
import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardFilters } from "./DashboardFilters";
import { MainStockChart } from "./MainStockChart";
import { SecondaryCharts } from "./SecondaryCharts";
import { ShelfInventoryTable } from "./ShelfInventoryTable";
import { DashboardSummary } from "./DashboardSummary";

interface StoreDashboardProps {
  onNavigate?: (page: string) => void;
}

export function StoreDashboard({ onNavigate }: StoreDashboardProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <AdminSidebar activePage="dashboard" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-[28px] text-[#1f2933] mb-2" style={{ fontWeight: 700 }}>
              Store Dashboard
            </h1>
            <p className="text-[14px] text-[#6b7280]">
              Real-time shelf analytics powered by OmniShelf AI.
            </p>
          </div>
          
          {/* Top Metrics Row */}
          <DashboardMetrics />
          
          {/* Filters Bar */}
          <DashboardFilters />
          
          {/* Main Chart Area */}
          <MainStockChart />
          
          {/* Secondary Charts */}
          <SecondaryCharts />
          
          {/* Inventory Table */}
          <ShelfInventoryTable />
          
          {/* Summary Section */}
          <DashboardSummary />
        </div>
      </main>
    </div>
  );
}
