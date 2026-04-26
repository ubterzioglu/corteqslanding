import Founding1000Section from "@/components/Founding1000Section";
import FooterSection from "@/components/FooterSection";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Founding1000Page = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-amber-300 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana sayfaya dön
        </Link>
      </div>
      <Founding1000Section />
      <FooterSection />
    </div>
  );
};

export default Founding1000Page;
