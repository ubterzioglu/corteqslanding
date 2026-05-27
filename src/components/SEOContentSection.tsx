import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import bloggerVlogger from "@/assets/blogger-vlogger.jpg";
import founding1000Card from "@/assets/founding-1000-card.jpg";
import vloggerContestCard from "@/assets/vlogger-contest-card.jpg";

const featuredLinks = [
  {
    to: "/founding-1000",
    image: founding1000Card,
    className:
      "border-[#f0b73b]/35 bg-[linear-gradient(135deg,#fff3cf_0%,#ffe79e_52%,#ffd768_100%)] text-[#8f5b00] shadow-[0_14px_30px_rgba(240,183,59,0.18)]",
    label: "🌍 Founding 1000'e Katıl",
  },
  {
    to: "/blogger-yarismasi",
    image: bloggerVlogger,
    className:
      "border-[#ef8c3f]/35 bg-[linear-gradient(135deg,#fff0de_0%,#ffd6af_52%,#ffbc7b_100%)] text-[#c96a1a] shadow-[0_14px_30px_rgba(239,140,63,0.18)]",
    label: "✍️ Blogger Yarışması",
  },
  {
    to: "/vlogger-yarismasi",
    image: vloggerContestCard,
    className:
      "border-[#2f8fb4]/35 bg-[linear-gradient(135deg,#eef9fc_0%,#cfeefa_52%,#a9dff2_100%)] text-[#1f7595] shadow-[0_14px_30px_rgba(47,143,180,0.18)]",
    label: "🎥 Vlogger Yarışması",
  },
] as const;

const SEOContentSection = () => {
  return (
    <section className="relative -mt-8 overflow-hidden py-2 lg:-mt-12 lg:py-3">
      <article className="container relative z-10 mx-auto max-w-6xl px-4" aria-labelledby="geo-content-title">
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem
            value="corteqs-nedir"
            className="overflow-hidden rounded-[1.75rem] border border-[#bfe5de] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,250,247,0.96),rgba(247,252,255,0.94))] px-5 shadow-[0_18px_40px_rgba(69,145,132,0.10)] backdrop-blur-sm md:px-7"
          >
            <AccordionTrigger
              className="gap-4 py-5 text-left hover:no-underline"
              chevronWrapperClassName="border border-[#b7dcd4] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,249,246,0.96))] text-[#153a5b] shadow-[0_10px_24px_rgba(21,58,91,0.10)]"
              chevronClassName="h-4.5 w-4.5"
            >
              <span className="inline-flex items-center gap-2 bg-[linear-gradient(90deg,#0f766e_0%,#2563eb_50%,#7c3aed_100%)] bg-clip-text text-xl font-black text-transparent md:text-2xl">
                <Sparkles className="h-4 w-4 text-primary" />
                CorteQS nedir?
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p id="geo-content-title" className="max-w-4xl text-xl leading-relaxed text-foreground md:text-2xl">
                Dünyaya dağılmış Türk topluluklarının ekonomik ve sosyal sinir ağlarını örüyoruz. CorteQS,
                dünyanın farklı şehirlerinde yaşayan Türkleri; sadece bir sosyal ağda değil, gerçek fırsatlar,
                topluluklar ve bağlantılar etrafında bir araya getirir.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mb-4 grid gap-4 md:grid-cols-3">
          {featuredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`group overflow-hidden rounded-[1.5rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(15,23,42,0.10)] ${link.className}`}
            >
              <div className="relative aspect-[1/1] min-h-[180px] md:min-h-[205px]">
                <div className="absolute inset-x-0 top-0 h-[66%] overflow-hidden">
                  <img
                    src={link.image}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.08)_55%,rgba(255,255,255,0)_100%)]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-[34%] items-center justify-center px-2 pb-3 pt-2 text-center">
                  <div className="max-w-[calc(100%-0.75rem)] rounded-[1.1rem] border border-white/55 bg-white/72 px-3 py-2.5 backdrop-blur-md shadow-[0_10px_24px_rgba(255,255,255,0.24)]">
                    <span className="text-[0.98rem] font-semibold md:text-[0.98rem]">{link.label}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
};

export default SEOContentSection;
