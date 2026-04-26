import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Video,
  Calendar,
  Trophy,
  Users,
  Award,
  BadgeCheck,
  ShieldCheck,
  Bot,
  Film,
  Globe2,
} from "lucide-react";
import RegisterInterestForm from "@/components/RegisterInterestForm";
import FooterSection from "@/components/FooterSection";
import magicBallHero from "@/assets/corteqs-magic-ball-hero.jpg";

const themes = [
  { title: "Kültür", desc: "Yaşanılan ülkedeki kültürel deneyimler, Türk diasporasının izleri ve kültürler arası gözlemler." },
  { title: "Mücadele", desc: "Göç, kariyer, eğitim, iş kurma, yeniden başlama, dayanışma ve kolektif mücadele hikâyeleri." },
  { title: "Mizah", desc: "Yurtdışında yaşamdan komik olaylar, kültürel yanlış anlamalar ve eğlenceli gözlemler." },
  { title: "Gusto", desc: "Yaşam zevki, yemek, mekan, seyahat, şehir kültürü, lezzet ve diaspora mekanları." },
];

const evaluation = [
  { criterion: "Subscription / platform kayıt dönüşümü", weight: "%50" },
  { criterion: "CorteQS resmi kanallarındaki performans", weight: "%20" },
  { criterion: "Vlogger'ın kendi hesabındaki takipçi başına etkileşim oranı", weight: "%15" },
  { criterion: "En yüksek etkileşim sağlayan 3 destek hesabın performansı", weight: "%10" },
  { criterion: "Jüri değerlendirmesi", weight: "%5" },
];

const calendar = [
  { phase: "Başvuru başlangıcı", date: "10 Mayıs" },
  { phase: "Son içerik gönderim tarihi", date: "1 Eylül" },
  { phase: "Performans ölçümü", date: "Her içerik için yayın tarihinden itibaren 45 gün" },
  { phase: "Kazananların ilanı", date: "29 Ekim CorteQS Lansmanı" },
  { phase: "Ödül ve online toplantılar", date: "29 Ekim'i takip eden hafta içinde" },
];

const participationDetails = [
  "Her yarışmacı en fazla 5 içerikle yarışmaya katılabilir.",
  "Her video ayrı başvuru olarak değerlendirilir.",
  "Her içerik için ayrı kayıt formu, ayrı içerik yüklemesi, ayrı referral kodu ve ayrı değerlendirme süreci oluşturulur.",
  "Katılım bedeli her bir içerik başvurusu için €25'tir.",
  "Katılımcı tüm başvurularını CorteQS dashboard'u üzerinden takip edebilir.",
];

