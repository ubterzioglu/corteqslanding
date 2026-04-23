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

const stripFlag = (label: string) => label.replace(/^[^\p{L}]+/u, "").trim();

const triggerCitySelect = (city: string, mode: "ai" | "form") => {
  window.dispatchEvent(new CustomEvent("corteqs:select-city", { detail: { city, mode } }));
  const target = document.getElementById("kaydol");
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
};

const CitiesSection = () => {
  return (
    <section id="sehirler" className="py-20 bg-background">
      <div className="container mx-auto px-4">
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
            <div key={city.name} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/40">
              <div className={`absolute inset-0 bg-gradient-to-br ${city.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} aria-hidden />
              <div className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl shrink-0">
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
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => triggerCitySelect(city.name, "ai")} className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                      AI Sohbet →
                    </button>
                    <span className="text-border">|</span>
                    <button type="button" onClick={() => triggerCitySelect(city.name, "form")} className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors">
                      Form →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 mb-10 -mx-4 overflow-hidden border-y border-border bg-muted/30 py-4">
          <div className="flex flex-col gap-2 px-4">
            {[
              ["🇩🇪 Dortmund", "🇩🇪 Münih", "🇩🇪 Hamburg", "🇩🇪 Frankfurt", "🇩🇪 Köln", "🇫🇷 Lyon", "🇧🇪 Brüksel", "🇦🇹 Viyana", "🇨🇭 Zürih", "🇳🇱 Rotterdam", "🇸🇪 Stockholm", "🇩🇰 Kopenhag", "🇪🇸 Madrid"],
              ["🇬🇧 Manchester", "🇮🇹 Milano", "🇺🇸 Los Angeles", "🇺🇸 Chicago", "🇺🇸 Miami", "🇨🇦 Montreal", "🇧🇷 São Paulo", "🇯🇵 Tokyo", "🇸🇬 Singapur", "🇦🇪 Abu Dabi", "🇶🇦 Doha", "🇦🇺 Melbourne"],
            ].map((row, index) => (
              <div key={index} className="flex flex-wrap justify-center gap-2">
                {row.map((label) => {
                  const cityName = stripFlag(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => triggerCitySelect(cityName, "ai")}
                      className="inline-flex w-[170px] items-center justify-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
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
