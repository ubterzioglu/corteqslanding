import { useState } from "react";
import { Star, Bot, Video, UserPlus, UserCheck, Info, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { consultants } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";

const FeaturedConsultants = () => {
  const featured = consultants.slice(0, 4);
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
        toast({ title: "Takip edildi! 🔔", description: `${name} yeni bir şey paylaştığında bildirim alacaksınız.` });
      }
      return next;
    });
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Öne Çıkan</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            En çok tercih edilen danışmanlar
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-body">
            AI Twin & canlı görüşme ile anında danışmanlık alın
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((c) => {
            const isFollowed = followedIds.has(c.id);
            return (
              <Link
                to={`/consultant/${c.id}`}
                key={c.id}
                className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border block"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={c.photo} alt={c.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold text-foreground">{c.name}</h3>
                      <p className="text-xs text-muted-foreground font-body">{c.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleFollow(c.id, c.name, e)}
                    className={`p-2 rounded-full transition-colors ${isFollowed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:text-primary"}`}
                  >
                    {isFollowed ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  </button>
                </div>

                <p className="text-sm text-muted-foreground font-body mb-3">📍 {c.city}, {c.country}</p>

                <div className="flex items-center gap-1 mb-5">
                  <Star className="h-4 w-4 text-gold fill-gold" />
                  <span className="text-sm font-semibold text-foreground">{c.rating}</span>
                  <span className="text-xs text-muted-foreground">({c.reviews})</span>
                </div>

                <div className="flex gap-2">
                  <Link to={`/consultant/${c.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="default" size="sm" className="w-full gap-1 text-xs relative">
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">
                              Şu an
                            </span>
                            <Video className="h-3 w-3" />
                            Canlı
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> Şu an müsait</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs relative" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                          <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground rounded-full p-0.5">
                            <Info className="h-2.5 w-2.5" />
                          </span>
                          <Bot className="h-3 w-3" />
                          AI Twin
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[200px] text-center">
                        <p className="font-semibold text-xs mb-1">🤖 24 Saat Danışman Klonu</p>
                        <p className="text-[10px] text-muted-foreground">Yapay zeka ile 7/24 görüşme!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/consultants">
            <Button variant="outline" size="lg">Tüm Danışmanları Gör →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedConsultants;
