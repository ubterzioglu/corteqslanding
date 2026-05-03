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

const heroCtaClass =
  "min-w-[210px] justify-center rounded-full border border-orange-200/45 bg-[linear-gradient(135deg,#f59e0b_0%,#f97316_52%,#fb923c_100%)] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(249,115,22,0.35)] transition duration-300 hover:-translate-y-0.5 hover:border-orange-100 hover:bg-[linear-gradient(135deg,#fbbf24_0%,#f97316_50%,#fdba74_100%)] hover:text-white";

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

        <div className="container mx-auto px-4 pb-8 pt-5 lg:px-6 lg:pb-10 lg:pt-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.98fr)_minmax(280px,0.82fr)] lg:items-center">
            <div className="space-y-5 text-white">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
                <img src={logo} alt="CorteQS" className="h-6 w-auto" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  CorteQS Lansman Daveti
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-[2.35rem] font-black leading-[1.02] tracking-tight sm:text-[2.9rem] lg:text-[3.2rem]">
                  Influencer Partner modeliyle global diaspora ağına davetlisin
                </h1>
                <p className="max-w-xl text-sm leading-6 text-slate-100/90 sm:text-base">
                  Seni sadece bir davetli olarak değil, erken dönem görünür partnerlerimizden biri olarak lansmanda aramızda görmek istiyoruz. CorteQS; toplulukları, danışmanları, işletmeleri ve içerik üreticilerini aynı büyüme ağı içinde bir araya getiriyor.
                </p>
              </div>

              <div className="space-y-2">
                {promiseItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm leading-5 text-slate-100 backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className={heroCtaClass}>
                  <a href="#lansman-formu">Lansmana Kayıt Ol</a>
                </Button>
                <Button asChild size="lg" variant="outline" className={heroCtaClass}>
                  <a href="https://corteqs.net/" target="_blank" rel="noreferrer">
                    CorteQS Hakkında
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[470px]">
              <div className="absolute inset-x-12 -top-3 h-16 rounded-full bg-orange-300/25 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/45 bg-white/90 p-2.5 shadow-[0_26px_72px_rgba(7,26,51,0.22)] backdrop-blur">
                <img
                  src={heroPoster}
                  alt="CorteQS influencer partner lansman afişi"
                  className="w-full rounded-[1.35rem] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-6 px-4 pb-20 lg:max-w-5xl lg:px-6">
        <section className="space-y-6">
          <Accordion type="single" collapsible className="space-y-6">
            <AccordionItem
              value="benefits-panel"
              className={`${launchPanelClass} overflow-hidden py-0`}
            >
              <AccordionTrigger className="min-h-[92px] px-0 py-0 hover:no-underline">
                <span className="flex items-center gap-4 text-left">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_12px_26px_rgba(7,26,51,0.18)]">
                    <img src={logo} alt="" className="h-8 w-8 rounded-full object-contain" />
                  </span>
                  <span className="text-base font-semibold text-cyan-50 sm:text-lg">
                    Bu lansmanda neden yer almalısın?
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-5">
                <div className="space-y-4">
                  {benefitCards.map((item) => (
                    <article key={item.title} className={launchGlassClass}>
                      <h2 className="text-lg font-bold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-100">{item.body}</p>
                    </article>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="agenda-panel"
              className={`${launchPanelClass} overflow-hidden py-0`}
            >
              <AccordionTrigger className="min-h-[92px] px-0 py-0 hover:no-underline">
                <span className="flex items-center gap-4 text-left">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_12px_26px_rgba(7,26,51,0.18)]">
                    <img src={logo} alt="" className="h-8 w-8 rounded-full object-contain" />
                  </span>
                  <span className="text-base font-semibold text-cyan-50 sm:text-lg">
                    Lansmanda konuşulacak konular nelerdir ?
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-5">
                <ul className="space-y-3">
                  {agendaItems.map((item, index) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-7 text-slate-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
