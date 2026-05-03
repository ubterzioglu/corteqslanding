import LansmanForm from "@/components/LansmanForm";
import { Button } from "@/components/ui/button";
import heroPoster from "../../inflans.jpeg";
import logo from "../../logo.png";
import mascot from "../../maskot.png";

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
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4f9ff_0%,#eef5fb_38%,#f8fbff_100%)] text-slate-900">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.14),_transparent_28%),linear-gradient(135deg,rgba(7,26,51,0.95),rgba(13,77,136,0.86)_52%,rgba(10,160,200,0.72))]" />
        <div className="absolute left-[-10rem] top-40 -z-10 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute right-[-6rem] top-20 -z-10 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="container mx-auto px-4 pb-16 pt-8 lg:px-6 lg:pb-24 lg:pt-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center">
            <div className="space-y-8 text-white">
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
                <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  Influencer Partner modeliyle global diaspora ağına davetlisin
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-100/92 sm:text-lg">
                  Seni sadece bir davetli olarak değil, erken dönem görünür partnerlerimizden biri olarak lansmanda aramızda görmek istiyoruz. CorteQS; toplulukları, danışmanları, işletmeleri ve içerik üreticilerini aynı büyüme ağı içinde bir araya getiriyor.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {promiseItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-white/15 bg-white/10 px-4 py-4 text-sm leading-6 text-slate-100 backdrop-blur"
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
              <div className="absolute inset-x-12 -top-6 h-24 rounded-full bg-orange-300/25 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-white/90 p-3 shadow-[0_30px_90px_rgba(7,26,51,0.24)] backdrop-blur">
                <img
                  src={heroPoster}
                  alt="CorteQS influencer partner lansman afişi"
                  className="w-full rounded-[1.5rem] object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-6 hidden w-36 rounded-[1.75rem] border border-white/60 bg-white/90 p-3 shadow-2xl backdrop-blur md:block">
                <img src={mascot} alt="CorteQS maskotu" className="w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-8 px-4 pb-20 lg:px-6">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
          <div className={launchPanelClass}>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Bu lansmanda neden yer almalısın?
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {benefitCards.map((item) => (
                <article key={item.title} className={launchGlassClass}>
                  <h2 className="text-lg font-bold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-100">{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={launchPanelClass}>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Lansmanda konuşacağımız başlıklar
            </p>
            <ul className="mt-5 space-y-3">
              {agendaItems.map((item, index) => (
                <li key={item} className="flex gap-3 rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-7 text-slate-100">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className={launchPanelClass}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                  Erken partner avantajı
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight">
                  Platform şekillenirken sahnede yerini al
                </h2>
              </div>
              <img src={logo} alt="" className="hidden h-12 w-auto sm:block" />
            </div>
            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-100/90">
              Etki alanın, kitlen ve içerik gücün CorteQS ekosistemi için değerli. Eğer diaspora odaklı yeni bir network modelinin erken parçası olmak istiyorsan bu lansman doğru başlangıç noktası.
            </p>
            <div className={`mt-6 ${launchGlassClass}`}>
              <p className="text-sm leading-7 text-slate-100">
                CorteQS Influencer Partner Programı; güçlü içerik üreticilerini sadece görünürlük tarafında değil, yönlendirme, etkinlik ve marka iş birlikleri tarafında da sürdürülebilir bir büyüme modeline dahil etmeyi hedefler.
              </p>
            </div>
          </div>

          <div id="lansman-formu" className={`${launchPanelClass} p-3 sm:p-5`}>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-6">
              <div className="mb-5 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100">
                  Katılım başvurusu
                </p>
                <h2 className="text-2xl font-black text-white">Yerini ayırt, erken giren avantajı yakala</h2>
                <p className="text-sm leading-7 text-slate-100">
                  Başvurunu bırak; ekibimiz inceleyip seninle hızlıca iletişime geçsin.
                </p>
              </div>
              <LansmanForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LansmanPage;
