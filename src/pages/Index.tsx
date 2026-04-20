import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import AmbassadorSection from "@/components/AmbassadorSection";
import BloggerSection from "@/components/BloggerSection";
import FAQSection from "@/components/FAQSection";
import CitiesSection from "@/components/CitiesSection";
import SupportSection from "@/components/SupportSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  return (
    <div className="min-h-screen">
      <main id="main">
        <HeroSection />
        <AboutSection />
        <FAQSection />
        <CategoriesSection />
        <CitiesSection />
        <AmbassadorSection />
        <BloggerSection />
        <SupportSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
