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
              Diasporanin Gucunu Kesfedin
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              <strong className="text-foreground">CorteQS Diaspora Connect</strong>, dunya genelindeki Turk diaspora topluluklarini bir araya getirerek is, kultur, egitim ve teknoloji alanlarinda guclu baglantilar kurmayi amaclayan benzersiz bir global diaspora platformudur.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              <a href="https://en.wikipedia.org/wiki/Turkish_diaspora" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dunya genelinde 8.8 milyondan fazla Turk diasporasi</a> 164 ulkede yasamaktadir. CorteQS, bu genis agi danismanlar, isletmeler, dernekler ve icerik ureticileriyle bulusturarak diaspora is birligi ve global networking potansiyelini ortaya cikarir.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Her kategoride uzmanlasmis profesyonelleri, girisimcileri, sanatcilari ve icerik ureticilerini bir cati altinda topluyoruz. Platformumuz, diaspora topluluklarinin <a href="https://www.oecd.org/en/topics/sub-issues/migration.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">uluslararasi is birligi ve surdurulebilir buyume</a> hedeflerine katki saglamayi amaclamaktadir.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              CorteQS nedir? Kisa tanim: Dunya genelindeki Turk diasporasini ve diger diaspora topluluklarini birlestiren, is birligi, networking ve buyume firsatlari sunan bir global diaspora network platformudur.
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
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={diasporaCommunity}
              alt="Turk diasporasi topluluk bulusmasi ve is birligi etkinligi"
              className="w-full object-cover [filter:brightness(0.95)_saturate(0.85)_contrast(0.95)]"
              loading="lazy"
              width={1024}
              height={1024}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-card/40 via-card/10 to-primary/15 mix-blend-soft-light" />
            <div className="absolute inset-0 bg-card/15" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
