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
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
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
