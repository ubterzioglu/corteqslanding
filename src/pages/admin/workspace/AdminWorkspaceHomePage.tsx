import { Link } from "react-router-dom";
import { BookOpen, FolderKanban, ListChecks, Network, Rocket, ScrollText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { workspaceDocPages } from "@/lib/dashboard/workspace-doc-pages";

const workspaceCards = [
  {
    title: "Dashboard Merkezi",
    description: "Ayrı dashboard repo bagimliligini bitiren yeni ic calisma alani.",
    to: "/admin/workspace",
    icon: Network,
  },
  {
    title: "Command Center",
    description: "Todo ve toplanti maddelerini tek tabloda yonetin.",
    to: "/admin/workspace/command-center",
    icon: ListChecks,
  },
  {
    title: "Dosyalar ve Linkler",
    description: "Genel kaynaklar, IK ve ARGE kayitlarini tek yerde toplayin.",
    to: "/admin/workspace/resources",
    icon: FolderKanban,
  },
  {
    title: "MVP Listesi",
    description: "MVP maddelerini, seviyeleri ve sorumlulari canli olarak takip edin.",
    to: "/admin/workspace/mvp",
    icon: Rocket,
  },
];

const docCards = workspaceDocPages.map((page) => ({
  title: page.title,
  description: page.description,
  to: `/admin/workspace/docs/${page.slug}`,
}));

const AdminWorkspaceHomePage = () => (
  <div className="space-y-6">
    <section className="space-y-2">
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
        <BookOpen className="h-3.5 w-3.5" />
        Yeni Admin Workspace
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Birlesik Dashboard Alani</h2>
      <p className="max-w-3xl text-sm leading-6 text-slate-600">
        `cordocu` icerikleri artik bu repo icinde yasiyor. Operasyon ekranlari, kaynak merkezi ve bilgi panelleri
        ayri dashboard linki olmadan `/admin` altinda aciliyor.
      </p>
    </section>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {workspaceCards.map((card) => (
        <Card key={card.to} className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-700">
              <card.icon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">{card.title}</CardTitle>
              <CardDescription className="text-xs leading-5">{card.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm" className="w-full justify-between text-xs">
              <Link to={card.to}>Ac</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>

    <section className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Bilgi Panelleri</h3>
        <p className="text-xs text-slate-600">Eski dashboard dokumanlari yeni admin icinde okunabilir hale getirildi.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {docCards.map((card) => (
          <Card key={card.to} className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-700">
                <ScrollText className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">{card.title}</CardTitle>
              <CardDescription className="text-xs leading-5">{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm" className="w-full text-xs">
                <Link to={card.to}>Dokumani Ac</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  </div>
);

export default AdminWorkspaceHomePage;
