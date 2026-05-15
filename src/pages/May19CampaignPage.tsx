import { ExternalLink, Lightbulb, Camera, Globe } from "lucide-react";
import May19CampaignShell from "@/components/may19/May19CampaignShell";
import heroLandmarks from "../../denemeremake.png";
import may19HeaderBg from "../../1905.png";
import may19PoeticLayer from "../../last.png";

const moduleCards = [
  {
    id: "module-1",
    title: "1. Dünya Üzerinde Yerini İşaretle",
    description:
      "Global diaspora haritasında yerini aç, şehrini görünür yap ve topluluğa katıl.",
    href: "https://globe.corteqs.net",
    external: true,
    Icon: Globe,
    badgeClass: "bg-cyan-100 text-cyan-700",
  },
  {
    id: "module-2",
    title: "2. 19 Kelimelik Fikrini Gönder",
    description:
      "Diasporayı güçlendirecek kısa fikrini paylaş; ekip hızlıca değerlendirip akışa alır.",
    href: "/190519idea",
    external: false,
    Icon: Lightbulb,
    badgeClass: "bg-amber-100 text-amber-700",
  },
  {
    id: "module-3",
    title: "3. 19 Mayıs Anını Paylaş",
    description:
      "19 Mayıs’a dair anını veya kısa notunu ilet; seçilen içerikler global yayına hazırlanır.",
    href: "/190519memory",
    external: false,
    Icon: Camera,
    badgeClass: "bg-orange-100 text-orange-700",
  },
];

export default function May19CampaignPage() {
  return (
    <May19CampaignShell
      eyebrow="19 MAYIS ATATÜRK'Ü ANMA, GENÇLİK VE SPOR BAYRAMI"
      title="19 Mayıs Coşkusunu Birlikte Yaşayalım!"
      description={`19 Mayıs heyecanını tüm dünyadaki Türk diaspora topluluğumuzla birlikte yaşıyoruz. Yaşadığın yeri dünya haritasında işaretle, diasporamızı güçlendirecek fikrini paylaş ve 19 Mayıs anını CorteQS global ağında görünür kıl.\n\n19 Mayıs heyecanını tüm dünyadaki topluluklarımızla birlikte yaşıyoruz. Yaşadığın yeri Dünya haritasında işaretle, Diasporamızı güçlendirecek fikrini yaz ve bugüne ait fotoğraflarını sosyal medyamızda paylaş.\n\n1. Dünya üzerindeki yerini işaretleyerek diaspora haritasında görünür ol.\n2. 19 kelimelik fikrini paylaşarak topluluğa yeni bir katkı sun.\n3. 19 Mayıs anını göndererek bayram coşkusunu birlikte büyüt.`}
      headerBgImageSrc={may19HeaderBg}
      headerPoeticImageSrc={may19PoeticLayer}
      heroImageSrc={heroLandmarks}
      heroImageAlt="CorteQS kahraman görseli"
    >
      <main className="container mx-auto px-4 pb-16 pt-10 lg:px-6 lg:pb-20">
        <section id="modules" className="mx-auto max-w-5xl space-y-4">
          {moduleCards.map((item) => {
            const body = (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-2.5 ${item.badgeClass}`}>
                    <item.Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-sm leading-7 text-slate-600">{item.description}</p>
                    <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      Modüle git
                      <ExternalLink className="h-4 w-4" />
                    </p>
                  </div>
                </div>
              </div>
            );

            if (item.external) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {body}
                </a>
              );
            }

            return (
              <a key={item.id} href={item.href} className="block">
                {body}
              </a>
            );
          })}
        </section>
      </main>
    </May19CampaignShell>
  );
}
