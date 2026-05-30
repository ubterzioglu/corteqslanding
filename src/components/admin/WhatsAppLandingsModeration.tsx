import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ExternalLink, MapPin, MessageSquare, RefreshCw, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  deleteLanding,
  listAllSubmissions,
  setLandingStatus,
  type LandingStatus,
  type WhatsAppLanding,
} from "@/lib/whatsapp-landings";

const statusBadgeClass: Record<LandingStatus, string> = {
  pending: "border-amber-200 bg-amber-100 text-amber-800",
  approved: "border-emerald-200 bg-emerald-100 text-emerald-800",
  rejected: "border-rose-200 bg-rose-100 text-rose-800",
};

const statusLabel: Record<LandingStatus, string> = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export default function WhatsAppLandingsModeration() {
  const { toast } = useToast();
  const [tab, setTab] = useState<LandingStatus>("pending");
  const [rows, setRows] = useState<WhatsAppLanding[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (status: LandingStatus) => {
    setLoading(true);
    setRows(await listAllSubmissions(status));
    setLoading(false);
  };

  useEffect(() => {
    void load(tab);
  }, [tab]);

  const handleStatus = async (dbId: string, status: LandingStatus) => {
    try {
      await setLandingStatus(dbId, status);
      toast({ title: status === "approved" ? "Başvuru onaylandı" : "Başvuru reddedildi" });
      await load(tab);
    } catch (error) {
      toast({
        title: "İşlem başarısız",
        description: error instanceof Error ? error.message : "Beklenmeyen hata",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (dbId: string) => {
    if (!window.confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;

    try {
      await deleteLanding(dbId);
      toast({ title: "Başvuru silindi" });
      await load(tab);
    } catch (error) {
      toast({
        title: "Silme başarısız",
        description: error instanceof Error ? error.message : "Beklenmeyen hata",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            WhatsApp Grup Başvuruları
          </h2>
          <p className="text-sm text-muted-foreground">
            Kullanıcı başvurularını inceleyin, onaylayın veya kaldırın.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void load(tab)}>
          <RefreshCw className="h-3.5 w-3.5" />
          Yenile
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as LandingStatus)}>
        <TabsList>
          <TabsTrigger value="pending">Beklemede</TabsTrigger>
          <TabsTrigger value="approved">Onaylı</TabsTrigger>
          <TabsTrigger value="rejected">Reddedilen</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Yükleniyor...</p>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Bu durumda kayıt yok.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {rows.map((row) => (
                <div key={row.dbId} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground">{row.groupName}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {row.city}, {row.country}
                      </p>
                    </div>
                    <Badge className={statusBadgeClass[(row.status ?? "pending") as LandingStatus]}>
                      {statusLabel[(row.status ?? "pending") as LandingStatus]}
                    </Badge>
                  </div>

                  {row.tagline ? <p className="text-sm text-foreground/85">{row.tagline}</p> : null}
                  {row.callToActionText ? (
                    <p className="line-clamp-3 text-xs text-muted-foreground">{row.callToActionText}</p>
                  ) : null}

                  <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">Kategori: {row.category}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5">Mod: {row.mode}</span>
                    {row.submitterRole ? (
                      <span className="rounded-full bg-muted px-2 py-0.5">
                        Başvuru: {row.submitterRole === "manager" ? "Topluluk Yöneticisi" : "Üye"}
                      </span>
                    ) : null}
                    {row.adminName ? <span className="rounded-full bg-muted px-2 py-0.5">Yönetici: {row.adminName}</span> : null}
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-border pt-2">
                    <a href={row.whatsappLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        WhatsApp Linki
                      </Button>
                    </a>
                    <Link to={`/addwa?group=${encodeURIComponent(row.id)}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Landing Önizle
                      </Button>
                    </Link>
                    {row.status !== "approved" && row.dbId ? (
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => void handleStatus(row.dbId!, "approved")}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Onayla
                      </Button>
                    ) : null}
                    {row.status !== "rejected" && row.dbId ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1.5"
                        onClick={() => void handleStatus(row.dbId!, "rejected")}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reddet
                      </Button>
                    ) : null}
                    {row.dbId ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-destructive hover:text-destructive"
                        onClick={() => void handleDelete(row.dbId!)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Sil
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
