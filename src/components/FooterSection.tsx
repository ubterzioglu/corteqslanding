import { useState } from "react";
import { Mail, Copy, Check, MessageCircle, Linkedin, Instagram } from "lucide-react";
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
          <p className="text-3xl md:text-4xl font-bold text-background mb-4">
            Yakında Açılıyoruz!
          </p>
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-all shadow-lg"
            >
              Kategorine Kayıt ve Takip İçin →
            </button>
            <button
              onClick={() => setSupportFormOpen(true)}
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-background/10 text-background border border-background/20 font-bold text-lg hover:bg-background/20 transition-all"
            >
              Teknik, Org, Yatırım Görüşmeleri için →
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a
              href="https://chat.whatsapp.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20bd5a] transition-all shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Topluluğuna Katıl
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <a
              href="https://www.linkedin.com/company/corteqs-global"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] text-white text-sm font-semibold hover:bg-[#004182] transition-all"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/corteqs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] text-white text-sm font-semibold hover:opacity-90 transition-all"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-background/40 text-sm">
            © {new Date().getFullYear()} CorteQS - bir Qualtron Sinclair ve Akçakanat-Terzioğlu Girişimidir. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-4 text-background/40 text-xs">
            <a href="mailto:info@corteqs.net" className="hover:text-primary transition-colors">İletişim</a>
            <a href="#hakkinda" className="hover:text-primary transition-colors">Hakkımızda</a>
            <a href="#destek" className="hover:text-primary transition-colors">Destek</a>
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
