import { useState } from "react";
import { ChevronDown, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

import burakPhoto from "../../burak.png";
import ubtPhoto from "../../ubt.png";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const founders = [
  {
    name: "Burak Akçakanat",
    role: "Kurucu Ortak",
    summary:
      "35 yılı aşkın üretim, ticaret, girişimcilik, danışmanlık ve uluslararası iş geliştirme deneyimiyle CorteQS'in stratejik büyüme, diaspora yapılanması ve şehir bazlı ekosistem vizyonunu şekillendiriyor.",
    strengths: [
      "Uluslararası pazar geliştirme",
      "Şirket yapılanması ve ölçeklenme",
      "Diaspora odaklı network kurgusu",
    ],
    imageSrc: burakPhoto,
    imageAlt: "Burak Akçakanat profil fotoğrafı",
    linkedinUrl: "https://www.linkedin.com/in/burakakcakanat/",
  },
  {
    name: "Umut Barış Terzioğlu",
    role: "Kurucu Ortak",
    summary:
      "Mühendislik, kalite güvencesi, otomasyon ve ölçeklenebilir sistem deneyimiyle CorteQS'in güvenilir, sürdürülebilir ve ürün odaklı teknik altyapısını kurguluyor.",
    strengths: [
      "Kalite ve güven odaklı ürün yaklaşımı",
      "Süreç ve operasyon tasarımı",
      "Ölçeklenebilir teknik mimari",
    ],
    imageSrc: ubtPhoto,
    imageAlt: "Umut Barış Terzioğlu profil fotoğrafı",
    linkedinUrl: "https://www.linkedin.com/in/ubterzioglu",
  },
];

const LandingFoundersSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="founders-landing" className="relative overflow-hidden py-14 lg:py-20">
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-card/82 shadow-xl shadow-primary/10 backdrop-blur-sm">
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/20 md:px-8 md:py-6"
                aria-expanded={isOpen}
              >
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-foreground md:text-4xl">Biz Kimiz?</h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                    CorteQS'in vizyonunu kuran iki kurucu ortağı görmek için bu bölümü aç.
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
              <div className="space-y-6 p-5 md:p-6">
                <div className="grid gap-6 xl:grid-cols-2">
                  {founders.map((founder) => (
                    <article
                      key={founder.name}
                      className="rounded-[1.8rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,255,0.94),rgba(255,247,239,0.92))] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex flex-col items-start gap-5 sm:flex-row">
                        <img
                          src={founder.imageSrc}
                          alt={founder.imageAlt}
                          className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-[0_18px_38px_rgba(10,79,150,0.18)]"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="inline-flex rounded-full border border-[#0f6fc2]/16 bg-[#0f6fc2]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#0a4f96]">
                            {founder.role}
                          </span>
                          <h3 className="mt-3 text-2xl font-black tracking-tight text-[#071c3f]">{founder.name}</h3>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{founder.summary}</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-[#0f6fc2]/10 bg-white/70 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a4f96]">Öne Çıkan Güçler</div>
                        <div className="mt-3 grid gap-2">
                          {founder.strengths.map((strength) => (
                            <div key={strength} className="flex items-start gap-3">
                              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ff8a00]" />
                              <p className="text-sm leading-6 text-slate-600">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <a
                        href={founder.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#0f6fc2]/20 bg-[linear-gradient(135deg,#f7fbff_0%,#e7f4ff_38%,#d7ecff_100%)] px-5 py-2.5 text-sm font-semibold text-[#0a4f96] shadow-[0_14px_30px_rgba(15,111,194,0.14)] transition hover:-translate-y-0.5 hover:text-[#083d75]"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    </article>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Link
                    to="/founders"
                    className="inline-flex items-center justify-center rounded-full border border-[#0f6fc2]/20 bg-[linear-gradient(135deg,#f7fbff_0%,#e7f4ff_38%,#d7ecff_100%)] px-6 py-3 text-sm font-semibold text-[#0a4f96] shadow-[0_14px_30px_rgba(15,111,194,0.14)] transition hover:-translate-y-0.5 hover:text-[#083d75]"
                  >
                    Daha Fazla Bilgi
                  </Link>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </section>
  );
};

export default LandingFoundersSection;
