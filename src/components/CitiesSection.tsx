import { MapPin, Users, ArrowRight } from "lucide-react";

const cities = [
  {
    name: "Berlin",
    slug: "berlin",
    country: "Almanya",
    description: "Almanya'nın başkenti, en büyük Türk diaspora topluluğunun yaşadığı şehir. Kültürel çeşitlilik, iş fırsatları ve aktif topluluk yaşamıyla bilinir.",
    stats: { population: "200.000+", category: "Tier 1" },
  },
  {
    name: "Dortmund",
    slug: "dortmund",
    country: "Almanya",
    description: "Ruhr bölgesinin kalbinde yer alan Dortmund, güçlü Türk topluluk yapısı ve yerel işletme ağıyla öne çıkar.",
    stats: { population: "60.000+", category: "Tier 1" },
  },
  {
    name: "Köln",
    slug: "koln",
    country: "Almanya",
    description: "Renanya bölgesinin merkezi Köln, Türk işletmeleri ve kültürel etkinlikleriyle zengin bir diaspora yaşamı sunar.",
    stats: { population: "80.000+", category: "Tier 1" },
  },
  {
    name: "Hamburg",
    slug: "hamburg",
    country: "Almanya",
    description: "Almanya'nın en büyük liman şehri, ticaret ve lojistik sektörlerinde güçlü Türk iş ağına ev sahipliği yapar.",
    stats: { population: "50.000+", category: "Tier 1" },
  },
  {
    name: "München",
    slug: "munchen",
    country: "Almanya",
    description: "Bavyera'nın başkenti, teknoloji ve inovasyon sektörlerinde çalışan Türk profesyonellerin yoğunlaştığı bir şehir.",
    stats: { population: "45.000+", category: "Tier 2" },
  },
  {
    name: "Amsterdam",
    slug: "amsterdam",
    country: "Hollanda",
    description: "Hollanda'nın başkenti, uluslararası iş dünyası ve kültürel çeşitlilik açısından Türk diasporasının önemli merkezlerinden.",
    stats: { population: "40.000+", category: "Tier 2" },
  },
];

const CitiesSection = () => {
  return (
    <section id="sehirler" className="py-14 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Şehir Bazlı Ağ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Türk Diasporasının Olduğu Her Şehirde
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Almanya ve Avrupa'nın önde gelen şehirlerinde yerel danışmanlar, işletmeler ve topluluk
            üyeleriyle bağlantı kurun. Şehrinizi seçin, ağınızı genişletin.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div
              key={city.slug}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg leading-tight">{city.name}</h3>
                  <span className="text-xs text-muted-foreground">{city.country}</span>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {city.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>{city.stats.population} Türk</span>
                </div>
              </div>

              <a
                href={`#kategoriler`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group-hover:gap-2.5"
              >
                {city.name} Danışmanlarını Gör
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-muted-foreground text-sm">
            Şehriniz listede yok mu?{" "}
            <a href="#kategoriler" className="text-primary hover:underline font-semibold">
              Kayıt bırakın
            </a>
            {", şehrinizdeki topluluğun büyümesine katkıda bulunun."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
