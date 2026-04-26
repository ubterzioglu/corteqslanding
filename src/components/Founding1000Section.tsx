import { useState } from "react";
import {
  Globe2,
  Users,
  Trophy,
  Calendar,
  Stethoscope,
  Scale,
  Home,
  GraduationCap,
  Store,
  Landmark,
  Mic,
  BadgeCheck,
  MapPin,
  Sparkles,
  Eye,
  Rocket,
  Network,
  Building2,
  Check,
  ArrowRight,
} from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";

const stats = [
  { icon: Globe2, value: "5", label: "Kıta" },
  { icon: Users, value: "1000", label: "Founding User" },
  { icon: Trophy, value: "200", label: "Her Kıtadan İlk" },
  { icon: Calendar, value: "29 Ekim", label: "Full Açılış" },
];

const eligibleCategories = [
  {
    icon: Stethoscope,
    title: "Sağlık",
    desc: "Doktorlar, klinikler, diş hekimleri, psikologlar, sağlık merkezleri",
  },
  {
    icon: Scale,
    title: "Hukuk & Finans",
    desc: "Avukatlar, hukuk danışmanları, muhasebeciler, vergi & finansal danışmanlar",
  },
  {
    icon: Home,
    title: "Emlak & Relocation",
    desc: "Emlak danışmanları, relocation, taşınma, vize ve göçmenlik danışmanları",
  },
  {
    icon: GraduationCap,
    title: "Eğitim & Kariyer",
    desc: "Okullar, eğitim & kariyer danışmanları, dil okulları, öğrenci danışmanları",
  },
  {
    icon: Store,
    title: "İşletmeler & Hizmetler",
    desc: "Restoranlar, marketler, ajanslar, turizm, hizmet & yerel işletmeler",
  },
  {
    icon: Landmark,
    title: "Kuruluşlar & Topluluklar",
    desc: "Dernekler, vakıflar, kültür merkezleri, medya kuruluşları, topluluk yapıları",
  },
  {
    icon: Mic,
    title: "İçerik Üreticileri",
    desc: "Diaspora, şehir, kültür, iş, yaşam ve deneyim odaklı içerik üreticileri",
  },
];

const benefits = [
  { icon: BadgeCheck, text: "CorteQS Founding Verified User Badge" },
  { icon: MapPin, text: "Ülke, şehir ve kategori bazlı erken görünürlük" },
  { icon: Eye, text: "CorteQS kategori vitrininde yer alma hakkı" },
  { icon: Sparkles, text: "Ana sayfa carousel alanında 6 ay görünürlük" },
  { icon: Rocket, text: "Platform tam açıldığında ilk yayınlanan profiller arasında" },
  { icon: Globe2, text: "Global Türk diasporasının erken dönem dijital index'inde yer" },
  { icon: Network, text: "İşletmeni / uzmanlığını farklı şehirlerdeki Türklerle buluştur" },
];

const exampleCities = [
  "🇩🇪 Berlin'de bir doktor",
  "🇦🇪 Dubai'de bir emlak danışmanı",
  "🇬🇧 Londra'da bir hukuk ofisi",
  "🇨🇦 Toronto'da bir dernek",
  "🇶🇦 Doha'da bir restoran",
  "🇳🇱 Amsterdam'da bir içerik üreticisi",
  "🇺🇸 New York'ta bir Türk girişimci",
];

const continents = [
  { name: "Avrupa", flag: "🇪🇺", quota: "İlk 200" },
  { name: "Asya", flag: "🌏", quota: "İlk 200" },
  { name: "Afrika", flag: "🌍", quota: "İlk 200" },
  { name: "Amerika", flag: "🌎", quota: "İlk 200" },
  { name: "Okyanusya", flag: "🇦🇺", quota: "İlk 200" },
];

