import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createMarqueeItem,
  deleteMarqueeItem,
  listAdminMarqueeItems,
  marqueeTypeLabels,
  slugifyMarqueeTitle,
  updateMarqueeItem,
  type MarqueeItemRow,
  type MarqueeItemType,
} from "@/lib/marquee";

type MarqueeFormState = {
  type: MarqueeItemType;
  slug: string;
  title: string;
  summary: string;
  detail_content: string;
  image_url: string;
  image_alt: string;
  metric_value: string;
  link_enabled: boolean;
  sort_order: string;
  is_active: boolean;
  published_at: string;
};

const emptyForm = (): MarqueeFormState => ({
  type: "news",
  slug: "",
  title: "",
  summary: "",
  detail_content: "",
  image_url: "",
  image_alt: "",
  metric_value: "",
  link_enabled: false,
  sort_order: "0",
  is_active: true,
  published_at: new Date().toISOString().slice(0, 16),
});

const toLocalInputValue = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 16);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const toFormState = (item: MarqueeItemRow): MarqueeFormState => ({
  type: item.type === "news" || item.type === "stat" || item.type === "announcement" ? item.type : "news",
  slug: item.slug ?? "",
  title: item.title,
  summary: item.summary,
  detail_content: item.detail_content ?? "",
  image_url: item.image_url ?? "",
  image_alt: item.image_alt ?? "",
  metric_value: item.metric_value ?? "",
  link_enabled: item.link_enabled,
  sort_order: String(item.sort_order),
  is_active: item.is_active,
  published_at: toLocalInputValue(item.published_at),
});

