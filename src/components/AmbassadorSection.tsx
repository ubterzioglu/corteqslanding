import { useState } from "react";
import cityAmbassador from "@/assets/city-ambassador.jpg";
import RegisterInterestForm from "./RegisterInterestForm";

const AmbassadorSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section id="elciler" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={cityAmbassador}
              alt="CorteQS şehir elçisi - yerel diaspora temsilcisi"
              className="w-full object-cover [filter:brightness(0.95)_saturate(0.85)_contrast(0.95)]"
              loading="lazy"
              width={1200}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-card/40 via-card/10 to-primary/15 mix-blend-soft-light" />
            <div className="absolute inset-0 bg-card/15" />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Şehir Elçileri</span>
            <p className="text-muted-foreground text-base mt-2 mb-1 italic">CorteQS'in topluluk gücünü arkanıza alın</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Şehrinizin Sesi Olun
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Corteqs Diaspora Connect şehir elçileri, bulundukları şehirlerde diaspora topluluğunu temsil eden, yerel etkinlikler organize eden ve ağı büyüten gönüllü liderlerdir.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Şehrinizde diaspora ağını temsil edin",
                "Yerel etkinlikler ve buluşmalar organize edin",
                "İş fırsatlarını topluluğunuzla paylaşın",
                "Küresel ağın yerel bağlantı noktası olun",
                "İşbirliği için Kayıt bırakın size ulaşalım",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-accent text-accent-foreground font-semibold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
            >
              Elçi Olarak Kayıt Bırak / Takip Et
            </button>
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} defaultCategory="sehir-elcisi" />
    </section>
  );
};

export default AmbassadorSection;
