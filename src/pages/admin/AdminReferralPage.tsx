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
import { createReferralCode, listReferralGroups, listReferralSources, listReferralTypes } from "@/lib/admin";
import type { ReferralCodeRow, ReferralGroupRow, ReferralSourceRow, ReferralTypeRow } from "@/lib/referral-codes";
import { supabase } from "@/integrations/supabase/client";
import { useAdminOutletContext } from "@/components/admin/AdminLayout";

type ReferralUsageRow = {
  id: string;
  referral_code_id: string;
  used_at: string;
  full_name: string | null;
  email: string | null;
};

const AdminReferralPage = () => {
  const { session } = useAdminOutletContext();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sources, setSources] = useState<ReferralSourceRow[]>([]);
  const [groups, setGroups] = useState<ReferralGroupRow[]>([]);
  const [types, setTypes] = useState<ReferralTypeRow[]>([]);
  const [referralCodes, setReferralCodes] = useState<ReferralCodeRow[]>([]);
  const [usageMap, setUsageMap] = useState<Record<string, ReferralUsageRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [lastCreatedCode, setLastCreatedCode] = useState<string | null>(null);

  const now = new Date();
  const defaultFrom = now.toISOString().slice(0, 10);
  const nextYear = new Date(now);
  nextYear.setFullYear(now.getFullYear() + 1);

  const [sourceId, setSourceId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [validFrom, setValidFrom] = useState(defaultFrom);
  const [validUntil, setValidUntil] = useState(nextYear.toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [sourceData, groupData, typeData, codeData] = await Promise.all([
          listReferralSources(true),
          listReferralGroups(true),
          listReferralTypes(true),
          supabase.from("referral_codes").select("*").order("created_at", { ascending: false }).limit(100),
        ]);
        if (cancelled) return;
        setSources(sourceData);
        setGroups(groupData);
        setTypes(typeData);
        setReferralCodes(codeData.data ?? []);
        setSourceId((current) => current || sourceData[0]?.id || "");
        setGroupId((current) => current || groupData[0]?.id || "");
        setTypeId((current) => current || typeData[0]?.id || "");
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Bilinmeyen hata";
        toast({ title: "Referral verileri yuklenemedi", description: message, variant: "destructive" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  useEffect(() => {
    let cancelled = false;

    const loadUsage = async () => {
      const ids = referralCodes.map((item) => item.id);
      if (!ids.length) {
        setUsageMap({});
        return;
      }

      const { data, error } = await supabase
        .from("referral_code_usages")
        .select("id,referral_code_id,used_at,full_name,email")
        .in("referral_code_id", ids)
        .order("used_at", { ascending: false });

      if (cancelled || error) return;

      const grouped: Record<string, ReferralUsageRow[]> = {};
      for (const usage of (data ?? []) as ReferralUsageRow[]) {
        if (!grouped[usage.referral_code_id]) grouped[usage.referral_code_id] = [];
        grouped[usage.referral_code_id].push(usage);
      }
      setUsageMap(grouped);
    };

    void loadUsage();
    return () => {
      cancelled = true;
    };
  }, [referralCodes]);

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      const element = document.getElementById("referral-create-form");
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams]);

  const summary = useMemo(() => {
    const source = sources.find((item) => item.id === sourceId)?.code ?? "??";
    const group = groups.find((item) => item.id === groupId)?.code ?? "??";
    const type = types.find((item) => item.id === typeId)?.code ?? "??";
    return `${source}${group}${type}-XXXXXX`;
  }, [groupId, groups, sourceId, sources, typeId, types]);

  const handleCreate = async () => {
    if (!sourceId || !groupId || !typeId) {
      toast({ title: "Source, Group ve Type gerekli", variant: "destructive" });
      return;
    }

    if (!validFrom || !validUntil) {
      toast({ title: "Baslangic ve bitis tarihi gerekli", variant: "destructive" });
      return;
    }

    if (new Date(validUntil) < new Date(validFrom)) {
      toast({ title: "Tarih araligi gecersiz", description: "Bitis tarihi baslangictan once olamaz.", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const created = await createReferralCode({
        sourceId,
        groupId,
        typeId,
        validFrom,
        validUntil,
        note,
        createdBy: session.user.id,
      });
      setReferralCodes((current) => [created, ...current].slice(0, 100));
      setLastCreatedCode(created.code);
      setNote("");
      const next = new URLSearchParams(searchParams);
      next.delete("action");
      setSearchParams(next, { replace: true });
      toast({ title: "Referral kodu olusturuldu", description: created.code });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Referral kodu olusturulamadi.";
      toast({ title: "Olusturma basarisiz", description: message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const copyCode = async (code: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      toast({ title: "Kopyalandi", description: code });
    } catch {
      toast({ title: "Kopyalama basarisiz", description: "Kod panoya kopyalanamadi.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card id="referral-create-form">
        <CardHeader>
          <CardTitle>Referral Kod Olustur</CardTitle>
          <CardDescription>Format: [SOURCE][GROUP][TYPE]-[RAND]</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Select value={sourceId} onValueChange={setSourceId}>
              <SelectTrigger><SelectValue placeholder="Source secin" /></SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name} ({source.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger><SelectValue placeholder="Group secin" /></SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} ({group.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeId} onValueChange={setTypeId}>
              <SelectTrigger><SelectValue placeholder="Type secin" /></SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={validFrom} onChange={(event) => setValidFrom(event.target.value)} placeholder="Baslangic" />
            <Input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} placeholder="Bitis" />
          </div>
          <Button onClick={() => void handleCreate()} disabled={creating || loading}>
            {creating ? "Uretiliyor..." : "Generate + Save"}
          </Button>
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Not (opsiyonel)" rows={3} />
          <div className="rounded-md border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Onizleme</p>
            <p className="font-mono text-lg font-semibold">{summary}</p>
            <p className="mt-1 text-xs text-muted-foreground">Valid: {validFrom} - {validUntil}</p>
          </div>
          {lastCreatedCode && (
            <div className="flex items-center justify-between rounded-md border bg-primary/5 p-3">
              <div>
                <p className="text-xs text-muted-foreground">Son uretilen kod</p>
                <p className="font-mono text-base font-semibold">{lastCreatedCode}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => void copyCode(lastCreatedCode)}>
                Kopyala
              </Button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/admin/referral/sources">Source Yonetimi</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/admin/referral/groups">Group Yonetimi</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/admin/referral/types">Type Yonetimi</Link></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uretilen Referral Kodlari</CardTitle>
          <CardDescription>Son 100 kod, kullanim ve kayit raporu.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Yukleniyor...</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {referralCodes.map((referral) => {
                const today = new Date().toISOString().slice(0, 10);
                const isExpired = referral.valid_until < today;
                const usages = usageMap[referral.id] ?? [];
                return (
                  <AccordionItem key={referral.id} value={referral.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex w-full items-center justify-between gap-3 pr-2">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-semibold">{referral.code}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(referral.created_at).toLocaleString("tr-TR")} · {referral.source_code}/{referral.group_code}/{referral.type_code}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={referral.is_active ? "outline" : "secondary"}>{referral.is_active ? "Aktif" : "Pasif"}</Badge>
                          <Badge variant={isExpired ? "secondary" : "outline"}>{isExpired ? "Expired" : "Valid"}</Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                        <div className="md:col-span-2 flex items-center gap-2">
                          <span className="font-mono text-foreground">{referral.code}</span>
                          <Button variant="outline" size="sm" onClick={() => void copyCode(referral.code)}>
                            Kopyala
                          </Button>
                        </div>
                        <div>Source/Group/Type: <span className="font-mono text-foreground">{referral.source_code}/{referral.group_code}/{referral.type_code}</span></div>
                        <div>Valid Window: <span className="text-foreground">{referral.valid_from} - {referral.valid_until}</span></div>
                        <div>Random: <span className="font-mono text-foreground">{referral.random_part}</span></div>
                        <div>Usage Count: <span className="text-foreground">{referral.usage_count}</span></div>
                        <div>Son Kullanim: <span className="text-foreground">{referral.used_at ? new Date(referral.used_at).toLocaleString("tr-TR") : "-"}</span></div>
                        <div className="md:col-span-2">Not: <span className="text-foreground">{referral.note || "Yok"}</span></div>
                        <div className="md:col-span-2">
                          Kayitlar:
                          <span className="text-foreground">
                            {usages.length
                              ? ` ${usages.map((usage) => usage.full_name || usage.email || "Isimsiz").join(", ")}`
                              : " -"}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferralPage;
