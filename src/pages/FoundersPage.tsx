import { useEffect } from "react";
import { ArrowRight, Briefcase, Building2, Compass, Globe2, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

type FounderSection = {
  title: string;
  body: string;
};

type FounderProfile = {
  name: string;
  role: string;
  summary: string;
  regions: string[];
  strengths: string[];
  sections: FounderSection[];
};

const founderProfiles: FounderProfile[] = [
  {
    name: "Burak Akçakanat",
    role: "Kurucu Ortak",
    summary:
      "Reel sektör, uluslararası büyüme, insan davranışı ve stratejik yapılanma başlıklarını aynı potada buluşturan çok katmanlı bir iş geliştirici ve kurucu.",
    regions: ["Avustralya", "Amerika", "Dubai", "Doha", "İstanbul", "MENA / GCC"],
    strengths: [
      "Uluslararası pazar deneyimi",
      "Stratejik büyüme ve yapılanma",
      "İnsan ve davranış bilimleri bakışı",
      "Kurumsal yönetim ve liderlik danışmanlığı",
    ],
    sections: [
      {
        title: "Profesyonel Arka Plan",
        body:
          "Profesyonel yolculuğunu tek bir sektör veya ülke ile sınırlamadan; üretim, ithalat, ticaret, perakende, danışmanlık ve kurumsal yapılanma gibi farklı alanlarda sahadan deneyimleyerek inşa etti. Bu çizgi, işlerin yalnızca fikirle değil; operasyon, finans, organizasyon, güven ve sürdürülebilir uygulama disipliniyle büyüdüğünü gösteren güçlü bir zemin oluşturdu.",
      },
      {
        title: "CorteQS Vizyonu ile Bağlantısı",
        body:
          "CorteQS’i yalnızca bir network ürünü değil; global Türk diasporasını şehir bazlı, kategori bazlı ve güven odaklı bir ekonomik ve sosyal dayanışma ekolojisine dönüştürebilecek uzun vadeli bir dijital altyapı olarak görüyor. Platformun bireyleri, profesyonelleri, işletmeleri, yatırımcıları, içerik üreticilerini ve kurumları daha sistemli bir bağ içinde buluşturmasını temel değer önerisi olarak konumluyor.",
      },
      {
        title: "Stratejik ve Yatırımcı Perspektifi",
        body:
          "Qualtron Sinclair yaklaşımıyla CorteQS’e; Türkiye, BAE, Katar, Suudi Arabistan ve daha geniş MENA bölgesine uzanan bir büyüme partnerliği mantığıyla bakıyor. Net problem alanı, dağınık ama büyük diaspora kitlesi, şehir bazlı ölçeklenme ve çoklu gelir modeli potansiyeli sayesinde CorteQS’in üyelikten premium görünürlüğe, etkinliklerden sponsorluklara uzanan geniş bir ekosisteme dönüşebileceğine inanıyor.",
      },
    ],
  },
  {
    name: "Umut Barış Terzioğlu",
    role: "Kurucu Ortak",
    summary:
      "Mühendislik disiplini, kalite güvencesi, otomasyon, süreç optimizasyonu ve ölçeklenebilir sistemler odağından gelen kurucu ve operasyonel yapı tasarımcısı.",
    regions: ["Türkiye", "Almanya", "Global kurumsal sistemler"],
    strengths: [
      "Yazılım kalite güvencesi ve test yönetimi",
      "Süreç optimizasyonu ve otomasyon",
      "Kurumsal sistem güvenilirliği",
      "Topluluk ihtiyacını teknik disiplinle birleştirme",
    ],
    sections: [
      {
        title: "Profesyonel Arka Plan",
        body:
          "18 yılı aşan kariyeri boyunca Türkiye ve Almanya’da; Daimler / Mercedes-Benz ve Swisslog gibi yüksek karmaşıklığa sahip yapılarda görev aldı. Yalnızca test süreçlerinde bulunmakla kalmayıp kalite sistemleri kurdu, test stratejileri geliştirdi, otomasyon yapıları tasarladı ve global kullanıcıları etkileyen projelerde sürdürülebilir operasyonel yapıların nasıl inşa edilmesi gerektiğine dair güçlü bir birikim kazandı.",
      },
      {
        title: "CorteQS Vizyonu ile Bağlantısı",
        body:
          "CorteQS’i, yurt dışında yaşayan Türklerin güvenilir bağlantı, erişim, görünürlük ve fırsat ihtiyaçlarına yanıt verecek bir dijital altyapı olarak konumluyor. Onun bakışında platformun asıl değeri; dağınık insan gücünü, bilgi birikimini, hizmetleri ve topluluk etkisini organize ederek ölçülebilir bir güven ve etki sistemine dönüştürmesinde yatıyor.",
      },
      {
        title: "Stratejik ve Yatırımcı Perspektifi",
        body:
          "Kurumsal kalite ve ölçeklenebilirlik refleksini topluluk inşa motivasyonuyla birleştirerek CorteQS’in kısa vadeli bir proje değil, şehir şehir genişleyebilecek sürdürülebilir bir diaspora altyapısı olmasını hedefliyor. Bu nedenle platformu; üyelik, premium görünürlük, listeleme, iş birlikleri, topluluk araçları, etkinlikler ve diaspora odaklı reklam modelleriyle ölçeklenebilir bir girişim temeli üzerinde değerlendiriyor.",
      },
    ],
  },
];

const platformPillars = [
  {
    title: "Güvenilir Ağ",
    description: "Diaspora içindeki görünmez bağlantıları doğrulanabilir ve erişilebilir ilişkilere dönüştüren bir yapı.",
    Icon: ShieldCheck,
  },
  {
    title: "Şehir Bazlı Ölçek",
    description: "Büyümeyi ülke geneline yaymadan önce şehir şehir derinleşen, yerel yoğunluğu önemseyen model.",
    Icon: Compass,
  },
  {
    title: "Ekonomik ve Sosyal Etki",
    description: "Bağlantıyı yalnızca iletişim değil; hizmet, iş birliği, yatırım ve topluluk etkisine çeviren yaklaşım.",
    Icon: Building2,
  },
];

const FoundersPage = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Kurucular | CorteQS";
    document.dispatchEvent(new Event("render-complete"));

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f4ee_0%,#fffdf9_38%,#f2f7f6_100%)]">
      <main className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] opacity-90"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 10% 14%, rgba(17,94,89,0.16), transparent 28%), radial-gradient(circle at 88% 10%, rgba(217,119,6,0.18), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0))",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          aria-hidden="true"
          style={{ background: "rgba(20, 120, 110, 0.12)" }}
        />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            ← Ana Sayfaya Dön
          </Link>

          <section className="mb-12 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_rgba(16,24,40,0.08)] backdrop-blur-xl md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Kurucular
                </span>
                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-tight text-foreground md:text-6xl">
                  CorteQS’i inşa eden bakış:
                  <span className="block text-primary">strateji, sistem ve topluluk.</span>
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  CorteQS, diaspora ihtiyacını yalnızca bir ürün problemi olarak değil; güven, erişim,
                  görünürlük ve ekonomik dayanışma başlıklarının kesişiminde okuyan iki kurucunun
                  tamamlayıcı deneyiminden doğuyor.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,243,239,0.88))] p-5 shadow-sm sm:col-span-2">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Kurucu Tezi
                  </div>
                  <div className="mt-2 text-2xl font-black text-foreground">Dağınık diasporayı ölçülebilir ekosisteme dönüştürmek</div>
                </div>
                <div className="rounded-[1.75rem] border border-border/70 bg-white/90 p-5 shadow-sm">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Globe2 className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Perspektif
                  </div>
                  <div className="mt-2 text-xl font-black text-foreground">Global + yerel</div>
                </div>
                <div className="rounded-[1.75rem] border border-border/70 bg-white/90 p-5 shadow-sm">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Odak
                  </div>
                  <div className="mt-2 text-xl font-black text-foreground">Güven, topluluk, fırsat</div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12 grid gap-5 md:grid-cols-3">
            {platformPillars.map(({ title, description, Icon }) => (
              <article
                key={title}
                className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
              >
                <div
                  className="absolute right-0 top-0 h-24 w-24 rounded-full blur-2xl"
                  aria-hidden="true"
                  style={{ background: "rgba(243,110,49,0.10)" }}
                />
                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="space-y-8">
            {founderProfiles.map((founder, index) => (
              <article
                key={founder.name}
                className={`rounded-[2rem] border border-border/70 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)] md:p-8 ${
                  index === 0
                    ? "bg-[linear-gradient(160deg,rgba(18,58,60,0.98),rgba(24,88,84,0.95),rgba(241,120,58,0.90))] text-white"
                    : "bg-white/88 backdrop-blur"
                }`}
              >
                <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                        index === 0
                          ? "border-white/20 bg-white/10 text-white/80"
                          : "border-primary/20 bg-primary/10 text-primary"
                      }`}
                    >
                      {founder.role}
                    </span>
                    <h2 className={`mt-4 text-3xl font-black tracking-tight md:text-4xl ${index === 0 ? "text-white" : "text-foreground"}`}>
                      {founder.name}
                    </h2>
                    <p className={`mt-4 text-base leading-8 ${index === 0 ? "text-white/82" : "text-muted-foreground"}`}>
                      {founder.summary}
                    </p>

                    <div
                      className={`mt-6 rounded-2xl border p-4 ${
                        index === 0 ? "border-white/15 bg-white/10" : "border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,243,239,0.86))]"
                      }`}
                    >
                      <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${index === 0 ? "text-white/70" : "text-muted-foreground"}`}>
                        Coğrafi Bağlam
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {founder.regions.map((region) => (
                          <span
                            key={region}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              index === 0 ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
                            }`}
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`mt-4 rounded-2xl border p-4 ${
                        index === 0 ? "border-white/15 bg-black/10" : "border-border/70 bg-white/70"
                      }`}
                    >
                      <div className={`text-xs font-semibold uppercase tracking-[0.22em] ${index === 0 ? "text-white/70" : "text-muted-foreground"}`}>
                        Ayırt Edici Güçler
                      </div>
                      <div className="mt-3 grid gap-2">
                        {founder.strengths.map((strength) => (
                          <div key={strength} className="flex items-start gap-3">
                            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${index === 0 ? "bg-white" : "bg-accent"}`} />
                            <p className={`text-sm leading-6 ${index === 0 ? "text-white/82" : "text-muted-foreground"}`}>{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {founder.sections.map((section) => (
                      <div
                        key={section.title}
                        className={`rounded-[1.6rem] border p-5 ${
                          index === 0
                            ? "border-white/15 bg-white/10"
                            : "border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,245,242,0.88))]"
                        }`}
                      >
                        <h3 className={`text-lg font-bold ${index === 0 ? "text-white" : "text-foreground"}`}>{section.title}</h3>
                        <p className={`mt-3 text-sm leading-7 ${index === 0 ? "text-white/82" : "text-muted-foreground"}`}>
                          {section.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-12 rounded-[2rem] border border-border/70 bg-white/82 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)] backdrop-blur md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Kurucu Perspektifi</span>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                  CorteQS, bağlantıyı kalıcı değere dönüştürme iddiasıyla kuruluyor
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Kurucuların ortak yaklaşımı; diaspora ihtiyacını yalnızca bir keşif veya içerik katmanı değil,
                güvenli erişim, görünürlük, profesyonel fırsat, kültürel hafıza ve topluluk etkisini aynı
                sistemde birleştiren uzun vadeli bir altyapı problemi olarak ele almak.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Güvenilir erişim", "Şehir bazlı büyüme", "Topluluk ekonomisi", "Uzun vadeli dijital altyapı"].map((item) => (
                <span key={item} className="rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-white px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                Ana sayfaya dön
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
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

export default FoundersPage;
