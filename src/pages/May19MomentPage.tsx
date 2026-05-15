import May19CampaignShell from "@/components/may19/May19CampaignShell";
import May19SubmissionForm from "@/components/may19/May19SubmissionForm";
import heroLandmarks from "../../denemeremake.png";

export default function May19MomentPage() {
  return (
    <May19CampaignShell
      eyebrow="19 MAYIS ANI MODULU"
      title="19 Mayis Anini Paylas"
      description="Bayram coskusunu gosteren ani, not veya icerigini bu formdan ilet. Secilen gonderimler moderasyon sonrasi global yayinlara eklenir."
      heroImageSrc={heroLandmarks}
      heroImageAlt="CorteQS kahraman gorseli"
    >
      <main className="container mx-auto px-4 pb-16 pt-10 lg:px-6 lg:pb-20">
        <section className="mx-auto max-w-3xl space-y-4">
          <p className="text-sm leading-7 text-slate-700">
            Kisa, acik ve baglanti eklenmis gonderimler daha hizli degerlendirilir.
          </p>
          <May19SubmissionForm kind="moment" />
        </section>
      </main>
    </May19CampaignShell>
  );
}
