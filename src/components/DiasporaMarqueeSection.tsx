import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, Newspaper, TrendingUp } from "lucide-react";

import {
  fallbackMarqueeItems,
  listPublicMarqueeItems,
  marqueeTypeLabels,
  type MarqueeItemRow,
  type MarqueeItemType,
} from "@/lib/marquee";
import { cn } from "@/lib/utils";

const typeStyles: Record<MarqueeItemType, { className: string; icon: typeof Newspaper }> = {
  news: {
    className: "bg-sky-50 text-sky-800 border-sky-200",
    icon: Newspaper,
  },
  stat: {
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: TrendingUp,
  },
  announcement: {
    className: "bg-orange-50 text-orange-800 border-orange-200",
    icon: Megaphone,
  },
};

const getType = (type: string): MarqueeItemType =>
  type === "news" || type === "stat" || type === "announcement" ? type : "announcement";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const MarqueeCard = ({ item }: { item: MarqueeItemRow }) => {
  const itemType = getType(item.type);
  const typeStyle = typeStyles[itemType];
  const TypeIcon = typeStyle.icon;
  const imageUrl = item.image_url || "/og-image.png";
  const cardContent = (
    <article className="group h-full w-[280px] overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:w-[340px]">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={item.image_alt || item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {item.metric_value && (
          <div className="absolute left-3 top-3 rounded-md bg-background/90 px-3 py-2 shadow-sm backdrop-blur">
            <span className="block text-xl font-extrabold tracking-tight text-foreground">{item.metric_value}</span>
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold", typeStyle.className)}>
            <TypeIcon className="h-3.5 w-3.5" />
            {marqueeTypeLabels[itemType]}
          </span>
          <time className="shrink-0 text-xs text-muted-foreground">{formatDate(item.published_at)}</time>
        </div>
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground">{item.title}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
        {item.link_enabled && item.slug && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Detay
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </article>
  );

  if (item.link_enabled && item.slug) {
    return (
      <Link to={`/diaspora/${item.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

const DiasporaMarqueeSection = () => {
  const [items, setItems] = useState<MarqueeItemRow[]>(fallbackMarqueeItems);

  useEffect(() => {
    let mounted = true;

    listPublicMarqueeItems()
      .then((data) => {
        if (mounted && data.length > 0) setItems(data);
      })
      .catch((error) => {
        console.error("Marquee items could not be loaded", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const marqueeItems = useMemo(() => [...items, ...items], [items]);

  return (
    <section className="overflow-hidden border-y border-border bg-[linear-gradient(90deg,hsl(var(--background)),hsl(var(--secondary)),hsl(var(--background)))] py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">CorteQS Radar</p>
            <h2 className="max-w-4xl text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
              Türk Diaspora Haberleri / İstatistikler / Duyurular
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Dünya genelindeki Türk topluluklarından sayılar, gelişmeler ve platform duyuruları.
          </p>
        </div>
      </div>

      <div className="diaspora-marquee group flex gap-4 overflow-hidden py-2">
        <div className="diaspora-marquee-track flex min-w-max gap-4 px-4">
          {marqueeItems.map((item, index) => (
            <MarqueeCard key={`${item.id}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiasporaMarqueeSection;
