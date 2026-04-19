import { useState } from "react";
import bloggerVlogger from "@/assets/blogger-vlogger.jpg";
import RegisterInterestForm from "./RegisterInterestForm";

const BloggerSection = () => {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="bg-section-warm py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">İçerik Üreticileri</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Blogger & Vlogger Ağı
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Diaspora hikayelerini dünyaya duyuran içerik üreticilerini arıyoruz. Blog yazarları, YouTuber'lar, podcaster'lar ve sosyal medya influencer'ları — sesinizi Corteqs Diaspora Connect ile güçlendirin.
            </p>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              {[
                { title: "İçerik Desteği", desc: "Profesyonel içerik üretim desteği" },
                { title: "Ağ Erişimi", desc: "Geniş diaspora ağına erişim" },
                { title: "Etkinlikler", desc: "Özel etkinlik ve buluşmalar" },
                { title: "İş Birlikleri", desc: "Marka ve proje iş birlikleri" },
              ].map((item) => (
                <div key={item.title} className="rounded-[8px] border border-border/75 bg-card/88 p-4 shadow-sm">
                  <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mb-6 rounded-[8px] border border-accent/20 bg-accent/10 p-4">
              <p className="text-foreground font-semibold">🏆 Ödüllü Blog Yazısı Yarışmamız Başlıyor!</p>
              <p className="text-sm text-muted-foreground">Bizi takip edin, yarışma detaylarını kaçırmayın.</p>
            </div>
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center justify-center rounded-[8px] bg-accent px-8 py-4 text-lg font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
            >
              Kayıt Bırak / Takip Et
            </button>
          </div>
          <div className="relative overflow-hidden rounded-[8px] border border-white/60 bg-white/60 p-3 shadow-[0_22px_60px_rgba(31,40,52,0.12)]">
            <img
              src={bloggerVlogger}
              alt="Blogger ve Vlogger"
              className="w-full rounded-[8px] object-cover [filter:brightness(0.95)_saturate(0.85)_contrast(0.95)]"
              loading="lazy"
              width={1200}
              height={800}
            />
            <div className="pointer-events-none absolute inset-3 rounded-[8px] bg-gradient-to-t from-foreground/15 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} defaultCategory="blogger-vlogger" />
    </section>
  );
};

export default BloggerSection;
