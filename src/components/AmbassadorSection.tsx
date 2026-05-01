import { useState } from "react";
import cityAmbassador from "@/assets/city-ambassador.jpg";
import { Sparkles, TrendingUp, Users, Globe2, Zap, Crown } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";

const perks = [
  { icon: Crown, title: "VIP — Sabit Gelir", desc: "VIP olduğunda sabit gelir: şehrinin, ülkenin iş partneri ol." },
  { icon: TrendingUp, title: "Influencer Büyüme", desc: "Sosyal medyanı CorteQS ağı ile patlat." },
  { icon: Users, title: "Etkinlik Lideri", desc: "Parti ve etkinlik düzenle, sorunsuz ödeme al, topluluğu aktif tut." },
  { icon: Globe2, title: "Global Ağ", desc: "Berlin'den Sydney'e, New York'tan Dubai'ye. Dünyanın dört bir yanındaki Türk topluluğuyla bağlantı kurun." },
  { icon: Zap, title: "Erken Avantajlar", desc: "Yeni özelliklere ilk sen eriş, gelir paylaşımına erkenden dahil ol." },
  { icon: Sparkles, title: "İçerik Desteği", desc: "Profesyonel medya kiti ve kampanya desteği." },
];

const AmbassadorSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section
      id="elciler"
      className="relative overflow-hidden py-20 lg:py-28"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--accent) / 0.12) 0%, hsl(var(--primary) / 0.08) 50%, hsl(var(--background)) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ background: "hsl(var(--accent))" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full blur-3xl opacity-25"
        style={{ background: "hsl(var(--primary))" }}
        aria-hidden
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-4 py-1.5">
            <Crown className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Şehir Elçisi / City Business Partner Programı</span>
          </div>
          <h2 className="mb-5 text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            Şehrinin <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">İş Partneri</span> Ol
          </h2>
          <p className="overflow-x-auto whitespace-nowrap text-base text-muted-foreground md:text-xl">
            Takipçi değil, topluluk ve iş inşa et. CorteQS Şehir Elçisi olarak diasporanın merkezi sen ol.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-5">
          <div className="group relative overflow-hidden rounded-3xl shadow-2xl lg:col-span-2">
            <img
              src={cityAmbassador}
              alt="CorteQS Şehir Elçisi"
              className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              width={800}
              height={1000}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" aria-hidden />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-accent">Şehir Elçisi · Berlin</p>
              <p className="text-lg font-bold leading-tight text-foreground">
                "CorteQS ile topluluğumu büyüttüm ve iş görünürlüğümü artırdım."
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
                >
                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl shadow-md"
                    style={{ background: "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2))" }}
                  >
                    <perk.icon className="h-5 w-5 text-accent transition-transform group-hover:scale-110" />
                  </div>
                  <h3 className="mb-1 font-bold text-foreground">{perk.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{perk.desc}</p>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl border-2 p-6 shadow-xl"
              style={{
                background: "linear-gradient(135deg, hsl(var(--accent) / 0.1) 0%, hsl(var(--primary) / 0.1) 100%)",
                borderColor: "hsl(var(--accent) / 0.3)",
              }}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-1 text-lg font-bold text-foreground">Elçi olmak 1 dakika sürer.</p>
                  <p className="text-sm text-muted-foreground">
                    Kayıt bırak, seni değerlendirelim. Seçilirsen özel onboarding paketin hazır.
                  </p>
                </div>
                <button
                  onClick={() => setFormOpen(true)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-primary px-6 py-3.5 text-base font-bold text-accent-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/30"
                >
                  <Crown className="h-5 w-5" />
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
