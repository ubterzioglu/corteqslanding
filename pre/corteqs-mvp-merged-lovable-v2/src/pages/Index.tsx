import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InternationalDiasporaHero from "@/components/InternationalDiasporaHero";
import DiasporaSearchBar from "@/components/DiasporaSearchBar";
import RadarNewsMarquee from "@/components/RadarNewsMarquee";
import ConsultantCategories from "@/components/ConsultantCategories";
import FeaturedConsultants from "@/components/FeaturedConsultants";
import FeaturedEvents from "@/components/FeaturedEvents";
import AssociationsSection from "@/components/AssociationsSection";
import BusinessesSection from "@/components/BusinessesSection";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";
import FloatingDotsBackground from "@/components/FloatingDotsBackground";
import { useDiaspora } from "@/contexts/DiasporaContext";

const Index = () => {
  const { diaspora } = useDiaspora();
  const isInternational = diaspora !== "tr";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {!isInternational && <FloatingDotsBackground />}

      <Navbar />
      {isInternational ? (
        <div className="relative z-10">
          <InternationalDiasporaHero />
        </div>
      ) : (
        <div className="relative z-10">
          <HeroSection />
          <SectionErrorBoundary sectionName="DiasporaSearchBar">
            <DiasporaSearchBar />
          </SectionErrorBoundary>
          <SectionErrorBoundary sectionName="CorteQSRadar">
            <RadarNewsMarquee />
          </SectionErrorBoundary>
          <ConsultantCategories />
          <FeaturedConsultants />
          <AssociationsSection />
          <BusinessesSection />
          <FeaturedEvents />
        </div>
      )}
    </div>
  );
};

export default Index;
