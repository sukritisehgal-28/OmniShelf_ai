import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { AdminShell } from "./components/AdminShell";
import { UserShell } from "./components/UserShell";
import { AdminDashboard } from "./components/AdminDashboard";
import { StoreDashboard } from "./components/StoreDashboard";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { AlertsPage } from "./components/AlertsPage";
import { SmartCartAssistant } from "./components/SmartCartAssistant";
import { ModelPerformanceSection } from "./components/ModelPerformanceSection";

const AdminDashboardPage = () => <AdminDashboard onNavigate={() => {}} />;
const AdminInventoryPage = () => <StoreDashboard onNavigate={() => {}} />;
const AdminAnalyticsPage = () => <AnalyticsDashboard onNavigate={() => {}} />;
const AdminAlertsPage = () => <AlertsPage onNavigate={() => {}} />;
const AdminModelPage = () => (
  <div className="bg-[#f8f9fa]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
    <div className="max-w-7xl mx-auto px-6 py-10">
      <ModelPerformanceSection />
    </div>
  </div>
);
const SmartCartAssistantPage = () => <SmartCartAssistant onNavigate={() => {}} />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<AdminShell />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/ai-model" element={<AdminModelPage />} />
          <Route path="/admin/alerts" element={<AdminAlertsPage />} />
        </Route>

        <Route element={<UserShell />}>
          <Route path="/user/smartcart" element={<SmartCartAssistantPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
