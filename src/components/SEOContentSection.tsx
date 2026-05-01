import mascotHome from "../../maskotanasayfa.png";

const SEOContentSection = () => {
  return (
    <section
      className="relative overflow-hidden py-14 lg:py-20"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--accent) / 0.08) 52%, hsl(var(--background)) 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-20 bottom-6 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute right-8 top-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" aria-hidden />

      <article className="container relative z-10 mx-auto max-w-6xl px-4" aria-labelledby="geo-content-title">
        <div className="grid gap-8 lg:auto-rows-fr">
          <div className="grid overflow-hidden rounded-2xl border border-white/50 bg-card/80 shadow-xl shadow-primary/10 backdrop-blur-sm lg:grid-cols-[0.42fr_0.58fr]">
            <figure className="flex min-h-64 items-center justify-center border-b border-white/50 bg-background/60 px-8 py-10 lg:border-b-0 lg:border-r">
              <img
                src="/sharedx/maillogo.png"
                alt="CorteQS Logo"
                className="h-auto w-full max-w-[280px]"
                loading="lazy"
                width={560}
                height={220}
              />
            </figure>

            <div className="p-6 md:p-8 lg:p-10">
              <span className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Platform
              </span>
              <h2 id="geo-content-title" className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                CorteQS Nedir?
              </h2>
              <ul className="grid gap-3 text-muted-foreground leading-relaxed">
                <li>🌍 Global Türk diasporasını tek platformda toplar</li>
                <li>📍 Şehir bazlı network (Berlin, Londra, Dubai vb.)</li>
                <li>🤝 İnsan, işletme ve toplulukları buluşturur</li>
                <li>🧭 Yeni şehirde “nereden başlayacağım?” sorununu çözer</li>
                <li>🏠 Relocation sürecini kolaylaştırır</li>
                <li>💼 İş, proje ve işbirliği fırsatları sunar</li>
                <li>👥 Güven temelli bağlantılar kurmanı sağlar</li>
                <li>📢 Bilgi paylaşımı ve deneyim aktarımını hızlandırır</li>
                <li>🎯 Profesyonel network oluşturmayı destekler</li>
                <li>🌐 Global ama lokal odaklı topluluklar yaratır</li>
              </ul>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-2xl border border-white/50 bg-card/80 shadow-xl shadow-accent/10 backdrop-blur-sm lg:grid-cols-[0.58fr_0.42fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Kimler İçin?
              </h2>
              <ul className="grid gap-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Yeni bir ülkeye taşınmayı planlayan ve relocation desteği arayan Türkler</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Yurt dışında yaşayan Türk diaspora topluluklarına bağlanmak isteyen expatlar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Diaspora kitlesine hizmet sunmak isteyen danışman, avukat, doktor ve uzmanlar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Türk müşteri kitlesine ulaşmak isteyen işletmeler ve girişimciler</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>Dernek, vakıf ve sivil toplum kuruluşları</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>İçerik üreticileri, bloggerlar ve diaspora hikâyelerini paylaşmak isteyenler</span>
                </li>
              </ul>
            </div>

            <figure className="flex min-h-64 items-center justify-center border-t border-white/50 bg-background/60 px-8 py-10 lg:border-l lg:border-t-0">
              <img
                src={mascotHome}
                alt="CorteQS ana sayfa maskotu"
                className="h-auto w-full max-w-[300px]"
                loading="lazy"
                width={900}
                height={900}
              />
            </figure>
          </div>
        </div>
      </article>
    </section>
  );
};

export default SEOContentSection;
