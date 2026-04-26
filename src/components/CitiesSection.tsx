import { MapPin, Users } from "lucide-react";

interface City {
  name: string;
  country: string;
  flag: string;
  population: string;
  desc: string;
  gradient: string;
}

const cities: City[] = [
  { name: "Berlin", country: "Almanya", flag: "🇩🇪", population: "200.000+", desc: "Avrupa'nın en büyük Türk diaspora topluluğunun kalbi. Kültürel çeşitlilik ve girişimcilik merkezi.", gradient: "from-amber-500/10 to-red-500/10" },
  { name: "Londra", country: "Birleşik Krallık", flag: "🇬🇧", population: "150.000+", desc: "Finans ve yaratıcı endüstrilerin merkezinde güçlü bir Türk profesyonel ağı.", gradient: "from-blue-500/10 to-red-500/10" },
  { name: "New York", country: "ABD", flag: "🇺🇸", population: "120.000+", desc: "Manhattan'dan Brooklyn'e uzanan dinamik Türk-Amerikan iş ve sanat topluluğu.", gradient: "from-blue-500/10 to-red-500/10" },
  { name: "Paris", country: "Fransa", flag: "🇫🇷", population: "90.000+", desc: "Sanat, moda ve gastronomide etkin Türk diasporasının Avrupa'daki köprüsü.", gradient: "from-blue-500/10 to-red-500/10" },
  { name: "Amsterdam", country: "Hollanda", flag: "🇳🇱", population: "80.000+", desc: "Uluslararası iş dünyası ve teknoloji ekosisteminde aktif Türk merkezi.", gradient: "from-orange-500/10 to-blue-500/10" },
  { name: "Dubai", country: "BAE", flag: "🇦🇪", population: "70.000+", desc: "Ortadoğu'nun iş başkentinde hızla büyüyen Türk girişimci ve profesyonel topluluğu.", gradient: "from-emerald-500/10 to-amber-500/10" },
  { name: "Toronto", country: "Kanada", flag: "🇨🇦", population: "60.000+", desc: "Kuzey Amerika'nın çok kültürlü merkezinde güçlü Türk-Kanadalı ağı.", gradient: "from-red-500/10 to-rose-500/10" },
  { name: "Sydney", country: "Avustralya", flag: "🇦🇺", population: "50.000+", desc: "Pasifik'teki en büyük Türk diasporası. İş, eğitim ve topluluk hayatının merkezi.", gradient: "from-blue-500/10 to-emerald-500/10" },
  { name: "İstanbul", country: "Türkiye", flag: "🇹🇷", population: "Köprü Şehir", desc: "Dünya diasporasını anavatana bağlayan stratejik buluşma noktası.", gradient: "from-red-500/10 to-amber-500/10" },
];

const radarCities = [
  "Dortmund",
  "Münih",
  "Hamburg",
  "Frankfurt",
  "Köln",
  "Lyon",
  "Brüksel",
  "Viyana",
  "Zürih",
  "Rotterdam",
  "Stockholm",
  "Kopenhag",
  "Madrid",
  "Stuttgart",
  "Düsseldorf",
  "Manchester",
  "Milano",
  "Los Angeles",
  "Chicago",
  "Miami",
  "Montreal",
  "Vancouver",
  "São Paulo",
  "Tokyo",
  "Singapur",
  "Abu Dabi",
  "Doha",
  "Melbourne",
  "Essen",
  "Nürnberg",
];

const triggerCitySelect = (city: string, mode: "ai" | "form") => {
  window.dispatchEvent(new CustomEvent("corteqs:select-city", { detail: { city, mode } }));
  const target = document.getElementById("kaydol");
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
};

const CitiesSection = () => {
  return (
    <section
      id="sehirler"
      className="relative overflow-hidden py-20"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--primary) / 0.07) 0%, hsl(var(--accent) / 0.07) 48%, hsl(var(--background)) 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-96 w-96 rounded-full bg-accent/15 blur-3xl" aria-hidden />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Küresel Ağ</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Türk Diasporasının Olduğu <span className="text-accent">Her Şehirde</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Berlin'den Sydney'e, New York'tan Dubai'ye. Dünyanın dört bir yanındaki Türk topluluğuyla bağlantı kurun.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div key={city.name} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm ring-1 ring-border/40 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:ring-primary/20 hover:shadow-xl hover:shadow-primary/10">
              <div className={`absolute inset-0 bg-gradient-to-br ${city.gradient} opacity-40 group-hover:opacity-100 transition-opacity`} aria-hidden />
              <div className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center text-3xl shrink-0">
                    {city.flag}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {city.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{city.country}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{city.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{city.population}</span>
                    <span className="text-muted-foreground">Türk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerCitySelect(city.name, "ai")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-primary/90 hover:shadow transition-all"
                    >
                      AI Sohbet →
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerCitySelect(city.name, "form")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-background text-foreground/80 text-xs font-semibold hover:border-primary/50 hover:text-primary transition-all"
                    >
                      Form →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 mb-10 overflow-hidden rounded-2xl border border-white/50 bg-card/80 p-5 shadow-lg shadow-primary/5 backdrop-blur-sm">
          <div className="mb-5 flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Radarımızdaki Şehirler</p>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Bu şehirler için de topluluk ilgisini topluyoruz. Şehrini seçerek erken kayıt akışını başlatabilirsin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {radarCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => triggerCitySelect(city, "ai")}
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border/80 bg-background/85 px-3 py-2 text-sm font-semibold text-foreground/80 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <MapPin className="h-3.5 w-3.5 text-primary transition-colors group-hover:text-primary-foreground" />
                <span className="truncate">{city}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            Şehrin listede yoksa{" "}
            <a href="#kaydol" className="font-semibold text-primary hover:text-accent underline-offset-4 hover:underline transition-colors">
              kaydını bırak
            </a>{" "}
            ve şehrini radarımıza alalım.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
