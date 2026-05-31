import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import WhatsAppLandingsModeration from "@/components/admin/WhatsAppLandingsModeration";

export default function AdminWhatsAppLandingsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link to="/admin/whatsapp-landings/editors">
          <Button variant="outline">Landing Editörleri</Button>
        </Link>
      </div>
      <WhatsAppLandingsModeration />
    </div>
  );
}
