import WhatsAppLandingsModeration from "@/components/admin/WhatsAppLandingsModeration";

export default function AdminWhatsAppLandingsPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">WhatsApp Grup Yönetimi</h1>
        <p className="text-sm text-muted-foreground">
          /addwa altından gelen grup ve landing başvurularını yönetin.
        </p>
      </div>

      <WhatsAppLandingsModeration />
    </div>
  );
}
