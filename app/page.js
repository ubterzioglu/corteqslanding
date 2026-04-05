const topCities = ["Berlin", "Londra", "Dubai", "New York", "Paris", "Tokyo"];

const responsibilities = [
  {
    title: "Yerel Ağ Oluşturma",
    text: "Kullanıcı, danışman ve işletmelerin platforma katılımını sağla.",
  },
  {
    title: "Topluluk Yönetimi",
    text: "WhatsApp grupları, etkinlikler ve onboarding süreçlerini yönet.",
  },
  {
    title: "Platform Aktivasyonu",
    text: "İlk işlemleri ve platform kullanımını aktif hale getir.",
  },
  {
    title: "Etkinlik Organizasyonu",
    text: "Yerel buluşmalar ve networking etkinlikleri düzenle.",
  },
  {
    title: "Strateji ve Raporlama",
    text: "Yerel içgörüleri ve gelişmeleri merkeze düzenli raporla.",
  },
  {
    title: "İşbirlikleri Kurma",
    text: "Yerel iş ortaklıkları ve sponsorluklar geliştir.",
  },
];

const benefits = [
  {
    title: "Gelir Paylaşımı",
    text: "Platform aktivitesinden komisyon geliri.",
  },
  {
    title: "Yerel İş Ortaklıkları",
    text: "İşletme ve kurumlarla doğrudan bağlantı.",
  },
  {
    title: "Kişisel Marka",
    text: "Şehrinde tanınırlık ve liderlik pozisyonu.",
  },
  {
    title: "Global Ağ",
    text: "Merkez ve diğer elçilerle sürekli destek.",
  },
];

