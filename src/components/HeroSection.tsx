import { useState } from "react";
import { Link } from "react-router-dom";
import heroLandmarks from "@/assets/hero-landmarks-watercolor.png";
import RegisterInterestForm from "./RegisterInterestForm";

const HeroSection = () => {
  const [formOpen, setFormOpen] = useState(false);
  const heroCardBaseClass =
    "relative inline-flex min-h-16 w-full items-center justify-center rounded-xl border px-8 py-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:saturate-125";

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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-card to-secondary/30">
      {/* Hero illustration — sits between logo bottom and CTA bottom */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <img
          src={heroLandmarks}
          alt="CorteQS Diaspora Connect - Almanya ve Avrupa'daki Türk Diaspora Ağı ve Şehir Rehberi"
          className="absolute right-[0%] top-[15%] h-[58%] w-auto max-w-[64%] object-contain [filter:brightness(0.98)_saturate(1.02)_contrast(1.0)] [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_94%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_94%)]"
          width={1480}
          height={860}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <div className="mb-4 flex flex-col items-start gap-5 md:flex-row md:items-center">
              <img src="/logo.png" alt="CorteQS Logo" className="w-full max-w-[220px] shrink-0 md:max-w-[240px]" />
              <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Türk Diasporasını Birleştiren{" "}
                <span className="text-accent">Platform</span>
              </h1>
            </div>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground hero-description">
              Dünyanın her yerindeki Türkleri tek çatı altında buluşturur.
              <br />
              Bağlan, keşfet, birlikte büyü!
              <br />
              Ücretsiz kayıt ol! Ağını genişlet!
            </p>

            <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
              <a
                href="#kaydol"
                className={`${heroCardBaseClass} text-lg font-semibold`}
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
                className={`${heroCardBaseClass} text-lg font-semibold`}
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

            <div className="mt-6 flex flex-col gap-3 max-w-xl">
              <Link
                to="/founding-1000"
                className={`${heroCardBaseClass} group relative flex-col text-base font-semibold`}
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
                  className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-md"
                  style={{ background: "#0E2238", color: "#FFD43A" }}
                >
                  Erken Erişim
                </span>
                <span className="relative z-10">🌍 Founding 1000'e Katıl →</span>
                <span className="relative z-10 mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#0E2238]/85">
                  Danışmanlar · İşletmeler · Kuruluşlar · Vloggerlar
                </span>
              </Link>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  to="/blogger-yarismasi"
                  className={`${heroCardBaseClass} text-base font-semibold`}
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
                  className={`${heroCardBaseClass} text-base font-semibold`}
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

          <div className="relative hidden min-h-[520px] lg:block" aria-hidden>
            {/* Spacer column — hero image is now a full-width background */}
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} />
    </section>
  );
};

export default HeroSection;
