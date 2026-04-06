import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cloud, TrendingUp, Briefcase, Newspaper, MapPin, Search, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cityMeta, categoryConfig, getFilteredNews, searchAllNews, type NewsCategory } from "@/data/cityNewsData";
import CityWeatherWidget from "@/components/city-news/CityWeatherWidget";
import NewsCard from "@/components/city-news/NewsCard";
import CityDropdown from "@/components/CityDropdown";
import { useDiaspora } from "@/contexts/DiasporaContext";

const CityNews = () => {
  const { selectedCountry: country } = useDiaspora();
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState<NewsCategory>("all");
  const [keyword, setKeyword] = useState("");

  // Reset city when country changes
  useEffect(() => { setCity("all"); }, [country]);

  // Filter cityMeta by selected country & city
  const filteredCityMetas = useMemo(() => {
    return cityMeta.filter(c => {
      const matchesCountry = country === "all" || c.country === country;
      const matchesCity = city === "all" || c.city === city;
      return matchesCountry && matchesCity;
    });
  }, [country, city]);

  // If a specific city is selected, use that; otherwise show first matching city for weather
  const currentMeta = useMemo(() => {
    if (city !== "all") return cityMeta.find(c => c.city === city) || cityMeta[0];
    if (country !== "all") return cityMeta.find(c => c.country === country) || cityMeta[0];
    return cityMeta[0];
  }, [city, country]);

  // Get news for all matching cities
  const { allLocal, allInternational } = useMemo(() => {
    const cities = filteredCityMetas.map(c => c.city);
    let localNews: ReturnType<typeof getFilteredNews>["local"] = [];
    let intlNews: ReturnType<typeof getFilteredNews>["international"] = [];
    cities.forEach(cityName => {
      const { local, international } = getFilteredNews(cityName, category, keyword);
      localNews = [...localNews, ...local];
      intlNews = [...intlNews, ...international];
    });
    return { allLocal: localNews, allInternational: intlNews };
  }, [filteredCityMetas, category, keyword]);

  // Cross-city keyword search results (cities NOT in current filter)
  const crossCityResults = useMemo(() => {
    if (!keyword.trim()) return [];
    const currentCities = filteredCityMetas.map(c => c.city);
    return searchAllNews(category, keyword).filter(n => !currentCities.includes(n.city));
  }, [keyword, category, filteredCityMetas]);

  const locationLabel = city !== "all" ? city : country !== "all" ? country : "Tüm Şehirler";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Newspaper className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Şehrinizden Haberler</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Diaspora Şehir Haberleri
          </h1>
          <p className="text-muted-foreground font-body">Yaşadığınız şehirden güncel hava durumu, ekonomi ve kariyer haberleri</p>
        </div>

        {/* City Dropdown + Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-3">
            <CityDropdown country={country} city={city} onCityChange={setCity} />
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Anahtar kelime ile ara..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(categoryConfig) as [NewsCategory, typeof categoryConfig["all"]][]).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    category === key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weather Widget - show for specific city */}
        {city !== "all" && (
          <CityWeatherWidget city={currentMeta.city} weather={currentMeta.weather} />
        )}

        {/* Local Sources Bar */}
        {city !== "all" && currentMeta && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground">Yerel Kaynaklar:</span>
            {currentMeta.localSources.map((s) => (
              <Badge key={s.name} variant="secondary" className="text-xs gap-1">
                <Newspaper className="h-3 w-3" />
                {s.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Local News Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {locationLabel} Yerel Haberler
          </h2>
          {allLocal.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {allLocal.map((news) => (
                <NewsCard key={news.id} news={news} showCity={city === "all"} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Newspaper className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>Bu filtrede yerel haber bulunamadı.</p>
            </div>
          )}
        </div>

        {/* International News Section */}
        {allInternational.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Uluslararası Basında {locationLabel}
              <span className="text-xs font-normal text-muted-foreground ml-1">BBC · CNN · Reuters</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {allInternational.map((news) => (
                <NewsCard key={news.id} news={news} isInternational showCity={city === "all"} />
              ))}
            </div>
          </div>
        )}

        {/* Cross-city keyword results */}
        {crossCityResults.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Diğer Şehirlerde "{keyword}" ile İlgili Haberler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {crossCityResults.slice(0, 6).map((news) => (
                <NewsCard key={news.id} news={news} showCity />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CityNews;
