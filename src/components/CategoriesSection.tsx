import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Building2, Landmark, User, Mic, Users } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";
import heroNetworkLight from "@/assets/hero-network-light.jpg";

const categories = [
  {
    icon: Briefcase,
    title: "Danışmanlar",
    desc: "Vergi, emlak, vize, iş kurma, kariyer, doktorlar ve daha birçok alanda uzman profesyoneller ağı.",
    defaultCategory: "danisman",
  },
  {
    icon: Building2,
    title: "İşletmeler & Şirketler",
    desc: "Diasporadaki Türk işletmeleri, şirketleri ve girişimcileri — marketler, klinikler, restoranlar, kafeler, butikler, ajanslar, kuaförler, atölyeler, turizm ofisleri ve daha fazlasını keşfedin, iş birliği yapın.",
    defaultCategory: "isletme",
  },
  {
    icon: Landmark,
    title: "Kuruluşlar",
    desc: "Dernekler, vakıflar, radyo ve TV kuruluşları. Topluluk yapılarına katılın veya kaydedin.",
    defaultCategory: "dernek",
  },
  {
    icon: Mic,
    title: "Blogger & Vlogger",
    desc: "Diaspora hikayelerini anlatan içerik üreticileri ağına katılın, sesinizi duyurun.",
    defaultCategory: "blogger-vlogger",
  },
  {
    icon: Users,
    title: "Şehir Elçisi / City Business Partner",
    desc: "Şehrinde diaspora ağını temsil et, yerel iş partneri ol. VIP olduğunda sabit gelir.",
    defaultCategory: "sehir-elcisi",
  },
  {
    icon: User,
    title: "Bireysel Kullanıcı",
    desc: "Platform hizmetlerinden faydalanmak isteyen bireyler için. Danışman bulun, etkinliklere katılın.",
    defaultCategory: "bireysel",
  },
];

const CategoriesSection = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const openForm = (category: string) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  return (
    <section id="kategoriler" className="py-14 lg:py-20 bg-card relative overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-[0.31]"
        style={{ backgroundImage: `url(${heroNetworkLight})` }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Kategoriler</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Corteqs'de Yerinizi Belirleyin
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kategorinize tıklayın, platform açıldığında ilk siz haberdar olun.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group rounded-2xl border border-white/50 bg-background/90 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <cat.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-xl mb-3">{cat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{cat.desc}</p>
              <button
                onClick={() => openForm(cat.defaultCategory)}
                className="w-full py-3 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Kayıt Bırak / Takip Et →
              </button>
            </div>
          ))}
        </div>

        {/* Founding 1000 CTA */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300/60 p-8 md:p-10 shadow-lg shadow-amber-500/10 overflow-hidden">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-300/30 blur-3xl pointer-events-none" aria-hidden />
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-[10px] font-bold tracking-wider uppercase mb-3">
                  ⭐ Erken Erişim
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                  Founding 1000'e Katıl
                </h3>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                  Danışmanlar · İşletmeler · Kuruluşlar · Vloggerlar — kategorinde ilk konumlananlardan biri ol.
                </p>
              </div>
              <Link
                to="/founding-1000"
                className="group shrink-0 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold text-base hover:from-amber-400 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/30 whitespace-nowrap"
              >
                🌍 Katıl
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            İletişim: <a href="mailto:info@corteqs.net" className="text-primary hover:underline">info@corteqs.net</a>
          </p>
        </div>
      </div>

      <RegisterInterestForm
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultCategory={selectedCategory}
      />
    </section>
  );
};

export default CategoriesSection;
