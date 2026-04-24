import diasporaCommunity from "@/assets/diaspora-community.jpg";

const AboutSection = () => {
  const stats = [
    { value: "50+", label: "Şehir" },
    { value: "12", label: "Kategori" },
    { value: "1M+", label: "Hedef Üye" },
    { value: "25+", label: "Ülke" },
  ];

  return (
    <section
      id="hakkinda"
      className="relative overflow-hidden py-14 lg:py-20"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--accent) / 0.08) 0%, hsl(var(--primary) / 0.06) 48%, hsl(var(--background)) 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" aria-hidden />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Hakkımızda</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Diasporanın Gücünü Keşfedin
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Her kategoride uzmanlaşmış <strong className="font-bold text-foreground">profesyonelleri, girişimleri, işletmeleri, kurumları ve içerik üreticilerini</strong> benzersiz bir çatı altında topluyoruz.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/50 bg-card/80 p-4 text-center shadow-sm backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-[70%] overflow-hidden rounded-2xl border border-white/50 shadow-2xl shadow-primary/10">
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
