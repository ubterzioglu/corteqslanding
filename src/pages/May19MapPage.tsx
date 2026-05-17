import May19CampaignShell from "@/components/may19/May19CampaignShell";

export default function May19MapPage() {
  return (
    <May19CampaignShell
      eyebrow="GLOBAL DIASPORA HARİTASI"
      title="19 Mayıs Global Harita"
      description="Global diaspora haritasına katılım için aşağıdaki butonu kullanarak doğrudan harita platformuna geçebilirsin."
      primaryCta={{ label: "Haritaya Katıl", to: "https://globe.corteqs.net/" }}
      secondaryCta={{ label: "Modüllere Git", to: "/19051919#modules" }}
    >
      <main className="bg-[linear-gradient(180deg,#fffaf5_0%,#fff_50%,#f8fbff_100%)]">
        <section className="container mx-auto px-4 pb-16 pt-10 text-center lg:px-6 lg:pb-20">
          <p className="mx-auto max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
            Bu sayfadaki demo globe bölümü kaldırıldı. Katılımı doğrudan harita platformu üzerinden
            gerçekleştirebilirsin.
          </p>
        </section>
      </main>
    </May19CampaignShell>
  );
}
