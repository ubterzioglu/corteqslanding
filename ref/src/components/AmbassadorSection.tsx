import { useState } from "react";
import cityAmbassador from "@/assets/city-ambassador.jpg";
import { Sparkles, TrendingUp, Users, Globe2, Zap, Crown } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";

const perks = [
  { icon: Crown, title: "VIP — Sabit Gelir", desc: "VIP olduğunda sabit gelir: şehrinin, ülkenin iş partneri ol." },
  { icon: TrendingUp, title: "Influencer Büyüme", desc: "Sosyal medyanı CorteQS ağı ile patlat." },
  { icon: Users, title: "Etkinlik Lideri", desc: "Parti & etkinlik düzenle, sorunsuz ödeme al, feedback topla, veri tabanını aktif kullan." },
  { icon: Globe2, title: "Global Ağ", desc: "164 ülkedeki Şehir Elçisi / City Business Partner'larla doğrudan bağlan." },
  { icon: Zap, title: "Erken Avantajlar", desc: "Yeni özelliklere ilk sen eriş, gelir paylaş." },
  { icon: Sparkles, title: "İçerik Desteği", desc: "Profesyonel medya kiti ve kampanya desteği." },
];

const AmbassadorSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section
      id="elciler"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--accent) / 0.12) 0%, hsl(var(--primary) / 0.08) 50%, hsl(var(--background)) 100%)",
      }}
    >
      {/* Decorative gradient orbs */}
      <div
        className="pointer-events-none absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl opacity-30"
        style={{ background: "hsl(var(--accent))" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-25"
        style={{ background: "hsl(var(--primary))" }}
        aria-hidden
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 mb-4">
            <Crown className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              🌟 Şehir Elçisi / City Business Partner Programı
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-5 leading-tight">
            Şehrinin <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">İş Partneri</span> Ol
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Takipçi değil, <strong className="text-foreground">topluluk + iş</strong> inşa et. CorteQS Şehir Elçisi / City Business Partner olarak diasporanın merkezi sen ol — sabit gelir, görünürlük, gerçek etki.
          </p>
        </div>

        {/* Hero visual + perks grid */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: ambassador hero card */}
          <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src={cityAmbassador}
              alt="CorteQS Şehir Elçisi — Influencer"
              className="w-full h-full object-cover aspect-[4/5] transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              width={800}
              height={1000}
            />
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--accent) / 0.35) 0%, transparent 50%, hsl(var(--primary) / 0.45) 100%)",
              }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" aria-hidden />

            {/* Floating stat badges */}
            <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-card/95 backdrop-blur shadow-lg border border-border">
              <span className="text-xs font-bold text-accent">🔥 TRENDİNG</span>
            </div>
            <div className="absolute top-6 left-6 flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-card shadow"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--accent) / ${0.6 + i * 0.1}), hsl(var(--primary) / ${0.6 + i * 0.1}))`,
                  }}
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-card bg-card flex items-center justify-center text-[10px] font-bold text-primary shadow">
                +50
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Şehir Elçisi / City Business Partner · Berlin</p>
              <p className="text-foreground font-bold text-lg leading-tight">
                "CorteQS ile 6 ayda topluluğumu 3 katına çıkardım — artık sabit gelirim var."
              </p>
            </div>
          </div>

          {/* Right: perks */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {perks.map((perk, i) => (
                <div
                  key={perk.title}
                  className="group p-5 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2))`,
                    }}
                  >
                    <perk.icon className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-6 border-2 shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--accent) / 0.1) 0%, hsl(var(--primary) / 0.1) 100%)",
                borderColor: "hsl(var(--accent) / 0.3)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <p className="font-bold text-foreground text-lg mb-1">Elçi olmak 1 dakika sürer. 🚀</p>
                  <p className="text-sm text-muted-foreground">
                    Kayıt bırak, seni değerlendirelim. Seçilirsen özel onboarding paketin hazır.
                  </p>
                </div>
                <button
                  onClick={() => setFormOpen(true)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent to-primary text-accent-foreground font-bold text-base hover:shadow-2xl hover:shadow-accent/30 hover:scale-[1.02] transition-all shadow-lg"
                >
                  <Crown className="w-5 h-5" />
                  Elçi Olmak İstiyorum
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} defaultCategory="sehir-elcisi" />
    </section>
  );
};

export default AmbassadorSection;
