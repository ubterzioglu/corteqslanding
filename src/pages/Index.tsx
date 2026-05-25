import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import DiasporaMarqueeSection from "@/components/DiasporaMarqueeSection";
import ChatBot from "@/components/chat/ChatBot";
import FAQSection from "@/components/FAQSection";
import SEOContentSection from "@/components/SEOContentSection";
import NetworkOverviewSection from "@/components/NetworkOverviewSection";
import LandingFoundersSection from "@/components/LandingFoundersSection";

const SectionBridge = () => (
  <div className="relative z-10 -mt-4 h-12 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    <div className="absolute inset-x-10 inset-y-2 rounded-full bg-gradient-to-r from-primary/8 via-white/45 to-accent/8 blur-2xl" />
    <div className="absolute inset-x-24 bottom-0 h-8 bg-gradient-to-b from-white/0 via-white/35 to-white/0 blur-xl" />
  </div>
);

const Index = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  return (
    <div className="landing-ambient min-h-screen">
      <div className="landing-ambient-orb landing-ambient-orb-one" aria-hidden="true" />
      <div className="landing-ambient-orb landing-ambient-orb-two" aria-hidden="true" />
      <div className="landing-ambient-orb landing-ambient-orb-three" aria-hidden="true" />
      <main id="main" className="relative isolate overflow-hidden pb-8">
        <HeroSection />
        <SectionBridge />
        <SEOContentSection />
        <SectionBridge />
        <FAQSection />
        <SectionBridge />
        <DiasporaMarqueeSection />
        <SectionBridge />
        <NetworkOverviewSection />
        <SectionBridge />
        <LandingFoundersSection />
        <ChatBot />
      </main>
    </div>
  );
};

export default Index;
