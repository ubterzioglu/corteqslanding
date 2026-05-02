import { useState } from "react";
import { Link } from "react-router-dom";
import heroLandmarks from "@/assets/hero-landmarks-watercolor.png";
import heroLogo from "../../logo.png";
import RegisterInterestForm from "./RegisterInterestForm";

const HeroSection = () => {
  const [formOpen, setFormOpen] = useState(false);
  const heroCtaClass =
    "relative inline-flex min-h-[52px] w-full items-center justify-center rounded-xl border px-4 py-2 text-center text-[12px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:saturate-125 md:text-[13px]";
  const heroFeaturedCardClass =
    "relative inline-flex min-h-[62px] w-full items-center justify-center rounded-xl border px-4 py-2 text-center transition-all duration-300 hover:-translate-y-0.5 hover:saturate-125";

  const heroCardStyles = {
    register: {
      background: "linear-gradient(135deg, #0C3558 0%, #15527F 55%, #1A6A94 100%)",
      borderColor: "rgba(18, 91, 132, 0.55)",
      color: "#ffffff",
      boxShadow: "0 16px 36px rgba(12, 53, 88, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
    },
    whatsapp: {
      background: "linear-gradient(135deg, #68B66A 0%, #8BC25B 52%, #B6CB6C 100%)",
      borderColor: "rgba(126, 181, 94, 0.52)",
      color: "#10364C",
      boxShadow: "0 16px 36px rgba(109, 174, 96, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    },
    founding: {
      background: "linear-gradient(135deg, #FFC11F 0%, #FFD43A 52%, #FFE56B 100%)",
      borderColor: "rgba(245, 191, 31, 0.62)",
      color: "#0E2238",
      boxShadow: "0 18px 40px rgba(230, 180, 28, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
    },
    blogger: {
      background: "linear-gradient(135deg, #E97A1F 0%, #F06B2E 52%, #E85A34 100%)",
      borderColor: "rgba(233, 110, 42, 0.55)",
      color: "#ffffff",
      boxShadow: "0 16px 36px rgba(231, 103, 42, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
    },
    vlogger: {
      background: "linear-gradient(135deg, #1A94AD 0%, #19789A 52%, #235E88 100%)",
      borderColor: "rgba(26, 137, 166, 0.55)",
      color: "#ffffff",
      boxShadow: "0 16px 36px rgba(24, 123, 151, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
    },
    contest: {
      background: "linear-gradient(135deg, #15608C 0%, #0D3759 100%)",
      borderColor: "#15608C",
      color: "#ffffff",
      boxShadow: "0 14px 30px rgba(21, 96, 140, 0.22)",
    },
    waitlist: {
      background: "linear-gradient(135deg, #95BF54 0%, #ED6F1E 100%)",
      borderColor: "#D98532",
      color: "#082947",
      boxShadow: "0 14px 30px rgba(217, 133, 50, 0.24)",
    },
  } as const;

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-gradient-to-br from-background via-card to-secondary/30">
      <div className="container relative z-10 mx-auto px-4 py-14 md:py-16">
        <div className="grid items-stretch gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col justify-center">
            <div className="mb-3 flex flex-col items-start gap-3 md:flex-row md:items-center">
              <img src={heroLogo} alt="CorteQS Logo" className="w-full max-w-[152px] shrink-0 md:max-w-[176px]" />
              <h1 className="text-2xl font-extrabold leading-[0.95] text-foreground md:text-4xl">
                Türk Diasporasını Birleştiren{" "}
                <span className="text-accent">Platform</span>
              </h1>
            </div>
            <p className="hero-description mb-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-base">
              Dünyanın her yerindeki Türkleri tek çatı altında buluşturur.
              <br />
              Bağlan, keşfet, birlikte büyü!
              <br />
              Ücretsiz kayıt ol! Ağını genişlet!
            </p>

            <div className="grid w-full max-w-lg gap-2.5 sm:grid-cols-2">
              <a
                href="#kaydol"
                className={`${heroCtaClass} whitespace-nowrap`}
                style={heroCardStyles.register}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-100"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 42%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <span
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/35"
                  aria-hidden
                />
                <span className="relative z-10">Ücretsiz Kayıt Ol →</span>
              </a>
              <a
                href="https://chat.whatsapp.com/IOpBgZK29CQEhhdOd5hUAD"
                target="_blank"
                rel="noopener noreferrer"
                className={`${heroCtaClass} whitespace-nowrap`}
                style={heroCardStyles.whatsapp}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-100"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <span
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/30"
                  aria-hidden
                />
                <span className="relative z-10">WhatsApp Grubuna Katıl →</span>
              </a>
            </div>

            <div className="mt-2.5 flex max-w-lg flex-col gap-2.5">
              <Link
                to="/founding-1000"
                className={`${heroFeaturedCardClass} group relative flex-col text-[12px] font-semibold md:text-[13px]`}
                style={heroCardStyles.founding}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-100"
                  aria-hidden
                  style={{
                    background:
                    "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <span
                  className="absolute -right-1 -top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-md"
                  style={{ background: "#0E2238", color: "#FFD43A" }}
                >
                  Erken Erişim
                </span>
                <span className="relative z-10">🌍 Founding 1000'e Katıl →</span>
                <span className="relative z-10 mt-1 text-[8px] font-semibold uppercase tracking-wide text-[#0E2238]/85 md:text-[9px]">
                  Danışmanlar · İşletmeler · Kuruluşlar · Vloggerlar
                </span>
              </Link>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Link
                  to="/blogger-yarismasi"
                  className={heroCtaClass}
                  style={heroCardStyles.blogger}
                >
                  <span
                    className="pointer-events-none absolute inset-0 opacity-100"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0) 100%)",
                    }}
                  />
                  <span className="relative z-10">✍️ Blogger Yarışması →</span>
                </Link>
                <Link
                  to="/vlogger-yarismasi"
                  className={heroCtaClass}
                  style={heroCardStyles.vlogger}
                >
                  <span
                    className="pointer-events-none absolute inset-0 opacity-100"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0) 100%)",
                    }}
                  />
                  <span className="relative z-10">🎥 Vlogger Yarışması →</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex lg:h-full lg:items-stretch" aria-hidden>
            <div className="flex h-full w-full items-center justify-center rounded-[2rem]">
              <img
                src={heroLandmarks}
                alt="CorteQS Diaspora Connect - Almanya ve Avrupa'daki Türk Diaspora Ağı ve Şehir Rehberi"
                className="h-full w-full object-contain [filter:brightness(0.98)_saturate(1.02)_contrast(1.0)] [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_94%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_94%)]"
                width={1480}
                height={860}
              />
            </div>
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} />
    </section>
  );
};

export default HeroSection;
