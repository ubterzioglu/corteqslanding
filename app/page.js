const heroCities = ["Berlin", "Londra", "Dubai", "Paris", "Toronto", "New York"];

const heroBadges = ["Danismanlar", "Etkinlikler", "Topluluklar", "Isletmeler"];

const videos = [
  { src: "/media/video1.mp4", label: "Diaspora Pulse", meta: "Global network energy" },
  { src: "/media/video2.mp4", label: "City Signals", meta: "People, movement, discovery" },
  { src: "/media/video3.mp4", label: "Next Layer", meta: "Culture, access, connection" },
];

const teaserCards = [
  {
    title: "Danismanlar",
    text: "Guvendigin uzmanlari sehir sehir kesfet, baglantiyi dogrudan kur.",
  },
  {
    title: "Kuruluslar",
    text: "Dernekler, topluluklar ve kurumlar tek cati altinda gorunur olsun.",
  },
  {
    title: "Isletmeler",
    text: "Diasporaya dokunan isletmeler dogru kitleyle daha hizli bulussun.",
  },
  {
    title: "Etkinlikler",
    text: "Sehrindeki bulusmalari, networking alanlarini ve yeni firsatlari kacirma.",
  },
  {
    title: "Topluluklar",
    text: "Ilgi alanina, sehrine ve hayat ritmine gore kendi cevreni kur.",
  },
  {
    title: "Sehir Rehberi",
    text: "Yeni bir ulkede veya sehirde sifirdan baslamak zorunda kalma.",
  },
];

const audiences = [
  {
    title: "Yeni tasinanlar",
    text: "Nereden baslayacagini degil, kime baglanacagini bilen bir giris noktasi.",
  },
  {
    title: "Ogrenciler",
    text: "Yasadigin sehirde aidiyet, firsat ve dogru insanlarla daha hizli bulus.",
  },
  {
    title: "Genc profesyoneller",
    text: "Kariyer, sosyal cevre ve yerel kesif ayni akista birlessin.",
  },
  {
    title: "Isletmeler",
    text: "Topluluga gercekten dokunan gorunurluk ve guven katmani olustur.",
  },
  {
    title: "Dernekler",
    text: "Etkinliklerini, agini ve etkini daha modern bir dille buyut.",
  },
  {
    title: "Topluluk yoneticileri",
    text: "Sehrindeki hareketi organize eden merkezlerden biri sen ol.",
  },
];

const launchMarkets = [
  "Almanya",
  "Ingiltere",
  "BAE",
  "Avustralya",
  "Fransa",
  "ABD",
  "Kanada",
  "Hollanda",
  "Avusturya",
  "Isvec",
];

const roadmap = [
  {
    phase: "01",
    title: "Erken erisim",
    text: "Ilk topluluk, ilk kullanicilar ve ilk sehir sinyalleri aciliyor.",
  },
  {
    phase: "02",
    title: "Topluluklar",
    text: "Insanlari ilgi alani, sehir ve ihtiyac etrafinda bulusturan katman geliyor.",
  },
  {
    phase: "03",
    title: "Etkinlikler",
    text: "Sehir bazli etkinlik kesfi ve yerel gorunurluk akisi aktive oluyor.",
  },
  {
    phase: "04",
    title: "Danisman agi",
    text: "Uzmanlara erisim ve guven odakli profil yapisi devreye giriyor.",
  },
  {
    phase: "05",
    title: "Sehir kesfi",
    text: "Diaspora hayatini kolaylastiran yerel rehberlik katmani buyuyor.",
  },
];

