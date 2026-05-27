import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const featuredLinks = [
  {
    to: "/founding-1000",
    className:
      "border-[#f0b73b]/35 bg-[linear-gradient(135deg,#fff3cf_0%,#ffe79e_52%,#ffd768_100%)] text-[#8f5b00] shadow-[0_14px_30px_rgba(240,183,59,0.18)]",
    label: "🌍 Founding 1000'e Katıl",
  },
  {
    to: "/blogger-yarismasi",
    className:
      "border-[#ef8c3f]/35 bg-[linear-gradient(135deg,#fff0de_0%,#ffd6af_52%,#ffbc7b_100%)] text-[#c96a1a] shadow-[0_14px_30px_rgba(239,140,63,0.18)]",
    label: "✍️ Blogger Yarışması",
  },
  {
    to: "/vlogger-yarismasi",
    className:
      "border-[#2f8fb4]/35 bg-[linear-gradient(135deg,#eef9fc_0%,#cfeefa_52%,#a9dff2_100%)] text-[#1f7595] shadow-[0_14px_30px_rgba(47,143,180,0.18)]",
    label: "🎥 Vlogger Yarışması",
  },
] as const;

const SEOContentSection = () => {
  return (
    <section className="relative overflow-hidden py-5 lg:py-7">
      <article className="container relative z-10 mx-auto max-w-6xl px-4" aria-labelledby="geo-content-title">
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem
            value="corteqs-nedir"
            className="overflow-hidden rounded-[1.75rem] border border-[#bfe5de] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(240,250,247,0.96),rgba(247,252,255,0.94))] px-5 shadow-[0_18px_40px_rgba(69,145,132,0.10)] backdrop-blur-sm md:px-7"
          >
            <AccordionTrigger className="gap-4 py-5 text-left text-xl font-black text-foreground hover:no-underline md:text-2xl">
              <span className="inline-flex items-center gap-2">
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

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          {featuredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 md:text-center ${link.className}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
};

export default SEOContentSection;
