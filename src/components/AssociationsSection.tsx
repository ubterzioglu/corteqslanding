import { useState } from "react";
import { Users, MapPin, Calendar as CalendarIcon, UserPlus, UserCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { associations } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";

const AssociationsSection = () => {
  const featured = associations.slice(0, 3);
  const { toast } = useToast();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

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
        toast({ title: "Takip edildi! 🔔", description: `${name} yeni bir etkinlik düzenlediğinde bildirim alacaksınız.` });
      }
      return next;
    });
  };

  return (
    <section id="dernekler" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Topluluk</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Kuruluşlar & Örgütler
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-body">
            Bulunduğun ülkedeki Türk topluluklarına katıl
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((a) => {
            const isFollowed = followedIds.has(a.id);
            return (
              <Link
                to={`/association/${a.id}`}
                key={a.id}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:-translate-y-1 block"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {a.type}
                  </span>
                  <button
                    onClick={(e) => toggleFollow(a.id, a.name, e)}
                    className={`p-2 rounded-full transition-colors ${isFollowed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-primary"}`}
                  >
                    {isFollowed ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{a.name}</h3>
                <p className="text-sm text-muted-foreground font-body flex items-center gap-1 mb-4">
                  <MapPin className="h-4 w-4" /> {a.city}, {a.country}
                </p>

                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-body">{a.members.toLocaleString()} üye</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-body">{a.events} etkinlik</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/association/${a.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="default" size="sm" className="w-full">Üye Ol</Button>
                  </Link>
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <Heart className="h-3 w-3" /> Bağış / Aidat
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/associations">
            <Button variant="outline" size="lg">Tüm Kuruluşları Gör →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AssociationsSection;
