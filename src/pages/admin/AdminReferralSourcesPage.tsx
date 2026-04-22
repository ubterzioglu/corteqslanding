import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { createReferralSource, listReferralSources, updateReferralSource } from "@/lib/admin";
import { validateReferralCodeToken, type ReferralSourceRow } from "@/lib/referral-codes";
import { normalizeTurkishText } from "@/lib/text-normalization";

const AdminReferralSourcesPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ReferralSourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listReferralSources(false);
      setItems(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen hata";
      toast({ title: "Source listesi yüklenemedi", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await createReferralSource({
        name: normalizeTurkishText(name),
        code: validateReferralCodeToken(code),
      });
      toast({ title: "Source eklendi" });
      setName("");
      setCode("");
      await refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Eklenemedi";
      toast({ title: "Source eklenemedi", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const updated = await updateReferralSource({ id, is_active: isActive });
      setItems((current) => current.map((item) => (item.id === id ? updated : item)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Güncellenemedi";
      toast({ title: "Source güncellenemedi", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Source Management</CardTitle>
          <CardDescription>Code alanı 2 harf, uppercase ve immutable kabul edilir.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[2fr_1fr_auto]">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Source adı" />
          <Input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Code (WA)" maxLength={2} />
          <Button onClick={() => void handleCreate()} disabled={submitting || !name || !code}>
            {submitting ? "Ekleniyor..." : "Source Ekle"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Source Kayıtları</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Aktif</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4}>Yükleniyor...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={4}>Kayıt yok.</TableCell></TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="font-mono">{item.code}</TableCell>
                    <TableCell>
                      <Switch checked={item.is_active} onCheckedChange={(checked) => void toggleActive(item.id, checked)} />
                    </TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString("tr-TR")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferralSourcesPage;
