import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import AmbassadorSection from "@/components/AmbassadorSection";
import BloggerSection from "@/components/BloggerSection";
import SupportSection from "@/components/SupportSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <AmbassadorSection />
      <BloggerSection />
      <SupportSection />
      <FooterSection />
    </div>
  );
};

export default Index;
