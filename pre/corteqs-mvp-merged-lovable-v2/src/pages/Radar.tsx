import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Newspaper, Radio, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPublicRadarNews, formatRadarDate, type RadarNewsItem } from "@/lib/radarNews";

const Radar = () => {
  const [items, setItems] = useState<RadarNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetchPublicRadarNews();
        if (active) setItems(data);
      } catch (error) {
        console.error("Failed to load radar page", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(() => items.find((item) => item.imageUrl) || items[0], [items]);
  const rest = useMemo(() => items.filter((item) => item.id !== featured?.id), [featured, items]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <section className="relative overflow-hidden rounded-[2rem] border border-orange-100/60 bg-[linear-gradient(135deg,rgba(255,248,242,0.98),rgba(255,243,236,0.96))] px-6 py-8 shadow-[0_30px_90px_-52px_rgba(249,115,22,0.38)] md:px-8 md:py-10">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_55%)]" />
            <div className="relative z-10 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Diaspora Haber Hatti
              </div>
              <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">CorteQS Radar</h1>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                Diaspora ekosistemindeki son duyurulari, firsatlari ve topluluk gundemini tek akista takip edin.
              </p>
            </div>
          </section>

          {loading ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="h-[360px] animate-pulse rounded-[2rem] border border-border bg-card" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-[112px] animate-pulse rounded-2xl border border-border bg-card" />
                ))}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-border bg-card p-10 text-center">
              <Newspaper className="mx-auto mb-4 h-10 w-10 text-primary/60" />
              <h2 className="text-2xl font-bold text-foreground">Henüz Radar haberi yok</h2>
              <p className="mt-2 text-sm text-muted-foreground">Admin panelinden ilk haberi eklediğinizde burada görünecek.</p>
            </div>
          ) : (
            <>
              {featured ? (
                <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <article className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
                    {featured.imageUrl ? (
                      <div className="h-72 overflow-hidden">
                        <img src={featured.imageUrl} alt={featured.imageAlt || featured.title} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="p-6 md:p-8">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Radio className="mr-1 h-3.5 w-3.5" /> Radar
                        </Badge>
                        <Badge variant="outline">{formatRadarDate(featured.publishedAt)}</Badge>
                        {featured.metricValue ? <Badge variant="secondary">{featured.metricValue}</Badge> : null}
                      </div>
                      <h2 className="text-3xl font-black tracking-tight text-foreground">{featured.title}</h2>
                      <p className="mt-3 text-base leading-7 text-muted-foreground">{featured.summary}</p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        {featured.detailContent && featured.slug ? (
                          <Link to={`/radar/${featured.slug}`}>
                            <Button className="gap-2">
                              Detayi oku
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        ) : null}
                        {featured.externalUrl ? (
                          <a href={featured.externalUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="gap-2">
                              Kaynaga git
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>

                  <div className="space-y-4">
                    {rest.slice(0, 3).map((item) => (
                      <article key={item.id} className="rounded-[1.6rem] border border-border bg-card p-5 shadow-card">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{formatRadarDate(item.publishedAt)}</Badge>
                          {item.metricValue ? <Badge variant="secondary">{item.metricValue}</Badge> : null}
                        </div>
                        <h3 className="text-lg font-bold leading-snug text-foreground">{item.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          {item.detailContent && item.slug ? (
                            <Link to={`/radar/${item.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                              Detayi oku
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          ) : null}
                          {item.externalUrl ? (
                            <a
                              href={item.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground"
                            >
                              Kaynak
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="mt-10">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Tum Radar Haberleri</h2>
                    <p className="text-sm text-muted-foreground">{items.length} aktif kayit listeleniyor.</p>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <article key={item.id} className="overflow-hidden rounded-[1.7rem] border border-border bg-card shadow-card">
                      {item.imageUrl ? (
                        <div className="h-48 overflow-hidden">
                          <img src={item.imageUrl} alt={item.imageAlt || item.title} className="h-full w-full object-cover" />
                        </div>
                      ) : null}
                      <div className="p-5">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{formatRadarDate(item.publishedAt)}</Badge>
                          {item.metricValue ? <Badge variant="secondary">{item.metricValue}</Badge> : null}
                        </div>
                        <h3 className="text-xl font-bold leading-snug text-foreground">{item.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                          {item.detailContent && item.slug ? (
                            <Link to={`/radar/${item.slug}`}>
                              <Button size="sm" className="gap-1.5">
                                Detayi oku
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          ) : null}
                          {item.externalUrl ? (
                            <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline" className="gap-1.5">
                                Kaynak
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Radar;
