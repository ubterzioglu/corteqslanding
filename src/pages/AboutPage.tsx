import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Mail, MapPin, Users, Globe, Target, Heart } from "lucide-react";

const AboutPage = () => {
  useEffect(() => {
    document.dispatchEvent(new Event("render-complete"));
  }, []);

  const values = [
    {
      icon: Users,
      title: "Topluluk Odaklılık",
      description: "Diaspora topluluklarının gücüne inanıyoruz. İnsanları bir araya getirmek, güven temelli ilişkiler kurmak ve ortak değerler etrafında büyümek önceliğimiz.",
    },
    {
      icon: Globe,
      title: "Küresel Vizyon, Yerel Etki",
      description: "164 ülkedeki Türk diasporasını tek bir ekosistemde buluştururken, her şehrin yerel dinamiklerine saygı duyuyoruz.",
    },
    {
      icon: Target,
      title: "Şeffaflık ve Güven",
      description: "Doğrulanmış danışmanlar, açık iletişim ve topluluk geri bildirimiyle güvenilir bir platform deneyimi sunuyoruz.",
    },
    {
      icon: Heart,
      title: "Kapsayıcılık",
      description: "Danışmanlardan bireysel kullanıcılara, işletmelerden içerik üreticilerine kadar herkesin yer aldığı bir ekosistem yaratıyoruz.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mb-8 transition-colors"
        >
          ← Ana Sayfaya Dön
        </Link>

        <section className="mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Hakkımızda</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mt-3 mb-6 leading-tight">
            CorteQS Nedir?
          </h1>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              CorteQS Diaspora Connect, dünya genelindeki Türk diasporasını şehir bazlı olarak
              danışmanlar, işletmeler, dernekler, vakıflar, bloggerlar, şehir elçileri ve bireysel
              kullanıcılarla buluşturan bir global network platformudur.
            </p>
            <p>
              2026 yılında İstanbul'da kurulan CorteQS, 164 ülkede yaşayan 8.8 milyon Türk
              diasporasını hedefleyen bir vizyonla yola çıktı. Platform, yurtdışında yaşayan Türklerin
              karşılaştığı bilgi eksikliği, güven sorunu ve ağ kurma zorluğu gibi temel problemlere
              çözüm sunmayı amaçlıyor.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Çözdüğümüz Sorunlar</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-bold text-foreground mb-2">Bilgi Dağınıklığı</h3>
              <p className="text-base">
                Relocation, vize, oturum, iş bulma gibi konulardaki bilgi dağınık ve güvenilirdir.
                CorteQS, şehir bazlı doğrulanmış danışmanlarla bu bilgiyi merkezi hale getirir.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-bold text-foreground mb-2">Güven Eksikliği</h3>
              <p className="text-base">
                Yeni bir ülkeye taşınırken doğru kişiye ulaşmak zordur. Doğrulama sistemi ve topluluk
                geri bildirimleriyle güvenilir bağlantılar kurmanızı sağlıyoruz.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-bold text-foreground mb-2">Ağ Kurma Zorluğu</h3>
              <p className="text-base">
                Diaspora toplulukları parçalıdır. Şehir bazlı networking, etkinlikler ve topluluk
                liderleriyle yeni bağlantılar kurmayı kolaylaştırıyoruz.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Değerlerimiz</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Aktif Şehirler</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            CorteQS, Türk diasporasının yoğun olduğu şehirlerde aktif olarak büyüyor. Berlin, Dortmund,
            Köln, Hamburg, München, Londra, Amsterdam, Dubai, Sydney ve New York ilk odak noktalarımız
            arasındadır. Topluluk yoğunluğuna göre yeni şehirler sürekli eklenmektedir.
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">164 Ülke</span>
            <span className="mx-2">·</span>
            <Users className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">8.8 Milyon Türk</span>
            <span className="mx-2">·</span>
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">120.000+ Kuruluş</span>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Kurucular</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-bold text-foreground text-lg mb-1">Qualtron Sinclair</h3>
              <span className="text-primary text-sm font-semibold">Co-Founder</span>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Global diaspora networking ve topluluk kurma üzerine çalışan CorteQS kurucu ortağı.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-bold text-foreground text-lg mb-1">Akçakanat-Terzioğlu</h3>
              <span className="text-primary text-sm font-semibold">Co-Founder</span>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Şehir bazlı diaspora ağları ve güven temelli bağlantı sistemleri üzerine odaklanan CorteQS kurucu ortağı.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center py-12 px-6 rounded-2xl bg-card border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-3">CorteQS Topluluğuna Katılın</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-xl mx-auto">
            Diaspora ağına katılmak için kategorinizi seçerek kayıt bırakmanız yeterli.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/#kategoriler"
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Kategorileri Gör →
            </Link>
            <a
              href="mailto:info@corteqs.net"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:border-primary/40 transition-all"
            >
              <Mail className="w-4 h-4" />
              İletişime Geçin
            </a>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} CorteQS bir Qualtron Sinclair ve Akçakanat-Terzioğlu Girişimidir. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default AboutPage;
