import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
                    CorteQS Nedir?
                  </h2>
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
                  <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                    CorteQS, global Turk diasporasini tek platformda bulusturmak icin tasarlanmis bir topluluk ve baglanti
                    altyapisidir. Sehir bazli network kurmayi kolaylastirir; relocation surecinde yon bulmayi destekler;
                    is birligi, bilgi paylasimi ve guven temelli iletisim icin ortak bir zemin sunar. Amaci, dunyanin farkli
                    noktalarindaki Turkleri, yerel topluluklari ve firsatlari daha gorunur, daha erisilebilir ve daha bagli
                    hale getirmektir.
                  </p>
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
