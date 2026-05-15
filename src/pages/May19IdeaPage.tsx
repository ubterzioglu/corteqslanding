import May19CampaignShell from "@/components/may19/May19CampaignShell";
import May19SubmissionForm from "@/components/may19/May19SubmissionForm";
import heroLandmarks from "../../denemeremake.png";

export default function May19IdeaPage() {
  return (
    <May19CampaignShell
      eyebrow="19 MAYIS FIKIR MODULU"
      title="19 Kelimelik Fikrini Gonder"
      description="Diasporayi guclendirecek fikrini bu formdan ilet. Uygun icerikler moderasyon sonrasi global akisa dahil edilir."
      heroImageSrc={heroLandmarks}
      heroImageAlt="CorteQS kahraman gorseli"
    >
      <main className="container mx-auto px-4 pb-16 pt-10 lg:px-6 lg:pb-20">
        <section className="mx-auto max-w-3xl space-y-4">
          <p className="text-sm leading-7 text-slate-700">
            Fikrini net ve uygulanabilir sekilde paylasman, yayin seciminde oncelik saglar.
          </p>
          <May19SubmissionForm kind="idea" />
        </section>
      </main>
    </May19CampaignShell>
  );
}
