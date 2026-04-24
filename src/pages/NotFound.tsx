import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Compass, Globe, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-card to-secondary/30">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: "hsl(var(--primary))" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: "hsl(var(--accent))" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <Link to="/" className="inline-block">
          <img
            src="/sharedx/maillogo.png"
            alt="CorteQS Logo"
            className="mx-auto mb-8 h-20 w-auto"
          />
        </Link>

        <div className="relative mb-6 inline-block">
          <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-[120px] font-extrabold leading-none text-transparent md:text-[160px]">
            404
          </span>
          <div className="absolute -right-4 -top-2 animate-pulse">
            <Compass className="h-8 w-8 text-accent/60" />
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
          Bu sayfa <span className="text-accent">kayıp</span> — ama sen
          değilsin!
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          <span className="block">Diaspora ağında yolunu bulamadık gibi görünüyor.</span>
          <span className="block">Ama endişelenme, ana sayfadan haritana ulaşabilirsin.</span>
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          {["Berlin", "Londra", "New York", "Paris"].map(
            (city) => (
              <span
                key={city}
                className="rounded-full border border-border/50 bg-muted/50 px-3 py-1"
              >
                {city}
              </span>
            )
          )}
          <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-primary">
            + 50 şehir
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-64 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:brightness-105"
          >
            <Home className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
          <Link
            to="/#kaydol"
            className="inline-flex w-64 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:brightness-105"
          >
            <Globe className="h-4 w-4" />
            Kayıt Ol
          </Link>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" />
          corteqs.net
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
