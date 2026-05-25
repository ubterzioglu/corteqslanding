import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import DiasporaMarqueeSection from "@/components/DiasporaMarqueeSection";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import ChatBot from "@/components/chat/ChatBot";
import FAQSection from "@/components/FAQSection";
import CitiesSection from "@/components/CitiesSection";
import SEOContentSection from "@/components/SEOContentSection";

const Index = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  return (
    <div className="min-h-screen">
      <main id="main">
        <HeroSection />
        <SEOContentSection />
        <FAQSection />
        <DiasporaMarqueeSection />
        <AboutSection />
        <div className="container mx-auto max-w-6xl px-4" aria-hidden="true">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        </div>
        <CategoriesSection />
        <CitiesSection />
        <ChatBot />
      </main>
    </div>
  );
};

export default Index;
