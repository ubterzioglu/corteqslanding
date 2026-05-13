import { useEffect } from "react";
import Founding1000Section from "@/components/Founding1000Section";
import FooterSection from "@/components/FooterSection";

const Founding1000Page = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main id="main">
        <Founding1000Section />
      </main>
      <FooterSection />
    </div>
  );
};

export default Founding1000Page;
