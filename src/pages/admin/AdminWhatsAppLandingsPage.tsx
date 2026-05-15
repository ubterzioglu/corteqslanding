import WhatsAppLandingsModeration from "@/components/admin/WhatsAppLandingsModeration";

export default function AdminWhatsAppLandingsPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">WhatsApp Grup Yonetimi</h1>
        <p className="text-sm text-muted-foreground">
          /addwa altindan gelen grup ve landing basvurularini yonetin.
        </p>
      </div>

      <WhatsAppLandingsModeration />
    </div>
  );
}
