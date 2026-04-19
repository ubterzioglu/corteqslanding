import diasporaCommunity from "@/assets/diaspora-community.jpg";

const AboutSection = () => {
  const stats = [
    { value: "50+", label: "Şehir" },
    { value: "12", label: "Kategori" },
    { value: "1000+", label: "Hedef Üye" },
    { value: "25+", label: "Ülke" },
  ];

  return (
    <section id="hakkinda" className="bg-card py-14 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Hakkımızda</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Diasporanın Gücünü Keşfedin
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              <strong className="text-foreground">CorteQS Diaspora Connect</strong>, dünya genelindeki Türk diaspora topluluklarını bir araya getirerek iş, kültür, eğitim ve teknoloji alanlarında güçlü bağlantılar kurmayı amaçlayan benzersiz bir global diaspora platformudur.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              <a href="https://en.wikipedia.org/wiki/Turkish_diaspora" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dünya genelinde 8.8 milyondan fazla Türk diasporası</a> 164 ülkede yaşamaktadır. CorteQS, bu geniş ağı danışmanlar, işletmeler, dernekler ve içerik üreticileriyle buluşturarak diaspora iş birliği ve global networking potansiyelini ortaya çıkarır.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Her kategoride uzmanlaşmış profesyonelleri, girişimcileri, sanatçıları ve içerik üreticilerini bir çatı altında topluyoruz. Platformumuz, diaspora topluluklarının <a href="https://www.oecd.org/en/topics/sub-issues/migration.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">uluslararası iş birliği ve sürdürülebilir büyüme</a> hedeflerine katkı sağlamayı amaçlamaktadır.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              CorteQS nedir? Kısa tanım: Dünya genelindeki Türk diasporasını ve diğer diaspora topluluklarını birleştiren, iş birliği, networking ve büyüme fırsatları sunan bir global diaspora network platformudur.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Neden CorteQS? Diaspora bireyleri ve kuruluşları sıklıkla yerel ağlara erişimde, iş birliği fırsatlarını bulmada ve topluluk gücünü organize etmede zorlanmaktadır. CorteQS, bu boşluğu doldurarak kategorilere ayrık bir yapıda danışmanlar, işletmeler, dernekler, vakıflar, bloggerlar, şehir elçileri ve bireysel kullanıcıları tek bir platformda buluşturur. Böylece ister Berlin'de bir startup kurucu olun, ister Londra'da bir dernek başkanı, CorteQS sizin için doğru bağlantıları sunar.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              CorteQS'in misyonu, diaspora bireylerinin ve kurumların küresel ölçekte görünür, erişilebilir ve güçlü olmasını sağlamaktır. Platform, yalnızca bir rehber veya üye dizini değil; aktif bir iş birliği ve büyüme ekosistemidir. Şehir elçileri aracılığıyla yerel toplulukları güçlendirirken, kategorilere ayrılmış yapısıyla her türlü kullanıcıya özel ve anlamlı bir deneyim sunmayı hedeflemektedir. Diaspora topluluğunun sahip olduğu bilgi birikimi, deneyim ve ağ gücü, doğru bir platform sayesinde katlanarak büyüyebilir.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              CorteQS Diaspora Connect nasıl çalışır? Kullanıcılar, danışman, işletme, dernek, vakıf, blogger/vlogger, şehir elçisi veya bireysel kullanıcı kategorilerinden birine kayıt olur. Platform açıldığında, her kullanıcı kendi kategorisine özel bir profil sayfasına sahip olur; diğer diaspora üyeleriyle bağlantı kurabilir, yerel etkinliklere katılabilir, iş fırsatlarına erişebilir ve içerik paylaşabilir. Şehir elçileri ise bulundukları şehirde bu ağı temsil ederek yerel toplulukla köprü kurar.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[8px] border border-border/70 bg-background/80 p-4 text-center shadow-sm">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[540px] overflow-hidden rounded-[8px] border border-white/60 bg-white/60 p-3 shadow-[0_22px_60px_rgba(31,40,52,0.12)]">
            <img
              src={diasporaCommunity}
              alt="Türk diasporası topluluk buluşması ve iş birliği etkinliği"
              className="mx-auto w-[70%] rounded-[8px] object-cover [filter:brightness(0.95)_saturate(0.85)_contrast(0.95)]"
              loading="lazy"
              width={1024}
              height={1024}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-card/20 via-transparent to-primary/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
