import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

const impactItems = [
  "Türk diasporasını tek platformda toplar",
  "Profesyonelleri, girişimcileri ve üreticileri buluşturur",
  "Global ölçekte güçlü network oluşturur",
  "İş fırsatlarına erişimi hızlandırır",
  "Yeteneği doğru fırsatla eşleştirir",
  "Üyelerin görünürlüğünü artırır",
  "Topluluk içi güveni ve etkileşimi güçlendirir",
  "Ülkeler arası bilgi akışını sağlar",
  "Yeni iş birliklerinin önünü açar",
  "Girişimlerin büyümesini destekler",
  "Freelance ve remote fırsatları görünür kılar",
  "Kariyer gelişimini destekleyen ortam sunar",
  "Bilgi paylaşımını sistematik hale getirir",
  "Sosyal ve profesyonel bağı birleştirir",
  "Diaspora içi dayanışmayı artırır",
  "Dijital kimlik ve profil oluşturmayı kolaylaştırır",
  "Topluluk bazlı fırsat keşfi sağlar",
  "AI destekli eşleşmelerle doğru kişiyi buldurur",
  "Global Türk gücünü organize eder",
  "Görünürlüğü gerçek değere dönüştürür",
];

const pillars = [
  {
    title: "Bağlantı Kur",
    description:
      "Bulunduğun şehirde ya da hedeflediğin ülkede doğru insanlara, güvenilir topluluklara ve seni hızlandıracak ilişkilere daha kısa sürede ulaş.",
    icon: Users,
  },
  {
    title: "Görünür Ol",
    description:
      "Uzmanlığını, girişimini, üretimini veya topluluk katkını dijital vitrine taşı. Profilin yalnızca görünmesin, anlamlı fırsatlara da dönüşsün.",
    icon: Sparkles,
  },
  {
    title: "Fırsat Yarat",
    description:
      "İş ortaklığı, müşteri, kariyer, danışmanlık, freelance ve remote fırsatlarını tek tek kovalamak yerine doğru ağ içinde doğal olarak üret.",
    icon: Zap,
  },
];

const statCards = [
  { label: "Kapsam", value: "164 ülke", icon: Globe },
  { label: "Potansiyel ağ", value: "8.8 milyon Türk", icon: Users },
  { label: "Odak", value: "Şehir + kategori", icon: MapPin },
  { label: "Yaklaşım", value: "AI destekli eşleşme", icon: Target },
];

const benefitColumns = [
  {
    title: "Profesyoneller İçin",
    points: [
      "Uzmanlığını doğru topluluğa gösterme",
      "Doğru müşteri ve iş ortaklarına ulaşma",
      "Kariyer ve danışmanlık fırsatlarını artırma",
      "Güven temelli görünürlük kazanma",
    ],
  },
  {
    title: "Girişimler ve İşletmeler İçin",
    points: [
      "Diaspora içinde daha hızlı keşfedilme",
      "Ülke ve şehir bazlı büyüme alanları bulma",
      "Yeni iş birlikleri ve dağıtım kanalları açma",
      "Topluluk içinden güvenli talep yakalama",
    ],
  },
  {
    title: "Topluluk ve Bireyler İçin",
    points: [
      "Bilgiye daha hızlı ve düzenli erişme",
      "Yeni şehirlerde daha kolay yön bulma",
      "Güvenilir çevre ve dayanışma ağı kurma",
      "Sosyal ve profesyonel hayatı aynı zeminde büyütme",
    ],
  },
];

