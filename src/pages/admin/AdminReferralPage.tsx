import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createReferralCode, listReferralSources, listReferralTypes } from "@/lib/admin";
import type { ReferralCodeRow, ReferralSourceRow, ReferralTypeRow } from "@/lib/referral-codes";
import { supabase } from "@/integrations/supabase/client";
import { useAdminOutletContext } from "@/components/admin/AdminLayout";

const AdminReferralPage = () => {
  const { session } = useAdminOutletContext();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sources, setSources] = useState<ReferralSourceRow[]>([]);
  const [types, setTypes] = useState<ReferralTypeRow[]>([]);
  const [referralCodes, setReferralCodes] = useState<ReferralCodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const today = new Date();
  const [sourceId, setSourceId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [month, setMonth] = useState(String(today.getMonth() + 1));
  const [year, setYear] = useState(String(today.getFullYear()));
  const [note, setNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [sourceData, typeData, codeData] = await Promise.all([
          listReferralSources(true),
          listReferralTypes(true),
          supabase.from("referral_codes").select("*").order("created_at", { ascending: false }).limit(100),
        ]);
        if (cancelled) return;
        setSources(sourceData);
        setTypes(typeData);
        setReferralCodes(codeData.data ?? []);
        setSourceId((current) => current || sourceData[0]?.id || "");
        setTypeId((current) => current || typeData[0]?.id || "");
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Bilinmeyen hata";
        toast({ title: "Referral verileri yüklenemedi", description: message, variant: "destructive" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [toast]);

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      const element = document.getElementById("referral-create-form");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams]);

  const summary = useMemo(() => {
    const source = sources.find((item) => item.id === sourceId)?.code ?? "??";
    const type = types.find((item) => item.id === typeId)?.code ?? "??";
    const mm = String(Number(month) || 0).padStart(2, "0");
    const yy = String(Number(year) || 0).slice(-2).padStart(2, "0");
    return `${source}${type}${mm}${yy}-XXXX`;
  }, [month, sourceId, sources, typeId, types, year]);

  const handleCreate = async () => {
    if (!sourceId || !typeId) {
      toast({ title: "Source ve type gerekli", variant: "destructive" });
      return;
    }
    const monthNum = Number(month);
    const yearNum = Number(year);
    if (monthNum < 1 || monthNum > 12 || yearNum < 2000 || yearNum > 2099) {
      toast({ title: "Ay/Yıl geçersiz", description: "Ay 1-12, yıl 2000-2099 olmalı.", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const created = await createReferralCode({
        sourceId,
        typeId,
        month: monthNum,
        year: yearNum,
        note,
        createdBy: session.user.id,
      });
      setReferralCodes((current) => [created, ...current].slice(0, 100));
      setNote("");
      const next = new URLSearchParams(searchParams);
      next.delete("action");
      setSearchParams(next, { replace: true });
      toast({ title: "Referral kodu oluşturuldu", description: created.code });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Referral kodu oluşturulamadı.";
      toast({ title: "Oluşturma başarısız", description: message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card id="referral-create-form">
        <CardHeader>
          <CardTitle>Referral Kod Oluştur</CardTitle>
          <CardDescription>Format: [SOURCE][TYPE][MM][YY]-[RAND]</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Select value={sourceId} onValueChange={setSourceId}>
              <SelectTrigger><SelectValue placeholder="Source seçin" /></SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name} ({source.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeId} onValueChange={setTypeId}>
              <SelectTrigger><SelectValue placeholder="Type seçin" /></SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" min={1} max={12} value={month} onChange={(event) => setMonth(event.target.value)} placeholder="Ay (1-12)" />
            <Input type="number" min={2000} max={2099} value={year} onChange={(event) => setYear(event.target.value)} placeholder="Yıl" />
            <Button onClick={() => void handleCreate()} disabled={creating || loading}>
              {creating ? "Üretiliyor..." : "Generate + Save"}
            </Button>
          </div>
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Not (opsiyonel)" rows={3} />
          <div className="rounded-md border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Önizleme</p>
            <p className="font-mono text-lg font-semibold">{summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/admin/referral/sources">Source Yönetimi</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/admin/referral/types">Type Yönetimi</Link></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Üretilen Referral Kodları</CardTitle>
          <CardDescription>Son 100 kod akordeon listesi.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Yükleniyor...</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {referralCodes.map((referral) => (
                <AccordionItem key={referral.id} value={referral.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex w-full items-center justify-between gap-3 pr-2">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-semibold">{referral.code}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(referral.created_at).toLocaleString("tr-TR")} · {referral.source_code}/{referral.type_code}
                        </span>
                      </div>
                      <Badge variant={referral.is_active ? "outline" : "secondary"}>{referral.is_active ? "Aktif" : "Pasif"}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <div>Source code: <span className="font-mono text-foreground">{referral.source_code}</span></div>
                      <div>Type code: <span className="font-mono text-foreground">{referral.type_code}</span></div>
                      <div>MM/YY: <span className="text-foreground">{String(referral.month_num).padStart(2, "0")}/{referral.year_short}</span></div>
                      <div>Random: <span className="font-mono text-foreground">{referral.random_part}</span></div>
                      <div className="md:col-span-2">Not: <span className="text-foreground">{referral.note || "Yok"}</span></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferralPage;
