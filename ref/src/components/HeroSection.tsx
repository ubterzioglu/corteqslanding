import { useState } from "react";
import { Link } from "react-router-dom";
import heroLandmarks from "@/assets/hero-watercolor.png";
import corteqsLogo from "@/assets/corteqs-logo-globe.png";
import { Globe, MapPin, Users, Mail } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";

const HeroSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-card to-secondary/30">
      {/* Hero illustration — sits between logo bottom and CTA bottom */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <img
          src={heroLandmarks}
          alt=""
          className="absolute right-[2%] top-[22%] h-[45%] w-auto max-w-[55%] object-contain [filter:brightness(0.98)_saturate(1.02)_contrast(1.0)] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_92%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_92%)]"
          width={1480}
          height={860}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img src={corteqsLogo} alt="CorteQS Logo" className="w-[70%] mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 leading-tight">
              Diasporayı Birleştiren{" "}
              <span className="text-accent">Platform</span>{" "}
              Yakında
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-foreground/90 mb-6 tracking-tight">
              Global Türklerin Platformu
            </p>
            <p className="text-lg text-muted-foreground mb-6 max-w-xl leading-relaxed">
              Corteqs Diaspora Connect — dünyanın dört bir yanındaki Türk diasporasını ve diğer diaspora topluluklarını danışmanlar, işletmeler, kuruluşlar ve bireylerle bir araya getiren platform.
            </p>

            {/* Global cities tagline */}
            <div className="flex flex-wrap gap-2 mb-8 max-w-xl">
              {[
                "🇩🇪 Berlin",
                "🇬🇧 Londra",
                "🇺🇸 New York",
                "🇫🇷 Paris",
                "🇳🇱 Amsterdam",
                "🇦🇪 Dubai",
                "🇨🇦 Toronto",
                "🇦🇺 Sydney",
                "🇹🇷 İstanbul",
              ].map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-card border border-border text-xs font-medium text-foreground/80 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  {city}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/founding-1000"
                className="group relative inline-flex flex-col items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-lg hover:from-amber-400 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/30"
              >
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-bold tracking-wider uppercase shadow-md">
                  Erken Erişim
                </span>
                <span>🌍 Founding 1000'e Katıl →</span>
                <span className="mt-1 text-[11px] font-semibold tracking-wide text-slate-900/80 uppercase">
                  Danışmanlar · İşletmeler · Kuruluşlar · Vloggerlar
                </span>
              </Link>
            </div>

            <div className="mt-8 space-y-2 max-w-md">
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/blogger-yarismasi"
                  className="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all w-fit"
                >
                  <span className="text-base">✍️</span>
                  <p className="font-semibold text-foreground text-xs">Blogger Yarışması →</p>
                </Link>
                <Link
                  to="/vlogger-yarismasi"
                  className="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all w-fit"
                >
                  <span className="text-base">🎥</span>
                  <p className="font-semibold text-foreground text-xs">Vlogger Yarışması →</p>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block" aria-hidden>
            {/* Spacer column — hero image is now a full-width background */}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">164 Ülke</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">8.8 Milyon Türk</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">120.000+ Kuruluş</span>
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} />
    </section>
  );
};

export default HeroSection;
