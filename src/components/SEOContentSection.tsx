const SEOContentSection = () => {
  return (
    <section className="py-14 lg:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              CorteQS Nedir?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CorteQS, dünya genelindeki Türk diasporasını şehir bazlı bir ağ yapısıyla birleştiren
              bir network platformudur. Yurt dışında yaşayan Türkleri, expatları, danışmanları,
              işletmeleri ve toplulukları aynı çatı altında buluşturarak bağlantı kurmayı, bilgi
              paylaşmayı ve iş birliğini kolaylaştırır.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Platform, relocation sürecinden yerel entegrasyona, profesyonel ağ oluşturmaktan
              topluluk etkinliklerine kadar geniş bir kullanım alanına sahiptir. Berlin, Londra,
              Amsterdam, Dubai ve daha birçok şehirde aktif topluluk oluşturma hedefiyle yola çıkar.
            </p>
          </div>

          <figure className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80"
              alt="Diaspora topluluğu ve profesyonel networking buluşması"
              className="h-72 w-full object-cover lg:h-[360px]"
              loading="lazy"
              width={900}
              height={600}
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
      </div>
    </section>
  );
};

export default SEOContentSection;