export default function HomePage() {
  return (
    <main className="coming-shell">
      <div className="mesh mesh-a" />
      <div className="mesh mesh-b" />
      <div className="grain-layer" />

      <section className="topbar">
        <div className="brand-mark">
          <span className="brand-dot" />
          <strong>CorteQS</strong>
        </div>
        <div className="status-pill">Coming Soon</div>
      </section>

      <header className="hero-panel">
        <div className="hero-copy">
          <p className="hero-kicker">Yeni nesil global Turk diasporasi agi</p>
          <h1>
            Dunyayin neresinde olursan ol,
            <span>kendi agin burada basliyor.</span>
          </h1>
          <p className="hero-text">
            CorteQS; yurtdisinda yasayan Turkleri, danismanlari, kuruluslari, isletmeleri,
            etkinlikleri ve topluluklari tek bir dijital akista bulusturmak icin geliyor.
          </p>

          <div className="hero-actions">
            <a href="#notify" className="button button-primary">
              Ilk Haberdar Olanlardan Ol
            </a>
            <a href="#vision" className="button button-secondary">
              Vizyonu Kesfet
            </a>
          </div>

          <div className="city-ribbon">
            {heroCities.map((city) => (
              <span key={city} className="city-chip">
                {city}
              </span>
            ))}
          </div>

          <div className="hero-notes">
            {heroBadges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-video-main frame-card">
            <video autoPlay muted loop playsInline preload="metadata" src={videos[0].src} />
            <div className="frame-copy">
              <span>{videos[0].label}</span>
              <small>{videos[0].meta}</small>
            </div>
          </div>

          <div className="hero-video-stack">
            {videos.slice(1).map((video) => (
              <div key={video.src} className="frame-card frame-card-small">
                <video autoPlay muted loop playsInline preload="metadata" src={video.src} />
                <div className="frame-copy">
                  <span>{video.label}</span>
                  <small>{video.meta}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="floating-card floating-card-a">
            <span>Network Layer</span>
            <strong>People x Cities x Opportunity</strong>
          </div>
          <div className="floating-card floating-card-b">
            <span>Launch Mode</span>
            <strong>Early signal is live</strong>
          </div>
        </div>
      </header>

      <section id="vision" className="story-panel">
        <div className="story-copy">
          <p className="section-kicker">Ne geliyor?</p>
          <h2>Bir rehber degil. Bir ag etkisi geliyor.</h2>
          <p>
            CorteQS tek bir ihtiyaci cozmek icin tasarlanmadi. Yeni bir sehre tasinmaktan dogru
            uzmani bulmaya, topluluga baglanmaktan yerel etkinlikleri kesfetmeye kadar daginik
            hayatlari tek bir dijital ritimde toplamak icin geliyor.
          </p>
        </div>
        <div className="story-mini-card">
          <span>Coming Soon</span>
          <strong>Belonging, connection, movement.</strong>
          <p>Yeni nesil diaspora deneyimi daha sicak, daha hizli ve daha gorunur olacak.</p>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-head">
          <p className="section-kicker">Vitrin</p>
          <h2>Ilk acilacak katmanlar</h2>
        </div>
        <div className="teaser-grid">
          {teaserCards.map((item) => (
            <article key={item.title} className="teaser-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel">
        <div className="section-head">
          <p className="section-kicker">Kimler icin?</p>
          <h2>Diaspora hayatinin farkli ritimleri icin tek merkez</h2>
        </div>
        <div className="audience-grid">
          {audiences.map((item) => (
            <article key={item.title} className="audience-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-panel markets-panel">
        <div className="section-head">
          <p className="section-kicker">Launch Markets</p>
          <h2>Ilk hareketin gelecegi pazarlar</h2>
        </div>
        <div className="market-marquee">
          <div className="market-track">
            {[...launchMarkets, ...launchMarkets].map((market, index) => (
              <span key={`${market}-${index}`} className="market-chip">
                {market}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-head">
          <p className="section-kicker">Mini roadmap</p>
          <h2>Yakinda neler aciliyor?</h2>
        </div>
        <div className="roadmap-grid">
          {roadmap.map((item) => (
            <article key={item.phase} className="roadmap-card">
              <span>{item.phase}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="notify" className="cta-panel">
        <div className="cta-copy">
          <p className="section-kicker">Erken erisim</p>
          <h2>Listeye katil. Acildiginda ilk sen duy.</h2>
          <p>
            Bu ilk dalga merak edenler icin degil; erken gormek, erken baglanmak ve erken konum
            almak isteyenler icin.
          </p>
        </div>

        <form className="notify-form" action="#" method="post">
          <label htmlFor="notifyEmail">E-posta adresin</label>
          <input id="notifyEmail" type="email" name="notifyEmail" placeholder="ornek@mail.com" required />
          <button type="submit" className="button button-primary button-full">
            Listeye Katil
          </button>
          <a href="/d" className="button button-ghost button-full">
            Dokumani Incele
          </a>
        </form>
      </section>

      <footer className="footer-bar">
        <strong>CorteQS</strong>
        <p>Global Turk diasporasi icin yeni nesil baglanti, kesif ve topluluk katmani.</p>
      </footer>
    </main>
  );
}
