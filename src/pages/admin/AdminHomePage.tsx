import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { externalAdminNavItems, primaryAdminNavItems } from "@/components/admin/admin-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const internalAdminLinkDescriptions: Record<string, string> = {
  "Üye Takibi": "Üyeleri, başvuruları ve günlük operasyonları tek ekrandan yönetin.",
  "Ref Kod": "Referral akışını, kaynakları ve kullanım performansını takip edin.",
  Muhasebe: "Gelir, gider ve nakit akışı ekranlarına hızlıca geçin.",
};

const externalAdminLinkDescriptions: Record<string, string> = {
  Engine: "Operasyon ve sistem akışlarına ayrılmış dış platform.",
  Globe: "Global ağ ve görünürlük tarafı için ayrı giriş noktası.",
  Founders: "Kurucu vizyonunu ve platform anlatısını açan sayfa.",
};

const AdminHomePage = () => {
  return (
    <div className="space-y-6">
      <Card className="border-primary/15 bg-gradient-to-br from-white via-sky-50/70 to-amber-50/60 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary shadow-sm">
            CorteQS Admin Hub
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
              Admin merkezine hoş geldiniz
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-6 text-slate-600">
              CorteQS operasyonlarını yöneten ana ekran burası. İç modüllere buradan geçebilir, dış sistemlere tek tıkla
              ulaşabilirsiniz.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Admin Modülleri</h2>
          <p className="text-sm text-slate-600">Header içindeki temel yönetim alanlarına hızlı erişim.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {primaryAdminNavItems.map((item) => (
            <Card key={item.to} className="border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-700 shadow-sm">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg text-slate-950">{item.label}</CardTitle>
                  <CardDescription className="text-sm leading-6 text-slate-600">
                    {internalAdminLinkDescriptions[item.label]}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full justify-between">
                  <Link to={item.to}>
                    Ekranı Aç
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Dış Bağlantılar</h2>
          <p className="text-sm text-slate-600">Engine, Globe ve Founders alanları için tek ekrandan çıkış verin.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {externalAdminNavItems.map((item, index) => (
            <Card
              key={item.href}
              className={`border shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                index === 0
                  ? "border-sky-200 bg-sky-50/70"
                  : index === 1
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-amber-200 bg-amber-50/70"
              }`}
            >
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg text-slate-950">{item.label}</CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  {externalAdminLinkDescriptions[item.label]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-between bg-white/90">
                  <a href={item.href} target="_blank" rel="noreferrer">
                    Bağlantıyı Aç
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminHomePage;
