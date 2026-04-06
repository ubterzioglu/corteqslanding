import diasporaCommunity from "@/assets/diaspora-community.jpg";

const AboutSection = () => {
  const stats = [
    { value: "50+", label: "Şehir" },
    { value: "12", label: "Kategori" },
    { value: "1000+", label: "Hedef Üye" },
    { value: "25+", label: "Ülke" },
  ];

  return (
    <section id="hakkinda" className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Hakkımızda</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Diasporanın Gücünü Keşfedin
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Corteqs Diaspora Connect, dünya genelindeki Türk diaspora topluluklarını bir araya getirerek iş, kültür, eğitim ve teknoloji alanlarında güçlü bağlantılar kurmayı amaçlayan benzersiz bir platformdur.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Her kategoride uzmanlaşmış profesyonelleri, girişimcileri, sanatçıları ve içerik üreticilerini bir çatı altında topluyoruz.
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
          <div className="relative">
            <img
              src={diasporaCommunity}
              alt="Diaspora topluluğu buluşması"
              className="rounded-2xl shadow-xl w-full object-cover"
              loading="lazy"
              width={1024}
              height={1024}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
