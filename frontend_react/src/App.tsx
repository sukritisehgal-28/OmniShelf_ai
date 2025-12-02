import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { FeatureHighlights } from "./components/FeatureHighlights";
import { HowItWorks } from "./components/HowItWorks";
import { LoginSection } from "./components/LoginSection";
import { Footer } from "./components/Footer";
import { SmartCartAssistant } from "./components/SmartCartAssistant";
import { AdminDashboard } from "./components/AdminDashboard";
import { StoreDashboard } from "./components/StoreDashboard";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { AlertsPage } from "./components/AlertsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render SmartCart page
  if (currentPage === "smartcart") {
    return <SmartCartAssistant onNavigate={handleNavigate} />;
  }

  // Render Admin pages
  if (currentPage === "admin" || currentPage === "overview") {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "dashboard") {
    return <StoreDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "analytics") {
    return <AnalyticsDashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === "alerts") {
    return <AlertsPage onNavigate={handleNavigate} />;
  }

  // Default landing page
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navigation onNavigate={handleNavigate} />
      <HeroSection onNavigate={handleNavigate} />
      <FeatureHighlights />
      <HowItWorks />
      <LoginSection onNavigate={handleNavigate} />
      <Footer />
    </div>
  );
}