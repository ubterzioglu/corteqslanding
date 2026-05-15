import { useEffect, useState } from "react";
import { Check, ExternalLink, Heart, Lightbulb, RefreshCw, Save, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  deleteMay19CampaignEntry,
  listMay19CampaignEntries,
  updateMay19CampaignEntry,
  type May19SubmissionKind,
  type May19SubmissionRow,
  type May19SubmissionStatus,
} from "@/lib/may19-campaign";

type May19SubmissionsModerationProps = {
  kind: May19SubmissionKind;
};

const statusBadgeClass: Record<May19SubmissionStatus, string> = {
  pending: "border-amber-200 bg-amber-100 text-amber-800",
  approved: "border-emerald-200 bg-emerald-100 text-emerald-800",
  rejected: "border-rose-200 bg-rose-100 text-rose-800",
};

const statusLabel: Record<May19SubmissionStatus, string> = {
  pending: "Bekliyor",
  approved: "Onaylı",
  rejected: "Reddedildi",
};

const kindMeta: Record<May19SubmissionKind, { title: string; description: string; icon: typeof Lightbulb }> = {
  idea: {
    title: "19 Mayıs Kelime Moderasyonu",
    description: "19 kelimelik fikir gönderimlerini inceleyin, not alın ve yayına uygun olanları onaylayın.",
    icon: Lightbulb,
  },
  moment: {
    title: "19 Mayıs Anı Moderasyonu",
    description: "19 Mayıs anı gönderimlerini inceleyin, not alın ve yayın için onaylayın.",
    icon: Heart,
  },
};

export default function May19SubmissionsModeration({ kind }: May19SubmissionsModerationProps) {
  const { toast } = useToast();
  const [tab, setTab] = useState<May19SubmissionStatus>("pending");
  const [rows, setRows] = useState<May19SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const meta = kindMeta[kind];

  const load = async (status: May19SubmissionStatus) => {
    setLoading(true);

    try {
      const nextRows = await listMay19CampaignEntries(kind, status);
      setRows(nextRows);
      setNotesById(
        Object.fromEntries(nextRows.map((row) => [row.id, row.review_notes ?? ""])),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(tab);
  }, [kind, tab]);

  const handleStatus = async (id: string, status: May19SubmissionStatus) => {
    try {
      await updateMay19CampaignEntry(id, {
        status,
        review_notes: notesById[id]?.trim() || null,
      });
      toast({
        title: status === "approved" ? "Gönderim onaylandı" : "Gönderim reddedildi",
      });
      await load(tab);
    } catch (error) {
      toast({
        title: "İşlem başarısız",
        description: error instanceof Error ? error.message : "Beklenmeyen hata",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      await updateMay19CampaignEntry(id, {
        review_notes: notesById[id]?.trim() || null,
      });
      toast({ title: "Moderasyon notu kaydedildi" });
      await load(tab);
    } catch (error) {
      toast({
        title: "Not kaydedilemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen hata",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu gönderimi silmek istediğinize emin misiniz?")) return;

    try {
      await deleteMay19CampaignEntry(id);
      toast({ title: "Gönderim silindi" });
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
            <meta.icon className={`h-5 w-5 ${kind === "idea" ? "text-amber-500" : "text-rose-500"}`} />
            {meta.title}
          </h2>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void load(tab)}>
          <RefreshCw className="h-3.5 w-3.5" />
          Yenile
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as May19SubmissionStatus)}>
        <TabsList>
          <TabsTrigger value="pending">Bekleyen</TabsTrigger>
          <TabsTrigger value="approved">Onaylı</TabsTrigger>
          <TabsTrigger value="rejected">Reddedilen</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Yükleniyor...</p>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Bu durumda kayıt yok.</p>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {rows.map((row) => (
                <div key={row.id} className="space-y-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-lg font-bold text-foreground">{row.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {row.full_name} · {row.city}, {row.country}
                      </p>
                    </div>
                    <Badge className={statusBadgeClass[row.status as May19SubmissionStatus]}>
                      {statusLabel[row.status as May19SubmissionStatus]}
                    </Badge>
                  </div>

                  <div className="grid gap-3 text-sm text-slate-700">
                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Açıklama</p>
                      <p className="mt-1 whitespace-pre-wrap">{row.description}</p>
                    </div>

                    {row.message ? (
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                          {kind === "idea" ? "Güçlendirme Notu" : "Ek Mesaj"}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap">{row.message}</p>
                      </div>
                    ) : null}

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">E-posta</p>
                        <p className="mt-1 break-all">{row.email}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Sosyal Medya</p>
                        <p className="mt-1">{row.social_handle || "—"}</p>
                      </div>
                    </div>

                    {row.link ? (
                      <a
                        href={row.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Gönderi linkini aç
                      </a>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Moderasyon Notu
                    </label>
                    <Textarea
                      rows={3}
                      value={notesById[row.id] ?? ""}
                      onChange={(event) =>
                        setNotesById((current) => ({ ...current, [row.id]: event.target.value }))
                      }
                      placeholder="İç ekip notu, gerekçe veya yayın kararı..."
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-border pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => void handleSaveNotes(row.id)}
                    >
                      <Save className="h-3.5 w-3.5" />
                      Notu Kaydet
                    </Button>
                    {row.status !== "approved" ? (
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => void handleStatus(row.id, "approved")}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Onayla
                      </Button>
                    ) : null}
                    {row.status !== "rejected" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1.5"
                        onClick={() => void handleStatus(row.id, "rejected")}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reddet
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-destructive hover:text-destructive"
                      onClick={() => void handleDelete(row.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Sil
                    </Button>
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
