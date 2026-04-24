const SEOContentSection = () => {
  return (
    <section className="py-14 lg:py-20 bg-background">
      <article className="container mx-auto px-4 max-w-6xl" aria-labelledby="geo-content-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr_1fr] lg:items-center">
          <div>
            <span className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Platform
            </span>
            <h2 id="geo-content-title" className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              CorteQS Nedir?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CorteQS, dünya genelindeki <strong className="font-semibold text-foreground">Türk diasporası</strong>
              için geliştirilen bir <strong className="font-semibold text-foreground">şehir bazlı diaspora network platformu</strong>dur.
              Yurt dışında yaşayan Türkleri, expatları, danışmanları, işletmeleri ve toplulukları aynı çatı altında buluşturarak bilgi paylaşımını ve iş birliğini kolaylaştırır.
              Relocation sürecinden profesyonel ağ oluşturmaya kadar, kullanıcıların yeni şehirlerde <em className="font-medium text-foreground">güven temelli bağlantı</em> kurmasına yardımcı olur.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Platform, relocation sürecinden yerel entegrasyona, profesyonel ağ oluşturmaktan
              topluluk etkinliklerine kadar geniş bir kullanım alanına sahiptir. Berlin, Londra,
              Amsterdam, Dubai ve daha birçok şehirde aktif topluluk oluşturma hedefiyle yola çıkar.
            </p>
          </div>

          <figure className="flex h-72 items-center justify-center rounded-lg border border-border bg-card px-8 shadow-sm lg:h-[360px]">
            <img
              src="/sharedx/maillogo.png"
              alt="CorteQS Logo"
              className="h-auto w-full max-w-[280px]"
              loading="lazy"
              width={560}
              height={220}
            />
          </figure>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Kimler İçin?
            </h2>
            <ul className="space-y-3 text-muted-foreground">
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
        </div>
      </article>
    </section>
  );
};

export default SEOContentSection;
