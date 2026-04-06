import { useState } from "react";
import { MapPin, Search, Building2, Users, ChevronDown, Store, Navigation, Tag, Coffee, Gift, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const cities = [
  { key: "dubai", label: "Dubai", lat: 25.2, lng: 55.27 },
  { key: "berlin", label: "Berlin", lat: 52.52, lng: 13.41 },
  { key: "washington", label: "Washington DC", lat: 38.9, lng: -77.04 },
  { key: "london", label: "Londra", lat: 51.51, lng: -0.13 },
  { key: "amsterdam", label: "Amsterdam", lat: 52.37, lng: 4.9 },
  { key: "paris", label: "Paris", lat: 48.86, lng: 2.35 },
  { key: "munich", label: "Münih", lat: 48.14, lng: 11.58 },
];

const entityTypes = [
  { key: "all", label: "Tümü" },
  { key: "market", label: "🛒 Türk Marketleri" },
  { key: "restaurant", label: "🍽️ Restoranlar" },
  { key: "association", label: "🏛️ Kuruluşlar" },
  { key: "consultant", label: "👤 Danışmanlar" },
];

interface MapEntity {
  id: string;
  name: string;
  type: string;
  category: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  rating?: number;
  cta?: string;
  ctaIcon?: "tag" | "coffee" | "gift" | "ticket";
  promo?: string;
}

const mockEntities: Record<string, MapEntity[]> = {
  dubai: [
    { id: "tm-dubai-1", name: "Turkish Market Al Barsha", type: "market", category: "Türk Marketi", address: "Al Barsha Mall, Shop 12", city: "Dubai", lat: 25.1125, lng: 55.2006, rating: 4.7, cta: "İndirimi Yakala!", ctaIcon: "tag", promo: "%20 indirim — bu hafta sonu" },
    { id: "tm-dubai-2", name: "Istanbul Grocery JLT", type: "market", category: "Türk Marketi", address: "JLT Cluster D, Ground Floor", city: "Dubai", lat: 25.0762, lng: 55.1498, rating: 4.5, cta: "Hediye Kazan", ctaIcon: "gift", promo: "100 AED üzeri alışverişe hediye paketi" },
    { id: "tm-dubai-3", name: "Anatolia Gıda Dubai Marina", type: "market", category: "Türk Marketi", address: "Dubai Marina Walk, Unit 7", city: "Dubai", lat: 25.0800, lng: 55.1400, rating: 4.8, cta: "İndirimi Yakala!", ctaIcon: "tag", promo: "Baklava %30 indirimli" },
    { id: "r-dubai-1", name: "Sultan's Kitchen", type: "restaurant", category: "Restoran", address: "Downtown Dubai, Souk Al Bahar", city: "Dubai", lat: 25.1955, lng: 55.2783, rating: 4.9, cta: "Tatlı Sizden Kahve Bizden ☕", ctaIcon: "coffee", promo: "Ana yemeğe ücretsiz Türk kahvesi" },
    { id: "a-dubai-1", name: "T.C. Dubai Başkonsolosluğu", type: "association", category: "Konsolosluk", address: "Trade Centre Area, Al Manara Tower", city: "Dubai", lat: 25.2285, lng: 55.2832, rating: 5.0, cta: "Randevu Al", ctaIcon: "ticket" },
  ],
  berlin: [
    { id: "tm-berlin-1", name: "Türkischer Supermarkt Kreuzberg", type: "market", category: "Türk Marketi", address: "Kottbusser Damm 35", city: "Berlin", lat: 52.4892, lng: 13.4183, rating: 4.6, cta: "İndirimi Yakala!", ctaIcon: "tag", promo: "Sucuk & peynir seti %25 indirimli" },
    { id: "tm-berlin-2", name: "Istanbul Market Neukölln", type: "market", category: "Türk Marketi", address: "Karl-Marx-Str. 112", city: "Berlin", lat: 52.4811, lng: 13.4350, rating: 4.4, cta: "Hediye Kazan", ctaIcon: "gift", promo: "50€ üzeri alışverişe çay seti hediye" },
    { id: "tm-berlin-3", name: "Bosphorus Gıda Wedding", type: "market", category: "Türk Marketi", address: "Müllerstraße 28", city: "Berlin", lat: 52.5485, lng: 13.3492, rating: 4.3, cta: "İndirimi Yakala!", ctaIcon: "tag", promo: "Taze pide her gün €1.50" },
    { id: "r-berlin-1", name: "Hasir Restaurant", type: "restaurant", category: "Restoran", address: "Adalbertstr. 12, Kreuzberg", city: "Berlin", lat: 52.5005, lng: 13.4195, rating: 4.8, cta: "Tatlı Sizden Kahve Bizden ☕", ctaIcon: "coffee", promo: "Künefe + Türk kahvesi menüsü €8" },
    { id: "a-berlin-1", name: "T.C. Berlin Büyükelçiliği", type: "association", category: "Büyükelçilik", address: "Tiergartenstr. 19-21", city: "Berlin", lat: 52.5130, lng: 13.3500, rating: 5.0, cta: "Randevu Al", ctaIcon: "ticket" },
  ],
  washington: [
    { id: "tm-dc-1", name: "Turkish Market Georgetown", type: "market", category: "Türk Marketi", address: "Wisconsin Ave NW 2105", city: "Washington DC", lat: 38.9130, lng: -77.0620, rating: 4.5, cta: "İndirimi Yakala!", ctaIcon: "tag", promo: "Lokum çeşitleri %15 indirimli" },
    { id: "tm-dc-2", name: "Ottoman Grocery Dupont", type: "market", category: "Türk Marketi", address: "Connecticut Ave NW 1825", city: "Washington DC", lat: 38.9145, lng: -77.0430, rating: 4.3, cta: "Hediye Kazan", ctaIcon: "gift", promo: "$30+ alışverişe Türk çayı hediye" },
    { id: "tm-dc-3", name: "Anatolia Foods Arlington", type: "market", category: "Türk Marketi", address: "Wilson Blvd 3100, Arlington", city: "Washington DC", lat: 38.8760, lng: -77.1050, rating: 4.6, cta: "İndirimi Yakala!", ctaIcon: "tag", promo: "Haftalık taze börek indirimi" },
    { id: "r-dc-1", name: "Turkish Kitchen DC", type: "restaurant", category: "Restoran", address: "K Street NW 1234", city: "Washington DC", lat: 38.9025, lng: -77.0310, rating: 4.7, cta: "Tatlı Sizden Kahve Bizden ☕", ctaIcon: "coffee", promo: "Öğle menüsüne ücretsiz baklava" },
    { id: "a-dc-1", name: "T.C. Washington Büyükelçiliği", type: "association", category: "Büyükelçilik", address: "Massachusetts Ave NW 2525", city: "Washington DC", lat: 38.9150, lng: -77.0530, rating: 5.0, cta: "Randevu Al", ctaIcon: "ticket" },
  ],
};

const typeColors: Record<string, string> = {
  market: "bg-turquoise text-primary-foreground",
  restaurant: "bg-gold text-primary-foreground",
  association: "bg-primary text-primary-foreground",
  consultant: "bg-secondary text-secondary-foreground",
};

const ctaIcons = {
  tag: Tag,
  coffee: Coffee,
  gift: Gift,
  ticket: Ticket,
};

const MapSearch = () => {
  const [selectedCity, setSelectedCity] = useState("dubai");
  const [entityType, setEntityType] = useState("all");
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const entities = mockEntities[selectedCity] || [];
  const filtered = entityType === "all" ? entities : entities.filter(e => e.type === entityType);
  const cityData = cities.find(c => c.key === selectedCity)!;

  // Build OSM embed with markers for all filtered entities
  const buildMapUrl = () => {
    // Center on first entity or city center
    const allLats = filtered.map(e => e.lat);
    const allLngs = filtered.map(e => e.lng);
    
    if (filtered.length === 0) {
      return `https://www.openstreetmap.org/export/embed.html?bbox=${cityData.lng - 0.08}%2C${cityData.lat - 0.05}%2C${cityData.lng + 0.08}%2C${cityData.lat + 0.05}&layer=mapnik&marker=${cityData.lat}%2C${cityData.lng}`;
    }

    const minLat = Math.min(...allLats) - 0.01;
    const maxLat = Math.max(...allLats) + 0.01;
    const minLng = Math.min(...allLngs) - 0.01;
    const maxLng = Math.max(...allLngs) + 0.01;

    // OSM embed only supports one marker, so we center on the bounding box
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${centerLat}%2C${centerLng}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" /> Harita Arama
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              Şehir seçin, Türk işletme ve kuruluşlarını harita üzerinde keşfedin
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* City dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                className="gap-2 min-w-[180px] justify-between"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              >
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  {cityData.label}
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-elevated z-30 w-full min-w-[180px]">
                  {cities.map(c => (
                    <button
                      key={c.key}
                      onClick={() => { setSelectedCity(c.key); setCityDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl ${selectedCity === c.key ? "bg-primary/5 text-primary font-semibold" : "text-foreground"}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type filter */}
            <div className="flex flex-wrap gap-2">
              {entityTypes.map(t => (
                <Button
                  key={t.key}
                  variant={entityType === t.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEntityType(t.key)}
                  className="text-xs"
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Map + Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map with pin overlay */}
            <div className="lg:col-span-2">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border">
                <iframe
                  key={`${selectedCity}-${entityType}`}
                  title={`${cityData.label} Harita`}
                  src={buildMapUrl()}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                />

                {/* Pin overlay on top of map */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  {filtered.map((entity, idx) => {
                    // Distribute pins visually across the map area
                    const angle = (idx / filtered.length) * 2 * Math.PI;
                    const radius = 18 + (idx % 3) * 8;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle) * 0.7;
                    
                    return (
                      <div
                        key={entity.id}
                        className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-auto cursor-pointer transition-all duration-200"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        onMouseEnter={() => setHoveredPin(entity.id)}
                        onMouseLeave={() => setHoveredPin(null)}
                      >
                        <div className={`w-9 h-9 rounded-full ${typeColors[entity.type]} flex items-center justify-center shadow-lg border-2 border-card ${hoveredPin === entity.id ? "scale-125 ring-2 ring-primary/40" : ""} transition-transform`}>
                          {entity.type === "market" ? <Store className="h-4 w-4" /> :
                           entity.type === "restaurant" ? <span className="text-sm">🍽️</span> :
                           entity.type === "association" ? <Building2 className="h-4 w-4" /> :
                           <Users className="h-4 w-4" />}
                        </div>
                        <div className={`w-2.5 h-2.5 mx-auto -mt-1.5 rotate-45 ${typeColors[entity.type].split(" ")[0]}`} />

                        {hoveredPin === entity.id && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-xl p-3 shadow-elevated min-w-[220px] z-20">
                            <p className="font-bold text-foreground text-sm">{entity.name}</p>
                            <p className="text-xs text-muted-foreground">{entity.category}</p>
                            <p className="text-xs text-muted-foreground mt-1">{entity.address}</p>
                            {entity.rating && <p className="text-xs text-gold mt-1">⭐ {entity.rating}</p>}
                            {entity.promo && (
                              <p className="text-xs text-turquoise font-semibold mt-1.5">🎁 {entity.promo}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* City label overlay */}
                <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border shadow-sm z-10">
                  <p className="text-sm font-bold text-foreground">{cityData.label}</p>
                  <p className="text-[10px] text-muted-foreground">{filtered.length} sonuç</p>
                </div>

                {/* Legend overlay */}
                <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border z-10">
                  <div className="flex flex-wrap gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-turquoise" /> Market</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gold" /> Restoran</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-primary" /> Kuruluş</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results list with CTA cards */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              <h2 className="font-bold text-foreground text-lg sticky top-0 bg-background py-1 z-10">{filtered.length} Sonuç</h2>
              {filtered.map(entity => {
                const CtaIcon = entity.ctaIcon ? ctaIcons[entity.ctaIcon] : Navigation;
                return (
                  <div
                    key={entity.id}
                    className={`bg-card border rounded-xl p-4 shadow-card transition-all cursor-pointer ${
                      hoveredPin === entity.id ? "border-primary bg-primary/5 shadow-card-hover" : "border-border hover:border-primary/30"
                    }`}
                    onMouseEnter={() => setHoveredPin(entity.id)}
                    onMouseLeave={() => setHoveredPin(null)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${typeColors[entity.type]} flex items-center justify-center shrink-0`}>
                        {entity.type === "market" ? <Store className="h-5 w-5" /> :
                         entity.type === "restaurant" ? <span>🍽️</span> :
                         <Building2 className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">{entity.name}</h3>
                        <Badge variant="outline" className="text-[10px] mt-1">{entity.category}</Badge>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {entity.address}
                        </p>
                        {entity.rating && (
                          <p className="text-xs text-gold mt-1">⭐ {entity.rating}</p>
                        )}
                      </div>
                    </div>

                    {/* Promo banner */}
                    {entity.promo && (
                      <div className="mt-3 bg-turquoise/10 border border-turquoise/20 rounded-lg px-3 py-2">
                        <p className="text-xs font-semibold text-turquoise flex items-center gap-1">
                          <Gift className="h-3 w-3" /> {entity.promo}
                        </p>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      variant={entity.ctaIcon === "tag" || entity.ctaIcon === "coffee" ? "default" : "outline"}
                      size="sm"
                      className={`w-full mt-3 text-xs gap-1.5 font-semibold ${
                        entity.ctaIcon === "coffee" ? "bg-gold hover:bg-gold/90 text-primary-foreground" :
                        entity.ctaIcon === "gift" ? "bg-turquoise hover:bg-turquoise-light text-primary-foreground" : ""
                      }`}
                    >
                      <CtaIcon className="h-3.5 w-3.5" />
                      {entity.cta || "Yol Tarifi Al"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MapSearch;
