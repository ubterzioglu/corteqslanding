import { Building2, MessageCircle, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroNetworkLight from "@/assets/hero-network-light.jpg";

const featuredLinks = [
  {
    to: "/founding-1000",
    className:
      "border-[#f0b73b]/35 bg-[linear-gradient(135deg,#fff3cf_0%,#ffe79e_52%,#ffd768_100%)] text-[#8f5b00] shadow-[0_14px_30px_rgba(240,183,59,0.18)]",
    label: "🌍 Founding 1000'e Katıl",
  },
  {
    to: "/blogger-yarismasi",
    className:
      "border-[#ef8c3f]/35 bg-[linear-gradient(135deg,#fff0de_0%,#ffd6af_52%,#ffbc7b_100%)] text-[#c96a1a] shadow-[0_14px_30px_rgba(239,140,63,0.18)]",
    label: "✍️ Blogger Yarışması",
  },
  {
    to: "/vlogger-yarismasi",
    className:
      "border-[#2f8fb4]/35 bg-[linear-gradient(135deg,#eef9fc_0%,#cfeefa_52%,#a9dff2_100%)] text-[#1f7595] shadow-[0_14px_30px_rgba(47,143,180,0.18)]",
    label: "🎥 Vlogger Yarışması",
  },
] as const;

const audienceCards = [
  {
    emoji: "🏢",
    title: "İşletmeler",
    description: "Yerel müşterilere, diasporaya ve global Türk ağına ulaşın.",
    cta: "İşletmeni Kaydet",
  },
  {
    emoji: "👨‍💼",
    title: "Profesyoneller",
    description: "İş fırsatları, mentorlar ve şehir bazlı networklerle bağlantı kurun.",
    cta: "Profesyonel Olarak Kaydol",
  },
  {
    emoji: "🏛",
    title: "Kuruluşlar & Dernekler",
    description: "Topluluğunuzu büyütün, etkinliklerinizi duyurun ve görünür olun.",
    cta: "Kuruluşunu Kaydet",
  },
  {
    emoji: "👥",
    title: "Topluluk Yöneticileri",
    description: "WhatsApp ve Telegram topluluklarınızı yeni üyelere açın.",
    cta: "Topluluğunu Kaydet",
  },
  {
    emoji: "🎥",
    title: "İçerik Üreticileri",
    description: "Diaspora odaklı içeriklerinizi daha doğru kitlelerle buluşturun.",
    cta: "İçerik Üreticisi Olarak Kaydol",
  },
  {
    emoji: "🌐",
    title: "Dijital Gruplar",
    description: "Şehir, ülke ve tema bazlı gruplar tek keşif sisteminde birleşsin.",
    cta: "Grubunu Listele",
  },
] as const;

const platformItems = [
  "✅ Cadde sosyal ağı",
  "✅ WhatsApp ve Telegram toplulukları",
  "✅ Etkinlikler",
  "✅ Relokasyon ve mentor sistemi",
  "✅ Şehir bazlı feedler",
  "✅ İşletmeler ve hizmetler",
  "✅ Diaspora haritası",
  "✅ AI destekli yönlendirme",
] as const;

const SEOContentSection = () => {
  return (
    <section className="relative overflow-hidden py-10 lg:py-14">
      <article className="container relative z-10 mx-auto max-w-6xl px-4" aria-labelledby="geo-content-title">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-card/84 shadow-xl shadow-primary/10 backdrop-blur-sm">
          <div className="grid gap-6 p-5 md:p-7 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-5">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  CorteQS Nedir?
                </span>
                <h2 id="geo-content-title" className="mt-4 text-3xl font-black leading-tight text-foreground md:text-5xl">
                  Dünyaya dağılmış Türk topluluklarının ekonomik ve sosyal sinir ağlarını örüyoruz
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-[15px]">
                  CorteQS, dünyanın farklı şehirlerinde yaşayan Türkleri; sadece bir sosyal ağda değil,
                  gerçek fırsatlar, topluluklar ve bağlantılar etrafında bir araya getirir.
                </p>
              </div>

              <div className="space-y-3">
                {featuredLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${link.className}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="rounded-[1.75rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,249,247,0.92))] p-4 shadow-sm">
                <img
                  src={heroNetworkLight}
                  alt="CorteQS global diaspora ağını gösteren harita"
                  className="h-auto w-full rounded-[1.25rem] border border-white/60 object-cover shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                />
              </div>

              <div className="rounded-[1.75rem] border border-white/60 bg-[linear-gradient(145deg,rgba(7,117,103,0.98),rgba(25,160,142,0.92),rgba(242,126,52,0.88))] p-5 text-white shadow-[0_20px_48px_rgba(15,23,42,0.14)]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    <Users className="h-3.5 w-3.5" />
                    Katılım Çağrısı
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    <Building2 className="h-3.5 w-3.5" />
                    CTA Revizyon
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-black md:text-[2rem]">Global Türk gücünü birlikte organize edelim</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/84">
                  Platform yayına alındığında kendi kategorinizde ilk görünenlerden olmak, topluluklara katılmak
                  ve doğru insanlara daha hızlı ulaşmak için şimdiden yerinizi alın.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#kaydol"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0e5f56] transition hover:bg-white/90"
                  >
                    Erken Kayıt Bırak
                  </a>
                  <a
                    href="https://chat.whatsapp.com/JDMyCOx0m2w3lqejP7vA6M"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/16"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Topluluğuna Katıl
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.75rem] border border-white/60 bg-background/72 p-5 shadow-sm">
                <h3 className="text-xl font-black text-foreground md:text-2xl">Kimler için?</h3>
                <div className="mt-4 grid gap-3">
                  {audienceCards.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.25rem] border border-white/70 bg-white/82 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl leading-none">{item.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-base font-bold text-foreground">{item.title}</div>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                          <a
                            href="#kaydol"
                            className="mt-3 inline-flex items-center rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                          >
                            {item.cta}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/60 bg-background/72 p-5 shadow-sm">
                <h3 className="text-xl font-black text-foreground md:text-2xl">Tek platformda</h3>
                <div className="mt-4 grid gap-3">
                  {platformItems.map((item) => (
                    <div key={item} className="rounded-xl border border-white/65 bg-white/80 px-4 py-3 text-sm font-medium text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default SEOContentSection;
