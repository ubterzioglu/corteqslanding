import { useState } from "react";
import cityAmbassador from "@/assets/city-ambassador.jpg";
import RegisterInterestForm from "./RegisterInterestForm";

const AmbassadorSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section id="elciler" className="bg-background py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="relative order-2 overflow-hidden rounded-[8px] border border-white/60 bg-white/60 p-3 shadow-[0_22px_60px_rgba(31,40,52,0.12)] lg:order-1">
            <img
              src={cityAmbassador}
              alt="CorteQS şehir elçisi - yerel diaspora temsilcisi"
              className="w-full rounded-[8px] object-cover [filter:brightness(0.95)_saturate(0.85)_contrast(0.95)]"
              loading="lazy"
              width={1200}
              height={800}
            />
            <div className="pointer-events-none absolute inset-3 rounded-[8px] bg-gradient-to-t from-foreground/15 via-transparent to-transparent" />
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
              className="inline-flex items-center justify-center rounded-[8px] bg-accent px-8 py-4 text-lg font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
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
