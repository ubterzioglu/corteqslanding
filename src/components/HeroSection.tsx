import { useState } from "react";
import heroLandmarks from "@/assets/hero-landmarks.jpg";
import { Globe, MapPin, Users, Mail } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";

const HeroSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-card to-secondary/30">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img src="/logocorteqsbig.png" alt="CorteQS Logo" className="w-[70%] mb-6" />
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium tracking-wider">Türk Diaspora Platformu</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Diasporayı Birleştiren{" "}
              <span className="text-accent">Platform</span>{" "}
              Yakında
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Corteqs Diaspora Connect — dünyanın dört bir yanındaki Türk diasporasını ve diğer diaspora topluluklarını danışmanlar, işletmeler, kuruluşlar ve bireylerle bir araya getiren platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Hemen Kaydol — Erken Avantajli Erisimden Faydalan →
              </button>
              <a
                href="#kategoriler"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-secondary transition-all"
              >
                Kategorileri Gör
              </a>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">Ödüllü Blog Yazısı Yarışmamız Başlıyor!</p>
                  <p className="text-xs text-muted-foreground">En iyi diaspora blog yazısını yaz, ödülleri kazan.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-2xl">⏳</span>
                <div>
                  <p className="font-semibold text-foreground text-sm">Yakında Açılıyor — Erken Kayıt Avantajları</p>
                  <p className="text-xs text-muted-foreground">İlk kayıt olanlar özel ayrıcalıklardan yararlanacak.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block rounded-2xl overflow-hidden">
            <img
              src={heroLandmarks}
              alt="Dunya genelinde diaspora topluluklarini birlestiren CorteQS platformu"
              className="w-full h-auto [filter:brightness(0.95)_saturate(0.85)_contrast(0.95)]"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-card/40 via-card/10 to-primary/15 mix-blend-soft-light" />
            <div className="absolute inset-0 bg-card/15" />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">164 Ulke</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">8.8 Milyon Turk</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">120.000+ Kurulus</span>
          </div>
          <nav className="flex flex-wrap gap-4 ml-auto" aria-label="Bolum navigasyonu">
            <a href="#hakkinda" className="text-sm text-muted-foreground hover:text-primary transition-colors">Hakkimizda</a>
            <a href="#kategoriler" className="text-sm text-muted-foreground hover:text-primary transition-colors">Kategoriler</a>
            <a href="#elciler" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sehir Elcilieri</a>
            <a href="#destek" className="text-sm text-muted-foreground hover:text-primary transition-colors">Destek</a>
          </nav>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} />
    </section>
  );
};

export default HeroSection;
