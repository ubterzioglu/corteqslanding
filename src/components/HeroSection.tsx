import { useState } from "react";
import { Link } from "react-router-dom";
import heroLandmarks from "@/assets/hero-landmarks-watercolor.png";
import corteqsLogo from "@/assets/seologo.png";
import {
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
  HandHeart,
  MapPin,
  Network,
  Radio,
  Users,
} from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";

const heroStats = [
  { label: "164 Ülke", icon: MapPin },
  { label: "8.8 Milyon Türk", icon: Users },
  { label: "120.000+ Kuruluş", icon: Building2 },
  { label: "35.000+ Türk Girişimi", icon: BriefcaseBusiness },
  { label: "50.000+ Öğrenci", icon: GraduationCap },
  { label: "10.000+ Akademisyen", icon: BookOpen },
  { label: "5.000+ STK", icon: HandHeart },
  { label: "2.000+ Medya & Yayın Platformu", icon: Radio },
  { label: "1.000+ Kültürel Etkinlik (yıllık)", icon: CalendarDays },
  { label: "500+ Profesyonel Ağ & Topluluk", icon: Network },
];

const heroCities = [
  { name: "Berlin", className: "border-amber-400/35 bg-amber-50 text-amber-800 hover:border-amber-500 hover:bg-amber-100" },
  { name: "Londra", className: "border-sky-400/35 bg-sky-50 text-sky-800 hover:border-sky-500 hover:bg-sky-100" },
  { name: "New York", className: "border-indigo-400/35 bg-indigo-50 text-indigo-800 hover:border-indigo-500 hover:bg-indigo-100" },
  { name: "Paris", className: "border-rose-400/35 bg-rose-50 text-rose-800 hover:border-rose-500 hover:bg-rose-100" },
  { name: "Amsterdam", className: "border-orange-400/35 bg-orange-50 text-orange-800 hover:border-orange-500 hover:bg-orange-100" },
  { name: "Dubai", className: "border-emerald-400/35 bg-emerald-50 text-emerald-800 hover:border-emerald-500 hover:bg-emerald-100" },
  { name: "Toronto", className: "border-red-400/35 bg-red-50 text-red-800 hover:border-red-500 hover:bg-red-100" },
  { name: "Sydney", className: "border-cyan-400/35 bg-cyan-50 text-cyan-800 hover:border-cyan-500 hover:bg-cyan-100" },
  { name: "İstanbul", className: "border-teal-400/35 bg-teal-50 text-teal-800 hover:border-teal-500 hover:bg-teal-100" },
  { name: "Roma", className: "border-lime-400/35 bg-lime-50 text-lime-800 hover:border-lime-500 hover:bg-lime-100" },
];

const HeroSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-card to-secondary/30">
      {/* Hero illustration — sits between logo bottom and CTA bottom */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <img
          src={heroLandmarks}
          alt="CorteQS Diaspora Connect - Almanya ve Avrupa'daki Türk Diaspora Ağı ve Şehir Rehberi"
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
              Türk Diasporasını Birleştiren{" "}
              <span className="text-accent">Platform</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-foreground/90 mb-6 tracking-tight">
              Yeni ülke, yeni şehir, yeni bağlantılar
            </p>
<p className="text-lg text-muted-foreground mb-6 max-w-xl leading-relaxed hero-description">
  Global Ağ<br />
  Berlin'den Sydney'e, New York'tan Dubai'ye. Dünyanın dört bir yanındaki Türk topluluğuyla bağlantı kurun ve global ağınızı genişletin.
</p>

            <div className="mb-8 flex max-w-xl flex-wrap gap-2">
              {heroCities.map((city) => (
                <span
                  key={city.name}
                  className={`inline-flex h-7 w-[104px] items-center justify-center rounded-full border px-3 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${city.className}`}
                >
                  {city.name}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4 w-fit">
              <a
                href="#kaydol"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-orange-500 text-white font-semibold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
              >
                Ücretsiz Kayıt Ol →
              </a>
              <a
                href="https://chat.whatsapp.com/IOpBgZK29CQEhhdOd5hUAD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                WhatsApp Grubuna Katıl →
              </a>
            </div>

            <div className="mt-6 flex flex-col gap-3 max-w-xl">
              <Link
                to="/founding-1000"
                className="group relative inline-flex flex-col items-center justify-center px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-base hover:from-amber-400 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/30"
              >
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-bold tracking-wider uppercase shadow-md">
                  Erken Erişim
                </span>
                <span>🌍 Founding 1000'e Katıl →</span>
                <span className="mt-1 text-[11px] font-semibold tracking-wide text-slate-900/80 uppercase">
                  Danışmanlar · İşletmeler · Kuruluşlar · Vloggerlar
                </span>
              </Link>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  to="/blogger-yarismasi"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-primary/30 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/10 hover:border-primary/50 transition-all"
                >
                  ✍️ Blogger Yarışması →
                </Link>
                <Link
                  to="/vlogger-yarismasi"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-accent/30 bg-accent/5 text-accent font-semibold text-sm hover:bg-accent/10 hover:border-accent/50 transition-all"
                >
                  🎥 Vlogger Yarışması →
                </Link>
              </div>
            </div>

            <div className="mt-8 max-w-xl space-y-3">
              <div className="inline-flex w-full items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
                <span className="text-xl">🏆</span>
                <p className="text-sm font-semibold text-foreground md:text-base">Ödüllü Blog Yazısı Yarışmamız Başlıyor!</p>
              </div>
              <button
                onClick={() => setFormOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 transition-all hover:border-primary/40 hover:bg-primary/10"
              >
                <span className="text-xl">⏳</span>
                <p className="text-left text-sm font-semibold text-foreground md:text-base">Yakında Açılıyoruz — Erken Kayıt Avantajlarından Faydalan →</p>
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block" aria-hidden>
            {/* Spacer column — hero image is now a full-width background */}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-12 grid grid-cols-2 gap-3 border-t border-border pt-8 sm:grid-cols-3 lg:grid-cols-5">
          {heroStats.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex min-h-14 items-center gap-2 rounded-lg border border-border/70 bg-card/70 px-3 py-2 text-muted-foreground shadow-sm backdrop-blur-sm"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm font-semibold leading-snug text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} />
    </section>
  );
};

export default HeroSection;
