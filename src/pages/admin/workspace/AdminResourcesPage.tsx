import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import LinkManager from "@/components/dashboard/links/LinkManager";

const sectionTitles: Record<string, { title: string; description: string }> = {
  arge: {
    title: "ARGE Kaynaklari",
    description: "ARGE odakli dosya ve link kayitlarini filtrelenmis gorunumde yonetin.",
  },
  insankaynaklari: {
    title: "Insan Kaynaklari Kaynaklari",
    description: "CV ve IK kayitlarini yeni birlesik kaynak merkezi uzerinden yonetin.",
  },
};

const AdminResourcesPage = () => {
  const { search } = useLocation();
  const activeSection = useMemo(() => new URLSearchParams(search).get("section") ?? "all", [search]);
  const heading = sectionTitles[activeSection] ?? {
    title: "Dosyalar ve Linkler",
    description: "Genel kaynaklar, IK ve ARGE kayitlarini tek panelden yonetin.",
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{heading.title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">{heading.description}</p>
      </div>
      <LinkManager />
    </div>
  );
};

export default AdminResourcesPage;
