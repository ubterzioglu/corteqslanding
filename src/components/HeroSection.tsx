import { useState } from "react";
import { Link } from "react-router-dom";
import heroLogo from "../../newlogo.png";
import heroLandmarks from "../../denemeremake.png";
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
    addWhatsapp: {
      background: "linear-gradient(135deg, #1FAF77 0%, #28C487 52%, #55D6A4 100%)",
      borderColor: "rgba(23, 148, 101, 0.48)",
      color: "#ffffff",
      boxShadow: "0 16px 36px rgba(31, 175, 119, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
    },
    addContent: {
      background: "linear-gradient(135deg, #C24163 0%, #DE5B6D 52%, #F08A67 100%)",
      borderColor: "rgba(194, 65, 99, 0.48)",
      color: "#ffffff",
      boxShadow: "0 16px 36px rgba(194, 65, 99, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
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
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-gradient-to-br from-background via-card to-secondary/30 pt-8 lg:pt-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[-10%] top-[8%] h-56 w-56 rounded-full bg-primary/8 blur-3xl lg:h-80 lg:w-80" />
        <div className="absolute bottom-[6%] right-[-8%] h-64 w-64 rounded-full bg-accent/10 blur-3xl lg:h-96 lg:w-96" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1780px] px-4 py-12 md:px-6 md:py-14 2xl:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] 2xl:gap-12">
          <div className="max-w-[760px] lg:-translate-y-4 xl:-translate-y-6 2xl:-translate-y-8">
            <div className="mb-3 flex max-w-lg">
              <span
                aria-disabled="true"
                className={`${heroFeaturedCardClass} relative flex-col overflow-hidden rounded-[1.35rem] text-[12px] font-semibold md:text-[13px] 2xl:max-w-[38rem]`}
                style={{
                  background:
                    "linear-gradient(135deg, #fff6f6 0%, #ffffff 26%, #ffe3e3 58%, #f6b1b1 100%)",
                  borderColor: "rgba(220, 38, 38, 0.28)",
                  color: "#7f1d1d",
                  boxShadow:
                    "0 18px 40px rgba(220, 38, 38, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.85)",
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-100"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.18) 34%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <span
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90"
                  aria-hidden
                />
                <span className="absolute right-3 top-3 rounded-full bg-[linear-gradient(135deg,#b91c1c_0%,#991b1b_100%)] px-3 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-white shadow-[0_10px_20px_rgba(153,27,27,0.28)] sm:text-[8.5px]">
                  Yakında!
                </span>
                <span className="relative z-10 text-[0.95rem] font-black tracking-[0.03em] text-[#b91c1c]">
                  19 Mayıs Etkinlikleri
                </span>
                <span className="relative z-10 mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#7f1d1d]/80">
                  Premium Etkinlik Akışı Hazırlanıyor
                </span>
              </span>
            </div>
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
                <Link
                  to="/founding-1000"
                  className={`${heroFeaturedCardClass} group relative flex-col text-[12px] font-semibold md:text-[13px] 2xl:max-w-[38rem]`}
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
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 2xl:max-w-[38rem]">
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
                  <span
                    aria-disabled="true"
                    className={`${heroCtaClass} cursor-not-allowed px-4 pr-[6.2rem]`}
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
                    <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.14em] text-emerald-700 shadow-sm sm:text-[7.5px]">
                      Yakında!
                    </span>
                    <span className="relative z-10">💬 Whatsapp Grubunu Ekle!</span>
                  </span>
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
