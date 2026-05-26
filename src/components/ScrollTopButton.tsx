import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Yukarı çık"
      className={[
        "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl",
        "border border-white/30 text-white shadow-[0_18px_40px_rgba(20,116,126,0.24)] backdrop-blur-xl",
        "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_22px_44px_rgba(20,116,126,0.34)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
        "before:pointer-events-none before:absolute before:inset-[1px] before:rounded-[15px]",
        "before:bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.03)_100%)]",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
      style={{
        background:
          "linear-gradient(135deg, rgba(12,106,112,0.98) 0%, rgba(17,145,138,0.96) 54%, rgba(50,193,168,0.92) 100%)",
      }}
    >
      <span
        className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_58%)]"
        aria-hidden
      />
      <span
        className="absolute bottom-0 right-0 h-5 w-5 rounded-tl-2xl rounded-br-2xl bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(116,255,224,0.38))]"
        aria-hidden
      />
      <span className="relative z-10 flex flex-col items-center leading-none">
        <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        <span className="mt-1 text-[10px] font-black tracking-[0.24em]">UP</span>
      </span>
    </button>
  );
};

export default ScrollTopButton;
