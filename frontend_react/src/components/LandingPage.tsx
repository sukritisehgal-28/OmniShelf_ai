import { LandingNav } from "./LandingNav";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { RoleCardsSection } from "./RoleCardsSection";
import { LandingFooter } from "./LandingFooter";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <LandingNav onNavigate={onNavigate} />
      <HeroSection onNavigate={onNavigate} />
      <FeaturesSection />
      <RoleCardsSection onNavigate={onNavigate} />
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
}
