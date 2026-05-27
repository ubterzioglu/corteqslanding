import heroMapShowcase from "../../aaa/01_ust_hero_harita_hd.png";
import businessesCard from "../../aaa/02_isletmeler_kart_hd.png";
import professionalsCard from "../../aaa/03_profesyoneller_kart_hd.png";
import institutionsCard from "../../aaa/04_kuruluslar_kart_hd.png";
import communityManagersCard from "../../aaa/05_topluluk_yoneticileri_kart_hd.png";
import creatorsCard from "../../aaa/06_icerik_ureticileri_kart_hd.png";
import digitalGroupsCard from "../../aaa/07_dijital_gruplar_kart_hd.png";
import featureStrip from "../../aaa/08_alt_ozellik_seridi_hd.png";

const showcaseCards = [
  { src: businessesCard, alt: "İşletmeler için CorteQS kartı" },
  { src: professionalsCard, alt: "Profesyoneller için CorteQS kartı" },
  { src: institutionsCard, alt: "Kuruluşlar için CorteQS kartı" },
  { src: communityManagersCard, alt: "Topluluk yöneticileri için CorteQS kartı" },
  { src: creatorsCard, alt: "İçerik üreticileri için CorteQS kartı" },
  { src: digitalGroupsCard, alt: "Dijital gruplar için CorteQS kartı" },
] as const;

const GlobalNetworkShowcaseSection = () => {
  return (
    <section className="relative overflow-hidden py-5 lg:py-8">
      <div className="container relative z-10 mx-auto max-w-[1480px] px-4">
        <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,252,255,0.96),rgba(255,250,244,0.95))] p-4 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-6 xl:p-8">
          <div className="overflow-hidden rounded-[1.6rem]">
            <img
              src={heroMapShowcase}
              alt="CorteQS'in dünya çapında Türk topluluklarını şehirler ve bağlantılar üzerinden bir araya getiren ağ görseli"
              className="w-full rounded-[1.6rem] object-cover"
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {showcaseCards.map((card) => (
              <div
                key={card.alt}
                className="overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.10)]"
              >
                <img src={card.src} alt={card.alt} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_16px_38px_rgba(15,23,42,0.06)]">
            <img
              src={featureStrip}
              alt="CorteQS platform özellikleri şeridi"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalNetworkShowcaseSection;
