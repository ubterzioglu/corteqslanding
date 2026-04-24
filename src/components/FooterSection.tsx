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
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
            Yakında Açılıyoruz!
          </h2>
          <p className="mx-auto mb-6 max-w-4xl overflow-x-auto whitespace-nowrap text-lg text-background/60">
            Dünyanın neresinde olursanız olun, Corteqs Diaspora Connect sizi güçlü bir toplulukla buluşturacak.
          </p>

          <a
            href="mailto:info@corteqs.net"
            className="inline-flex items-center gap-2 mb-8 px-5 py-3 rounded-xl bg-background/10 border border-background/20 hover:bg-background/15 transition-colors"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-primary font-bold text-lg">info@corteqs.net</span>
          </a>

          <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-md transition-all hover:bg-accent/90"
            >
              Kategorine Kayıt ve Takip İçin →
            </button>
            <button
              onClick={() => setSupportFormOpen(true)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500"
            >
              Teknik, Org, Yatırım Görüşmeleri için →
            </button>
            <a
              href="https://chat.whatsapp.com/IOpBgZK29CQEhhdOd5hUAD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#1ebe5d]"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Grubuna Katıl →
            </a>
          </div>

          <div className="mt-8">
            <p className="text-background/70 text-sm mb-3">Bizi Sosyal Medyada Takip Edin</p>
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
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-background/40 text-sm">
              © {new Date().getFullYear()} CorteQS bir Qualtron Sinclair ve Akçakanat-Terzioğlu Girişimidir. Tüm hakları saklıdır.
            </div>
            <Link to="/hakkimizda" className="text-primary hover:underline text-sm font-semibold">
              Hakkımızda
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <a href="mailto:info@corteqs.net" className="text-primary hover:underline text-sm font-semibold">
              info@corteqs.net
            </a>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-background/10 transition-colors"
              title="Kopyala"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-background/50 hover:text-primary" />}
            </button>
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} />
      <RegisterInterestForm open={supportFormOpen} onOpenChange={setSupportFormOpen} mode="support" />
    </footer>
  );
};

export default FooterSection;
