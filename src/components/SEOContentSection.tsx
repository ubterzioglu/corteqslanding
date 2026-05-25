import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const platformItems = [
  "🌍 Global Türk diasporasını tek platformda toplar",
  "📍 Şehir bazlı network (Berlin, Londra, Dubai vb.)",
  "🤝 İnsan, işletme ve toplulukları buluşturur",
  "🧭 Yeni şehirde ilk adımı kolaylaştırır",
  "🏠 Relocation sürecini kolaylaştırır",
  "💼 İş, proje ve işbirliği fırsatları sunar",
  "👥 Güven temelli bağlantılar kurmanı sağlar",
  "📢 Bilgi ve deneyim paylaşımını hızlandırır",
  "🎯 Profesyonel network kurmayı destekler",
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
              <div className="p-5 md:p-6">
                <div className="rounded-2xl border border-white/50 bg-background/55 p-4 md:p-5">
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-foreground md:text-xl">CorteQS Nedir? Kimler İçin?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Platformun sunduğu değer ve hitap ettiği kitle tek akışta aşağıda özetlenir.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className="mb-2 text-base font-semibold text-foreground">CorteQS Nedir?</h4>
                      <ul className="grid gap-1.5 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                        {platformItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-white/50 pt-4">
                      <h4 className="mb-3 text-base font-semibold text-foreground">Kimler İçin?</h4>
                      <ul className="grid gap-1.5 text-sm text-muted-foreground md:text-[15px]">
                        {audienceItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
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
