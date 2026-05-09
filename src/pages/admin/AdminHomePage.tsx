import { ArrowRight, ExternalLink, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

import {
  adminPanelNavItems,
  externalAdminNavItems,
  otherActionNavItems,
  otherRecordNavItems,
  primaryAdminNavItems,
} from "@/components/admin/admin-navigation";
import { useAdminOutletContext } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { advisorProfileSections } from "@/lib/resource-links";

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

const otherActionDescriptions: Record<string, string> = {
  "Haber Bandı": "Site içindeki kayan haber alanını ve görünür metinleri yönetin.",
  "Sosyal Medya": "Sosyal medya linkleri ve dış ağ bağlantılarını düzenleyin.",
  Güncellemeler: "Hakkımızda ve güncelleme içeriklerini admin panelinden kontrol edin.",
};

const otherRecordDescriptions: Record<string, string> = {
  "Lansman Katılım": "Lansman kayıtlarını, filtreleri ve form cevaplarını inceleyin.",
};

const dashboardDescriptions: Record<string, string> = {
  WikiDash: "Merkezi dashboard ana sayfası ve genel bilgi alanı.",
  "Toplantılar / Aksiyonlar": "Toplantı özetleri ile aksiyon takibini birlikte açar.",
  "TODO Listesi (Legacy)": "Eski görev yönetim ekranına hızlı erişim sağlar.",
  "Toplantı Özetleri (Legacy)": "Legacy toplantı özetleri görünümünü açar.",
  "IK Dökümanları": "İnsan kaynakları dokümantasyon alanına gider.",
  "ARGE Dökümanları": "Araştırma ve geliştirme dokümanlarını açar.",
  "Dosyalar ve Linkler": "Operasyon için paylaşılan link ve dosya merkezine gider.",
  "Dashboard Anasayfa": "Dashboard giriş ekranını ayrı sekmede açar.",
};

const advisorRecordItems = advisorProfileSections.map((section) => ({
  to: `/admin/advisors/${section.key}`,
  label: section.label,
  description: `${section.label} profil bağlantılarını ve içeriklerini yönetin.`,
}));

const AdminHomePage = () => {
  const { session, onLogout } = useAdminOutletContext();

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
              Header’da gördüğünüz tüm alanlar burada da erişilebilir. İç modülleri yönetin, dış sistemlere geçin ve
              oturum işlemlerini tek sayfadan tamamlayın.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-5">
          <div className="text-sm text-slate-600">
            Giriş yapan kullanıcı: <span className="font-semibold text-slate-900">{session.user.email}</span>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => void onLogout()}>
            <LogOut className="h-4 w-4" />
            Çıkış
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Ana Menü</h2>
          <p className="text-sm text-slate-600">Header’daki ilk erişim alanlarının landing karşılığı.</p>
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
          <p className="text-sm text-slate-600">Engine, Globe ve Founders için hızlı çıkış verin.</p>
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

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-950">Diğer İşlemler</CardTitle>
            <CardDescription>Header dropdown’undaki tüm işlem ekranları burada listelenir.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {otherActionNavItems.map((item) => (
              <div key={item.to} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">{item.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{otherActionDescriptions[item.label]}</p>
                  </div>
                </div>
                <Button asChild variant="ghost" className="mt-3 w-full justify-between">
                  <Link to={item.to}>
                    Sayfayı Aç
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-950">Diğer Kayıtlar</CardTitle>
            <CardDescription>Lansman ve danışman profili kayıt ekranlarını tek alanda toplayın.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {otherRecordNavItems.map((item) => (
              <div key={item.to} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">{item.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{otherRecordDescriptions[item.label]}</p>
                  </div>
                </div>
                <Button asChild variant="ghost" className="mt-3 w-full justify-between">
                  <Link to={item.to}>
                    Sayfayı Aç
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}

            {advisorRecordItems.map((item) => (
              <div key={item.to} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{item.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
                <Button asChild variant="ghost" className="mt-3 w-full justify-between">
                  <Link to={item.to}>
                    Sayfayı Aç
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Dashboard</h2>
          <p className="text-sm text-slate-600">Header altındaki dashboard linklerinin tamamı burada da görünür.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {adminPanelNavItems.map((item) => (
            <Card key={item.key} className="border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-700 shadow-sm">
                  <item.icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base text-slate-950">{item.label}</CardTitle>
                  <CardDescription className="text-sm leading-6 text-slate-600">
                    {dashboardDescriptions[item.label]}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-between">
                  <a href={item.href} target="_blank" rel="noreferrer">
                    Dashboard'a Git
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
