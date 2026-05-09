import { useEffect, useState } from "react";
import burakPhoto from "../../burak.png";
import foundersLogo from "../../foundersicinlogo.png";
import ubtPhoto from "../../ubt.png";

type FounderSection = {
  title: string;
  body: string;
};

type FounderProfile = {
  name: string;
  role: string;
  summary: string;
  strengths: string[];
  sections: FounderSection[];
  imageSrc?: string;
  imageAlt: string;
  fallbackInitials: string;
};

const founderProfiles: FounderProfile[] = [
  {
    name: "Burak Akçakanat",
    role: "Kurucu Ortak",
    summary:
      "Reel sektör, uluslararası büyüme, insan davranışı ve stratejik yapılanma başlıklarını aynı potada buluşturan çok katmanlı bir iş geliştirici ve kurucu.",
    strengths: [
      "Uluslararası pazar deneyimi",
      "Stratejik büyüme ve yapılanma",
      "İnsan ve davranış bilimleri bakışı",
      "Kurumsal yönetim ve liderlik danışmanlığı",
    ],
    imageSrc: burakPhoto,
    imageAlt: "Burak Akçakanat profil fotoğrafı",
    fallbackInitials: "BA",
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
    strengths: [
      "Yazılım kalite güvencesi ve test yönetimi",
      "Süreç optimizasyonu ve otomasyon",
      "Kurumsal sistem güvenilirliği",
      "Topluluk ihtiyacını teknik disiplinle birleştirme",
    ],
    imageSrc: ubtPhoto,
    imageAlt: "Umut Barış Terzioğlu profil fotoğrafı",
    fallbackInitials: "UBT",
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

const FounderPortrait = ({
  src,
  alt,
  initials,
  dark,
}: {
  src?: string;
  alt: string;
  initials: string;
  dark: boolean;
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex aspect-[4/5] w-full items-center justify-center rounded-[1.75rem] border text-3xl font-black tracking-[0.18em] ${
          dark
            ? "border-white/15 bg-white/10 text-white"
            : "border-primary/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,247,246,0.92))] text-primary"
        }`}
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="aspect-[4/5] w-full rounded-[1.75rem] border border-white/10 object-cover shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
      onError={() => setHasError(true)}
    />
  );
};

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
          <section className="mb-8 flex justify-center">
            <div className="rounded-[2rem] border border-white/70 bg-white/82 px-6 py-5 shadow-[0_24px_60px_rgba(15,23,42,0.05)] backdrop-blur">
              <img
                src={foundersLogo}
                alt="CorteQS kurucular logosu"
                className="h-16 w-auto object-contain md:h-20"
              />
            </div>
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
                    <div className="mb-6">
                      <FounderPortrait
                        src={founder.imageSrc}
                        alt={founder.imageAlt}
                        initials={founder.fallbackInitials}
                        dark={index === 0}
                      />
                    </div>
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
        </div>
      </main>

      <footer className="px-4 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CorteQS bir Qualtron Sinclair ve Akçakanat-Terzioğlu Girişimidir. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default FoundersPage;
