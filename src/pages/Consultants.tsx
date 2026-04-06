import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Star, Bot, Video, UserPlus, UserCheck, Home, Plane, Briefcase, Scale, TrendingUp, Heart, Flag, Crown } from "lucide-react";
import MapShareButtons from "@/components/MapShareButtons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityDropdown from "@/components/CityDropdown";
import { useDiaspora } from "@/contexts/DiasporaContext";
import { consultants, cityAmbassadors } from "@/data/mock";
import { countryCities } from "@/data/countryCities";
import { useToast } from "@/hooks/use-toast";

const categoryFilters = [
  { key: "all", label: "Tümü", icon: null },
  { key: "ambassador", label: "Şehir Elçileri", icon: Flag },
  { key: "Gayrimenkul", label: "Gayrimenkul", icon: Home },
  { key: "Vize & Göçmenlik", label: "Vize & Göçmenlik", icon: Plane },
  { key: "Şirket & İş", label: "Şirket & İş", icon: Briefcase },
  { key: "Hukuk & Vergi", label: "Hukuk & Vergi", icon: Scale },
  { key: "Finansal", label: "Finansal", icon: TrendingUp },
  { key: "Yaşam & Relocation", label: "Yaşam & Relocation", icon: Heart },
];

// Mock: IDs of consultants who purchased "Kategori Vitrini"
const showcasePurchasedIds = new Set([
  "ayse-kara", "elif-demir", "zeynep-arslan", "selin-yildiz", "derya-emlak", "osman-vize"
]);

