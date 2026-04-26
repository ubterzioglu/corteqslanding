import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Trophy,
  Users,
  FileText,
  Mic,
  Globe2,
  BadgeCheck,
  Check,
  PenLine,
  Award,
  Music,
  Image as ImageIcon,
  Headphones,
  Quote,
  ShieldCheck,
  Bot,
} from "lucide-react";
import RegisterInterestForm from "@/components/RegisterInterestForm";
import FooterSection from "@/components/FooterSection";

const themes = [
  { title: "Kültür", desc: "Kültürel deneyimler, diaspora gözlemleri ve kültürler arası karşılaşmalar." },
  { title: "Mücadele", desc: "Göç, kariyer, eğitim, iş kurma, yeniden başlama, dayanışma ve başarı hikâyeleri." },
  { title: "Mizah", desc: "Yurtdışında yaşamdan komik olaylar, kültürel yanlış anlamalar ve gündelik hayat mizahı." },
  { title: "Gusto", desc: "Şehir, mekan, yemek, seyahat, estetik, yaşam tarzı ve deneyim odaklı anlatılar." },
];

const evaluation = [
  { criterion: "Subscription / platform kayıt dönüşümü", weight: "%45" },
  { criterion: "Blog okunma ve okuma kalitesi", weight: "%20" },
  { criterion: "Sosyal medya teaser ve podcast performansı", weight: "%15" },
  { criterion: "Yazarın kendi hesabı + en iyi 3 destek hesabın yayılımı", weight: "%10" },
  { criterion: "Jüri değerlendirmesi", weight: "%10" },
];

const calendar = [
  { phase: "Başvuru başlangıcı", date: "10 Mayıs" },
  { phase: "Son içerik gönderim tarihi", date: "1 Eylül" },
  { phase: "Performans ölçüm süresi", date: "Her içerik için yayın tarihinden itibaren 45 gün" },
  { phase: "Kazananların ilanı", date: "29 Ekim CorteQS Lansmanı" },
  { phase: "Ödül ve online toplantılar", date: "29 Ekim'i takip eden hafta içinde" },
];

const teaserItems = [
  { icon: Quote, text: "Kısa teaser metni" },
  { icon: PenLine, text: "Yazıdan 3 güçlü alıntı" },
  { icon: ImageIcon, text: "Kapak görseli" },
  { icon: Sparkles, text: "Carousel & story başlıkları" },
];

const optionalMedia = [
  { icon: Headphones, text: "Podcast / seslendirme" },
  { icon: Music, text: "Özgün müzik" },
  { icon: ImageIcon, text: "Kısa video teaser" },
];

