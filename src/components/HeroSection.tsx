import { useState } from "react";
import { Link } from "react-router-dom";
import heroLogo from "../../newlogo.png";
import heroLandmarks from "../../denemeremake.png";
import RegisterInterestForm from "./RegisterInterestForm";

const HeroSection = () => {
  const [formOpen, setFormOpen] = useState(false);
  const heroCtaClass =
    "relative inline-flex min-h-[52px] w-full items-center justify-center rounded-xl border px-4 py-2 text-center text-[12px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:saturate-125 md:text-[13px]";
  const heroCardStyles = {
    register: {
      background: "linear-gradient(135deg, #123B5A 0%, #195379 54%, #226A92 100%)",
      borderColor: "rgba(25, 83, 121, 0.5)",
      color: "#ffffff",
      boxShadow: "0 16px 34px rgba(18, 59, 90, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
    },
    whatsapp: {
      background: "linear-gradient(135deg, #5FAD76 0%, #78BD76 52%, #96CC79 100%)",
      borderColor: "rgba(95, 173, 118, 0.48)",
      color: "#103D42",
      boxShadow: "0 16px 34px rgba(95, 173, 118, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
    },
    addWhatsapp: {
      background: "linear-gradient(135deg, #1F9672 0%, #27AC85 52%, #42C29B 100%)",
      borderColor: "rgba(31, 150, 114, 0.48)",
      color: "#ffffff",
      boxShadow: "0 16px 34px rgba(31, 150, 114, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
    },
    addContent: {
      background: "linear-gradient(135deg, #C65368 0%, #DD6A6B 52%, #ED8867 100%)",
      borderColor: "rgba(198, 83, 104, 0.48)",
      color: "#ffffff",
      boxShadow: "0 16px 34px rgba(198, 83, 104, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
    },
    about: {
      background: "linear-gradient(135deg, #2A6D88 0%, #3588A0 52%, #49A9B7 100%)",
      borderColor: "rgba(53, 136, 160, 0.46)",
      color: "#ffffff",
      boxShadow: "0 16px 34px rgba(42, 109, 136, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
    },
    founders: {
      background: "linear-gradient(135deg, #D86B30 0%, #E8863A 52%, #F2A04A 100%)",
      borderColor: "rgba(216, 107, 48, 0.46)",
      color: "#ffffff",
      boxShadow: "0 16px 34px rgba(216, 107, 48, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
    },
  } as const;

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-gradient-to-br from-background via-card to-secondary/30 pt-8 lg:pt-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[-10%] top-[8%] h-56 w-56 rounded-full bg-primary/8 blur-3xl lg:h-80 lg:w-80" />
        <div className="absolute bottom-[6%] right-[-8%] h-64 w-64 rounded-full bg-accent/10 blur-3xl lg:h-96 lg:w-96" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1780px] px-4 py-12 md:px-6 md:py-14 2xl:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] 2xl:gap-12">
          <div className="max-w-[760px] lg:-translate-y-4 xl:-translate-y-6 2xl:-translate-y-8">
            <div className="flex max-w-[36rem] flex-col justify-center rounded-[2rem] border border-white/80 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.93)_38%,rgba(255,255,255,0.82)_62%,rgba(255,255,255,0.58)_82%,rgba(255,255,255,0.18)_100%)] p-4 shadow-[0_20px_55px_-36px_rgba(15,23,42,0.32)] backdrop-blur-xl sm:p-5 lg:max-w-[34rem] lg:px-6 2xl:max-w-[38rem]">
              <div className="mb-3 flex flex-col items-start gap-3 md:flex-row md:items-center">
                <img src={heroLogo} alt="CorteQS Logo" className="w-full max-w-[152px] shrink-0 md:max-w-[176px]" />
                <h1 className="text-2xl font-extrabold leading-[0.95] text-foreground md:text-4xl 2xl:text-[2.75rem]">
                  Türk Diasporasını Birleştiren{" "}
                  <span className="text-accent">Platform</span>
                </h1>
              </div>
              <p className="hero-description mb-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-base 2xl:max-w-xl 2xl:text-[1.05rem]">
                Dünyanın her yerindeki Türkleri tek çatı altında buluşturur.
                <br />
                Bağlan, keşfet, birlikte büyü!
                <br />
                Ücretsiz kayıt ol! Ağını genişlet!
              </p>
            </div>

            <div className="mt-3 max-w-[760px] space-y-2.5 lg:max-w-[540px] xl:max-w-[590px] 2xl:max-w-[640px]">
              <div className="grid w-full max-w-lg gap-2.5 sm:grid-cols-2 2xl:max-w-[38rem]">
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

              <div className="flex max-w-lg flex-col gap-2.5 2xl:max-w-[38rem]">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 2xl:max-w-[38rem]">
                  <Link
                    to="/addwa"
                    className={`${heroCtaClass} px-4`}
                    style={heroCardStyles.addWhatsapp}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 opacity-100"
                      aria-hidden
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0) 100%)",
                      }}
                    />
                    <span className="relative z-10">💬 Whatsapp Grubunu Ekle! →</span>
                  </Link>
                  <span
                    aria-disabled="true"
                    className={`${heroCtaClass} cursor-not-allowed px-4 pr-[6.2rem]`}
                    style={heroCardStyles.addContent}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 opacity-100"
                      aria-hidden
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0) 100%)",
                      }}
                    />
                    <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.14em] text-rose-700 shadow-sm sm:text-[7.5px]">
                      Yakında!
                    </span>
                    <span className="relative z-10">✨ İçerik Ekle!</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 2xl:max-w-[38rem]">
                  <a
                    href="#geo-content-title"
                    className={`${heroCtaClass} font-bold`}
                    style={heroCardStyles.about}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 opacity-100"
                      aria-hidden
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 42%, rgba(255,255,255,0) 100%)",
                      }}
                    />
                    <span className="relative z-10">CorteQS Nedir →</span>
                  </a>
                  <a
                    href="#founders-landing"
                    className={`${heroCtaClass} font-bold`}
                    style={heroCardStyles.founders}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 opacity-100"
                      aria-hidden
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 42%, rgba(255,255,255,0) 100%)",
                      }}
                    />
                    <span className="relative z-10">Biz Kimiz →</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-[1180px] xl:max-w-[1320px] 2xl:max-w-[1460px]">
              <img
                src={heroLandmarks}
                alt=""
                className="h-auto w-full object-contain object-right"
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
