import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Briefcase, Building2, UserPlus, UserCheck, Star, Stethoscope } from "lucide-react";
import MapShareButtons from "@/components/MapShareButtons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityDropdown from "@/components/CityDropdown";
import { useDiaspora } from "@/contexts/DiasporaContext";
import { businesses } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";

const sectorFilters = [
  { key: "all", label: "Tümü" },
  { key: "Gastronomi", label: "🍽️ Gastronomi" },
  { key: "Teknoloji", label: "💻 Teknoloji" },
  { key: "Lojistik", label: "🚛 Lojistik" },
  { key: "Perakende", label: "🛒 Perakende" },
  { key: "İnşaat", label: "🏗️ İnşaat" },
  { key: "Turizm", label: "✈️ Turizm" },
  { key: "Tekstil", label: "👕 Tekstil" },
  { key: "Sağlık", label: "🏥 Sağlık" },
  { key: "Finans", label: "🏦 Finans" },
  { key: "Havacılık", label: "✈️ Havacılık" },
  { key: "Telekomünikasyon", label: "📱 Telekom" },
];

const offeringFilters = [
  { key: "all", label: "Tümü" },
  { key: "iş ilanı", label: "💼 İş İlanları" },
  { key: "franchise", label: "🏪 Franchise" },
  { key: "iş fırsatı", label: "🤝 İş Fırsatları" },
];

const offeringColors: Record<string, string> = {
  "iş ilanı": "bg-turquoise/10 text-turquoise border-turquoise/20",
  "franchise": "bg-gold/10 text-gold border-gold/20",
  "iş fırsatı": "bg-primary/10 text-primary border-primary/20",
};

const Businesses = () => {
  const { selectedCountry: country } = useDiaspora();
  const [city, setCity] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [offeringFilter, setOfferingFilter] = useState("all");
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => { setCity("all"); }, [country]);

  const filtered = businesses.filter((b) => {
    const matchesCountry = country === "all" || b.country === country;
    const matchesCity = city === "all" || b.city === city;
    const matchesSector = sectorFilter === "all" || b.sector === sectorFilter;
    const matchesOffering = offeringFilter === "all" || b.offerings.includes(offeringFilter as any);
    return matchesCountry && matchesCity && matchesSector && matchesOffering;
  });

  const toggleFollow = (id: string, name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: "Takipten çıkıldı", description: `${name} artık takip edilmiyor.` });
      } else {
        next.add(id);
        toast({ title: "Takip edildi! 🔔", description: `${name} yeni fırsat paylaştığında bildirim alacaksınız.` });
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Türk İşletmeleri</h1>
              <p className="text-muted-foreground font-body mt-1">
                {filtered.length} işletme bulundu
              </p>
            </div>
          </div>

          {/* Sector filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {sectorFilters.map((f) => (
              <Button
                key={f.key}
                variant={sectorFilter === f.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSectorFilter(f.key)}
                className="text-xs"
              >
                {f.label}
              </Button>
            ))}
          </div>

          {/* Offering filter + City dropdown */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {offeringFilters.map((f) => (
              <Button
                key={f.key}
                variant={offeringFilter === f.key ? "secondary" : "outline"}
                size="sm"
                onClick={() => setOfferingFilter(f.key)}
                className="text-xs"
              >
                {f.label}
              </Button>
            ))}
            <div className="ml-auto">
              <CityDropdown country={country} city={city} onCityChange={setCity} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((b) => {
              const isFollowed = followedIds.has(b.id);
              return (
                <Link
                  to={`/business/${b.id}`}
                  key={b.id}
                  className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:-translate-y-1 block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm shrink-0">
                        {b.logo}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground truncate">{b.name}</h3>
                        <p className="text-xs text-muted-foreground font-body">{b.sector}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleFollow(b.id, b.name, e)}
                      className={`p-2 rounded-full transition-colors shrink-0 ${isFollowed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-primary"}`}
                    >
                      {isFollowed ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground font-body flex items-center gap-1 mb-3">
                    <MapPin className="h-4 w-4 shrink-0" /> {b.city}, {b.country}
                  </p>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-body">{b.employees} çalışan</span>
                    </div>
                    {b.openPositions > 0 && (
                      <div className="flex items-center gap-1 text-sm text-turquoise">
                        <Briefcase className="h-4 w-4" />
                        <span className="font-body font-semibold">{b.openPositions} açık pozisyon</span>
                      </div>
                    )}
                  </div>

                   <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">{b.description}</p>

                   <MapShareButtons name={b.name} city={b.city} country={b.country} className="mb-3" />

                   <div className="flex flex-wrap gap-1.5 mb-4">
                     {b.offerings.map((o) => (
                       <Badge key={o} variant="outline" className={`text-xs ${offeringColors[o] || ""}`}>
                         {o === "iş ilanı" ? "💼 İş İlanı" : o === "franchise" ? "🏪 Franchise" : "🤝 İş Fırsatı"}
                       </Badge>
                     ))}
                   </div>

                  <div className="flex gap-2">
                    <Link to={`/business/${b.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="default" size="sm" className="w-full">Detay</Button>
                    </Link>
                    {b.sector === "Sağlık" ? (
                      <Link to={`/hospital-appointment/${b.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" className="w-full gap-1 border-turquoise/30 text-turquoise hover:bg-turquoise/10">
                          <Stethoscope className="h-3 w-3" /> Randevu Al
                        </Button>
                      </Link>
                    ) : b.offerings.includes("franchise") ? (
                      <Link to={`/business/${b.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" className="w-full gap-1 border-gold/30 text-gold hover:bg-gold/10">🏪 Franchise</Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>Başvur</Button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-body">
              Bu filtrelerde işletme bulunamadı.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Businesses;
