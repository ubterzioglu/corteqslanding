import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const SEOContentSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);

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
              <div className="space-y-4 p-5 md:p-6">
                <div className="rounded-2xl border border-white/50 bg-background/55 p-4 md:p-5">
                  <p className="max-w-4xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                    CorteQS, global Türk diasporasını tek platformda buluşturmak için tasarlanmış bir topluluk ve bağlantı
                    altyapısıdır. Şehir bazlı network kurmayı kolaylaştırır; relocation sürecinde yön bulmayı destekler;
                    iş birliği, bilgi paylaşımı ve güven temelli iletişim için ortak bir zemin sunar. Amacı, dünyanın farklı
                    noktalarındaki Türkleri, yerel toplulukları ve fırsatları daha görünür, daha erişilebilir ve daha bağlı
                    hale getirmektir.
                  </p>
                </div>

                <Collapsible open={linksOpen} onOpenChange={setLinksOpen}>
                  <div className="overflow-hidden rounded-2xl border border-white/55 bg-white/60 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.3)] backdrop-blur-sm">
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/35 md:px-5"
                        aria-expanded={linksOpen}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground md:text-[15px]">
                            Öne Çıkan Bağlantılar
                          </p>
                        </div>
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-background/80 text-primary transition-transform duration-300 ${
                            linksOpen ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden border-t border-white/55">
                      <div className="space-y-3 p-4 md:p-5">
                        <Link
                          to="/founding-1000"
                          className="block rounded-xl border border-[#f0b73b]/35 bg-[linear-gradient(135deg,#fff3cf_0%,#ffe79e_52%,#ffd768_100%)] px-4 py-3 text-sm font-semibold text-[#8f5b00] shadow-[0_14px_30px_rgba(240,183,59,0.18)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                          🌍 Founding 1000'e Katıl →
                        </Link>
                        <Link
                          to="/blogger-yarismasi"
                          className="block rounded-xl border border-[#ef8c3f]/35 bg-[linear-gradient(135deg,#fff0de_0%,#ffd6af_52%,#ffbc7b_100%)] px-4 py-3 text-sm font-semibold text-[#c96a1a] shadow-[0_14px_30px_rgba(239,140,63,0.18)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                          ✍️ Blogger Yarışması →
                        </Link>
                        <Link
                          to="/vlogger-yarismasi"
                          className="block rounded-xl border border-[#2f8fb4]/35 bg-[linear-gradient(135deg,#eef9fc_0%,#cfeefa_52%,#a9dff2_100%)] px-4 py-3 text-sm font-semibold text-[#1f7595] shadow-[0_14px_30px_rgba(47,143,180,0.18)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                          🎥 Vlogger Yarışması →
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </article>
    </section>
  );
};

export default SEOContentSection;
