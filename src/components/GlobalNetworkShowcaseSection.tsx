import {
  BriefcaseBusiness,
  CalendarDays,
  Clapperboard,
  Globe,
  Landmark,
  MapPinned,
  MessageCircleMore,
  Plane,
  ScanSearch,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import heroMapShowcase from "@/assets/may19-globe-pins.png";
import logo from "../../newlogo.png";

const showcaseCards = [
  {
    src: "https://images.pexels.com/photos/4649855/pexels-photo-4649855.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "İşletmeler için benzer görsel",
  },
  {
    src: "https://images.pexels.com/photos/9623659/pexels-photo-9623659.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Profesyoneller için benzer görsel",
  },
  {
    src: "https://images.pexels.com/photos/34774320/pexels-photo-34774320.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Kuruluşlar için benzer görsel",
  },
  {
    src: "https://images.pexels.com/photos/6255901/pexels-photo-6255901.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Topluluk yöneticileri için benzer görsel",
  },
  {
    src: "https://images.pexels.com/photos/16891530/pexels-photo-16891530.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "İçerik üreticileri için benzer görsel",
  },
  {
    src: "https://images.pexels.com/photos/16852968/pexels-photo-16852968.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Dijital gruplar için benzer görsel",
  },
] as const;

const rebuiltCards = [
  {
    title: "İşletmeler",
    description:
      "Yerel müşterilere, diasporaya ve global Türk ağına ulaşın. Etkinlikler, kampanyalar ve topluluklarla görünürlüğünüzü büyütün.",
    image: "https://images.pexels.com/photos/4649855/pexels-photo-4649855.jpeg?auto=compress&cs=tinysrgb&w=1200",
    icon: Store,
    accent: "from-[#42bf65] to-[#2da956]",
    text: "text-[#2c9b4d]",
    line: "bg-[#42bf65]",
  },
  {
    title: "Profesyoneller",
    description:
      "İş fırsatları, mentorlar, networking etkinlikleri ve şehir bazlı topluluklarla bağlantı kurun.",
    image: "https://images.pexels.com/photos/9623659/pexels-photo-9623659.jpeg?auto=compress&cs=tinysrgb&w=1200",
    icon: BriefcaseBusiness,
    accent: "from-[#4a97ff] to-[#2878f2]",
    text: "text-[#2878f2]",
    line: "bg-[#3c8cff]",
  },
  {
    title: "Kuruluşlar",
    description:
      "Topluluklarınızı büyütün, etkinliklerinizi duyurun ve global diaspora içinde görünür olun.",
    image: "https://images.pexels.com/photos/34774320/pexels-photo-34774320.jpeg?auto=compress&cs=tinysrgb&w=1200",
    icon: Landmark,
    accent: "from-[#a45af6] to-[#7c3aed]",
    text: "text-[#7c3aed]",
    line: "bg-[#9b5cf4]",
  },
  {
    title: "Topluluk Yöneticileri",
    description:
      "WhatsApp ve Telegram gruplarınızı listeleyin, yeni üyelere ulaşın ve kendi mikro ağınızı yönetin.",
    image: "https://images.pexels.com/photos/6255901/pexels-photo-6255901.jpeg?auto=compress&cs=tinysrgb&w=1200",
    icon: Users,
    accent: "from-[#52d67c] to-[#2bbf62]",
    text: "text-[#24a454]",
    line: "bg-[#35c465]",
  },
  {
    title: "İçerik Üreticileri",
    description:
      "Blogger, vlogger ve dijital topluluk liderleri için yeni nesil diaspora dağıtım ağı.",
    image: "https://images.pexels.com/photos/16891530/pexels-photo-16891530.jpeg?auto=compress&cs=tinysrgb&w=1200",
    icon: Clapperboard,
    accent: "from-[#ff59b8] to-[#ff2b92]",
    text: "text-[#ef2d8d]",
    line: "bg-[#ff2b92]",
  },
  {
    title: "Dijital Gruplar",
    description:
      "Şehir, ülke ve tema bazlı topluluklar tek bir keşif sisteminde birleşiyor.",
    image: "https://images.pexels.com/photos/16852968/pexels-photo-16852968.jpeg?auto=compress&cs=tinysrgb&w=1200",
    icon: Globe,
    accent: "from-[#ffb249] to-[#ff7a18]",
    text: "text-[#f97316]",
    line: "bg-[#ff7a18]",
  },
] as const;

const featureItems = [
  { label: "Cadde\nSosyal Ağı", icon: MessageCircleMore, color: "text-[#4bbf70]", ring: "ring-[#c6f2d3]" },
  { label: "WhatsApp &\nTelegram Toplulukları", icon: MessageCircleMore, color: "text-[#35c465]", ring: "ring-[#caf4d6]" },
  { label: "Etkinlikler", icon: CalendarDays, color: "text-[#8b5cf6]", ring: "ring-[#e5d6ff]" },
  { label: "Relokasyon &\nMentor Sistemi", icon: Plane, color: "text-[#fb923c]", ring: "ring-[#ffe0c5]" },
  { label: "Şehir Bazlı\nFeedler", icon: MapPinned, color: "text-[#3b82f6]", ring: "ring-[#d6e8ff]" },
  { label: "İşletmeler &\nHizmetler", icon: BriefcaseBusiness, color: "text-[#f59e0b]", ring: "ring-[#ffecbe]" },
  { label: "Diaspora\nHaritası", icon: Globe, color: "text-[#ec4899]", ring: "ring-[#ffd5eb]" },
  { label: "AI Destekli\nYönlendirme", icon: ScanSearch, color: "text-[#6366f1]", ring: "ring-[#dfe0ff]" },
] as const;

const cityNodes = [
  { city: "Toronto", position: "left-[58%] top-[7%]", chip: "text-[#f43f8d] border-[#ffd2e4] bg-white/95", dot: "bg-[#f43f8d]" },
  { city: "Berlin", position: "right-[6%] top-[4%]", chip: "text-[#2f9e44] border-[#d3f3dc] bg-white/95", dot: "bg-[#2f9e44]" },
  { city: "New York", position: "left-[45%] top-[56%]", chip: "text-[#3b82f6] border-[#d7e7ff] bg-white/95", dot: "bg-[#3b82f6]" },
  { city: "Istanbul", position: "left-[66%] top-[36%]", chip: "text-[#f97316] border-[#ffe0cc] bg-white/95", dot: "bg-[#f97316]" },
  { city: "Dubai", position: "left-[72%] top-[67%]", chip: "text-[#f59e0b] border-[#ffe8c2] bg-white/95", dot: "bg-[#f59e0b]" },
  { city: "Seoul", position: "right-[2%] top-[45%]", chip: "text-[#8b5cf6] border-[#e9ddff] bg-white/95", dot: "bg-[#8b5cf6]" },
  { city: "Sydney", position: "right-[2%] top-[74%]", chip: "text-[#3b82f6] border-[#d7e7ff] bg-white/95", dot: "bg-[#3b82f6]" },
] as const;

const GlobalNetworkShowcaseSection = () => {
  return (
    <section className="relative overflow-hidden py-5 lg:py-8">
      <div className="container relative z-10 mx-auto max-w-[1480px] px-4">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,252,255,0.96),rgba(255,250,244,0.95))] p-4 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-6 xl:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
                Referans Versiyon
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Mevcut görsel tabanlı section
              </h3>
            </div>
            <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">
              Üstte eski sürüm, altta kodla kurulmuş sürüm
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.6rem]">
            <img
              src={heroMapShowcase}
              alt="CorteQS'in dünya çapında Türk topluluklarını şehirler ve bağlantılar üzerinden bir araya getiren ağ görseli"
              className="w-full rounded-[1.6rem] object-cover"
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {showcaseCards.map((card) => (
              <div
                key={card.alt}
                className="overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.10)]"
              >
                <img src={card.src} alt={card.alt} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_16px_38px_rgba(15,23,42,0.06)] md:px-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
              {featureItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={`reference-${item.label}`}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] px-3 py-3"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white ring-1 ${item.ring}`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <p className="whitespace-pre-line text-sm font-semibold leading-5 tracking-[-0.02em] text-slate-700">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,252,255,0.98),rgba(255,247,240,0.96))] p-5 shadow-[0_18px_48px_rgba(15,23,42,0.07)] md:p-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
                  Kodla Yeniden Kurulan Sürüm
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Metinleri ve alt şeridi düzenlenebilir versiyon
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Bu blok metin ve kart bazında tamamen düzenlenebilir
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
              <div className="max-w-[680px]">
                <div className="inline-flex items-center rounded-2xl border border-[#ffd5c7] bg-[#fff6f1] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#f35b38] shadow-[0_10px_30px_rgba(243,91,56,0.08)]">
                  Dünya Çapında Tek Ağ
                </div>
                <h2 className="mt-5 text-[2rem] font-black leading-[1.03] tracking-[-0.04em] text-slate-900 sm:text-[2.8rem] lg:text-[4.1rem]">
                  Dünyaya dağılmış Türk topluluklarının{" "}
                  <span className="bg-[linear-gradient(90deg,#23b26d,#7c3aed,#ff7a18)] bg-clip-text text-transparent">
                    ekonomik ve sosyal sinir ağlarını
                  </span>{" "}
                  örüyoruz.
                </h2>
                <p className="mt-5 max-w-[46rem] text-lg leading-8 text-slate-600 sm:text-[1.35rem]">
                  CorteQS, işletmelerden profesyonellere, kuruluşlardan topluluk yöneticilerine
                  kadar herkesi tek bir ağ içinde bir araya getirir.
                </p>
              </div>

              <div className="relative min-h-[360px] overflow-hidden rounded-[1.9rem] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),rgba(246,250,255,0.94),rgba(255,249,244,0.96))] p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:min-h-[430px]">
                <img
                  src={heroMapShowcase}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-[0.22]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.08)_48%,rgba(255,255,255,0.62)_100%)]" />

                <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white shadow-[0_24px_50px_rgba(15,23,42,0.12)] sm:h-36 sm:w-36">
                  <img src={logo} alt="CorteQS logosu" className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
                </div>

                {cityNodes.map((node) => (
                  <div key={node.city} className={`absolute z-20 ${node.position}`}>
                    <div className={`rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] shadow-[0_12px_24px_rgba(15,23,42,0.08)] ${node.chip}`}>
                      {node.city}
                    </div>
                    <span className={`mx-auto mt-2 block h-2.5 w-2.5 rounded-full ${node.dot} shadow-[0_0_0_6px_rgba(255,255,255,0.78)]`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {rebuiltCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="group overflow-hidden rounded-[1.6rem] border border-slate-200/90 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_54px_rgba(15,23,42,0.10)]"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_48%,rgba(255,255,255,0.18)_100%)]" />
                      <div className={`absolute bottom-0 left-6 translate-y-1/2 rounded-full bg-gradient-to-br p-4 text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)] ${card.accent}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-9">
                      <h4 className={`text-[1.85rem] font-semibold leading-tight tracking-[-0.04em] ${card.text}`}>
                        {card.title}
                      </h4>
                      <p className="mt-3 min-h-[8.5rem] text-lg leading-8 text-slate-600">
                        {card.description}
                      </p>
                      <div className={`mt-5 h-1.5 w-14 rounded-full ${card.line}`} />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
              <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-[1.55fr_repeat(8,minmax(0,1fr))]">
                <div className="flex items-center gap-4 border-b border-slate-200/80 px-6 py-6 md:border-r md:border-b-0">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(244,247,255,0.95))] shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                    <img src={logo} alt="CorteQS" className="h-16 w-16 object-contain" />
                  </div>
                  <div>
                    <p className="text-[2rem] font-black leading-none tracking-[-0.04em] text-slate-900">
                      CorteQS
                    </p>
                    <p className="mt-2 max-w-[15rem] text-xl leading-7 text-slate-700">
                      Yurt Dışında Yaşayan Türklerin Sistemi
                    </p>
                  </div>
                </div>

                {featureItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex min-h-[160px] items-center justify-center border-b border-slate-200/80 px-5 py-6 text-center last:border-b-0 md:border-r md:last:border-r-0 xl:min-h-[132px] xl:border-b-0"
                    >
                      <div>
                        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] ring-1 ${item.ring}`}>
                          <Icon className={`h-8 w-8 ${item.color}`} />
                        </div>
                        <p className="mt-4 whitespace-pre-line text-[1.1rem] font-semibold leading-7 tracking-[-0.03em] text-slate-800">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalNetworkShowcaseSection;
