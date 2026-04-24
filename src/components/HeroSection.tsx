import { useState } from "react";
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
              {[
                "Berlin",
                "Londra",
                "New York",
                "Paris",
                "Amsterdam",
                "Dubai",
                "Toronto",
                "Sydney",
                "İstanbul",
              ].map((city) => (
                <span
                  key={city}
                  className="inline-flex h-7 w-[104px] items-center justify-center rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground/80 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  {city}
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

            <div className="mt-8 space-y-2 max-w-md">
              <div className="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-accent/5 border border-accent/20 w-full">
                <span className="text-base">🏆</span>
                <p className="font-semibold text-foreground text-xs">Ödüllü Blog Yazısı Yarışmamız Başlıyor!</p>
              </div>
              <button
                onClick={() => setFormOpen(true)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all w-full"
              >
                <span className="text-base">⏳</span>
                <p className="font-semibold text-foreground text-xs">Yakında Açılıyoruz — Erken Kayıt Avantajlarından Faydalan →</p>
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
