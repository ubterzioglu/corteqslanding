import { useState } from "react";
import { Briefcase, Building2, Landmark, User, Mic, Users } from "lucide-react";
import RegisterInterestForm from "./RegisterInterestForm";
import heroNetworkLight from "@/assets/hero-network-light.jpg";

const categories = [
  {
    icon: Briefcase,
    title: "Danışmanlar",
    desc: "Hukuk, vergi, emlak, vize, iş kurma ve daha birçok alanda uzman danışmanlar ağı.",
    defaultCategory: "danisman",
  },
  {
    icon: Building2,
    title: "İşletmeler & Şirketler",
    desc: "Diasporadaki Türk işletmeleri, şirketleri ve girişimcileri keşfedin, iş birliği yapın.",
    defaultCategory: "isletme",
  },
  {
    icon: Landmark,
    title: "Kuruluşlar",
    desc: "Dernekler, vakıflar, radyo ve TV kuruluşları — topluluk yapılarına katılın veya kaydedin.",
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
    title: "Şehir Elçileri",
    desc: "Bulunduğunuz şehirde diaspora ağını temsil edin, yerel topluluk lideri olun.",
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
    <section id="kategoriler" className="relative overflow-hidden bg-card py-14 lg:py-20">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-[0.31]"
        style={{ backgroundImage: `url(${heroNetworkLight})` }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Kategoriler</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Sizi Hangi Kategori Tanımlıyor?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Diaspora Connect platformunda yerinizi belirleyin. Kategorinize tıklayarak ilginizi kaydedin — platform açıldığında ilk siz haberdar olun.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group flex h-full flex-col rounded-[8px] border border-border/80 bg-background/88 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[8px] bg-primary/10">
                <cat.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-xl mb-3">{cat.title}</h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{cat.desc}</p>
              <button
                onClick={() => openForm(cat.defaultCategory)}
                className="w-full rounded-[8px] bg-primary/10 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
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