const VloggerContestPage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const openForm = () => setFormOpen(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top nav */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-amber-300 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana sayfaya dön
        </Link>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          {/* HERO */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center mb-16">
            {/* Hero text column */}
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <Video className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 text-sm font-semibold tracking-wider uppercase">
                  🎥 CorteQS Vlogger İçerik Yarışması
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Hikâyeni ya da Global Türklerin hikâyesini{" "}
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  video ile anlat
                </span>
                . Dünyaya duyur.
              </h1>

              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                Diaspora deneyimlerini, kültürel gözlemlerini, mücadeleni, mizahını ve gustonu video
                formatında bir araya getir. CorteQS sosyal medya kanallarında ve dijital yayın
                akışlarında global görünürlük kazan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-10">
                <button
                  onClick={openForm}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-lg hover:from-amber-400 hover:to-yellow-300 transition-all shadow-xl shadow-amber-500/30"
                >
                  Videonu Gönder
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Hero visual column — CorteQS Magic Ball */}
            <div className="relative flex items-center justify-center">
              {/* Glow halo behind ball */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                <div className="w-[80%] h-[80%] rounded-full bg-amber-400/20 blur-3xl" />
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                <div className="w-[55%] h-[55%] rounded-full bg-blue-500/20 blur-3xl" />
              </div>
              <img
                src={magicBallHero}
                alt="CorteQS Magic Ball — Global Türk diasporası maskotu"
                className="relative z-10 w-full max-w-md lg:max-w-lg object-contain drop-shadow-[0_25px_60px_rgba(251,191,36,0.25)] animate-float"
                width={1024}
                height={1024}
                loading="eager"
              />
              {/* Subtle reflection plate */}
              <div
                className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-3 rounded-[100%] bg-amber-400/30 blur-md"
                aria-hidden
              />
            </div>
          </div>

          {/* Stats — full width below hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
            {[
              { icon: Trophy, value: "€1.500", label: "Birincilik Ödülü" },
              { icon: Film, value: "5", label: "Maks. Video" },
              { icon: Calendar, value: "1 Eylül", label: "Son Gönderim" },
              { icon: Award, value: "29 Ekim", label: "Kazanan İlanı" },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 hover:bg-white/10 hover:border-amber-400/30 transition-all"
              >
                <s.icon className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* INTRO */}
          <div className="max-w-4xl mx-auto mb-20 space-y-5 text-slate-300 text-lg leading-relaxed">
            <p>
              CorteQS Vlogger İçerik Yarışması, dünyanın farklı ülkelerinde yaşayan{" "}
              <span className="text-amber-300 font-semibold">Global Türklerin</span> hikâyelerini,
              diaspora deneyimlerini, kültürel gözlemlerini, mücadelelerini, mizahını ve gusto anlayışını
              video formatında bir araya getiriyor.
            </p>
            <p>
              Kendi yaşam hikâyeni anlatabileceğin gibi, yaşadığın ülkedeki Türk diasporasının ortak
              deneyimlerini, topluluk başarılarını, kültürel karşılaşmaları, iş hayatını, sosyal yaşamı
              veya yeni nesil göç hikâyelerini de konu edinebilirsin.
            </p>
            <p>
              Yarışmaya gönderilen uygun video içerikler{" "}
              <span className="text-white font-semibold">
                CorteQS sosyal medya kanallarında ve dijital yayın akışlarında
              </span>{" "}
              kullanıma alınır. Bu süreç içerik sahibine global görünürlük, kendini tanıtma ve CorteQS
              topluluğu içinde öne çıkma fırsatı sağlar.
            </p>
          </div>

          {/* PARTICIPATION */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-400/5 to-amber-600/10 border border-amber-400/30 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Katılım Limiti ve Ücret
              </h2>
              <ul className="space-y-3">
                {participationDetails.map((d) => (
                  <li key={d} className="flex items-start gap-3">
                    <div className="shrink-0 w-2 h-2 rounded-full bg-amber-400 mt-2.5" />
                    <span className="text-slate-200 leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kategoriler</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="p-7 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white text-xl">Otantik İçerik</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Tamamen katılımcının kendi üretimi olan, yapay zekâ izi taşımayan özgün video
                  içeriklerdir. AI kullanımı tespit edilirse başvuru diskalifiye edilebilir.
                </p>
              </div>
              <div className="p-7 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white text-xl">AI Serbest İçerik</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Teknoloji kullanımı serbesttir. Hibrit, kısmi veya tamamen AI destekli video üretimleri
                  kabul edilir. Yaratıcılık, anlatım gücü ve içerik etkisi değerlendirilir.
                </p>
              </div>
            </div>
          </div>

          {/* THEMES */}
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Temalar</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
              {themes.map((t) => (
                <div
                  key={t.title}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all"
                >
                  <h3 className="font-bold text-amber-300 text-xl mb-2">{t.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PRIZES */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ödüller</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mb-6">
              {[
                { rank: "1.", prize: "€1.500", desc: "Birincilik para ödülü", glow: true },
                { rank: "2.", prize: "Dubai Uçak Bileti", desc: "Dubai-İstanbul standardı; ülkeye göre eşdeğer ödül sunulabilir" },
                { rank: "3.", prize: "Big Chefs Akşam Yemeği", desc: "2 kişilik; erişim olmayan ülkelerde eşdeğer restoran/deneyim sunulabilir" },
              ].map((p) => (
                <div
                  key={p.rank}
                  className={`relative p-7 rounded-2xl border text-center ${
                    p.glow
                      ? "bg-gradient-to-br from-amber-500/20 to-yellow-400/10 border-amber-400/50 shadow-xl shadow-amber-500/20"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className={`text-5xl font-extrabold mb-3 ${p.glow ? "text-amber-300" : "text-white"}`}>
                    {p.rank}
                  </div>
                  <div className="text-xl font-bold text-white mb-2">{p.prize}</div>
                  <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex items-start gap-3">
              <BadgeCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-100 text-sm leading-relaxed">
                Öne çıkan <span className="font-bold text-amber-300">ilk 20 içerik üreticisine</span>{" "}
                CorteQS'te <span className="font-semibold">1 yıl süreyle Onursal Blogger/Vlogger Badge'i</span>{" "}
                verilir ve platformda özel tanıtım yapılır.
              </p>
            </div>
          </div>

          {/* EVALUATION */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Değerlendirme Özeti</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
              {evaluation.map((e, i) => (
                <div
                  key={e.criterion}
                  className={`flex items-center justify-between gap-4 px-6 py-4 ${
                    i % 2 === 0 ? "bg-white/[0.04]" : "bg-white/[0.02]"
                  } ${i !== evaluation.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <span className="text-slate-200 text-sm md:text-base">{e.criterion}</span>
                  <span className="text-amber-300 font-bold text-lg whitespace-nowrap">{e.weight}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex items-start gap-4">
              <Globe2 className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
              <p className="text-slate-300 text-sm leading-relaxed">
                Her yarışmacıya veya her içeriğe özel <span className="text-white font-semibold">referral
                kodu / referral linki</span> tanımlanır. Bu kod üzerinden corteqs.net'e gelen ve platforma
                kayıt olan kullanıcılar, yarışmanın en yüksek ağırlıklı performans kriteri olan{" "}
                <span className="text-amber-300 font-semibold">subscription conversion</span> puanını
                oluşturur.
              </p>
            </div>
          </div>

          {/* CALENDAR */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Takvim</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              {calendar.map((c, i) => (
                <div
                  key={c.phase}
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-2 px-6 py-4 ${
                    i % 2 === 0 ? "bg-white/[0.04]" : "bg-white/[0.02]"
                  } ${i !== calendar.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-slate-200 font-medium text-sm md:text-base">{c.phase}</span>
                  </div>
                  <span className="text-amber-200 text-sm md:text-base sm:text-right">{c.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* APPLICATION */}
          <div className="max-w-3xl mx-auto text-center rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-400/5 to-amber-600/10 border border-amber-400/30 p-10 md:p-14">
            <Video className="w-12 h-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              Başvuru
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Formun tamamlanması, video bağlantısının yüklenmesi, gerekli onayların verilmesi ve her
              içerik için <span className="text-amber-300 font-bold">€25 katılım bedelinin</span> ödenmesi
              gerekir.
            </p>
            <button
              onClick={openForm}
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-lg hover:from-amber-400 hover:to-yellow-300 transition-all shadow-xl shadow-amber-500/30"
            >
              Başvuruyu Tamamla ve Ödemeye Geç
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-slate-400 mt-6">
              Ödeme akışı, başvuru tamamlandıktan sonra e-posta ile iletilecektir.
            </p>
          </div>
        </div>
      </section>

      <FooterSection />

      <RegisterInterestForm
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultCategory="blogger-vlogger"
        defaultReferralCode="GGVBLA-M7SDSR"
      />
    </div>
  );
};

export default VloggerContestPage;
