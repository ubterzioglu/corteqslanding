import May19CampaignShell from "@/components/may19/May19CampaignShell";
import May19SubmissionForm from "@/components/may19/May19SubmissionForm";
import heroLandmarks from "../../denemeremake.png";

export default function May19MomentPage() {
  return (
    <May19CampaignShell
      eyebrow="19 MAYIS ANI MODULU"
      title="19 Mayıs Anını Paylaş"
      description="Bayram coşkusunu gösteren anı, not veya içeriğini bu formdan ilet. Seçilen gönderimler moderasyon sonrası global yayınlara eklenir."
      heroImageSrc={heroLandmarks}
      heroImageAlt="CorteQS kahraman gorseli"
    >
      <main className="container mx-auto px-4 pb-16 pt-10 lg:px-6 lg:pb-20">
        <section className="mx-auto max-w-3xl space-y-4">
          <p className="text-sm leading-7 text-slate-700">
            Kısa, açık ve bağlantı eklenmiş gönderimler daha hızlı değerlendirilir.
          </p>
          <May19SubmissionForm kind="moment" />
        </section>
      </main>
    </May19CampaignShell>
  );
}
