import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import CitiesSection from "@/components/CitiesSection";
import ChatRegisterBar from "@/components/ChatRegisterBar";
import AmbassadorSection from "@/components/AmbassadorSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <CitiesSection />
      <ChatRegisterBar />
      <AmbassadorSection />
      <FooterSection />
    </div>
  );
};

export default Index;
