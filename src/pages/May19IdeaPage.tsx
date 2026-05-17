import May19CampaignShell from "@/components/may19/May19CampaignShell";
import May19SubmissionForm from "@/components/may19/May19SubmissionForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroLandmarks from "../../denemeremake.png";

export default function May19IdeaPage() {
  return (
    <May19CampaignShell
      eyebrow="19 MAYIS FİKİR MODÜLÜ"
      title="19 Kelimelik Fikrini Gönder"
      description="Diasporayı güçlendirecek fikrini bu formdan ilet. Uygun içerikler moderasyon sonrası global akışa dahil edilir."
      heroImageSrc={heroLandmarks}
      heroImageAlt="CorteQS kahraman görseli"
    >
      <main className="container mx-auto px-4 pb-16 pt-10 lg:px-6 lg:pb-20">
        <section className="mx-auto max-w-3xl space-y-4">
          <p className="text-sm leading-7 text-slate-700">
            Fikrini net ve uygulanabilir şekilde paylaşman, yayın seçiminde öncelik sağlar.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/19051919/harita">Haritaya Geç</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/190519memory">19 Mayıs Anı Sayfasına Geç</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/19051919">Yarışma Sayfasına Dön</Link>
            </Button>
          </div>
          <May19SubmissionForm kind="idea" />
        </section>
      </main>
    </May19CampaignShell>
  );
}
