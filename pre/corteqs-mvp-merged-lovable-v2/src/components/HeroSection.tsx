import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useDiaspora } from "@/contexts/DiasporaContext";
import { cn } from "@/lib/utils";

const actionCardBase =
  "group relative w-full overflow-hidden rounded-[1.45rem] border px-4 py-3 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-30px_rgba(15,23,42,0.44)]";

const HeroSection = () => {
  const { t } = useDiaspora();
  const h = t.hero;

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-white pt-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-y-0 right-0 hidden w-[56%] bg-no-repeat lg:block"
          style={{
            backgroundImage: "url('/newera.png')",
            backgroundPosition: "right center",
            backgroundSize: "contain",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-5 md:py-6">
        <div className="max-w-[770px] lg:max-w-[540px] lg:-translate-y-10 xl:max-w-[590px] xl:-translate-y-12">
          <div className="mb-3 rounded-[2rem] border border-white/80 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.93)_38%,rgba(255,255,255,0.82)_62%,rgba(255,255,255,0.58)_82%,rgba(255,255,255,0.18)_100%)] px-4 py-4 shadow-[0_20px_55px_-36px_rgba(15,23,42,0.32)] backdrop-blur-xl sm:px-5 lg:px-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-turquoise/22 bg-[linear-gradient(90deg,rgba(255,255,255,0.86),rgba(220,247,242,0.92),rgba(255,255,255,0.42))] px-4 py-2 shadow-sm">
              <Globe className="h-4 w-4 text-turquoise" />
              <span className="text-sm font-semibold text-turquoise sm:text-[0.95rem]">{h.badge}</span>
            </div>

            <div className="flex items-center gap-4 lg:gap-5">
              <img
                src="/logo.png"
                alt="Corteqs"
                className="h-20 w-20 shrink-0 object-contain drop-shadow-[0_18px_30px_rgba(249,115,22,0.14)] sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                loading="eager"
              />

              <div className="min-w-0">
                <h1 className="max-w-[11ch] text-[1.9rem] font-extrabold leading-[0.94] tracking-[-0.045em] text-foreground sm:text-[2.45rem] lg:text-[2.85rem]">
                  {h.title}
                  <span className="text-gradient-primary">{h.titleHighlight}</span>
                  {h.titleEnd}
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-[770px] whitespace-nowrap text-[0.7rem] leading-none text-muted-foreground/88 sm:text-[0.74rem]">
              Danışmanlar, dernekler, etkinlikler ve AI destekli araçlarla diasporadaki yaşamınızı kolaylaştırın.
            </p>
          </div>

          <div className="max-w-[770px] lg:max-w-[540px] xl:max-w-[590px] space-y-2.5">
            <Link to="/auth" className="block">
              <div
                className={cn(
                  actionCardBase,
                  "border-turquoise/38 bg-[linear-gradient(135deg,#11385f_0%,#1b6288_55%,#36bcc7_110%)] text-primary-foreground",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[0.78rem] font-bold leading-tight sm:text-[0.84rem]">Ücretsiz Kayıt Ol!</p>
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-primary-foreground/80 sm:text-[11px]">
                      Hesabını aç, profilini düzenle! Diasporanın bir parçası ol!
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Link to="/whatsapp-groups" className="block">
                <div
                  className={cn(
                    actionCardBase,
                    "border-emerald-300/52 bg-[linear-gradient(135deg,#92d65c_0%,#b5e15d_52%,#d9ef8f_100%)] text-slate-900",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-[0.78rem] font-bold leading-tight sm:text-[0.84rem]">WhatsApp Grubuna Katıl</p>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-800/78 sm:text-[11px]">Topluluklar, şehirler, hızlı bağlantılar</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/founders-1000" className="block">
                <div
                  className={cn(
                    actionCardBase,
                    "border-amber-300/58 bg-[linear-gradient(135deg,#ffd35a_0%,#ffe07b_55%,#fff1a8_100%)] text-slate-900",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-[0.78rem] font-bold leading-tight sm:text-[0.84rem]">Founding 1000</p>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-800/76 sm:text-[11px]">Danışmanlar, işletmeler, kuruluşlar, vloggerlar</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/blog-contest" className="block">
                <div
                  className={cn(
                    actionCardBase,
                    "border-orange-300/54 bg-[linear-gradient(135deg,#f26a21_0%,#f68d33_56%,#f7a55b_100%)] text-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-[0.78rem] font-bold leading-tight sm:text-[0.84rem]">Blogger Yarışması</p>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-white/82 sm:text-[11px]">Yaz, yayınla, ödül havuzuna gir.</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/vlogger-contest" className="block">
                <div
                  className={cn(
                    actionCardBase,
                    "border-sky-300/48 bg-[linear-gradient(135deg,#1887b4_0%,#2676a1_54%,#315b91_100%)] text-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-[0.78rem] font-bold leading-tight sm:text-[0.84rem]">Vlogger Yarışması</p>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-white/82 sm:text-[11px]">Video üret, kitleni büyüt, öne çık.</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
