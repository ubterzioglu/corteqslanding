import { useState } from "react";
import { Rocket, Handshake, CircuitBoard, Crown, Sparkles, Star, Award, Check } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";
import BackerForm from "./BackerForm";

type MiniTier = {
  amount: number;
  title: string;
  limit: string;
  badge?: string;
  badgeClass?: string;
  icon: typeof Sparkles;
  perks: string[];
  cta: string;
  highlight?: boolean;
  founding?: boolean;
};

const miniTiers: MiniTier[] = [
  {
    amount: 10,
    title: "Erken Üye",
    limit: "İlk 1000 kişi",
    icon: Sparkles,
    perks: ["Erken erişim", "Kurucu güncellemeleri", "Kapalı WhatsApp", "Profil rozeti"],
    cta: "Erken Katıl",
  },
  {
    amount: 100,
    title: "Çekirdek Üye",
    limit: "İlk 750 kişi",
    badge: "Önerilen",
    badgeClass: "bg-accent text-accent-foreground",
    icon: Star,
    perks: ["Tüm Erken Üye avantajları", "Etkinliklere öncelikli erişim", "Premium üyelik indirimi", "Profil görünürlük artırımı"],
    cta: "Çekirdek Üye Ol",
  },
  {
    amount: 1000,
    title: "Şehir Patronu",
    limit: "Max 500 kişi",
    badge: "Popüler",
    badgeClass: "bg-emerald-500 text-white",
    icon: Award,
    highlight: true,
    perks: ["Tüm Çekirdek Üye avantajları", "Şehir bazlı öne çıkma", "Erken kullanıcı lead'leri", "Etkinlik sponsorluğu önceliği", "Şehir Patronlarına özel online etkinlik", "Platform reklam kredisi"],
    cta: "Şehir Patronu Ol",
  },
  {
    amount: 10000,
    title: "Onursal Kurucu",
    limit: "Max 100 kişi",
    badge: "Özel",
    badgeClass: "bg-gradient-to-r from-yellow-500 to-primary text-white",
    icon: Crown,
    founding: true,
    perks: ["Tüm Şehir Patronu avantajları", "Global görünürlük", "Onursal Kurucular panosu", "Özel iş birliği fırsatları", "Stratejik 1:1 görüşmeler"],
    cta: "Onursal Kurucu Ol",
  },
];

const SupportSection = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [backerOpen, setBackerOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number>(100);

  const openBacker = (amount: number) => {
    setSelectedTier(amount);
    setBackerOpen(true);
  };

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
              <CircuitBoard className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Teknik</h3>
            <p className="text-muted-foreground text-sm">Yazılım, tasarım, altyapı ve teknoloji alanlarında katkıda bulunun.</p>
          </div>
          <div className="p-8 rounded-2xl bg-background border border-border text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Handshake className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Organizasyonel</h3>
            <p className="text-muted-foreground text-sm">İş birlikleri, ağ genişletme ve topluluk yönetimi ile destek olun.</p>
          </div>
          <div className="p-8 rounded-2xl bg-background border border-border text-center">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Rocket className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">Yatırım</h3>
            <p className="text-muted-foreground text-sm">CorteQS'in potansiyeline yatırım yapmak için.</p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
          >
            Teknik, Org, Yatırım Görüşmeleri için →
          </button>
          <p className="text-muted-foreground text-sm">
            veya bize yazın: <a href="mailto:info@corteqs.net" className="text-primary font-semibold hover:underline text-base">info@corteqs.net</a>
          </p>
        </div>

        <div className="max-w-6xl mx-auto mt-16">
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/15 p-8 md:p-10">
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden />

            <div className="absolute top-4 right-4 hidden sm:block">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                <Crown className="w-3.5 h-3.5" /> SINIRLI KONTENJAN
              </span>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
                <Crown className="w-8 h-8 text-white" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Onursal Kurucularımızın Arasına Girin
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wide">
                  <Crown className="w-3 h-3" /> Onursal
                </span>
              </div>
              <p className="text-lg md:text-xl font-semibold text-foreground/90 mb-3">
                Bağış/Backing Kabul Ediyoruz
              </p>
              <p className="text-muted-foreground text-base max-w-2xl mx-auto mb-8">
                Bağışınızla <strong className="text-foreground">erken erişim</strong>, <strong className="text-foreground">üyelik paketi avantajları</strong>, <strong className="text-foreground">platform reklamları</strong> ve <strong className="text-foreground">Onursal Bağışçılar Panomuzda</strong> yer alma fırsatı kazanın.
              </p>
            </div>

            <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {miniTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.amount}
                    className={`relative flex flex-col p-5 rounded-2xl bg-card/95 backdrop-blur border-2 transition-all hover:shadow-xl ${
                      tier.founding
                        ? "border-yellow-500/40"
                        : tier.highlight
                        ? "border-emerald-500/60 ring-2 ring-emerald-500/30 lg:scale-[1.02] shadow-lg"
                        : "border-border"
                    }`}
                  >
                    {tier.badge && (
                      <span
                        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-md ${tier.badgeClass}`}
                      >
                        {tier.badge}
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          tier.founding
                            ? "bg-gradient-to-br from-yellow-500 to-primary"
                            : "bg-emerald-500/15"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${tier.founding ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                      </div>
                      <h4 className="font-bold text-foreground text-sm leading-tight">{tier.title}</h4>
                    </div>

                    <div className="mb-0.5">
                      <span className="text-2xl font-bold text-foreground">${tier.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-3">{tier.limit}</p>

                    <ul className="space-y-1.5 mb-4 flex-1">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-1.5 text-xs text-foreground/80">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => openBacker(tier.amount)}
                      className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all ${
                        tier.founding
                          ? "bg-gradient-to-r from-yellow-500 via-primary to-primary text-white hover:opacity-95 shadow-md"
                          : tier.highlight
                          ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      {tier.cta} →
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="relative text-center">
              <button
                onClick={() => openBacker(10000)}
                className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white font-bold text-lg hover:opacity-95 transition-all shadow-lg shadow-emerald-500/30"
              >
                Onursal Kurucu Olmak İstiyorum →
              </button>
              <p className="text-xs text-muted-foreground mt-3">
                Veya yukarıdaki paketlerden birini seçerek başvurabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>

      <RegisterInterestForm open={formOpen} onOpenChange={setFormOpen} mode="support" />
      <BackerForm open={backerOpen} onOpenChange={setBackerOpen} defaultTier={selectedTier} />
    </section>
  );
};

export default SupportSection;
