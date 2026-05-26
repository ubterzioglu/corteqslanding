import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MarqueeItemCard from "@/components/MarqueeItemCard";
import { Button } from "@/components/ui/button";
import {
  fallbackMarqueeItems,
  listPublicMarqueeItems,
  type MarqueeItemRow,
} from "@/lib/marquee";

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
    <section className="overflow-hidden py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-4xl text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
              CorteQS Radar
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Dünya genelindeki Türk topluluklarından sayılar, gelişmeler ve platform duyuruları.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link to="/radar">
              Tüm Radar
            </Link>
          </Button>
        </div>
      </div>

      <div className="diaspora-marquee group flex gap-4 overflow-hidden py-2">
        <div className="diaspora-marquee-track flex min-w-max gap-4 px-4">
          {marqueeItems.map((item, index) => (
            <MarqueeItemCard key={`${item.id}-${index}`} item={item} className="w-[280px] sm:w-[340px]" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiasporaMarqueeSection;