const Founding1000Section = () => {
  const [formOpen, setFormOpen] = useState(false);

  const openForm = () => setFormOpen(true);

  return (
    <section
      id="founding-1000"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
        {/* HERO */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-semibold tracking-wider uppercase">
              🌍 CorteQS Founding 1000
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Global Türk diasporasının dijital haritasında{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              erken yerinizi alın
            </span>
            .
          </h2>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            CorteQS, dünyanın farklı şehirlerine yayılmış Türk işletmelerini, danışmanları, klinikleri,
            doktorları, avukatları, emlak danışmanlarını, relocation uzmanlarını, marketleri, restoranları,
            dernekleri, vakıfları, okulları, medya kuruluşlarını, içerik üreticilerini ve profesyonelleri
            şehir şehir görünür kılmak için kuruluyor.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 hover:bg-white/10 hover:border-amber-400/30 transition-all"
              >
                <s.icon className="w-6 h-6 text-amber-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button
              onClick={openForm}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-lg hover:from-amber-400 hover:to-yellow-300 transition-all shadow-xl shadow-amber-500/30"
            >
              Founding 1000'e Katıl
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Scarcity band */}
        <div className="max-w-4xl mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <p className="text-amber-100 text-sm md:text-base font-medium">
            <span className="font-bold text-amber-300">Kontenjan sınırlı:</span> Her kıtadan yalnızca
            ilk 200 katılımcı Founding Verified User avantajından yararlanabilecek.
          </p>
        </div>

        {/* Referral code band */}
        <div className="max-w-4xl mx-auto mb-20 rounded-2xl bg-gradient-to-r from-amber-500/15 to-yellow-400/10 border border-amber-400/40 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-2xl">🎁</span>
          <p className="text-amber-100 text-sm md:text-base font-medium flex-1">
            <span className="font-bold text-amber-300">Founding 1000 özel referral kodu:</span>{" "}
            <code className="px-2 py-0.5 rounded bg-slate-900/60 border border-amber-400/30 text-amber-200 font-mono text-sm tracking-wider">
              GGVBLA-M7SDSR
            </code>{" "}
            — Bu sayfadan kayıt olduğunuzda kod otomatik tanımlanır.
          </p>
        </div>

        {/* WHO CAN JOIN */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Kimler Katılabilir?</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              CorteQS Founding 1000 programı, global Türk diasporasına hizmet veren veya diaspora içinde
              görünür olmak isteyen işletme, danışman, kurum, topluluk ve profesyoneller için tasarlandı.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eligibleCategories.map((cat) => (
              <div
                key={cat.title}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.07] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <cat.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">{cat.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BENEFITS */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Founding Verified User Avantajları
            </h3>
            <p className="text-slate-400 text-lg">
              Erken katılan, erken konumlanır. İşte size özel ayrıcalıklar:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-all"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-slate-200 text-sm leading-relaxed pt-1.5">{b.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Erken Dönem Üyelik</h3>
            <p className="text-slate-400 text-lg">Founding 1000'e özel — sınırlı kontenjan.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-amber-400/40 p-8 md:p-10 shadow-2xl shadow-amber-500/10 backdrop-blur-sm">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 text-xs font-bold tracking-wider uppercase shadow-lg">
                  ⭐ Founding 1000 Özel
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-amber-300 text-sm font-semibold uppercase tracking-wider mb-2">
                  Founding 1000 Özel Yıllık Üyelik
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                    €99
                  </span>
                  <span className="text-slate-400 text-lg">/ yıl</span>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Standart üyelik</span>
                  <span>Aylık €10</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Yıllık normal değer</span>
                  <span className="line-through text-slate-500">€120</span>
                </div>
                <div className="flex justify-between text-amber-300 font-bold pt-2 border-t border-white/10">
                  <span>Founding 1000 özel</span>
                  <span>€99</span>
                </div>
              </div>

              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 mb-6">
                <p className="text-amber-100 text-sm leading-relaxed">
                  <span className="font-bold text-amber-300">+ €399 değerinde</span> kategori vitrini ve
                  ana sayfa carousel görünürlüğü <span className="font-semibold">6 ay boyunca dahil</span>.
                </p>
              </div>

              <p className="text-xs text-slate-400 mb-6 leading-relaxed text-center">
                <span className="font-semibold text-slate-300">Önemli:</span> 6 aylık görünürlük periyodu,
                CorteQS'in <span className="font-semibold text-white">29 Ekim full açılış</span>{" "}
                tarihinden itibaren başlar.
              </p>

              <button
                onClick={openForm}
                className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-lg hover:from-amber-400 hover:to-yellow-300 transition-all shadow-xl shadow-amber-500/30"
              >
                Founding 1000'e Katıl
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6 max-w-xl mx-auto leading-relaxed">
              CorteQS, 29 Ekim full açılış öncesinde kısım kısım açılmaya başlayacaktır. Founding 1000
              üyelerine sunulan kategori vitrini ve ana sayfa carousel görünürlüğü, 29 Ekim full açılış
              tarihinden itibaren geçerli olacaktır.
            </p>
          </div>
        </div>

        {/* WHY NOW */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Neden Şimdi Katılmalısınız?
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Çünkü CorteQS henüz erken aşamada. Bugün katılanlar, platform büyüdüğünde sadece kullanıcı
              değil; ülkelerinde, şehirlerinde ve kategorilerinde{" "}
              <span className="text-amber-300 font-semibold">ilk görünen, ilk tanınan ve ilk konumlanan</span>{" "}
              kişi ve kurumlar olacak.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {exampleCities.map((c) => (
              <div
                key={c}
                className="px-5 py-4 rounded-xl bg-gradient-to-r from-white/[0.07] to-transparent border border-white/10 hover:border-amber-400/30 hover:from-amber-500/[0.07] transition-all flex items-center gap-3"
              >
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-200 text-sm font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTINENTS */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
              5 Kıta, 1000 Kurucu Katılımcı
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {continents.map((c) => (
              <div
                key={c.name}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-3">{c.flag}</div>
                <div className="font-bold text-white text-lg mb-1">{c.name}</div>
                <div className="text-amber-300 text-sm font-semibold">{c.quota}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Amerika bölgesi, Kuzey ve Güney Amerika'yı kapsar.
          </p>
        </div>

        {/* FINAL CTA */}
        <div className="max-w-3xl mx-auto text-center rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-400/5 to-amber-600/10 border border-amber-400/30 p-10 md:p-14">
          <Building2 className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Ülkenizde, şehrinizde ve kategorinizde{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              ilk görünenlerden
            </span>{" "}
            biri olun.
          </h3>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            CorteQS Founding 1000'e katılın ve global Türk diasporasının dijital haritasında erken
            pozisyon alın.
          </p>
          <button
            onClick={openForm}
            className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-lg hover:from-amber-400 hover:to-yellow-300 transition-all shadow-xl shadow-amber-500/30"
          >
            Founding 1000'e Katıl
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      <RegisterInterestForm
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultCategory="isletme"
        defaultReferralCode="GGVBLA-M7SDSR"
      />
    </section>
  );
};

export default Founding1000Section;
