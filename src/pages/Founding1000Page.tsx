import { useEffect } from "react";
import Founding1000Section from "@/components/Founding1000Section";
import FooterSection from "@/components/FooterSection";
import May19SharedHeader from "@/components/may19/May19SharedHeader";

const Founding1000Page = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <May19SharedHeader />
      <main id="main">
        <Founding1000Section />
      </main>
      <FooterSection />
    </div>
  );
};

export default Founding1000Page;
