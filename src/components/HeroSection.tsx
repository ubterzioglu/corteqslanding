import { useState } from "react";
import heroLandmarks from "@/assets/hero-landmarks.jpg";
import { ArrowRight, Globe, MapPin, Users } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";

const HeroSection = () => {
  const [formOpen, setFormOpen] = useState(false);
  const stats = [
    { icon: MapPin, value: "164 Ülke", label: "Yaygın diaspora ağı" },
    { icon: Users, value: "8.8 Milyon Türk", label: "Hedeflenen küresel erişim" },
    { icon: Globe, value: "120.000+ Kuruluş", label: "Topluluk, iş ve içerik ekosistemi" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/70">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(39,178,156,0.12),_transparent_34%),radial-gradient(circle_at_80%_20%,_rgba(245,118,54,0.14),_transparent_26%)]" />
      <div className="container relative mx-auto px-4 pb-12 pt-8 sm:pt-10 lg:pb-16 lg:pt-12">
        <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-[8px] border border-white/55 bg-white/72 px-5 py-7 shadow-[0_28px_90px_rgba(28,38,52,0.10)] backdrop-blur sm:px-7 md:px-8 lg:px-10 lg:py-10">
          <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
            <div className="absolute inset-y-[8%] right-[2%] w-full overflow-hidden rounded-l-[32px]">
              <img
                src={heroLandmarks}
                alt="Dünya genelinde diaspora topluluklarını birleştiren CorteQS platformu"
                className="h-full w-full object-cover object-center [filter:brightness(0.98)_saturate(0.9)_contrast(0.96)]"
                width={1920}
                height={1080}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,transparent_0,transparent_28%,rgba(255,255,255,0.82)_70%,rgba(255,255,255,0.97)_100%)]" />
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white via-white/65 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/22 via-transparent to-background/8" />
            </div>
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <div className="max-w-2xl">
              <img src="/logocorteqsbig.png" alt="CorteQS Logo" className="mb-5 w-[72%] max-w-[320px]" />
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
                <Globe className="h-4 w-4" />
                Türk diaspora network platformu
              </div>
              <h1 className="max-w-xl text-4xl font-extrabold leading-[1.02] text-foreground sm:text-5xl lg:text-[4.2rem]">
                Diasporayı birleştiren <span className="text-accent">platform</span> yakında.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                CorteQS Diaspora Connect, dünya genelindeki Türk diasporasını danışmanlar, işletmeler, kuruluşlar,
                içerik üreticileri ve bireylerle aynı ağ içinde buluşturan global katılım alanı kuruyor.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setFormOpen(true)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  Kategorileri Gör - Kaydol
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#kategoriler"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border border-border bg-background/72 px-7 py-3.5 text-base font-semibold text-foreground transition-all hover:bg-secondary"
                >
                  Kategorileri Gör
                </a>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[8px] border border-accent/18 bg-accent/6 p-4 shadow-sm">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-accent/12 text-lg">
                    🏆
                  </div>
                  <p className="text-sm font-semibold text-foreground">Ödüllü blog yazısı yarışması yakında</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Diaspora hikayelerini görünür kılan içerik üreticileri için erken çağrı başlıyor.
                  </p>
                </div>
                <div className="rounded-[8px] border border-primary/18 bg-primary/6 p-4 shadow-sm">
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-primary/12 text-lg">
                    ⏳
                  </div>
                  <p className="text-sm font-semibold text-foreground">Erken kayıt süreci açık</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Kategorinizi şimdi bırakın; platform açıldığında ilk erişim duyurularını doğrudan alın.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative lg:min-h-[620px]">
              <div className="relative overflow-hidden rounded-[8px] border border-white/65 bg-white/70 p-3 shadow-[0_18px_50px_rgba(31,40,52,0.12)] lg:absolute lg:bottom-6 lg:right-0 lg:w-[78%]">
                <img
                  src={heroLandmarks}
                  alt="Dünya genelinde diaspora topluluklarını birleştiren CorteQS platformu"
                  className="h-[320px] w-full rounded-[8px] object-cover object-center [filter:brightness(0.97)_saturate(0.9)_contrast(0.96)] lg:h-[520px]"
                  width={1920}
                  height={1080}
                />
                <div className="absolute inset-3 rounded-[8px] bg-gradient-to-t from-foreground/15 via-transparent to-white/10" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:absolute lg:bottom-6 lg:left-0 lg:right-[42%] lg:mt-0">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.value} className="rounded-[8px] border border-border/75 bg-background/88 p-4 shadow-sm backdrop-blur">
                      <Icon className="mb-3 h-4 w-4 text-primary" />
                      <p className="text-base font-semibold text-foreground">{stat.value}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative mt-8 border-t border-border/70 pt-5">
            <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground" aria-label="Bölüm navigasyonu">
              <a href="#hakkinda" className="rounded-full bg-background/80 px-3 py-1.5 transition-colors hover:text-primary">
                Hakkımızda
              </a>
              <a href="#kategoriler" className="rounded-full bg-background/80 px-3 py-1.5 transition-colors hover:text-primary">
                Kategoriler
              </a>
              <a href="#elciler" className="rounded-full bg-background/80 px-3 py-1.5 transition-colors hover:text-primary">
                Şehir Elçileri
              </a>
              <a href="#destek" className="rounded-full bg-background/80 px-3 py-1.5 transition-colors hover:text-primary">
                Destek
              </a>
            </nav>
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} />
    </section>
  );
};

export default HeroSection;
