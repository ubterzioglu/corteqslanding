import { useState } from "react";
import { Mail, Copy, Check, MessageCircle, Linkedin, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import RegisterInterestForm from "./RegisterInterestForm";

const FooterSection = () => {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [supportFormOpen, setSupportFormOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("info@corteqs.net");
    setCopied(true);
    toast({ title: "Kopyalandı!", description: "E-posta adresi panoya kopyalandı." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="relative overflow-hidden py-16 lg:py-20">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/videos/footer-community.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(9,36,38,0.88),rgba(12,24,31,0.72),rgba(0,0,0,0.82))]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,hsl(var(--primary)/0.34),transparent_32%),radial-gradient(circle_at_82%_70%,hsl(var(--accent)/0.28),transparent_34%)]" aria-hidden />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/20 bg-white/10 px-5 py-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-8 lg:px-12">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Yakında Açılıyoruz!
            </h2>
            <p className="mx-auto mt-4 mb-6 max-w-4xl text-base leading-relaxed text-white/75 md:text-lg">
              Dünyanın neresinde olursanız olun, Corteqs Diaspora Connect sizi güçlü bir toplulukla buluşturacak.
            </p>

            <a
              href="mailto:info@corteqs.net"
              className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 transition-colors hover:bg-white/15"
            >
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-primary">info@corteqs.net</span>
            </a>

            <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
              <button
                onClick={() => setFormOpen(true)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
              >
                Kategorine Kayıt ve Takip İçin →
              </button>
              <button
                onClick={() => setSupportFormOpen(true)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500"
              >
                Teknik, Org, Yatırım Görüşmeleri için →
              </button>
              <a
                href="https://chat.whatsapp.com/IOpBgZK29CQEhhdOd5hUAD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#1ebe5d]"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Grubuna Katıl →
              </a>
            </div>

            <div className="mt-8">
              <p className="text-sm text-white/70 mb-3">Bizi Sosyal Medyada Takip Edin</p>
              <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                <a
                  href="https://www.linkedin.com/company/corteqs-global"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CorteQS LinkedIn"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#0a5cb0]"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
                <a
                  href="https://www.facebook.com/corteqs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CorteQS Facebook"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#166fe5]"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/corteqsturk"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CorteQS Instagram"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] px-4 py-3 font-semibold text-white shadow-md transition-all hover:opacity-90"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
                <a
                  href="https://x.com/turksdiaspora"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CorteQS X"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-neutral-800"
                >
                  <Twitter className="w-5 h-5" />
                  X
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 md:flex-row">
            <div className="flex flex-col items-center gap-3 md:flex-row md:gap-4">
              <div className="text-sm text-white/55">
                © {new Date().getFullYear()} CorteQS bir Qualtron Sinclair ve Akçakanat-Terzioğlu Girişimidir. Tüm hakları saklıdır.
              </div>
              <Link to="/hakkimizda" className="text-sm font-semibold text-primary hover:underline">
                Hakkımızda
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <a href="mailto:info@corteqs.net" className="text-sm font-semibold text-primary hover:underline">
                info@corteqs.net
              </a>
              <button
                onClick={handleCopy}
                className="rounded p-1 transition-colors hover:bg-white/10"
                title="Kopyala"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/55 hover:text-primary" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} />
      <RegisterInterestForm open={supportFormOpen} onOpenChange={setSupportFormOpen} mode="support" />
    </footer>
  );
};

export default FooterSection;
