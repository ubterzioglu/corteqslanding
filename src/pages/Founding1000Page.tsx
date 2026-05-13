import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Founding1000Section from "@/components/Founding1000Section";
import FooterSection from "@/components/FooterSection";

const Founding1000Page = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main id="main">
        <div className="container mx-auto px-4 pt-6 pb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
        </div>
        <Founding1000Section />
      </main>
      <FooterSection />
    </div>
  );
};

export default Founding1000Page;
