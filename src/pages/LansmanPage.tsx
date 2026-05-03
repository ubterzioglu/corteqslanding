import LansmanForm from "@/components/LansmanForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import heroPoster from "../../yeniinffffffff.png";
import logo from "../../logo.png";

const launchPanelClass =
  "rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#123f74_0%,#17588f_54%,#18a6d0_100%)] p-7 text-white shadow-[0_24px_80px_rgba(7,26,51,0.22)]";

const launchGlassClass =
  "rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur";

const LansmanPage = () => {
  const benefitCards = [
    {
      title: "Yeni gelir modeli",
      body: "Referral akışları, etkinlik katkıları ve ileride doğacak marka iş birlikleri için erken konum alma fırsatı.",
    },
    {
      title: "Doğru hedef kitle",
      body: "Diaspora, expat yaşamı, global kariyer ve topluluk ekseninde yüksek uyumlu bir network yapısı.",
    },
    {
      title: "Erken partner avantajı",
      body: "Platform şekillenirken görünür olmak ve gelecekteki iş birliklerinde önden pozisyon almak.",
    },
    {
      title: "Network erişimi",
      body: "Farklı şehirlerden topluluk liderleri, iş insanları ve üreticilerle doğrudan temas kurmak.",
    },
  ];

  const agendaItems = [
    "Platform vizyonu ve influencer partner modeli",
    "Şehir bazlı diaspora büyümesi ve içerik iş birliği akışı",
    "Referral sistemi, etkinlik katkıları ve görünürlük fırsatları",
    "Erken dönem partner pozisyonunun nasıl şekilleneceği",
  ];

  const promiseItems = [
    "Görünürlük desteği ile içeriklerinin daha fazla kişiye ulaşması",
    "Paylaşım ve yönlendirmeler üzerinden çalışacak referral modeli",
    "Global Türk diasporasına doğrudan erişim",
    "Markaların ulaşacağı dashboard ve erken dönem partner görünürlüğü",
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#062446_0%,#0b3b67_36%,#0f5f8f_72%,#1183b0_100%)] text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_28%),linear-gradient(135deg,rgba(7,26,51,0.95),rgba(13,77,136,0.86)_52%,rgba(10,160,200,0.72))]" />
        <div className="absolute left-[-10rem] top-40 -z-10 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 -z-10 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="container mx-auto px-4 pb-10 pt-6 lg:px-6 lg:pb-14 lg:pt-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] lg:items-center">
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                <img src={logo} alt="CorteQS" className="h-8 w-auto" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
                  CorteQS Lansman Daveti
                </span>
              </div>

              <div className="space-y-5">
                <p className="max-w-xl text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
                  Erken dönem görünür partner çağrısı
                </p>
                <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-[4.5rem]">
                  Influencer Partner modeliyle global diaspora ağına davetlisin
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-100/92 sm:text-lg">
                  Seni sadece bir davetli olarak değil, erken dönem görünür partnerlerimizden biri olarak lansmanda aramızda görmek istiyoruz. CorteQS; toplulukları, danışmanları, işletmeleri ve içerik üreticilerini aynı büyüme ağı içinde bir araya getiriyor.
                </p>
              </div>

              <div className="space-y-2.5">
                {promiseItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-white/15 bg-white/10 px-4 py-3 text-sm leading-6 text-slate-100 backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full bg-white px-7 text-slate-950 hover:bg-slate-100">
                  <a href="#lansman-formu">Yerini Ayırt</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/35 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white">
                  <a href="https://corteqs.net/" target="_blank" rel="noreferrer">
                    CorteQS Hakkında
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute inset-x-12 -top-4 h-20 rounded-full bg-orange-300/25 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-white/90 p-3 shadow-[0_30px_90px_rgba(7,26,51,0.24)] backdrop-blur">
                <img
                  src={heroPoster}
                  alt="CorteQS influencer partner lansman afişi"
                  className="w-full rounded-[1.5rem] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-6 px-4 pb-20 lg:max-w-5xl lg:px-6">
        <section className="space-y-6">
          <div className={launchPanelClass}>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Bu lansmanda neden yer almalısın?
            </p>
            <Accordion type="single" collapsible className="mt-5 space-y-4">
              {benefitCards.map((item) => (
                <AccordionItem
                  key={item.title}
                  value={item.title}
                  className={`${launchGlassClass} overflow-hidden border-white/15 py-0`}
                >
                  <AccordionTrigger className="px-5 py-4 text-left text-lg font-bold text-white hover:no-underline">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-0 text-sm leading-7 text-slate-100">
                    {item.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className={launchPanelClass}>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Lansmanda konuşacağımız başlıklar
            </p>
            <Accordion type="single" collapsible className="mt-5 space-y-3">
              {agendaItems.map((item, index) => (
                <AccordionItem
                  key={item}
                  value={`agenda-${index + 1}`}
                  className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 px-4 backdrop-blur"
                >
                  <AccordionTrigger className="gap-3 py-4 text-left text-sm font-medium text-slate-100 hover:no-underline">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pl-11 pr-3 pt-0 text-sm leading-7 text-slate-100/90">
                    {item}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section id="lansman-formu">
          <div className={`${launchPanelClass} p-5 sm:p-6`}>
            <LansmanForm />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LansmanPage;
