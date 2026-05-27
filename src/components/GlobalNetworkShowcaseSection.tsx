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
import showcasePanelImage from "@/assets/global-network-showcase-panel.png";
import logo from "../../newlogo.png";

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

          <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_18px_42px_rgba(15,23,42,0.07)] md:px-7 md:py-7">
            <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
              <div className="max-w-[670px]">
                <div className="inline-flex items-center rounded-2xl border border-[#ffd5c7] bg-[#fff6f1] px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[#f35b38] shadow-[0_10px_30px_rgba(243,91,56,0.08)]">
                  Dunya Capinda Tek Ag
                </div>
                <h2 className="mt-5 max-w-[14ch] text-[2.25rem] font-black leading-[0.98] tracking-[-0.05em] text-slate-900 sm:text-[3.2rem] lg:max-w-[13ch] lg:text-[4rem]">
                  Dunyaya dagilmis Turk topluluklarinin{" "}
                  <span className="bg-[linear-gradient(90deg,#23b26d_0%,#7c3aed_48%,#ff7a18_100%)] bg-clip-text text-transparent">
                    ekonomik ve sosyal sinir aglarini
                  </span>{" "}
                  oruyoruz.
                </h2>
                <p className="mt-5 max-w-[48rem] text-base font-medium leading-8 text-slate-500 sm:text-[1.18rem]">
                  CorteQS, isletmelerden profesyonellere, kuruluslardan topluluk yoneticilerine
                  kadar herkesi tek bir ag icinde bir araya getirir.
                </p>
              </div>

              <div className="relative min-h-[320px] overflow-hidden rounded-[1.8rem] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),rgba(246,250,255,0.94),rgba(255,249,244,0.96))] p-3 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:min-h-[390px]">
                <img
                  src={showcasePanelImage}
                  alt="CorteQS global ag gorseli"
                  className="h-full w-full rounded-[1.45rem] object-cover object-center"
                />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {rebuiltCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={`reference-card-${card.title}`}
                    className="group overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.09)]"
                  >
                    <div className="relative h-24 overflow-hidden sm:h-28 xl:h-24 2xl:h-28">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_48%,rgba(255,255,255,0.14)_100%)]" />
                      <div className={`absolute left-4 top-4 rounded-full bg-gradient-to-br p-3 text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] ${card.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-5 2xl:px-5">
                      <h4 className={`min-h-[3.4rem] text-[0.98rem] font-bold leading-[1.12] tracking-[-0.03em] 2xl:text-[1.05rem] ${card.text}`}>
                        {card.title}
                      </h4>
                      <p className="mt-2 min-h-[6.8rem] text-[0.88rem] leading-6 text-slate-600 2xl:text-[0.92rem]">
                        {card.description}
                      </p>
                      <div className={`mt-4 h-1 w-8 rounded-full ${card.line}`} />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_16px_38px_rgba(15,23,42,0.06)]">
              <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-[1.55fr_repeat(8,minmax(0,1fr))]">
                <div className="flex min-h-[168px] items-start gap-4 border-b border-slate-200/80 px-6 py-5 md:border-r md:border-b-0 xl:min-h-[156px]">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(244,247,255,0.95))] shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                    <img src={logo} alt="CorteQS" className="h-16 w-16 object-contain" />
                  </div>
                  <div className="flex min-h-[118px] flex-col justify-between pt-1">
                    <p className="text-[2rem] font-black leading-none tracking-[-0.04em] text-slate-900">
                      CorteQS
                    </p>
                    <p className="max-w-[14rem] text-[1rem] font-semibold leading-7 tracking-[-0.03em] text-slate-800">
                      Yurt Disinda Yasayan Turklerin Sistemi
                    </p>
                  </div>
                </div>

                {featureItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={`reference-${item.label}`}
                      className="flex min-h-[168px] items-start justify-center border-b border-slate-200/80 px-4 py-5 text-center last:border-b-0 md:border-r md:last:border-r-0 xl:min-h-[156px] xl:border-b-0"
                    >
                      <div className="flex min-h-[118px] w-full flex-col items-center justify-between">
                        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] ring-1 ${item.ring}`}>
                          <Icon className={`h-8 w-8 ${item.color}`} />
                        </div>
                        <p className="flex min-h-[72px] items-start justify-center whitespace-pre-line text-[0.92rem] font-semibold leading-6 tracking-[-0.02em] text-slate-800">
                          {item.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 px-6 py-4">
                <div className="h-1 w-full rounded-full bg-[linear-gradient(90deg,#ffb46b_0%,#f6f0df_8%,#52d67c_42%,#f7f4ea_56%,#8b5cf6_78%,#60a5fa_100%)]" />
                <p className="mt-3 text-center text-lg font-semibold tracking-[-0.03em] text-slate-700">
                  Baglan. Kesfet. Guclen.
                </p>
              </div>
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

              <div className="relative min-h-[340px] overflow-hidden rounded-[1.9rem] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),rgba(246,250,255,0.94),rgba(255,249,244,0.96))] p-3 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:min-h-[430px] sm:p-4">
                <img
                  src={showcasePanelImage}
                  alt="CorteQS global ağ gösterimi"
                  className="h-full w-full rounded-[1.55rem] object-cover object-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {rebuiltCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="group overflow-hidden rounded-[1.45rem] border border-slate-200/90 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.09)]"
                  >
                    <div className="relative h-24 overflow-hidden sm:h-28 xl:h-24 2xl:h-28">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_48%,rgba(255,255,255,0.18)_100%)]" />
                      <div className={`absolute bottom-0 left-4 translate-y-1/2 rounded-full bg-gradient-to-br p-3 text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] ${card.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-7 xl:px-4 2xl:px-5">
                      <h4 className={`min-h-[3.75rem] text-[1rem] font-bold leading-[1.15] tracking-[-0.03em] xl:text-[0.95rem] 2xl:text-[1.1rem] ${card.text}`}>
                        {card.title}
                      </h4>
                      <p className="mt-2 min-h-[7.5rem] text-[0.9rem] leading-7 text-slate-600 xl:text-[0.82rem] xl:leading-6 2xl:text-[0.95rem] 2xl:leading-7">
                        {card.description}
                      </p>
                      <div className={`mt-4 h-1 w-8 rounded-full ${card.line}`} />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.9rem] border border-slate-200/90 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
              <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-[1.55fr_repeat(8,minmax(0,1fr))]">
                <div className="flex min-h-[168px] items-start gap-4 border-b border-slate-200/80 px-6 py-5 md:border-r md:border-b-0 xl:min-h-[156px]">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(244,247,255,0.95))] shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                    <img src={logo} alt="CorteQS" className="h-16 w-16 object-contain" />
                  </div>
                  <div className="flex min-h-[118px] flex-col justify-between pt-1">
                    <p className="text-[2rem] font-black leading-none tracking-[-0.04em] text-slate-900">
                      CorteQS
                    </p>
                    <p className="max-w-[14rem] text-[1rem] font-semibold leading-7 tracking-[-0.03em] text-slate-800">
                      Yurt Dışında Yaşayan Türklerin Sistemi
                    </p>
                  </div>
                </div>

                {featureItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex min-h-[168px] items-start justify-center border-b border-slate-200/80 px-4 py-5 text-center last:border-b-0 md:border-r md:last:border-r-0 xl:min-h-[156px] xl:border-b-0"
                    >
                      <div className="flex min-h-[118px] w-full flex-col items-center justify-between">
                        <div className={`mx-auto mt-0 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] ring-1 ${item.ring}`}>
                          <Icon className={`h-8 w-8 ${item.color}`} />
                        </div>
                        <p className="flex min-h-[72px] items-start justify-center whitespace-pre-line text-[0.92rem] font-semibold leading-6 tracking-[-0.02em] text-slate-800">
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
