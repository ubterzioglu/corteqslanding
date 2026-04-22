import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  categoryOptions,
  getCategoryLabel,
  getFormTypeLabel,
  getReferralSourceLabel,
  getStatusLabel,
  referralSourceOptions,
  type Submission,
  type SubmissionStatus,
} from "@/lib/submissions";
import { normalizeTurkishText } from "@/lib/text-normalization";

const DEFAULT_PAGE_SIZE = 20;

function useDebouncedValue<T>(value: T, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, value]);
  return debounced;
}

function parseBool(value: string | null): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

const AdminMembersPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [savingSubmissionId, setSavingSubmissionId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState("");

  const action = searchParams.get("action");

  useEffect(() => {
    if (action === "create-member") setCreateOpen(true);
    if (action === "import-export") setImportOpen(true);
    if (action === "bulk") setBulkOpen(true);
  }, [action]);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE));
  const sortBy = searchParams.get("sortBy") ?? "created_at";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";
  const statusFilter = searchParams.get("status") ?? "";
  const formTypeFilter = searchParams.get("formType") ?? "";
  const categoryFilter = searchParams.get("category") ?? "";
  const referralSourceFilter = searchParams.get("referralSource") ?? "";
  const fromDate = searchParams.get("fromDate") ?? "";
  const toDate = searchParams.get("toDate") ?? "";
  const whatsappFilter = parseBool(searchParams.get("whatsapp"));
  const contestFilter = parseBool(searchParams.get("contest"));

  const [fullnameInput, setFullnameInput] = useState(searchParams.get("fullname") ?? "");
  const [emailInput, setEmailInput] = useState(searchParams.get("email") ?? "");
  const [cityInput, setCityInput] = useState(searchParams.get("city") ?? "");
  const debouncedFullname = useDebouncedValue(fullnameInput);
  const debouncedEmail = useDebouncedValue(emailInput);
  const debouncedCity = useDebouncedValue(cityInput);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedFullname) next.set("fullname", debouncedFullname); else next.delete("fullname");
    if (debouncedEmail) next.set("email", debouncedEmail); else next.delete("email");
    if (debouncedCity) next.set("city", debouncedCity); else next.delete("city");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  }, [debouncedCity, debouncedEmail, debouncedFullname, searchParams, setSearchParams]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value == null || value === "") next.delete(key); else next.set(key, value);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      let query = supabase.from("submissions").select("*", { count: "exact" });

      if (debouncedFullname) query = query.ilike("fullname", `%${debouncedFullname}%`);
      if (debouncedEmail) query = query.ilike("email", `%${debouncedEmail}%`);
      if (debouncedCity) query = query.ilike("city", `%${debouncedCity}%`);
      if (statusFilter) query = query.eq("status", statusFilter);
      if (formTypeFilter) query = query.eq("form_type", formTypeFilter);
      if (categoryFilter) query = query.eq("category", categoryFilter);
      if (referralSourceFilter) query = query.eq("referral_source", referralSourceFilter);
      if (whatsappFilter !== null) query = query.eq("whatsapp_interest", whatsappFilter);
      if (contestFilter !== null) query = query.eq("contest_interest", contestFilter);
      if (fromDate) query = query.gte("created_at", `${fromDate}T00:00:00.000Z`);
      if (toDate) query = query.lte("created_at", `${toDate}T23:59:59.999Z`);

      const start = (Math.max(page, 1) - 1) * Math.max(pageSize, 1);
      const end = start + Math.max(pageSize, 1) - 1;
      const { data, count, error } = await query.order(sortBy, { ascending: sortDir === "asc" }).range(start, end);

      if (cancelled) return;

      if (error) {
        console.error(error);
        toast({ title: "Kayıtlar yüklenemedi", description: error.message, variant: "destructive" });
        setRows([]);
        setTotalCount(0);
      } else {
        setRows(data ?? []);
        setTotalCount(count ?? 0);
      }
      setLoading(false);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [
    categoryFilter,
    contestFilter,
    debouncedCity,
    debouncedEmail,
    debouncedFullname,
    formTypeFilter,
    fromDate,
    page,
    pageSize,
    referralSourceFilter,
    sortBy,
    sortDir,
    statusFilter,
    toDate,
    toast,
    whatsappFilter,
  ]);

  useEffect(() => {
    if (!rows.length) {
      setSelectedSubmissionId(null);
      return;
    }
    if (!selectedSubmissionId || !rows.some((submission) => submission.id === selectedSubmissionId)) {
      setSelectedSubmissionId(rows[0].id);
    }
  }, [rows, selectedSubmissionId]);

  const selectedSubmission = useMemo(
    () => rows.find((submission) => submission.id === selectedSubmissionId) ?? null,
    [rows, selectedSubmissionId],
  );

  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, checked]) => checked).map(([id]) => id),
    [rowSelection],
  );

  const columns = useMemo<ColumnDef<Submission>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(checked) => table.toggleAllPageRowsSelected(Boolean(checked))}
          />
        ),
        cell: ({ row }) => (
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))} />
        ),
      },
      {
        accessorKey: "created_at",
        header: "Tarih",
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{new Date(row.original.created_at).toLocaleDateString("tr-TR")}</span>,
      },
      {
        accessorKey: "form_type",
        header: "Tür",
        cell: ({ row }) => <Badge variant="outline">{getFormTypeLabel(row.original.form_type)}</Badge>,
      },
      { accessorKey: "category", header: "Kategori", cell: ({ row }) => <span className="text-xs">{getCategoryLabel(row.original.category)}</span> },
      { accessorKey: "status", header: "Durum", cell: ({ row }) => <Badge variant="secondary">{getStatusLabel(row.original.status)}</Badge> },
      { accessorKey: "fullname", header: "Ad Soyad", cell: ({ row }) => <span className="text-xs font-medium">{row.original.fullname}</span> },
      { accessorKey: "city", header: "Şehir", cell: ({ row }) => <span className="text-xs">{row.original.city}</span> },
      { accessorKey: "email", header: "E-posta", cell: ({ row }) => <span className="text-xs">{row.original.email}</span> },
      {
        accessorKey: "referral_code",
        header: "Referral Kodu",
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.referral_code || "-"}</span>,
      },
      {
        accessorKey: "referral_source",
        header: "Referral Kaynağı",
        cell: ({ row }) => <span className="text-xs">{getReferralSourceLabel(row.original.referral_source)}</span>,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));

  const closeAction = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("action");
    setSearchParams(next, { replace: true });
  };

  const exportCSV = () => {
    const headers = ["Tarih", "Tür", "Kategori", "Durum", "Ad Soyad", "Ülke", "Şehir", "E-posta", "Telefon", "Referral Kaynağı", "Referral Kodu"];
    const csvRows = rows.map((submission) => [
      new Date(submission.created_at).toLocaleDateString("tr-TR"),
      submission.form_type,
      submission.category || "",
      submission.status,
      submission.fullname,
      submission.country,
      submission.city,
      submission.email,
      submission.phone,
      submission.referral_source || "",
      submission.referral_code || "",
    ]);

    const csvContent = [headers, ...csvRows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `diaspora-connect-members-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const updateSubmission = async (submissionId: string, patch: Partial<Submission>) => {
    setSavingSubmissionId(submissionId);
    const { data, error } = await supabase.from("submissions").update(patch).eq("id", submissionId).select("*").single();
    if (error) {
      toast({ title: "Kayıt güncellenemedi", description: error.message, variant: "destructive" });
    } else if (data) {
      setRows((current) => current.map((submission) => (submission.id === submissionId ? data : submission)));
      toast({ title: "Kayıt güncellendi" });
    }
    setSavingSubmissionId(null);
  };

  const createMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      fullname: normalizeTurkishText(String(form.get("fullname") ?? "")),
      country: normalizeTurkishText(String(form.get("country") ?? "")),
      city: normalizeTurkishText(String(form.get("city") ?? "")),
      field: normalizeTurkishText(String(form.get("field") ?? "")),
      email: normalizeTurkishText(String(form.get("email") ?? "")),
      phone: normalizeTurkishText(String(form.get("phone") ?? "")),
      form_type: "register",
      category: "bireysel",
      consent: true,
      status: "new",
    };
    const { error } = await supabase.from("submissions").insert(payload);
    if (error) {
      toast({ title: "Kayıt eklenemedi", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Yeni kayıt eklendi" });
    setCreateOpen(false);
    closeAction();
    setRows([]);
    setSearchParams(new URLSearchParams(searchParams), { replace: true });
  };

  const importCsv = async () => {
    const lines = importCsvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      toast({ title: "CSV geçersiz", description: "En az bir satır veri olmalı.", variant: "destructive" });
      return;
    }

    const header = lines[0].split(",").map((cell) => cell.trim().toLowerCase());
    const required = ["fullname", "country", "city", "field", "email", "phone"];
    if (!required.every((key) => header.includes(key))) {
      toast({ title: "CSV başlığı eksik", description: "Gerekli başlıklar: fullname,country,city,field,email,phone", variant: "destructive" });
      return;
    }

    const rowsToInsert = lines.slice(1).map((line) => {
      const values = line.split(",").map((cell) => cell.trim());
      const get = (key: string) => values[header.indexOf(key)] ?? "";
      return {
        fullname: normalizeTurkishText(get("fullname")),
        country: normalizeTurkishText(get("country")),
        city: normalizeTurkishText(get("city")),
        field: normalizeTurkishText(get("field")),
        email: normalizeTurkishText(get("email")),
        phone: normalizeTurkishText(get("phone")),
        form_type: get("form_type") || "register",
        category: get("category") || "bireysel",
        status: (get("status") as SubmissionStatus) || "new",
        consent: true,
      };
    });

    const { error } = await supabase.from("submissions").insert(rowsToInsert);
    if (error) {
      toast({ title: "Import başarısız", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Import tamamlandı", description: `${rowsToInsert.length} kayıt eklendi.` });
    setImportOpen(false);
    closeAction();
    setImportCsvText("");
  };

  const applyBulk = async (status: SubmissionStatus, note: string) => {
    if (!selectedIds.length) {
      toast({ title: "Toplu işlem", description: "Önce en az bir kayıt seçin.", variant: "destructive" });
      return;
    }
    const patch: Partial<Submission> = { status };
    if (note.trim()) patch.notes = normalizeTurkishText(note);
    const { error } = await supabase.from("submissions").update(patch).in("id", selectedIds);
    if (error) {
      toast({ title: "Toplu işlem başarısız", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Toplu işlem tamamlandı", description: `${selectedIds.length} kayıt güncellendi.` });
    setBulkOpen(false);
    closeAction();
    setRowSelection({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Üye Takibi</CardTitle>
          <CardDescription>Sunucu tarafı sayfalama, kolon bazlı filtre ve URL persistent state.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Filtreler iki satırda düzenlendi. Dropdown alanlarının üstündeki etiketler hangi veriyi filtrelediğini gösterir.
          </p>
          <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Ad Soyad (metin)</label>
              <Input className="h-8 text-xs" value={fullnameInput} onChange={(event) => setFullnameInput(event.target.value)} placeholder="Ada Lovelace" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">E-posta (metin)</label>
              <Input className="h-8 text-xs" value={emailInput} onChange={(event) => setEmailInput(event.target.value)} placeholder="mail ara" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Şehir (metin)</label>
              <Input className="h-8 text-xs" value={cityInput} onChange={(event) => setCityInput(event.target.value)} placeholder="şehir ara" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Durum (enum)</label>
              <Select value={statusFilter || "__all__"} onValueChange={(value) => updateParam("status", value === "__all__" ? "" : value)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Durum" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tümü</SelectItem>
                  <SelectItem value="new">Yeni</SelectItem>
                  <SelectItem value="contacted">İletişime geçildi</SelectItem>
                  <SelectItem value="archived">Arşiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Form Türü (enum)</label>
              <Select value={formTypeFilter || "__all__"} onValueChange={(value) => updateParam("formType", value === "__all__" ? "" : value)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Form Türü" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tümü</SelectItem>
                  <SelectItem value="register">Kayıt</SelectItem>
                  <SelectItem value="support">Destek</SelectItem>
                  <SelectItem value="backer">Backer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Kategori (enum)</label>
              <Select value={categoryFilter || "__all__"} onValueChange={(value) => updateParam("category", value === "__all__" ? "" : value)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tümü</SelectItem>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Referral Kaynağı (enum)</label>
              <Select value={referralSourceFilter || "__all__"} onValueChange={(value) => updateParam("referralSource", value === "__all__" ? "" : value)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Referral kaynağı" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tümü</SelectItem>
                  {referralSourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Başlangıç Tarihi</label>
              <Input className="h-8 text-xs" type="date" value={fromDate} onChange={(event) => updateParam("fromDate", event.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Bitiş Tarihi</label>
              <Input className="h-8 text-xs" type="date" value={toDate} onChange={(event) => updateParam("toDate", event.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">WhatsApp İlgisi (boolean)</label>
              <Select value={searchParams.get("whatsapp") ?? "__all__"} onValueChange={(value) => updateParam("whatsapp", value === "__all__" ? "" : value)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="WhatsApp ilgisi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tümü</SelectItem>
                  <SelectItem value="true">Evet</SelectItem>
                  <SelectItem value="false">Hayır</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Yarışma İlgisi (boolean)</label>
              <Select value={searchParams.get("contest") ?? "__all__"} onValueChange={(value) => updateParam("contest", value === "__all__" ? "" : value)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Yarışma ilgisi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tümü</SelectItem>
                  <SelectItem value="true">Evet</SelectItem>
                  <SelectItem value="false">Hayır</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Filtreleri Temizle</label>
              <Button
                variant="outline"
                className="h-8 w-full text-xs"
                onClick={() =>
                  setSearchParams(
                    new URLSearchParams({ page: "1", pageSize: String(pageSize), sortBy, sortDir }),
                    { replace: true },
                  )
                }
              >
                Sıfırla
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/70">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-xs">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-10 text-center text-sm text-muted-foreground">
                      Yükleniyor...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={`${
                        row.original.id === selectedSubmissionId
                          ? "bg-green-100/70 dark:bg-green-900/30"
                          : index % 2 === 0
                            ? "bg-background"
                            : "bg-muted/20"
                      } cursor-pointer hover:bg-green-100/60 dark:hover:bg-green-900/40`}
                      onClick={() => setSelectedSubmissionId(row.original.id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-2 align-middle text-xs">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-10 text-center text-sm text-muted-foreground">
                      Kayıt bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Toplam {totalCount} kayıt · Seçili {selectedIds.length}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateParam("page", String(Math.max(1, page - 1)))}
                disabled={page <= 1}
              >
                Önceki
              </Button>
              <span className="text-xs">{page} / {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateParam("page", String(Math.min(totalPages, page + 1)))}
                disabled={page >= totalPages}
              >
                Sonraki
              </Button>
              <Select value={String(pageSize)} onValueChange={(value) => updateParam("pageSize", value)}>
                <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / sayfa</SelectItem>
                  <SelectItem value="20">20 / sayfa</SelectItem>
                  <SelectItem value="50">50 / sayfa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kayıt Detayı</CardTitle>
          <CardDescription>Seçili üyenin status/not yönetimi.</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedSubmission ? (
            <div className="space-y-3 text-sm">
              <div className="font-semibold">{selectedSubmission.fullname}</div>
              <div>{selectedSubmission.email} · {selectedSubmission.phone}</div>
              <div>{selectedSubmission.country}, {selectedSubmission.city}</div>
              <div>Referral: {getReferralSourceLabel(selectedSubmission.referral_source)} / {selectedSubmission.referral_code || "-"}</div>
              <div className="flex gap-2">
                <Select
                  value={selectedSubmission.status}
                  onValueChange={(value) => void updateSubmission(selectedSubmission.id, { status: value as SubmissionStatus })}
                  disabled={savingSubmissionId === selectedSubmission.id}
                >
                  <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Yeni</SelectItem>
                    <SelectItem value="contacted">İletişime geçildi</SelectItem>
                    <SelectItem value="archived">Arşiv</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={exportCSV}>CSV Export</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Detayları görmek için tablodan bir kayıt seçin.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) closeAction(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni kayıt ekle</DialogTitle>
            <DialogDescription>Gerekli alanları girerek üye oluşturun.</DialogDescription>
          </DialogHeader>
          <form className="space-y-3" onSubmit={(event) => void createMember(event)}>
            <Input name="fullname" placeholder="Ad Soyad" required />
            <Input name="country" placeholder="Ülke" required />
            <Input name="city" placeholder="Şehir" required />
            <Input name="field" placeholder="Alan" required />
            <Input name="email" type="email" placeholder="E-posta" required />
            <Input name="phone" placeholder="Telefon" required />
            <DialogFooter>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={importOpen} onOpenChange={(open) => { setImportOpen(open); if (!open) closeAction(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export / Import</DialogTitle>
            <DialogDescription>CSV export alın veya CSV metni ile toplu import yapın.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button variant="secondary" onClick={exportCSV}>Mevcut listeyi CSV export et</Button>
            <Textarea
              value={importCsvText}
              onChange={(event) => setImportCsvText(event.target.value)}
              placeholder="fullname,country,city,field,email,phone&#10;Ada Lovelace,Germany,Berlin,AI,ada@example.com,+49..."
              rows={10}
            />
            <DialogFooter>
              <Button onClick={() => void importCsv()}>CSV Import</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <BulkDialog
        open={bulkOpen}
        onClose={() => { setBulkOpen(false); closeAction(); }}
        onApply={(status, note) => void applyBulk(status, note)}
        selectedCount={selectedIds.length}
      />
    </div>
  );
};

const BulkDialog = ({
  open,
  onClose,
  onApply,
  selectedCount,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (status: SubmissionStatus, note: string) => void;
  selectedCount: number;
}) => {
  const [status, setStatus] = useState<SubmissionStatus>("contacted");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setStatus("contacted");
      setNote("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Toplu işlem</DialogTitle>
          <DialogDescription>{selectedCount} seçili kayıt güncellenecek.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Select value={status} onValueChange={(value) => setStatus(value as SubmissionStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Yeni</SelectItem>
              <SelectItem value="contacted">İletişime geçildi</SelectItem>
              <SelectItem value="archived">Arşiv</SelectItem>
            </SelectContent>
          </Select>
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Opsiyonel admin notu" rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Vazgeç</Button>
            <Button onClick={() => onApply(status, note)}>Uygula</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminMembersPage;
