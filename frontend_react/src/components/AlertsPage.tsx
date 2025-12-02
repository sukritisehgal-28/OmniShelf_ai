import { AdminSidebar } from "./AdminSidebar";
import { AlertFilters } from "./AlertFilters";
import { ActiveAlertsList } from "./ActiveAlertsList";
import { AlertSettings } from "./AlertSettings";
import { AlertHistory } from "./AlertHistory";

interface AlertsPageProps {
  onNavigate?: (page: string) => void;
}

export function AlertsPage({ onNavigate }: AlertsPageProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <AdminSidebar activePage="alerts" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-[28px] text-[#1f2933] mb-2" style={{ fontWeight: 700 }}>
              Stock Alerts & Notifications
            </h1>
            <p className="text-[14px] text-[#6b7280]">
              Monitor critical stock changes and adjust alert rules.
            </p>
          </div>
          
          {/* Active Alerts Section */}
          <div>
            <h2 className="text-[22px] text-[#1f2933] mb-5" style={{ fontWeight: 700 }}>
              Active Alerts
            </h2>
            
            {/* Filters */}
            <AlertFilters />
            
            {/* Alerts List */}
            <ActiveAlertsList />
          </div>
          
          {/* Alert Settings Section */}
          <div className="pt-4">
            <AlertSettings />
          </div>
          
          {/* Alert History Section */}
          <div className="pt-4">
            <AlertHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