const Consultants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCountry: country } = useDiaspora();
  const [city, setCity] = useState("all");
  const filterParam = searchParams.get("filter");
  const [category, setCategory] = useState(filterParam || "all");
  const { toast } = useToast();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCategory(filterParam || "all");
  }, [filterParam]);

  // Reset city when country changes
  useEffect(() => {
    setCity("all");
  }, [country]);

  const handleCategoryChange = (nextCategory: string) => {
    setCategory(nextCategory);
    const nextParams = new URLSearchParams(searchParams);
    if (nextCategory === "all") {
      nextParams.delete("filter");
    } else {
      nextParams.set("filter", nextCategory);
    }
    setSearchParams(nextParams, { replace: true });
  };

  // Only show cities when a country is selected
  const activeCities = useMemo(() => {
    if (country === "all") return [];
    return countryCities[country] || [];
  }, [country]);

  const filtered = consultants.filter((c) => {
    const matchesCountry = country === "all" || c.country === country;
    const matchesCity = city === "all" || c.city === city;
    const matchesCategory = category === "all" || c.category === category;
    return matchesCountry && matchesCity && matchesCategory;
  });

  // Sort: showcase purchasers first
  const sortedFiltered = [...filtered].sort((a, b) => {
    const aShowcase = showcasePurchasedIds.has(a.id) ? 0 : 1;
    const bShowcase = showcasePurchasedIds.has(b.id) ? 0 : 1;
    return aShowcase - bShowcase;
  });

  const filteredAmbassadors = cityAmbassadors.filter((a) => {
    const matchesCountry = country === "all" || a.country === country;
    const matchesCity = city === "all" || a.city === city;
    return matchesCountry && matchesCity;
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
        toast({ title: "Takip edildi! 🔔", description: `${name} yeni bir şey paylaştığında bildirim alacaksınız.` });
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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Danışmanlar</h1>
              <p className="text-muted-foreground font-body mt-1">
                {category === "ambassador"
                  ? `${filteredAmbassadors.length} şehir elçisi bulundu`
                  : `${sortedFiltered.length} danışman bulundu`}
              </p>
            </div>
          </div>

          {/* Category filters + City dropdown */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {categoryFilters.map((f) => {
              const isActive = category === f.key;
              const Icon = f.icon;
              return (
                <Button
                  key={f.key}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(f.key)}
                  className="gap-1.5 text-xs"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {f.label}
                </Button>
              );
            })}

            {/* City dropdown - only when country selected */}
            <div className="ml-auto">
              <CityDropdown country={country} city={city} onCityChange={setCity} />
            </div>
          </div>

          {/* Ambassador Cards - show in "all" or "ambassador" category */}
          {(category === "all" || category === "ambassador") && filteredAmbassadors.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-foreground">Şehir Elçileri</h2>
                {category === "all" && <span className="text-xs text-muted-foreground">— Şehrindeki CorteQS temsilcileri</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAmbassadors.map((a) => (
                  <Link
                    to={`/ambassador/${a.id}`}
                    key={a.id}
                    className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gold/30 block"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img src={a.photo} alt={a.name} className="w-14 h-14 rounded-full object-cover" />
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground truncate">{a.name}</h3>
                        <p className="text-xs text-gold font-semibold">🏅 Şehir Elçisi</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-body mb-2">📍 {a.city}, {a.country}</p>
                    <p className="text-xs text-muted-foreground font-body mb-3 line-clamp-2">{a.bio}</p>

                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div className="bg-muted/50 rounded-lg py-1.5">
                        <p className="text-sm font-bold text-foreground">{a.usersOnboarded}</p>
                        <p className="text-[10px] text-muted-foreground">Kullanıcı</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg py-1.5">
                        <p className="text-sm font-bold text-foreground">{a.eventsOrganized}</p>
                        <p className="text-[10px] text-muted-foreground">Etkinlik</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg py-1.5">
                        <p className="text-sm font-bold text-foreground">{a.activeAdvisors}</p>
                        <p className="text-[10px] text-muted-foreground">Danışman</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {a.specialties.map((s) => (
                        <span key={s} className="text-xs bg-gold/10 text-gold rounded-full px-2 py-0.5">{s}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                      <span className="text-sm font-semibold text-foreground">{a.rating}</span>
                    </div>

                    <p className="text-[10px] text-success font-semibold mb-2">🎁 İlk 10 dk ücretsiz</p>
                    <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                      <Button variant="default" size="sm" className="flex-1 gap-1 text-xs">
                        <Video className="h-3 w-3" /> Canlı · €2/dk
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs border-gold/30 text-gold hover:bg-gold/10">
                        <Bot className="h-3 w-3" /> AI Twin · €1/dk
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Consultant Cards */}
          {category !== "ambassador" && (
            <>
              {category === "all" && (
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Danışmanlar</h2>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedFiltered.map((c, index) => {
                  const isFollowed = followedIds.has(c.id);
                  const isShowcase = showcasePurchasedIds.has(c.id) && index < 6;
                  return (
                    <Link
                      to={`/consultant/${c.id}`}
                      key={c.id}
                      className={`group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block ${
                        isShowcase ? "border-2 border-gold/40 ring-1 ring-gold/20" : "border border-border"
                      }`}
                    >
                      {isShowcase && (
                        <div className="flex items-center gap-1.5 mb-3">
                          <Crown className="h-3.5 w-3.5 text-gold" />
                          <Badge className="bg-gold/15 text-gold border-gold/30 text-[10px]">Vitrin</Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={c.photo} alt={c.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                          <div className="min-w-0">
                            <h3 className="font-bold text-foreground truncate">{c.name}</h3>
                            <p className="text-xs text-muted-foreground font-body truncate">{c.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => toggleFollow(c.id, c.name, e)}
                          className={`p-2 rounded-full transition-colors shrink-0 ${isFollowed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-primary"}`}
                        >
                          {isFollowed ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                        </button>
                      </div>

                      <p className="text-sm text-muted-foreground font-body mb-2">📍 {c.city}, {c.country}</p>

                      <div className="flex items-center gap-1 mb-4">
                        <Star className="h-4 w-4 text-gold fill-gold" />
                        <span className="text-sm font-semibold text-foreground">{c.rating}</span>
                        <span className="text-xs text-muted-foreground">({c.reviews})</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {c.specialties.slice(0, 2).map((s) => (
                          <span key={s} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{s}</span>
                        ))}
                      </div>

                       <p className="text-[10px] text-success font-semibold mb-2">🎁 İlk 10 dk ücretsiz</p>
                       <MapShareButtons name={c.name} city={c.city} country={c.country} className="mb-2" />
                       <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                         <Button variant="default" size="sm" className="flex-1 gap-1 text-xs">
                           <Video className="h-3 w-3" /> Canlı · €2/dk
                         </Button>
                         <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                           <Bot className="h-3 w-3" /> AI Twin · €1/dk
                         </Button>
                       </div>
                    </Link>
                  );
                })}
              </div>

              {sortedFiltered.length === 0 && (
                <div className="text-center py-20 text-muted-foreground font-body">
                  Bu filtrelerde danışman bulunmuyor.
                </div>
              )}
            </>
          )}

          {category === "ambassador" && filteredAmbassadors.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-body">
              Bu ülkede henüz şehir elçisi bulunmuyor.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Consultants;
