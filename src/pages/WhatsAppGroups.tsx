import { useState, useEffect } from "react";
import { MessageSquare, Users, GraduationCap, Briefcase, Heart, Search, ExternalLink, ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CityDropdown from "@/components/CityDropdown";
import { useDiaspora } from "@/contexts/DiasporaContext";
import { whatsappGroups, countries } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";

const categoryMeta = {
  alumni: { icon: GraduationCap, label: "Alumni", color: "bg-primary/10 text-primary" },
  hobi: { icon: Heart, label: "Hobiler", color: "bg-turquoise/10 text-turquoise" },
  is: { icon: Briefcase, label: "İş Grupları", color: "bg-gold/10 text-gold" },
};

const universities = ["ODTÜ", "Boğaziçi", "İTÜ", "Yıldız Teknik", "Hacettepe", "Bilkent", "Koç Üniversitesi", "Sabancı", "İstanbul Üniversitesi", "Ankara Üniversitesi"];

const WhatsAppGroups = () => {
  const { selectedCountry: country } = useDiaspora();
  const [city, setCity] = useState("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => { setCity("all"); }, [country]);

  const filtered = whatsappGroups.filter((g) => {
    const matchesCountry = country === "all" || g.country === country;
    const matchesCity = city === "all" || g.city === city;
    const matchesSearch = search === "" || g.name.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase());
    return matchesCountry && matchesCity && matchesSearch;
  });

  const byCategory = (cat: "alumni" | "hobi" | "is") => filtered.filter((g) => g.category === cat);

  const handleApply = () => {
    toast({ title: "Başvurunuz alındı!", description: "Grup yöneticisi başvurunuzu inceleyecek." });
  };

  const handlePostGroup = () => {
    toast({ title: "Grubunuz gönderildi!", description: "İnceleme sonrası yayınlanacaktır." });
  };

  const GroupCard = ({ group }: { group: typeof whatsappGroups[0] }) => {
    const meta = categoryMeta[group.category];
    return (
      <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${meta.color} flex items-center justify-center shrink-0`}>
            <meta.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground truncate">{group.name}</h3>
            <p className="text-sm text-muted-foreground font-body mt-0.5">{group.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {group.members} üye</span>
              <span>📍 {group.city}, {group.country}</span>
              {group.university && <span className={`px-2 py-0.5 rounded-full ${meta.color} text-xs font-medium`}>{group.university}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="flex-1 gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Başvur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{group.name} - Katılım Başvurusu</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Ad Soyad</Label>
                  <Input placeholder="Adınız ve soyadınız" />
                </div>
                <div>
                  <Label>Telefon (WhatsApp)</Label>
                  <Input placeholder="+49 170 000 0000" />
                </div>
                {group.category === "alumni" && (
                  <div>
                    <Label>Üniversite & Mezuniyet Yılı</Label>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Üniversite" /></SelectTrigger>
                        <SelectContent>
                          {universities.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input placeholder="Yıl" className="w-24" />
                    </div>
                  </div>
                )}
                {group.category === "is" && (
                  <div>
                    <Label>Şirket & Pozisyon</Label>
                    <Input placeholder="Şirketiniz ve pozisyonunuz" />
                  </div>
                )}
                <div>
                  <Label>Kısa Not</Label>
                  <Textarea placeholder="Gruba neden katılmak istiyorsunuz?" rows={3} />
                </div>
                <Button className="w-full gap-2" onClick={handleApply}>
                  <MessageSquare className="h-4 w-4" /> Başvuru Gönder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <a href={group.link} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-[#25D366]" /> WhatsApp Grupları
              </h1>
              <p className="text-muted-foreground font-body mt-1">{filtered.length} grup bulundu</p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white">
                    <PlusCircle className="h-4 w-4" /> Post Your Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Grubunuzu Paylaşın</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Grup Adı</Label>
                      <Input placeholder="Örn: Berlin Türk Girişimciler" />
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alumni">Alumni</SelectItem>
                          <SelectItem value="hobi">Hobi</SelectItem>
                          <SelectItem value="is">İş Grubu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Ülke & Şehir</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Ülke" />
                        <Input placeholder="Şehir" />
                      </div>
                    </div>
                    <div>
                      <Label>WhatsApp Grup Linki</Label>
                      <Input placeholder="https://chat.whatsapp.com/..." />
                    </div>
                    <div>
                      <Label>Açıklama</Label>
                      <Textarea placeholder="Grup hakkında kısa bilgi" rows={3} />
                    </div>
                    <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white" onClick={handlePostGroup}>
                      <MessageSquare className="h-4 w-4" /> Grubu Gönder
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <CityDropdown country={country} city={city} onCityChange={setCity} />
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Grup ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="alumni">
            <TabsList className="bg-card border border-border w-full justify-start h-auto gap-1 p-1 mb-6">
              <TabsTrigger value="alumni" className="gap-1.5"><GraduationCap className="h-4 w-4" /> Alumni ({byCategory("alumni").length})</TabsTrigger>
              <TabsTrigger value="hobi" className="gap-1.5"><Heart className="h-4 w-4" /> Hobiler ({byCategory("hobi").length})</TabsTrigger>
              <TabsTrigger value="is" className="gap-1.5"><Briefcase className="h-4 w-4" /> İş Grupları ({byCategory("is").length})</TabsTrigger>
            </TabsList>

            {(["alumni", "hobi", "is"] as const).map((cat) => (
              <TabsContent key={cat} value={cat}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {byCategory(cat).map((g) => <GroupCard key={g.id} group={g} />)}
                </div>
                {byCategory(cat).length === 0 && (
                  <p className="text-center py-16 text-muted-foreground font-body">Bu filtrelerde grup bulunamadı.</p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WhatsAppGroups;
