import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

const NEW_ADMIN_URL = "https://mvp.corteqs.net/admin/";

const AdminRedirectPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-900">Admin paneli taşındı</h1>
      <p className="max-w-md text-sm text-slate-600">
        Eski admin sayfası geçersizdir. Yeni admin paneline aşağıdaki butondan ulaşabilirsiniz.
      </p>
    </div>
    <Button asChild size="lg" className="gap-2">
      <a href={NEW_ADMIN_URL} target="_blank" rel="noreferrer">
        Yeni admin paneline git
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  </div>
);

export default AdminRedirectPage;
