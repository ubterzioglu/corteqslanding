import { useState } from "react";
import { Heart, Rocket, Handshake } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";

const SupportSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section id="destek" className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Projeye Destek</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Diaspora Connect'e Destek Olun
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bu proje, dünya genelindeki Türk diasporasını birleştirmek için büyüyor. Siz de teknik, organizasyonel veya yatırım desteğiyle bu vizyonun bir parçası olun.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="p-8 rounded-2xl bg-background border border-border text-center">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Rocket className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Teknik Destek</h3>
            <p className="text-muted-foreground text-sm">Yazılım, tasarım, altyapı ve teknoloji alanlarında katkıda bulunun.</p>
          </div>
          <div className="p-8 rounded-2xl bg-background border border-border text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Handshake className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Organizasyonel Destek</h3>
            <p className="text-muted-foreground text-sm">İş birlikleri, ağ genişletme ve topluluk yönetimi ile destek olun.</p>
          </div>
          <div className="p-8 rounded-2xl bg-background border border-border text-center">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Yatırım</h3>
            <p className="text-muted-foreground text-sm">Projenin büyümesi için yatırım fırsatlarını değerlendirin.</p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
          >
            Projeye Destek Vermek İstiyorum →
          </button>
          <p className="text-muted-foreground text-sm">
            veya bize yazın: <a href="mailto:info@corteqs.net" className="text-primary font-semibold hover:underline text-base">info@corteqs.net</a>
          </p>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} mode="support" />
    </section>
  );
};

export default SupportSection;
