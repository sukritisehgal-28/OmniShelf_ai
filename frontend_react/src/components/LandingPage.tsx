import { LandingNav } from "./LandingNav";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { ModelPerformanceSection } from "./ModelPerformanceSection";
import { RoleCardsSection } from "./RoleCardsSection";
import { LandingFooter } from "./LandingFooter";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <ModelPerformanceSection />
      <RoleCardsSection />
      <LandingFooter />
    </div>
  );
}
