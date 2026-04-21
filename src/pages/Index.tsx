import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import ChatRegisterBar from "@/components/ChatRegisterBar";
import AmbassadorSection from "@/components/AmbassadorSection";
import FAQSection from "@/components/FAQSection";
import CitiesSection from "@/components/CitiesSection";
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
        <ChatRegisterBar />
        <AmbassadorSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
