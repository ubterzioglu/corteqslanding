import type { ReactNode } from "react";

export type WorkspaceDocSection = {
  id: string;
  title: string;
  accentColor: string;
  content: ReactNode;
};

export type WorkspaceDocPage = {
  slug: string;
  title: string;
  description: string;
  badge: string[];
  sections: WorkspaceDocSection[];
};

export const workspaceDocPages: WorkspaceDocPage[] = [
  {
    slug: "kortexdocs",
    title: "Kortex Docs",
    description: "Teknik omurga, pitch anlatısı ve PRD hattını tek admin alanında toplayan referans sayfa.",
    badge: ["CTO Handoff", "Investor Pitch", "PRD"],
    sections: [
      {
        id: "vision",
        title: "Dokuman Setinin Amaci",
        accentColor: "#1A6DC2",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Kortex teknik, urun ve yatirimci anlatilarini tek cati altinda toplar.</li>
            <li>Bu alan ekiplerin ayni sistemin farkli yuzlerini ortak dille gormesini saglar.</li>
            <li>Admin ici erisim sayesinde artik ayri dashboard repo ihtiyaci kalmaz.</li>
          </ul>
        ),
      },
      {
        id: "cto",
        title: "CTO Handoff Ozeti",
        accentColor: "#34A853",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Temel mimari diaspora odakli hiyerarsik kesif modeline dayanir.</li>
            <li>Supabase tabanli backend, auth, listing, search ve claim akislarini merkeze alir.</li>
            <li>Guvenlik, rol bazli erisim ve olceklenebilirlik erken asamada planin parcasi kabul edilir.</li>
          </ul>
        ),
      },
      {
        id: "pitch",
        title: "Investor Pitch Ozeti",
        accentColor: "#FBBC04",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Vizyon: global Turk diasporasi icin merkezi super app olmak.</li>
            <li>Problem: hizmet, topluluk ve firsatlara daginik erisim.</li>
            <li>Cozum: discovery, community ve marketplace katmanlarini tek urunde birlestirmek.</li>
          </ul>
        ),
      },
    ],
  },
  {
    slug: "roadmap",
    title: "Roadmap",
    description: "MVP'den seed-ready seviyesine giden 12 aylik urun ve buyume plani.",
    badge: ["M1-M12", "Growth", "Revenue"],
    sections: [
      {
        id: "phases",
        title: "Faz Kurgusu",
        accentColor: "#1A6DC2",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Akis MVP, Launch, Growth, PMF, Scale, Expansion ve Seed Ready fazlarina ayrilir.</li>
            <li>Her faz sadece urun teslimi degil, arz, talep ve gelir dengesini birlikte tasir.</li>
            <li>Bu panel karar alma ve yatirimci anlatisi icin ayni anda kullanilir.</li>
          </ul>
        ),
      },
      {
        id: "mvp",
        title: "MVP ve Launch Donemi",
        accentColor: "#34A853",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Ilk donem auth, listing, booking, search, admin ve SEO temelini kurar.</li>
            <li>Launch ile odak kullanilabilirlikten olculebilir gelir ve onboarding verimine kayar.</li>
            <li>Referral, analytics ve mobile optimizasyon bu noktada devreye girer.</li>
          </ul>
        ),
      },
      {
        id: "scale",
        title: "Scale ve Seed Ready",
        accentColor: "#FBBC04",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Dogrulanan yapi yeni sehirler, partnerlikler ve B2B gelir katmanlariyla buyutulur.</li>
            <li>Hedef metrikler advisor, kullanici ve revenue dengesini birlikte takip eder.</li>
            <li>Son durum yatirimciya anlatilabilir, tekrarlanabilir bir buyume sistemi yaratmaktir.</li>
          </ul>
        ),
      },
    ],
  },
  {
    slug: "ambassador",
    title: "Ambassador",
    description: "Sehir bazli topluluk buyume motoru, onboarding ve saha dagitimi modeli.",
    badge: ["City Lead", "Community", "Revenue Share"],
    sections: [
      {
        id: "role",
        title: "Rol ve Amac",
        accentColor: "#1A6DC2",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Ambassador yapisi yerel topluluklari aktive eden buyume motoru olarak tasarlanir.</li>
            <li>Kullanici ve advisor onboarding ile sehir ici ag etkisini guclendirir.</li>
            <li>Platformu sahada gorunur kilar ve geri bildirim toplar.</li>
          </ul>
        ),
      },
      {
        id: "ops",
        title: "Operasyon Modeli",
        accentColor: "#34A853",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>WhatsApp, Telegram, LinkedIn ve etkinlik organizasyonu temel kanallardir.</li>
            <li>Tematik bulusmalar ve sehir bazli etkinlikler topluluk derinligini artirir.</li>
            <li>Yerel buyume verisi merkezi dashboard akislarina geri beslenir.</li>
          </ul>
        ),
      },
      {
        id: "revenue",
        title: "Gelir ve Teshvik",
        accentColor: "#FBBC04",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Kupon, subscription ve etkinlik gelir paylasimi modelin merkezindedir.</li>
            <li>Oranlar sehir olgunlugu ve operasyon yogunluguna gore ayarlanabilir.</li>
            <li>Sistem statuden cok etki ve aktif katkıyı odullendirir.</li>
          </ul>
        ),
      },
    ],
  },
  {
    slug: "captable",
    title: "Cap Table",
    description: "Kurucu hisse yapisi, ESOP kurgusu ve seyrelme senaryolari icin referans panel.",
    badge: ["Founders", "ESOP", "Vesting"],
    sections: [
      {
        id: "structure",
        title: "Temel Sermaye Yapisi",
        accentColor: "#1A6DC2",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Kurucu paylari ve ESOP havuzu fully diluted mantikla okunur.</li>
            <li>Bu yapi ise alim, option grant ve gelecek turlar icin referans islevi gorur.</li>
            <li>Dokuman kurucu kontrolu ile ekip teshvikini birlikte dengelemeyi hedefler.</li>
          </ul>
        ),
      },
      {
        id: "vesting",
        title: "Vesting Yaklasimi",
        accentColor: "#34A853",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Kurucular icin uzun vadeli bagliligi garanti eden cliff + aylik vesting mantigi vardir.</li>
            <li>Kilit roller ve advisor grantlari rol tipine gore farkli surelerle kurgulanir.</li>
            <li>Yatirimci beklentileriyle uyumlu standardizasyon hedeflenir.</li>
          </ul>
        ),
      },
      {
        id: "deferred",
        title: "Deferred Compensation",
        accentColor: "#FBBC04",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Erken asamada piyasa maasinin tam odenemedigi roller icin referans deger tutulur.</li>
            <li>Bu kayit gelecekteki denkleme, due diligence ve ekip beklenti yonetimine yardim eder.</li>
            <li>Cap table yalniz oran degil, katkilarin ekonomik hafizasina da donusur.</li>
          </ul>
        ),
      },
    ],
  },
  {
    slug: "ekip",
    title: "Ekip ve Butce",
    description: "Rol mimarisi, ucret bantlari, ESOP dagilimi ve ise alim altyapisi.",
    badge: ["16 Rol", "Hiring", "Compensation"],
    sections: [
      {
        id: "team",
        title: "Ekip Yapisi",
        accentColor: "#1A6DC2",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Kurucu, urun, muhendislik ve destek rolleri cok katmanli bir yapi icinde ele alinir.</li>
            <li>Plan mevcut ekipten daha buyuk gelecek yapiyi modellemek icin kullanilir.</li>
            <li>Vesting ve rol seviyeleri ilerideki ise alim dalgalarina referans olur.</li>
          </ul>
        ),
      },
      {
        id: "hiring",
        title: "Hiring ve Degerlendirme",
        accentColor: "#34A853",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Rol, asama, CV, gorusmeci ve not alanlari ile merkezi takip hedeflenir.</li>
            <li>Dokuman bugunku haliyle tam dolu degil, ama operasyonel omurgayi kurar.</li>
            <li>Admin icinde bu sayfa karar baglamini kaybetmeden korunur.</li>
          </ul>
        ),
      },
      {
        id: "budget",
        title: "Butce ve Hisse",
        accentColor: "#FBBC04",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Farkli ulke pazarlarina gore maas bantlari ve toplam ekip maliyeti izlenir.</li>
            <li>Hisse dagitimi kritik teknik ve liderlik rollerine gore katmanlanir.</li>
            <li>Belge planlama iskeletidir; canli veriyle beslendiginde yonetim aracina donusur.</li>
          </ul>
        ),
      },
    ],
  },
  {
    slug: "dijitalpazarlama",
    title: "Dijital Pazarlama",
    description: "Icerik ve kampanya yonetimini tek calisma sistemi icinde toplayan operasyon paneli.",
    badge: ["Content Ops", "Campaigns", "Distribution"],
    sections: [
      {
        id: "content",
        title: "Icerik Yonetuimi",
        accentColor: "#1A6DC2",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Icerik adi, tur, sahip, durum, tarih ve dosya baglamlariyla takip edilir.</li>
            <li>Email, sosyal medya, blog ve benzeri kanallar ayni sistemde toplanir.</li>
            <li>Yapi bugun iskelet olsa da dagitim motoru icin saglam bir cerceve sunar.</li>
          </ul>
        ),
      },
      {
        id: "campaign",
        title: "Kampanya Yonetimi",
        accentColor: "#34A853",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Kampanya sahibi, tarihleri, notlari ve asamalari ayni panelde tutulur.</li>
            <li>Fikirden yayina kadar net bir ilerleme mantigi tanimlanir.</li>
            <li>Bu sayfa growth operasyonunu command center disinda destekleyen stratejik bir katmandir.</li>
          </ul>
        ),
      },
      {
        id: "next",
        title: "Operasyonel Tamamlama",
        accentColor: "#FBBC04",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Sorumlu, tarih, dosya ve not alanlari canli veriyle doldurulmalidir.</li>
            <li>Placeholder kampanya turleri netlestikce ekipler ayni panel uzerinden hizalanir.</li>
            <li>Admin ici konumlandirma sayesinde growth calismalari ayri repo bagimliligindan kurtulur.</li>
          </ul>
        ),
      },
    ],
  },
  {
    slug: "whatsappbot",
    title: "WhatsApp Bot",
    description: "Topluluk tanitimi, opt-in akisi ve token mantigi icin fikir ve operasyon paneli.",
    badge: ["Bot", "Opt-in", "Community"],
    sections: [
      {
        id: "purpose",
        title: "Genel Amac",
        accentColor: "#1A6DC2",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Bot reklamdan cok kullaniciya fayda sunan bir temas noktasi olarak dusunulur.</li>
            <li>Grup akisina zarar vermeden bilgi ve firsat paylasimini duzenlemeyi hedefler.</li>
            <li>Spam riski ve platform kurallari erken asamadan hesaba katilir.</li>
          </ul>
        ),
      },
      {
        id: "model",
        title: "Teknik ve Operasyonel Model",
        accentColor: "#34A853",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Resmi API ve esnek ama riskli gayriresmi cozumler yan yana degerlendirilir.</li>
            <li>Komut tetikleyicileri, zamanli mesajlar ve DM yonlendirmeleri temel senaryolardir.</li>
            <li>Opt-in ve opt-out akislari grup spamini azaltmak icin zorunludur.</li>
          </ul>
        ),
      },
      {
        id: "token",
        title: "Odul ve Takip Katmani",
        accentColor: "#FBBC04",
        content: (
          <ul className="space-y-2 text-sm leading-7 text-slate-700">
            <li>Numara, wallet ve ozel link eslestirmesi uzerinden odul mekanizmasi kurgulanir.</li>
            <li>Tiklama limiti, suistimal engelleme ve gunluk kurallar backend tasariminin parcasidir.</li>
            <li>Bu alan hem growth hem topluluk sadakati icin deneysel bir ar-ge panelidir.</li>
          </ul>
        ),
      },
    ],
  },
];

export function getWorkspaceDocPage(slug: string) {
  return workspaceDocPages.find((page) => page.slug === slug) ?? null;
}