const priorityCities = [
  { country: "🇩🇪 Almanya", cities: ["Berlin", "Köln", "Frankfurt"] },
  { country: "🇬🇧 İngiltere", cities: ["Londra"] },
  { country: "🇺🇸 ABD", cities: ["New York", "Los Angeles", "Washington DC"] },
  { country: "🇦🇺 Avustralya", cities: ["Melbourne", "Sydney"] },
  { country: "🇦🇪 BAE", cities: ["Dubai"] },
  { country: "🇫🇷 Fransa", cities: ["Paris"] },
  { country: "🇦🇹 Avusturya", cities: ["Viyana", "Salzburg"] },
  { country: "🇯🇵 Japonya", cities: ["Tokyo"] },
  { country: "🇰🇿 Kazakistan", cities: ["Almatı"] },
  { country: "🇧🇷 Güney Amerika", cities: ["São Paulo", "Buenos Aires", "Santiago"] },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="hero section-card">
        <p className="eyebrow">CorteQS Şehir Elçisi Programı</p>
        <h1>
          Şehrindeki Türk Global Ağını
          <br />
          <span>Sen Şekillendir</span>
        </h1>
        <p className="lead">
          CorteQS Şehir Elçisi Programı'nı dünyanın önde gelen şehirlerinde başlatıyoruz. Güçlü bir
          yerel ağın varsa, insanları bir araya getirmeyi seviyorsan ve şehrinde etki ve gelir
          oluşturmak istiyorsan bu senin fırsatın.
        </p>

        <div className="cta-row">
          <a href="#apply" className="btn btn-primary">
            Şehir Elçisi Başvurusu Yap
          </a>
          <a href="#priority-cities" className="btn btn-secondary">
            Öncelikli Şehirleri Gör
          </a>
          <a href="#notify" className="btn btn-secondary">
            Haberdar Ol
          </a>
        </div>

        <div className="city-cloud">
          {topCities.map((city) => (
            <span key={city} className="city-pill">
              {city}
            </span>
          ))}
        </div>

        <p className="form-note">
          Öncelikli şehirler belirlendi, ancak tüm şehirlerden başvuru kabul ediyoruz.
        </p>
      </header>

      <section className="section-card">
        <p className="eyebrow">Video içerik yakında eklenecek</p>
        <h2>Şehrinin Ağ Merkezini Sen Kur</h2>
        <p className="lead">
          Bu bir gönüllülük rolü değil. Bu, şehrindeki merkez düğüm olma fırsatın: insanların
          bağlandığı, işletmelerin büyüdüğü ve fırsatların senden geçtiği bir pozisyon.
        </p>
        <p className="lead">
          Kendi topluluğunu yönet, etkinlikler düzenle ve platform gelirinden pay al.
        </p>
      </section>

      <section className="section-card">
        <p className="eyebrow">Görevler</p>
        <h2>Şehir Elçisi Olarak Görevlerin</h2>
        <p className="lead">Şehrindeki CorteQS ekosisteminin lideri sen olacaksın.</p>
        <div className="section-grid">
          {responsibilities.map((item) => (
            <article key={item.title} className="section-card persona">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <p className="eyebrow">Kazanımlar</p>
        <h2>Kazanımların ve Avantajların</h2>
        <div className="section-grid">
          {benefits.map((item) => (
            <article key={item.title} className="section-card persona">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <p className="lead">Kazanç tavanı yok, büyümen gelirini belirler.</p>
      </section>

      <section id="priority-cities" className="section-card">
        <p className="eyebrow">Öncelikli Şehirler</p>
        <h2>Global genişleme şehirleri</h2>
        <div className="country-grid">
          {priorityCities.map((group) => (
            <article key={group.country} className="country-block">
              <h3>{group.country}</h3>
              <ul>
                {group.cities.map((city) => (
                  <li key={city}>{city}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="lead">Dünya genelindeki tüm şehirlerden başvuru kabul ediyoruz.</p>
      </section>

      <section id="notify" className="section-card notify-section">
        <div>
          <p className="eyebrow">Haberdar Ol</p>
          <h2>Gelişmeleri ilk sen öğren</h2>
          <p className="lead">
            Lansman tarihi, şehir duyuruları ve yeni program güncellemeleri için e-postanı bırak.
          </p>
        </div>
        <form className="notify-form" action="#" method="post">
          <label>
            E-posta adresin
            <input type="email" name="notifyEmail" placeholder="ornek@mail.com" required />
          </label>
          <button type="submit" className="btn btn-primary">
            Beni Haberdar Et
          </button>
        </form>
      </section>

      <section id="apply" className="section-card form-section">
        <div>
          <p className="eyebrow">Hemen Başvur</p>
          <h2>Elçilik yolculuğuna ilk adımını at</h2>
          <p>
            Şehrinde etki oluşturmak, güçlü bağlantılar kurmak ve gelir paylaşımı modelinde yer
            almak için başvuru formunu doldur.
          </p>
        </div>

        <form className="waitlist-form" action="#" method="post">
          <div className="input-row">
            <label>
              Ad Soyad *
              <input type="text" name="fullName" placeholder="Adınız Soyadınız" required />
            </label>
            <label>
              E-posta *
              <input type="email" name="email" placeholder="ornek@mail.com" required />
            </label>
          </div>

          <div className="input-row">
            <label>
              Telefon (WhatsApp) *
              <input type="tel" name="phone" placeholder="+49..." required />
            </label>
            <label>
              Şehir *
              <input type="text" name="city" placeholder="Berlin" required />
            </label>
          </div>

          <div className="input-row">
            <label>
              Ülke *
              <input type="text" name="country" placeholder="Almanya" required />
            </label>
            <label>
              Doğrudan kaç kişiye ulaşabilirsiniz?
              <input type="number" name="reachCount" placeholder="Sayı" min="0" />
            </label>
          </div>

          <label>
            Ulaşım açıklaması
            <textarea
              name="reachDetails"
              rows="3"
              placeholder="Arkadaş çevresi, iş ağı, topluluk bağlantıları..."
            />
          </label>

          <label>
            Son 3 ayda etkinlik düzenlediniz mi?
            <textarea name="eventsLast3Months" rows="3" placeholder="Evet ise detay verin..." />
          </label>

          <label>
            Kişisel olarak tanıdığınız 3-5 danışman veya profesyonel
            <textarea name="knownProfessionals" rows="3" placeholder="İsim ve uzmanlık alanı..." />
          </label>

          <label>
            İlk 7 gününüzde ne yaparsınız?
            <textarea name="first7DaysPlan" rows="3" placeholder="Aksiyon planını özetleyin..." />
          </label>

          <div className="input-row">
            <label>
              Haftada kaç saat ayırabilirsiniz?
              <input type="text" name="weeklyHours" placeholder="Ör: 10-15 saat" />
            </label>
            <label>
              Bu rol sizin için neden önemli?
              <input type="text" name="motivationShort" placeholder="Kısa yanıt" />
            </label>
          </div>

          <button type="submit" className="btn btn-primary full">
            Elçilik Yolculuğuma Başla
          </button>

          <p className="form-note">Başvurular Supabase üzerinden güvenli biçimde toplanacak.</p>
        </form>
      </section>
    </main>
  );
}

