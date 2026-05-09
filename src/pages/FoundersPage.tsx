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

const founderCardClasses = [
  "border-[#0f6fc2]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(241,248,255,0.97),rgba(235,246,255,0.94))]",
  "border-[#47b000]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(248,252,241,0.97),rgba(238,250,233,0.94))]",
] as const;

const strengthCardClasses = [
  "border-[#0f6fc2]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(236,248,255,0.86),rgba(229,244,255,0.82))]",
  "border-[#47b000]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(245,251,236,0.86),rgba(236,248,230,0.82))]",
] as const;

const sectionCardClasses = [
  "border-[#0f6fc2]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,248,255,0.92),rgba(231,244,255,0.86))]",
  "border-[#ff8a00]/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,236,0.92),rgba(255,239,220,0.86))]",
  "border-[#47b000]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,251,236,0.92),rgba(236,248,230,0.86))]",
] as const;

const FounderPortrait = ({
  src,
  alt,
  initials,
}: {
  src?: string;
  alt: string;
  initials: string;
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className="flex h-44 w-44 items-center justify-center rounded-full border border-[#0f6fc2]/15 bg-[radial-gradient(circle_at_30%_30%,rgba(255,191,71,0.28),rgba(15,111,194,0.10),rgba(255,255,255,0.96))] text-3xl font-black tracking-[0.18em] text-[#0a2f63] shadow-[0_20px_50px_rgba(15,111,194,0.20)]"
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
      className="h-44 w-44 rounded-full border-4 border-white object-cover shadow-[0_18px_45px_rgba(10,79,150,0.24),0_0_0_10px_rgba(255,191,71,0.14)]"
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
    <div className="min-h-screen bg-white">
      <main className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] opacity-90"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 12% 14%, rgba(37,153,225,0.18), transparent 24%), radial-gradient(circle at 84% 10%, rgba(255,133,10,0.16), transparent 20%), radial-gradient(circle at 72% 78%, rgba(96,202,0,0.12), transparent 22%)",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
          aria-hidden="true"
          style={{ background: "rgba(16, 128, 210, 0.12)" }}
        />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16">
          <section className="mb-10">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-[2rem] border border-[#0f6fc2]/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(241,248,255,0.96),rgba(255,248,237,0.96))] px-6 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:px-8 md:py-8">
                <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:gap-7 md:text-left">
                  <div className="shrink-0 rounded-[1.75rem] border border-[#0f6fc2]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(232,245,255,0.95),rgba(255,244,223,0.98))] p-4 shadow-[0_22px_50px_rgba(10,79,150,0.14),0_10px_20px_rgba(255,191,71,0.10)]">
                    <img
                      src={foundersLogo}
                      alt="CorteQS kurucular logosu"
                      className="h-20 w-auto rounded-[1.2rem] object-contain md:h-[112px]"
                    />
                  </div>
                  <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0f6fc2]">
                      Founders
                    </p>
                    <h1 className="mt-2 text-[1.65rem] font-black tracking-tight text-[#071c3f] md:text-[1.9rem] md:leading-none lg:text-[2.05rem]">
                      Diasporayı bağlantıdan ekosisteme taşıyan kurucu bakışı
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600 md:text-[15px]">
                      CorteQS’in arkasında; stratejiyi, teknoloji disiplinini ve topluluk sezgisini aynı zeminde
                      buluşturan iki farklı ama birbirini tamamlayan kurucu perspektifi var.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-2">
            {founderProfiles.map((founder, index) => (
              <article
                key={founder.name}
                className={`rounded-[2rem] border p-6 shadow-[0_24px_60px_rgba(15,23,42,0.07)] md:p-8 ${founderCardClasses[index % founderCardClasses.length]}`}
              >
                <div className="grid gap-8">
                  <div>
                    <div className="mb-6 flex justify-center">
                      <FounderPortrait
                        src={founder.imageSrc}
                        alt={founder.imageAlt}
                        initials={founder.fallbackInitials}
                      />
                    </div>
                    <span className="inline-flex rounded-full border border-[#0f6fc2]/16 bg-[#0f6fc2]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#0a4f96]">
                      {founder.role}
                    </span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-[#071c3f] md:text-4xl">
                      {founder.name}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-slate-600">
                      {founder.summary}
                    </p>

                    <div className={`mt-6 rounded-2xl border p-4 ${strengthCardClasses[index % strengthCardClasses.length]}`}>
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0a4f96]">
                        Ayırt Edici Güçler
                      </div>
                      <div className="mt-3 grid gap-2">
                        {founder.strengths.map((strength) => (
                          <div key={strength} className="flex items-start gap-3">
                            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${index % 2 === 0 ? "bg-[#ff8a00]" : "bg-[#47b000]"}`} />
                            <p className="text-sm leading-6 text-slate-600">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {founder.sections.map((section) => (
                      <div
                        key={section.title}
                        className={`rounded-[1.6rem] border p-5 ${sectionCardClasses[(index + founder.sections.indexOf(section)) % sectionCardClasses.length]}`}
                      >
                        <h3 className="text-lg font-bold text-[#071c3f]">{section.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
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
