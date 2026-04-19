import diasporaCommunity from "@/assets/diaspora-community.jpg";

const AboutSection = () => {
  const stats = [
    { value: "50+", label: "Şehir" },
    { value: "12", label: "Kategori" },
    { value: "1M+", label: "Hedef Üye" },
    { value: "25+", label: "Ülke" },
  ];

  return (
    <section id="hakkinda" className="py-14 lg:py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Hakkımızda</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Diasporanın Gücünü Keşfedin
            </h2>
            <p className="intro-text text-muted-foreground text-lg leading-relaxed mb-8">
              Her kategoride uzmanlaşmış <strong className="font-bold text-foreground">profesyonelleri, girişimleri, işletmeleri, kurumları ve içerik üreticilerini</strong> benzersiz bir çatı altında topluyoruz.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-secondary">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl mx-auto w-[70%]">
            <img
              src={diasporaCommunity}
              alt="Diaspora topluluğu buluşması"
              className="w-full object-cover [filter:brightness(0.95)_saturate(0.85)_contrast(0.95)]"
              loading="lazy"
              width={1024}
              height={1024}
            />
            {/* Soft tonal overlay to harmonize with page palette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-card/40 via-card/10 to-primary/15 mix-blend-soft-light" aria-hidden />
            <div className="pointer-events-none absolute inset-0 bg-card/15" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
