import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { UserShell } from "./components/UserShell";
import { AdminHome } from "./components/AdminHome";
import { SmartCartAssistant } from "./components/SmartCartAssistant";
import { VisualSearch } from "./components/VisualSearch";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

const LandingPageWrapper = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    if (page === "admin") navigate("/admin/dashboard");
    else if (page === "smartcart") navigate("/user/smartcart");
    else navigate("/");
  };
  return <LandingPage onNavigate={handleNavigate} />;
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    if (page === "home") navigate("/");
    else navigate(`/${page}`);
  };
  return <AdminHome onNavigate={handleNavigate} />;
};

const SmartCartAssistantPage = () => <SmartCartAssistant onNavigate={() => {}} />;

const VisualSearchPage = () => {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    if (page === "user_home") navigate("/user/smartcart");
    else navigate("/");
  };
  return <VisualSearch onNavigate={handleNavigate} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

        <Route element={<UserShell />}>
          <Route path="/user/smartcart" element={<SmartCartAssistantPage />} />
          <Route path="/user/visual-search" element={<VisualSearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