const normalizeOptional = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const AdminMarqueePage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<MarqueeItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MarqueeFormState>(() => emptyForm());

  const editingItem = useMemo(() => items.find((item) => item.id === editingId) ?? null, [editingId, items]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listAdminMarqueeItems());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      toast({ title: "Haber bandı yüklenemedi", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateForm = <Key extends keyof MarqueeFormState>(key: Key, value: MarqueeFormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const editItem = (item: MarqueeItemRow) => {
    setEditingId(item.id);
    setForm(toFormState(item));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPayload = () => {
    const title = form.title.trim();
    const summary = form.summary.trim();
    const slug = form.slug.trim() || (form.link_enabled ? slugifyMarqueeTitle(title) : "");

    if (!title) throw new Error("Başlık zorunlu.");
    if (!summary) throw new Error("Kısa bilgi zorunlu.");
    if (form.link_enabled && !slug) throw new Error("Detay sayfası açıksa slug zorunlu.");

    const sortOrder = Number.parseInt(form.sort_order, 10);
    if (Number.isNaN(sortOrder)) throw new Error("Sıralama sayısal olmalı.");

    const publishedAt = new Date(form.published_at);
    if (Number.isNaN(publishedAt.getTime())) throw new Error("Yayın tarihi geçersiz.");

    return {
      type: form.type,
      slug: slug || null,
      title,
      summary,
      detail_content: normalizeOptional(form.detail_content),
      image_url: normalizeOptional(form.image_url),
      image_alt: normalizeOptional(form.image_alt),
      metric_value: normalizeOptional(form.metric_value),
      link_enabled: form.link_enabled,
      sort_order: sortOrder,
      is_active: form.is_active,
      published_at: publishedAt.toISOString(),
    };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = buildPayload();
      if (editingId) {
        await updateMarqueeItem(editingId, payload);
        toast({ title: "Haber bandı kaydı güncellendi" });
      } else {
        await createMarqueeItem(payload);
        toast({ title: "Haber bandı kaydı eklendi" });
      }
      resetForm();
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kaydedilemedi";
      toast({ title: "Kayıt başarısız", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (item: MarqueeItemRow) => {
    try {
      const updated = await updateMarqueeItem(item.id, { is_active: !item.is_active });
      setItems((current) => current.map((currentItem) => (currentItem.id === item.id ? updated : currentItem)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Durum değiştirilemedi";
      toast({ title: "Güncelleme başarısız", description: message, variant: "destructive" });
    }
  };

  const removeItem = async (item: MarqueeItemRow) => {
    if (!window.confirm(`"${item.title}" kaydı silinsin mi?`)) return;
    try {
      await deleteMarqueeItem(item.id);
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      if (editingId === item.id) resetForm();
      toast({ title: "Kayıt silindi" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Silinemedi";
      toast({ title: "Silme başarısız", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingItem ? "Haber Bandı Kaydını Düzenle" : "Yeni Haber Bandı Kaydı"}</CardTitle>
          <CardDescription>Hero altında dönen görselli haber, istatistik ve duyuru kartlarını yönetin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Tip</Label>
              <Select value={form.type} onValueChange={(value) => updateForm("type", value as MarqueeItemType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">Haber</SelectItem>
                  <SelectItem value="stat">İstatistik</SelectItem>
                  <SelectItem value="announcement">Duyuru</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Yayın tarihi</Label>
              <Input type="datetime-local" value={form.published_at} onChange={(event) => updateForm("published_at", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Sıralama</Label>
              <Input value={form.sort_order} onChange={(event) => updateForm("sort_order", event.target.value)} inputMode="numeric" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-2">
              <Label>Başlık</Label>
              <Input value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Türk diasporası 164 ülkede görünür" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(event) => updateForm("slug", slugifyMarqueeTitle(event.target.value))}
                placeholder="turk-diasporasi-164-ulke"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kısa bilgi</Label>
            <Textarea value={form.summary} onChange={(event) => updateForm("summary", event.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Detay metni</Label>
            <Textarea value={form.detail_content} onChange={(event) => updateForm("detail_content", event.target.value)} rows={6} />
          </div>

          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-2">
              <Label>Görsel URL</Label>
              <Input value={form.image_url} onChange={(event) => updateForm("image_url", event.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Görsel alt metni</Label>
              <Input value={form.image_alt} onChange={(event) => updateForm("image_alt", event.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Sayı / değer</Label>
              <Input value={form.metric_value} onChange={(event) => updateForm("metric_value", event.target.value)} placeholder="8.8 milyon" />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label>Detay sayfası</Label>
                <p className="text-xs text-muted-foreground">Açıksa kart slug sayfasına gider.</p>
              </div>
              <Switch checked={form.link_enabled} onCheckedChange={(checked) => updateForm("link_enabled", checked)} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <Label>Aktif</Label>
                <p className="text-xs text-muted-foreground">Pasif kayıt public tarafta görünmez.</p>
              </div>
              <Switch checked={form.is_active} onCheckedChange={(checked) => updateForm("is_active", checked)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void handleSubmit()} disabled={submitting}>
              <Plus className="h-4 w-4" />
              {submitting ? "Kaydediliyor..." : editingId ? "Kaydı Güncelle" : "Kayıt Ekle"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Vazgeç
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Haber Bandı Kayıtları</CardTitle>
          <CardDescription>Görsel, durum, detay ve sıralama bilgilerini hızlıca kontrol edin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Görsel</TableHead>
                <TableHead>Başlık</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Detay</TableHead>
                <TableHead>Sıra</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>Yükleniyor...</TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>Kayıt yok.</TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const type = item.type === "news" || item.type === "stat" || item.type === "announcement" ? item.type : "announcement";
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.image_url || "/og-image.png"}
                          alt={item.image_alt || item.title}
                          className="h-14 w-20 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="max-w-sm">
                        <div className="font-semibold text-foreground">{item.title}</div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">{item.summary}</div>
                      </TableCell>
                      <TableCell>{marqueeTypeLabels[type]}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => void toggleActive(item)}>
                          {item.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          {item.is_active ? "Aktif" : "Pasif"}
                        </Button>
                      </TableCell>
                      <TableCell>{item.link_enabled ? "Açık" : "Kapalı"}</TableCell>
                      <TableCell>{item.sort_order}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editItem(item)}>
                            <Edit className="h-4 w-4" />
                            Düzenle
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => void removeItem(item)}>
                            <Trash2 className="h-4 w-4" />
                            Sil
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMarqueePage;
