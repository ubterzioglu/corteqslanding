import { useState } from "react";
import { ChevronDown } from "lucide-react";

import mascotHome from "../../maskotanasayfa.png";
import seoLogo from "../../newlogo.png";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const platformItems = [
  "🌍 Global Türk diasporasını tek platformda toplar",
  "📍 Şehir bazlı network (Berlin, Londra, Dubai vb.)",
  "🤝 İnsan, işletme ve toplulukları buluşturur",
  "🧭 Yeni şehirde “nereden başlayacağım?” sorununu çözer",
  "🏠 Relocation sürecini kolaylaştırır",
  "💼 İş, proje ve işbirliği fırsatları sunar",
  "👥 Güven temelli bağlantılar kurmanı sağlar",
  "📢 Bilgi paylaşımı ve deneyim aktarımını hızlandırır",
  "🎯 Profesyonel network oluşturmayı destekler",
  "🌐 Global ama lokal odaklı topluluklar yaratır",
];

const audienceItems = [
  "🌍 Relocation desteği arayan Türkler",
  "🤝 Diaspora ile bağ kurmak isteyen expatlar",
  "🧑‍⚕️ Hizmet sunan danışman, doktor, avukatlar",
  "🏢 Türk müşteriye ulaşmak isteyen işletmeler",
  "🏛️ Dernek, vakıf ve STK’lar",
  "🎥 İçerik üreticileri ve bloggerlar",
  "🧑‍🤝‍🧑 Sosyal çevre arayan bireyler",
  "💼 İş ve kariyer fırsatı arayanlar",
  "🧑‍💻 Freelance ve proje arayanlar",
  "📍 Yerel bilgi ve tavsiye arayanlar",
];

const SEOContentSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className="relative overflow-hidden py-14 lg:py-20"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--accent) / 0.08) 52%, hsl(var(--background)) 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-20 bottom-6 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute right-8 top-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" aria-hidden />

      <article className="container relative z-10 mx-auto max-w-6xl px-4" aria-labelledby="geo-content-title">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="overflow-hidden rounded-2xl border border-white/50 bg-card/80 shadow-xl shadow-primary/10 backdrop-blur-sm">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/20 md:px-8 md:py-6"
                aria-expanded={isOpen}
              >
                <div className="min-w-0">
                  <span className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Platform Rehberi
                  </span>
                  <h2 id="geo-content-title" className="text-2xl font-bold text-foreground md:text-4xl">
                    CorteQS Nedir? Kimler İçin?
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                    CorteQS’in ne yaptığını, kimlere hitap ettiğini ve platformun hangi ihtiyaçları çözmek için tasarlandığını görmek için bu bölümü aç.
                  </p>
                </div>
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-background/80 text-primary transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="h-5 w-5" />
                </span>
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden border-t border-white/50">
              <div className="grid gap-0 lg:grid-cols-[0.48fr_0.52fr]">
                <div className="border-b border-white/50 bg-background/55 p-6 md:p-8 lg:border-b-0 lg:border-r">
                  <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
                    <figure className="flex items-center justify-center">
                      <img
                        src={seoLogo}
                        alt="CorteQS Logo"
                        className="h-auto w-full max-w-[220px]"
                        loading="lazy"
                        width={560}
                        height={220}
                      />
                    </figure>

                    <div>
                      <h3 className="mb-4 text-xl font-bold text-foreground md:text-2xl">CorteQS Nedir?</h3>
                      <ul className="grid gap-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                        {platformItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-card/40 p-6 md:p-8">
                  <div className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr] lg:items-center">
                    <div>
                      <h3 className="mb-4 text-xl font-bold text-foreground md:text-2xl">Kimler İçin?</h3>
                      <ul className="grid gap-3 text-sm text-muted-foreground md:text-[15px]">
                        {audienceItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <figure className="flex items-center justify-center">
                      <img
                        src={mascotHome}
                        alt="CorteQS ana sayfa maskotu"
                        className="h-auto w-full max-w-[240px]"
                        loading="lazy"
                        width={900}
                        height={900}
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </article>
    </section>
  );
};

export default SEOContentSection;