const AboutPage = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--section-warm))_52%,hsl(var(--background))_100%)]">
      <main className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] opacity-90"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 12% 18%, hsl(var(--primary) / 0.22), transparent 30%), radial-gradient(circle at 88% 14%, hsl(var(--accent) / 0.18), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0))",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-32 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
          aria-hidden="true"
          style={{ background: "hsl(var(--primary) / 0.14)" }}
        />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/75 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            ← Ana Sayfaya Dön
          </Link>

          <section className="mb-14 rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_30px_80px_rgba(16,24,40,0.08)] backdrop-blur-xl md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Hakkımızda
                </span>
                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-tight text-foreground md:text-6xl">
                  Türk Diasporası artık dağınık değil.
                  <span className="block text-primary">Birleşiyor.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  CorteQS ile hedef net: <span className="font-semibold text-foreground">bağlantı kur, görünür ol, fırsat yarat.</span>
                  Dünyanın dört bir yanındaki Türkleri daha organize, daha görünür ve daha güçlü bir topluluk yapısında buluşturuyoruz.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://chat.whatsapp.com/JDMyCOx0m2w3lqejP7vA6M"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Topluluğuna Katıl
                  </a>
                  <Link
                    to="/#kaydol"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-white px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    Katıl ve Parçası Ol
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {statCards.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,239,0.88))] p-5 shadow-sm"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="mt-2 text-2xl font-black text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-14 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
              >
                <div
                  className="absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl"
                  aria-hidden="true"
                  style={{ background: "hsl(var(--accent) / 0.12)" }}
                />
                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <pillar.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="mb-14 rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)] md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">CorteQS Ne Yapar?</span>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                  Görünürlüğü gerçek değere dönüştüren diaspora altyapısı
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Bu yapı sadece bir rehber değil. İlişki, güven, fırsat ve bilgi akışını aynı platformda birleştiren büyüme zemini.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {impactItems.map((item, index) => (
                <div
                  key={item}
                  className="group rounded-2xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,245,242,0.88))] px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium leading-6 text-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[2rem] border border-border/70 bg-[linear-gradient(160deg,rgba(18,58,60,0.96),rgba(28,111,105,0.92),rgba(243,110,49,0.86))] p-8 text-white shadow-[0_28px_70px_rgba(11,33,35,0.22)]">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Kısaca</span>
              <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                Doğru insan + doğru zaman + doğru platform
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/82">
                CorteQS, diasporadaki enerjiyi sadece görünür kılmakla kalmaz; onu organize eder, eşleştirir ve büyümeye dönüştürür.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="text-sm font-semibold text-white">Neden şimdi?</div>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    Çünkü diaspora güçlü ama parçalı. Bilgi, çevre ve fırsatlar var; eksik olan bunları ortak bir sistemde bir araya getirmek.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="text-sm font-semibold text-white">CorteQS’in farkı</div>
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    Şehir bazlı yapı, kategori odaklı görünürlük, topluluk güveni ve AI destekli eşleşme mantığını aynı deneyimde toplaması.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)] md:p-8">
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Kimler İçin?</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground">
                Tek bir kitleye değil, ekosistemin tamamına hizmet eder
              </h2>
              <div className="mt-8 grid gap-4">
                {benefitColumns.map((column) => (
                  <div
                    key={column.title}
                    className="rounded-2xl border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,243,239,0.82))] p-5"
                  >
                    <h3 className="text-lg font-bold text-foreground">{column.title}</h3>
                    <div className="mt-4 grid gap-3">
                      {column.points.map((point) => (
                        <div key={point} className="flex items-start gap-3">
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                          <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="rounded-[2rem] border border-border/70 bg-white/80 p-6 text-center shadow-[0_24px_60px_rgba(15,23,42,0.05)] backdrop-blur md:p-10">
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Katılım Çağrısı</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Global Türk gücünü birlikte organize edelim
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              Eğer sen de görünür olmak, doğru insanlara ulaşmak, topluluk içinde fırsat üretmek ve bu yapının bir parçası olmak istiyorsan şimdi katıl.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://chat.whatsapp.com/JDMyCOx0m2w3lqejP7vA6M"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Topluluğuna Katıl
              </a>
              <a
                href="https://corteqs.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-2xl border border-primary/25 bg-white px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                Web Sitesine Git
                <ArrowRight className="h-4 w-4 text-primary" />
              </a>
              <a
                href="mailto:info@corteqs.net"
                className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                <Mail className="h-4 w-4 text-accent" />
                İletişime Geç
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="px-4 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CorteQS bir Qualtron Sinclair ve Akçakanat-Terzioğlu Girişimidir. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default AboutPage;
