import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, PenLine, Video, Instagram, Users, Handshake, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityDropdown from "@/components/CityDropdown";
import { useDiaspora } from "@/contexts/DiasporaContext";
import { bloggers } from "@/data/mock";

const typeFilters = [
  { key: "all", label: "Tümü" },
  { key: "blogger", label: "Bloggerlar" },
  { key: "influencer", label: "Vloggerlar" },
];

const Bloggers = () => {
  const { selectedCountry: country } = useDiaspora();
  const [city, setCity] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => { setCity("all"); }, [country]);

  const filtered = bloggers.filter((b) => {
    const matchesCountry = country === "all" || b.country === country;
    const matchesCity = city === "all" || b.city === city;
    const matchesType = typeFilter === "all" || b.type === typeFilter;
    return matchesCountry && matchesCity && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Bloggerlar & Vloggerlar</h1>
              <p className="text-muted-foreground font-body mt-1">{filtered.length} içerik üretici bulundu</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            {typeFilters.map((f) => (
              <Button
                key={f.key}
                variant={typeFilter === f.key ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(f.key)}
                className="text-xs"
              >
                {f.label}
              </Button>
            ))}
            <div className="ml-auto">
              <CityDropdown country={country} city={city} onCityChange={setCity} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((b) => (
              <Link
                to={`/blogger/${b.id}`}
                key={b.id}
                className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border block"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={b.photo} alt={b.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate">{b.name}</h3>
                    <Badge variant={b.type === "influencer" ? "default" : "secondary"} className="text-[10px] mt-0.5">
                      {b.type === "influencer" ? "Vlogger" : "Blogger"}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground font-body mb-2">📍 {b.city}, {b.country}</p>
                <p className="text-sm text-muted-foreground font-body mb-3">🌍 {b.region}</p>

                <div className="flex items-center gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                    <span className="font-semibold text-foreground">{b.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{(b.followers / 1000).toFixed(0)}K</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {b.specialties.slice(0, 2).map((s) => (
                    <span key={s} className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{s}</span>
                  ))}
                </div>

                {/* Ad collaboration badge for vloggers */}
                {b.adCollaboration && (
                  <div className="flex items-center gap-1.5 bg-gold/10 text-gold rounded-lg px-3 py-1.5 mb-4 text-xs font-semibold">
                    <Handshake className="h-3.5 w-3.5" />
                    Reklam İşbirliği Açık
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  {b.blogPosts.length > 0 && (
                    <span className="flex items-center gap-1">
                      <PenLine className="h-3 w-3" /> {b.blogPosts.length} Blog
                    </span>
                  )}
                  {b.vlogs.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Video className="h-3 w-3" /> {b.vlogs.length} Vlog
                    </span>
                  )}
                  {b.instagram && (
                    <span className="flex items-center gap-1">
                      <Instagram className="h-3 w-3" /> {b.instagram}
                    </span>
                  )}
                </div>

                <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                  <Button variant="default" size="sm" className="flex-1 gap-1 text-xs">
                    <Eye className="h-3 w-3" /> Profili Gör
                  </Button>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-body">
              Bu filtrelerde içerik üretici bulunmuyor.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bloggers;
