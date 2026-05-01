import { useState } from "react";
import { Briefcase, Building2, Landmark, User, Mic, Users } from "lucide-react";
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
              className="group flex h-full flex-col rounded-2xl border border-white/50 bg-background/90 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <cat.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold leading-snug text-foreground">{cat.title}</h3>
              </div>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{cat.desc}</p>
              <button
                onClick={() => openForm(cat.defaultCategory)}
                className="mt-auto w-full rounded-xl bg-primary/10 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
              >
                Kayıt Bırak / Takip Et →
              </button>
            </div>
          ))}
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
