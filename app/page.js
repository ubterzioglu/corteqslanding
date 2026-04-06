const heroCities = ["Berlin", "Londra", "Dubai", "Paris", "Toronto", "New York"];

const heroBadges = ["Danışmanlar", "Etkinlikler", "Topluluklar", "İşletmeler"];

const videos = [
  { src: "/media/video1.mp4", label: "Diaspora Pulse", meta: "Global network energy" },
  { src: "/media/video2.mp4", label: "City Signals", meta: "People, movement, discovery" },
  { src: "/media/video3.mp4", label: "Next Layer", meta: "Culture, access, connection" },
];

const teaserCards = [
  {
    title: "Danışmanlar",
    text: "Güvendiğin uzmanları şehir şehir keşfet, bağlantıyı doğrudan kur.",
  },
  {
    title: "Kuruluşlar",
    text: "Dernekler, topluluklar ve kurumlar tek çatı altında görünür olsun.",
  },
  {
    title: "İşletmeler",
    text: "Diasporaya dokunan işletmeler doğru kitleyle daha hızlı buluşsun.",
  },
  {
    title: "Etkinlikler",
    text: "Şehrindeki buluşmaları, networking alanlarını ve yeni fırsatları kaçırma.",
  },
  {
    title: "Topluluklar",
    text: "İlgi alanına, şehrine ve hayat ritmine göre kendi çevreni kur.",
  },
  {
    title: "Şehir Rehberi",
    text: "Yeni bir ülkede veya şehirde sıfırdan başlamak zorunda kalma.",
  },
];

const audiences = [
  {
    title: "Yeni taşınanlar",
    text: "Nereden başlayacağını değil, kime bağlanacağını bilen bir giriş noktası.",
  },
  {
    title: "Öğrenciler",
    text: "Yaşadığın şehirde aidiyet, fırsat ve doğru insanlarla daha hızlı buluş.",
  },
  {
    title: "Genç profesyoneller",
    text: "Kariyer, sosyal çevre ve yerel keşif aynı akışta birleşsin.",
  },
  {
    title: "İşletmeler",
    text: "Topluluğa gerçekten dokunan görünürlük ve güven katmanı oluştur.",
  },
  {
    title: "Dernekler",
    text: "Etkinliklerini, ağını ve etkini daha modern bir dille büyüt.",
  },
  {
    title: "Topluluk yöneticileri",
    text: "Şehrindeki hareketi organize eden merkezlerden biri sen ol.",
  },
];

const launchMarkets = [
  "Almanya",
  "İngiltere",
  "BAE",
  "Avustralya",
  "Fransa",
  "ABD",
  "Kanada",
  "Hollanda",
  "Avusturya",
  "İsveç",
];

const roadmap = [
  {
    phase: "01",
    title: "Erken erişim",
    text: "İlk topluluk, ilk kullanıcılar ve ilk şehir sinyalleri açılıyor.",
  },
  {
    phase: "02",
    title: "Topluluklar",
    text: "İnsanları ilgi alanı, şehir ve ihtiyaç etrafında buluşturan katman geliyor.",
  },
  {
    phase: "03",
    title: "Etkinlikler",
    text: "Şehir bazlı etkinlik keşfi ve yerel görünürlük akışı aktive oluyor.",
  },
  {
    phase: "04",
    title: "Danışman ağı",
    text: "Uzmanlara erişim ve güven odaklı profil yapısı devreye giriyor.",
  },
  {
    phase: "05",
    title: "Şehir keşfi",
    text: "Diaspora hayatını kolaylaştıran yerel rehberlik katmanı büyüyor.",
  },
];

export default function HomePage() {
  return (
    <main className="coming-shell">
      <div className="mesh mesh-a" />
      <div className="mesh mesh-b" />
      <div className="grain-layer" />

      
      <section className="top-video-banner">
        <video autoPlay muted loop playsInline preload="metadata" src={videos[0].src} />
        <div className="banner-overlay">
          <div className="banner-top-left">
            CorteQS
            <br />
            Global Türk Diasporası Ağı
          </div>
          <h2 className="banner-full-line">
            Dünyanın neresinde olursan ol, kendi ağın burada başlıyor.
          </h2>
        </div>
      </section>

      <section className="top-video-banner">
        <video autoPlay muted loop playsInline preload="metadata" src={videos[2].src} />
        <div className="banner-overlay">
          <h2>{videos[2].label}</h2>
          <p>{videos[2].meta}</p>
        </div>
      </section>

      <section className="top-video-banner">
        <video autoPlay muted loop playsInline preload="metadata" src={videos[1].src} />
        <div className="banner-overlay">
          <h2>{videos[1].label}</h2>
          <p>{videos[1].meta}</p>
        </div>
      </section>


      <section className="topbar">
        <div className="brand-mark">
          <span className="brand-dot" />
          <strong>CorteQS</strong>
        </div>
        <div className="status-pill">Coming Soon</div>
      </section>

      <header className="hero-panel">
        <div className="hero-copy">
          <p className="hero-kicker">Global Türk Diasporası Ağı</p>
          <h1>
            Dünyanın neresinde olursan ol,
            <span>kendi ağın burada başlıyor.</span>
          </h1>
          

          <div className="hero-actions">
            <a href="#notify" className="button button-primary">
              İlk Haberdar Olanlardan Ol
            </a>
            <a href="#vision" className="button button-secondary">
              Vizyonu Keşfet
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
          <h2>Bir rehber değil. Bir ağ etkisi geliyor.</h2>
          <p>
            CorteQS tek bir ihtiyacı çözmek için tasarlanmadı. Yeni bir şehre taşınmaktan doğru
            uzmanı bulmaya, topluluğa bağlanmaktan yerel etkinlikleri keşfetmeye kadar dağınık
            hayatları tek bir dijital ritimde toplamak için geliyor.
          </p>
        </div>
        <div className="story-mini-card">
          <span>Coming Soon</span>
          <strong>Belonging, connection, movement.</strong>
          <p>Yeni nesil diaspora deneyimi daha sıcak, daha hızlı ve daha görünür olacak.</p>
        </div>
      </section>

      <section className="content-panel">
        <div className="section-head">
          <p className="section-kicker">Vitrin</p>
          <h2>İlk açılacak katmanlar</h2>
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
          <p className="section-kicker">Kimler için?</p>
          <h2>Diaspora hayatının farklı ritimleri için tek merkez</h2>
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
          <h2>İlk hareketin geleceği pazarlar</h2>
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
          <h2>Yakında neler açılıyor?</h2>
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
          <p className="section-kicker">Erken erişim</p>
          <h2>Listeye katıl. Açıldığında ilk sen duy.</h2>
          <p>
            Bu ilk dalga merak edenler için değil; erken görmek, erken bağlanmak ve erken konum
            almak isteyenler için.
          </p>
        </div>

        <form className="notify-form" action="#" method="post">
          <label htmlFor="notifyEmail">E-posta adresin</label>
          <input id="notifyEmail" type="email" name="notifyEmail" placeholder="ornek@mail.com" required />
          <button type="submit" className="button button-primary button-full">
            Listeye Katıl
          </button>
          <a href="/d" className="button button-ghost button-full">
            Dokümanı İncele
          </a>
        </form>
      </section>

      <footer className="footer-bar">
        <strong>CorteQS</strong>
        <p>Global Türk diasporası için yeni nesil bağlantı, keşif ve topluluk katmanı.</p>
      </footer>
    </main>
  );
}
