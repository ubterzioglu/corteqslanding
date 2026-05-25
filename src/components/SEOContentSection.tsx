import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const SEOContentSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative overflow-hidden py-14 lg:py-20">
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
                    CorteQS, global Türk diasporasını tek platformda buluşturmak için tasarlanmış bir topluluk ve bağlantı
                    altyapısıdır. Şehir bazlı network kurmayı kolaylaştırır; relocation sürecinde yön bulmayı destekler;
                    iş birliği, bilgi paylaşımı ve güven temelli iletişim için ortak bir zemin sunar. Amacı, dünyanın farklı
                    noktalarındaki Türkleri, yerel toplulukları ve fırsatları daha görünür, daha erişilebilir ve daha bağlı
                    hale getirmektir.
                  </p>

                  <div className="mt-5 space-y-3 border-t border-white/50 pt-4">
                    <Link
                      to="/founding-1000"
                      className="block rounded-xl border border-amber-200/80 bg-[linear-gradient(135deg,#FFC11F_0%,#FFD43A_52%,#FFE56B_100%)] px-4 py-3 text-sm font-semibold text-[#0E2238] shadow-[0_12px_28px_rgba(230,180,28,0.18)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      🌍 Founding 1000'e Katıl →
                    </Link>
                    <Link
                      to="/blogger-yarismasi"
                      className="block rounded-xl border border-orange-300/70 bg-[linear-gradient(135deg,#E97A1F_0%,#F06B2E_52%,#E85A34_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(231,103,42,0.18)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      ✍️ Blogger Yarışması →
                    </Link>
                    <Link
                      to="/vlogger-yarismasi"
                      className="block rounded-xl border border-sky-400/60 bg-[linear-gradient(135deg,#1A94AD_0%,#19789A_52%,#235E88_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(24,123,151,0.18)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      🎥 Vlogger Yarışması →
                    </Link>
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
