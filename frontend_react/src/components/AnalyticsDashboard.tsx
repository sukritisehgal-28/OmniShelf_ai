import { AdminSidebar } from "./AdminSidebar";
import { AnalyticsFilters } from "./AnalyticsFilters";
import { TotalStockChart } from "./TotalStockChart";
import { ProductLevelTrends } from "./ProductLevelTrends";
import { StockVelocityTable } from "./StockVelocityTable";
import { VelocityHighlights } from "./VelocityHighlights";
import { DetailedDataSection } from "./DetailedDataSection";

interface AnalyticsDashboardProps {
  onNavigate?: (page: string) => void;
}

export function AnalyticsDashboard({ onNavigate }: AnalyticsDashboardProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <AdminSidebar activePage="analytics" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-[28px] text-[#1f2933] mb-2" style={{ fontWeight: 700 }}>
              Analytics Dashboard
            </h1>
            <p className="text-[14px] text-[#6b7280]">
              Stock trends and performance over time.
            </p>
          </div>
          
          {/* Filters */}
          <AnalyticsFilters />
          
          {/* Section 1: Total Stock Over Time */}
          <TotalStockChart />
          
          {/* Section 2: Product-Level Trends */}
          <ProductLevelTrends />
          
          {/* Section 3: Stock Velocity */}
          <StockVelocityTable />
          
          {/* Highlight Cards */}
          <VelocityHighlights />
          
          {/* Section 4: Detailed Data */}
          <DetailedDataSection />
        </div>
      </main>
    </div>
  );
}
