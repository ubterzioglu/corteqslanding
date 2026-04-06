import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, MapPin, Users, Clock, Star, PlusCircle,
  Search, Ticket, Globe, Filter, ChevronLeft, ChevronRight,
  Radio, Video, Lock, Unlock
} from "lucide-react";
import MapShareButtons from "@/components/MapShareButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityDropdown from "@/components/CityDropdown";
import { useDiaspora } from "@/contexts/DiasporaContext";
import { events, countries } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";

const categoryLabels: Record<string, string> = {
  networking: "Networking",
  eğitim: "Eğitim",
  kültür: "Kültür",
  iş: "İş & Kariyer",
  sosyal: "Sosyal",
  spor: "Spor",
};

const categoryColors: Record<string, string> = {
  networking: "bg-turquoise/10 text-turquoise",
  eğitim: "bg-primary/10 text-primary",
  kültür: "bg-purple-500/10 text-purple-600",
  iş: "bg-gold/10 text-gold",
  sosyal: "bg-pink-500/10 text-pink-600",
  spor: "bg-success/10 text-success",
};

const typeLabels: Record<string, string> = {
  online: "🌐 Online",
  "yüz yüze": "📍 Yüz yüze",
  hybrid: "🔄 Hybrid",
};

const Events = () => {
  const { selectedCountry: country } = useDiaspora();
  const [city, setCity] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const { toast } = useToast();

  useEffect(() => { setCity("all"); }, [country]);

  // Group events by date for calendar view
  const eventsByDate: Record<string, typeof events> = {};
  events.forEach((e) => {
    const dateKey = e.date;
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(e);
  });

  const featured = events.filter((e) => e.featured);

  const filtered = events.filter((e) => {
    const matchesCountry = country === "all" || e.country === country;
    const matchesCity = city === "all" || e.city === city;
    const matchesSearch = search === "" ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
    return matchesCountry && matchesCity && matchesSearch && matchesCategory;
  });

  const handleCreateEvent = () => {
    toast({ title: "Etkinliğiniz gönderildi!", description: "İnceleme sonrası platformda yayınlanacaktır." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" /> Etkinlikler
              </h1>
              <p className="text-muted-foreground font-body mt-1">{filtered.length} etkinlik bulundu</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Etkinlik Oluştur
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Yeni Etkinlik Oluştur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Etkinlik Adı</Label>
                      <Input placeholder="Örn: Networking Akşam Yemeği" />
                    </div>
                    <div>
                      <Label>Açıklama</Label>
                      <Textarea placeholder="Etkinlik hakkında detaylı bilgi..." rows={4} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Tarih</Label>
                        <Input type="date" />
                      </div>
                      <div>
                        <Label>Saat</Label>
                        <Input type="time" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Kategori</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(categoryLabels).map(([k, v]) => (
                              <SelectItem key={k} value={k}>{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Tür</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="yüz yüze">Yüz yüze</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Ülke</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Ülke" /></SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Şehir / Mekan</Label>
                        <Input placeholder="Şehir veya mekan adı" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Kontenjan</Label>
                        <Input type="number" placeholder="Maks. katılımcı" />
                      </div>
                      <div>
                        <Label>Ücret (€)</Label>
                        <Input type="number" placeholder="0 = Ücretsiz" />
                      </div>
                    </div>
                    <div>
                      <Label>Görsel URL (opsiyonel)</Label>
                      <Input placeholder="https://..." />
                    </div>
                    <div>
                      <Label>Etiketler (virgülle ayır)</Label>
                      <Input placeholder="Networking, Yatırım, Workshop" />
                    </div>
                    <Button className="w-full gap-2" onClick={handleCreateEvent}>
                      <Calendar className="h-4 w-4" /> Etkinliği Yayınla
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <CityDropdown country={country} city={city} onCityChange={setCity} />
            </div>
          </div>

          {/* Featured Events */}
          {categoryFilter === "all" && country === "all" && search === "" && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-gold fill-gold" /> Öne Çıkan Etkinlikler
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featured.map((evt) => (
                  <Link
                    to={`/event/${evt.id}`}
                    key={evt.id}
                    className="group relative rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 block"
                  >
                    <div className="relative h-48 md:h-56">
                      <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-gold/90 text-white border-0">⭐ Featured</Badge>
                        <Badge className={`border-0 ${categoryColors[evt.category]}`}>{categoryLabels[evt.category]}</Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-bold text-white mb-1">{evt.title}</h3>
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {evt.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {evt.time}</span>
                          <span>{typeLabels[evt.type]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-card">
                      <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">{evt.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{evt.attendees}/{evt.maxAttendees} katılımcı</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {evt.price === 0 ? (
                            <Badge variant="outline" className="text-success border-success/30">Ücretsiz</Badge>
                          ) : (
                            <Badge variant="outline">€{evt.price}</Badge>
                          )}
                          <Button size="sm">Katıl</Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 🔴 Şu an Canlı */}
          {categoryFilter === "all" && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                </span>
                Şu an Canlı
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Live Event 1 - Ücretsiz */}
                <div className="bg-card rounded-2xl border-2 border-destructive/30 overflow-hidden shadow-card relative">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-destructive text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    <Radio className="h-3 w-3 animate-pulse" /> CANLI
                  </div>
                  <div className="relative h-36">
                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=280&fit=crop" alt="Webinar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-turquoise/90 text-primary-foreground border-0 text-xs">Networking</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground mb-1">Diaspora Networking Webinarı</h3>
                    <p className="text-xs text-muted-foreground font-body mb-3">Avrupa'daki Türk girişimcilerin deneyim paylaşımı ve iş birliği fırsatları.</p>
                    <div className="space-y-1.5 text-sm text-muted-foreground font-body mb-4">
                      <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 19:00 – 20:30 CET <span className="text-xs bg-destructive/10 text-destructive rounded px-1.5 ml-1">42 dk kaldı</span></p>
                      <p className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" /> Zoom · Online</p>
                      <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 87 / 150 katılımcı</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-success border-success/30 gap-1">
                        <Unlock className="h-3 w-3" /> Ücretsiz
                      </Badge>
                      <Button size="sm" className="gap-1.5">
                        <Video className="h-3.5 w-3.5" /> Hemen Katıl
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Live Event 2 - Ücretli */}
                <div className="bg-card rounded-2xl border-2 border-destructive/30 overflow-hidden shadow-card relative">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-destructive text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    <Radio className="h-3 w-3 animate-pulse" /> CANLI
                  </div>
                  <div className="relative h-36">
                    <img src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=500&h=280&fit=crop" alt="Workshop" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-primary/90 text-primary-foreground border-0 text-xs">Eğitim</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground mb-1">Almanya'da Şirket Kuruluşu Workshop</h3>
                    <p className="text-xs text-muted-foreground font-body mb-3">GmbH kuruluş adımları, vergi avantajları ve pratik ipuçları.</p>
                    <div className="space-y-1.5 text-sm text-muted-foreground font-body mb-4">
                      <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 18:30 – 20:00 CET <span className="text-xs bg-destructive/10 text-destructive rounded px-1.5 ml-1">1s 12dk kaldı</span></p>
                      <p className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" /> Google Meet · Online</p>
                      <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 34 / 50 katılımcı</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-gold border-gold/30 gap-1">
                        <Lock className="h-3 w-3" /> €15
                      </Badge>
                      <Button size="sm" className="gap-1.5 bg-gold hover:bg-gold/90 text-primary-foreground">
                        <Ticket className="h-3.5 w-3.5" /> Bilet Al & Katıl
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Live Event 3 - Ücretsiz */}
                <div className="bg-card rounded-2xl border-2 border-destructive/30 overflow-hidden shadow-card relative">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-destructive text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    <Radio className="h-3 w-3 animate-pulse" /> CANLI
                  </div>
                  <div className="relative h-36">
                    <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&h=280&fit=crop" alt="Panel" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-gold/90 text-primary-foreground border-0 text-xs">İş & Kariyer</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground mb-1">Yatırımcı Buluşması — Q&A</h3>
                    <p className="text-xs text-muted-foreground font-body mb-3">Dubai'deki yatırım fırsatları hakkında canlı soru-cevap oturumu.</p>
                    <div className="space-y-1.5 text-sm text-muted-foreground font-body mb-4">
                      <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 20:00 – 21:00 GST <span className="text-xs bg-destructive/10 text-destructive rounded px-1.5 ml-1">18 dk kaldı</span></p>
                      <p className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" /> YouTube Live · Online</p>
                      <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 215 izleyici</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-success border-success/30 gap-1">
                        <Unlock className="h-3 w-3" /> Ücretsiz
                      </Badge>
                      <Button size="sm" className="gap-1.5">
                        <Video className="h-3.5 w-3.5" /> İzle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Etkinlik ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={categoryFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter("all")} className="text-xs">Tümü</Button>
              {Object.entries(categoryLabels).map(([k, v]) => (
                <Button key={k} variant={categoryFilter === k ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(k)} className="text-xs">{v}</Button>
              ))}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="text-xs"
            >
              Kart Görünümü
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="text-xs gap-1"
            >
              <Calendar className="h-3.5 w-3.5" /> Takvim
            </Button>
          </div>

          {viewMode === "calendar" ? (
            /* Calendar View */
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Etkinlik Takvimi
              </h2>
              <div className="space-y-6">
                {Object.entries(eventsByDate)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, dateEvents]) => {
                    const relevantEvents = dateEvents.filter((e) => {
                      const matchesCountry = country === "all" || e.country === country;
                      const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
                      return matchesCountry && matchesCategory;
                    });
                    if (relevantEvents.length === 0) return null;
                    return (
                      <div key={date}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-16 text-center shrink-0">
                            <div className="text-2xl font-bold text-primary">{date.split(" ")[0]}</div>
                            <div className="text-xs text-muted-foreground">{date.split(" ").slice(1).join(" ")}</div>
                          </div>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                        <div className="ml-20 space-y-3">
                          {relevantEvents.map((evt) => (
                            <Link
                              to={`/event/${evt.id}`}
                              key={evt.id}
                              className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="shrink-0">
                                <Badge className={`border-0 text-xs ${categoryColors[evt.category]}`}>{categoryLabels[evt.category]}</Badge>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate">{evt.title}</h3>
                                <p className="text-sm text-muted-foreground font-body flex items-center gap-2">
                                  <Clock className="h-3 w-3" /> {evt.time} - {evt.endTime} · {evt.location}, {evt.city}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {evt.price === 0 ? (
                                  <Badge variant="outline" className="text-success border-success/30 text-xs">Ücretsiz</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">€{evt.price}</Badge>
                                )}
                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{evt.attendees}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (

          /* All Events Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((evt) => (
              <Link
                to={`/event/${evt.id}`}
                key={evt.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 block"
              >
                <div className="relative h-40">
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`border-0 text-xs ${categoryColors[evt.category]}`}>{categoryLabels[evt.category]}</Badge>
                  </div>
                  {evt.featured && (
                    <Badge className="absolute top-3 right-3 bg-gold/90 text-white border-0 text-xs">⭐</Badge>
                  )}
                </div>
                 <div className="p-5">
                   <h3 className="font-bold text-foreground mb-2 line-clamp-2">{evt.title}</h3>
                   <div className="space-y-1.5 mb-3 text-sm text-muted-foreground font-body">
                     <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {evt.date} · {evt.time}</p>
                     <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {evt.location} · {evt.city}</p>
                   </div>
                   {evt.type !== "online" && (
                     <MapShareButtons
                       name={evt.title}
                       city={evt.city}
                       country={evt.country}
                       address={evt.location}
                       className="mb-3"
                     />
                   )}
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                       <Users className="h-3.5 w-3.5" /> {evt.attendees}/{evt.maxAttendees}
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-xs text-muted-foreground">{typeLabels[evt.type]}</span>
                       {evt.price === 0 ? (
                         <Badge variant="outline" className="text-success border-success/30 text-xs">Ücretsiz</Badge>
                       ) : (
                         <Badge variant="outline" className="text-xs">€{evt.price}</Badge>
                       )}
                     </div>
                   </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                    <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{evt.organizerAvatar}</div>
                    <span className="text-xs text-muted-foreground font-body">{evt.organizer}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-body">
              Bu filtrelerde etkinlik bulunamadı.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
