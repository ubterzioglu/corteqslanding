import { useState } from "react";
import { Mail, Copy, Check, MessageCircle, Linkedin, Instagram, Twitter } from "lucide-react";
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
          <p className="text-background/60 text-lg max-w-xl mx-auto mb-6">
            Dünyanın neresinde olursanız olun, Corteqs Diaspora Connect sizi güçlü bir toplulukla buluşturacak.
          </p>

          {/* Prominent email */}
          <a
            href="mailto:info@corteqs.net"
            className="inline-flex items-center gap-2 mb-8 px-5 py-3 rounded-xl bg-background/10 border border-background/20 hover:bg-background/15 transition-colors"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-primary font-bold text-lg">info@corteqs.net</span>
          </a>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 transition-all shadow-md"
            >
              Kategorine Kayıt ve Takip İçin →
            </button>
            <button
              onClick={() => setSupportFormOpen(true)}
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-background/10 text-background border border-background/20 font-bold text-sm hover:bg-background/20 transition-all"
            >
              Teknik, Org, Yatırım Görüşmeleri için →
            </button>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-3 flex justify-center">
            <a
              href="https://chat.whatsapp.com/L3FeJVRpPIb75bQGG7M3oN?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#25D366] text-white font-bold text-sm hover:bg-[#1ebe5d] transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Grubuna Katıl →
            </a>
          </div>

          {/* Sosyal Medya CTA */}
          <div className="mt-8">
            <p className="text-background/70 text-sm mb-3">Bizi Sosyal Medyada Takip Edin</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://www.linkedin.com/company/corteqs-global"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CorteQS LinkedIn"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0A66C2] text-white font-semibold hover:bg-[#0a5cb0] transition-all shadow-md"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/corteqssocial/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CorteQS Instagram"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white font-semibold hover:opacity-90 transition-all shadow-md"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
              <a
                href="https://x.com/corteqsx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CorteQS X"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 transition-all shadow-md"
              >
                <Twitter className="w-5 h-5" />
                X
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-background/40 text-sm">
            © {new Date().getFullYear()} CorteQS bir Qualtron Sinclair ve Akçakanat-Terzioğlu Girişimidir. Tüm hakları saklıdır.
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