const BloggerContestPage = () => {
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
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          {/* HERO */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <PenLine className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-semibold tracking-wider uppercase">
                ✍️ CorteQS Blogger İçerik Yarışması
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Global Türklerin en büyük{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                yazılı anlatı arşivini
              </span>{" "}
              birlikte oluşturuyoruz.
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Hikâyeni, gözlemini veya diaspora anlatını yaz. CorteQS'te yayınla. Dünyaya duyur.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { icon: Trophy, value: "€1.500", label: "Birincilik Ödülü" },
                { icon: FileText, value: "5", label: "Maks. İçerik" },
                { icon: Calendar, value: "1 Eylül", label: "Son Gönderim" },
                { icon: Award, value: "29 Ekim", label: "Kazanan İlanı" },
              ].map((s) => (
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button
                onClick={openForm}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-lg hover:from-amber-400 hover:to-yellow-300 transition-all shadow-xl shadow-amber-500/30"
              >
                Hikâyeni Gönder
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* INTRO */}
          <div className="max-w-4xl mx-auto mb-20 space-y-5 text-slate-300 text-lg leading-relaxed">
            <p>
              CorteQS Blogger İçerik Yarışması, dünyanın farklı ülkelerinde yaşayan{" "}
              <span className="text-amber-300 font-semibold">Global Türklerin</span> kişisel hikâyelerini,
              diaspora deneyimlerini, kültürel gözlemlerini, mücadelelerini, mizahını ve gusto anlayışını
              yazılı anlatı olarak bir araya getirir.
            </p>
            <p>
              İçerik yalnızca kişinin kendi yaşam hikâyesiyle sınırlı değildir. Katılımcılar yaşadıkları
              ülkedeki Türk diasporasını, topluluk başarılarını, kültürel karşılaşmaları, iş hayatını,
              sosyal yaşamı, yeni nesil göç hikâyelerini ve Global Türklerin ortak meselelerini de konu
              edinebilir.
            </p>
            <p>
              Uygun blog yazıları CorteQS platformunda yayınlanır. Yazılar; sosyal medya teaser'ları,
              görsel anlatımlar, podcast, seslendirme, özgün müzik, kısa video teaser'lar ve yaratıcı medya
              bileşenleriyle daha geniş kitlelere ulaştırılabilir.
            </p>
          </div>

          {/* WHO CAN JOIN */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kimler Katılabilir?</h2>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 flex items-start gap-4">
              <Users className="w-7 h-7 text-amber-400 shrink-0 mt-1" />
              <p className="text-slate-300 text-lg leading-relaxed">
                Yarışmaya <span className="text-white font-semibold">bloggerlar, yazarlar, hikâye anlatıcıları,
                içerik üreticileri, öğrenciler, profesyoneller, araştırmacılar</span> ve Global Türkler
                topluluğuna yazılı anlatıyla katkı sunmak isteyen herkes katılabilir.
              </p>
            </div>
          </div>

          {/* THEMES */}
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Temalar</h2>
              <p className="text-slate-400 text-lg">İçeriğini bu dört tema ekseninde kurabilirsin.</p>
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

          {/* CATEGORIES */}
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kategoriler</h2>
              <p className="text-slate-400 text-lg">Dilediğin kategoride başvurabilirsin.</p>
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
                  Tamamen katılımcının kendi üretimi olan, AI kullanılmamış ve intihal içermeyen özgün
                  yazılardır. AI kullanımı, intihal veya daha önce yayınlanmış içerik tespiti diskalifiye
                  sebebi olabilir.
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
                  AI ile üretilmiş, hibrit veya teknoloji destekli içerikler kabul edilir. AI kullanımı
                  beyan edilmelidir. Bu kategoride de intihal, telif ihlali ve izinsiz kullanım yasaktır.
                </p>
              </div>
            </div>
          </div>

          {/* PARTICIPATION & FEE */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-400/5 to-amber-600/10 border border-amber-400/30 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Katılım Limiti ve Ücret
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <div className="text-amber-300 text-sm font-semibold uppercase tracking-wider mb-2">
                    Maksimum Başvuru
                  </div>
                  <div className="text-4xl font-extrabold text-white mb-2">5 İçerik</div>
                  <p className="text-slate-400 text-sm">
                    Her içerik ayrı başvuru, ayrı değerlendirme ve ayrı referral kodu ile takip edilir.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <div className="text-amber-300 text-sm font-semibold uppercase tracking-wider mb-2">
                    Katılım Bedeli
                  </div>
                  <div className="text-4xl font-extrabold text-white mb-2">€25</div>
                  <p className="text-slate-400 text-sm">
                    Her içerik başvurusu için katılım bedeli — başvuru sırasında ödenir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TEASER PACKAGE */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Blog İçeriği ve Teaser Paketi
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto">
                Ana içerik CorteQS platformunda yayınlanacak blog yazısıdır. Yazılar fotoğraf, görsel,
                alıntı kutusu, ses kaydı, harita, zaman çizelgesi veya diğer yaratıcı medya bileşenleriyle
                desteklenebilir.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-amber-300 text-sm font-semibold uppercase tracking-wider mb-4">
                Her başvuruda alınanlar
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {teaserItems.map((t) => (
                  <div
                    key={t.text}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <t.icon className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-slate-200 text-sm font-medium">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-amber-300 text-sm font-semibold uppercase tracking-wider mb-4">
                Opsiyonel medya bileşenleri (önerilir)
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {optionalMedia.map((m) => (
                  <div
                    key={m.text}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-white/[0.07] to-transparent border border-white/10"
                  >
                    <m.icon className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-slate-200 text-sm font-medium">{m.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">
                Zorunlu değildir; ancak tanıtımı ve etkileşimi güçlendirdiği için tavsiye edilir.
              </p>
            </div>
          </div>

          {/* PODCAST */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-7 md:p-9 flex items-start gap-5">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Mic className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Podcast Yayını</h2>
                <p className="text-slate-300 leading-relaxed">
                  CorteQS, uygun gördüğü blog yazılarını <span className="text-white font-semibold">Spotify
                  ve diğer podcast mecralarında</span> özgün seslendirme, müzik veya ses tasarımıyla
                  podcast formatında yayınlayabilir. Podcast yayınlarından gelen dinlenme, paylaşım, takip,
                  kaydetme ve platforma yönlendirme verileri değerlendirmeye dahil edilebilir.
                </p>
              </div>
            </div>
          </div>

          {/* EVALUATION */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Değerlendirme Kriterleri</h2>
              <p className="text-slate-400 text-lg">Toplam puan aşağıdaki ağırlıklarla hesaplanır.</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10">
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
          </div>

          {/* PRIZES */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ödüller ve Görünürlük</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5 mb-6">
              {[
                { rank: "1.", prize: "€1.500", desc: "Birincilik para ödülü", glow: true },
                { rank: "2.", prize: "Dubai Uçak Bileti", desc: "İstanbul-Dubai standardı; eşdeğer alternatif sunulabilir" },
                { rank: "3.", prize: "Big Chefs Akşam Yemeği", desc: "2 kişilik; ülkeye göre eşdeğer deneyim sunulabilir" },
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
                CorteQS platformunda <span className="font-semibold">1 yıl süreyle Onursal
                Blogger/Vlogger Badge'i</span> verilir ve platformda özel tanıtım yapılır.
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Kazananın bulunduğu ülkeye göre eşdeğer seviye ödül alternatifi sunulabilir.
            </p>
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
            <PenLine className="w-12 h-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              Başvuru
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Katılımcı formu doldurur, içeriğini ve teaser materyallerini yükler, onayları verir ve her
              içerik için <span className="text-amber-300 font-bold">€25 katılım bedelini</span> öder.
            </p>
            <button
              onClick={openForm}
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-lg hover:from-amber-400 hover:to-yellow-300 transition-all shadow-xl shadow-amber-500/30"
            >
              Başvuruyu Tamamla
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

export default BloggerContestPage;
