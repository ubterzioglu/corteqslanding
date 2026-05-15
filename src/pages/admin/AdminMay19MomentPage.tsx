import May19SubmissionsModeration from "@/components/admin/May19SubmissionsModeration";

export default function AdminMay19MomentPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">19 Mayıs Anı</h1>
        <p className="text-sm text-muted-foreground">
          /19051919 içindeki 19 Mayıs anı gönderimlerini yönetin.
        </p>
      </div>

      <May19SubmissionsModeration kind="moment" />
    </div>
  );
}
