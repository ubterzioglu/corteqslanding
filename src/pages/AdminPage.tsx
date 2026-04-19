import { useCallback, useEffect, useMemo, useState } from "react";

import type { Session } from "@supabase/supabase-js";
import { Download, LogOut, Mail, MapPin, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { userIsAdmin } from "@/lib/admin";
import {
  buildSubmissionSearchText,
  getCategoryLabel,
  getFormTypeLabel,
  getReferralSourceLabel,
  getStatusLabel,
  submissionStatusOptions,
  type Submission,
  type SubmissionStatus,
} from "@/lib/submissions";

const AdminPage = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [savingSubmissionId, setSavingSubmissionId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast({ title: "Veri yüklenemedi", description: error.message, variant: "destructive" });
    } else {
      setSubmissions(data || []);
    }

    setLoading(false);
  }, [toast]);

  const syncSession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    setAuthenticated(Boolean(nextSession));
    setCheckingAccess(true);

    if (!nextSession?.user) {
      setIsAdmin(false);
      setSubmissions([]);
      setLoading(false);
      setCheckingAccess(false);
      return;
    }

    try {
      const allowed = await userIsAdmin(nextSession.user.id);
      setIsAdmin(allowed);

      if (allowed) {
        await fetchSubmissions();
      } else {
        setSubmissions([]);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsAdmin(false);
      setLoading(false);
      toast({
        title: "Admin erişimi doğrulanamadı",
        description: "Yetki kontrolü sırasında bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setCheckingAccess(false);
    }
  }, [fetchSubmissions, toast]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    void supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      void syncSession(initialSession);
    });

    return () => data.subscription.unsubscribe();
  }, [syncSession]);

  const filtered = useMemo(
    () =>
      submissions.filter((submission) => {
        const matchType =
          filterType === "all" ||
          submission.form_type === filterType ||
          submission.category === filterType ||
          submission.status === filterType;
        const matchSearch = search === "" || buildSubmissionSearchText(submission).includes(search.toLowerCase());
        return matchType && matchSearch;
      }),
    [filterType, search, submissions],
  );

  useEffect(() => {
    if (!filtered.length) {
      setSelectedSubmissionId(null);
      return;
    }

    if (!selectedSubmissionId || !filtered.some((submission) => submission.id === selectedSubmissionId)) {
      setSelectedSubmissionId(filtered[0].id);
    }
  }, [filtered, selectedSubmissionId]);

  const selectedSubmission = useMemo(
    () => submissions.find((submission) => submission.id === selectedSubmissionId) ?? null,
    [selectedSubmissionId, submissions],
  );

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Giriş başarısız", description: error.message, variant: "destructive" });
    }

    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
    setIsAdmin(false);
    setSession(null);
    setSubmissions([]);
  };

  const exportCSV = () => {
    const headers = [
      "Tarih",
      "Tür",
      "Kategori",
      "Durum",
      "Ad Soyad",
      "Ülke",
      "Şehir",
      "İşletme",
      "İştigal",
      "E-posta",
      "Telefon",
      "Açıklama",
      "Notlar",
      "Yarisma",
      "LinkedIn",
      "Instagram",
      "TikTok",
      "Facebook",
      "Twitter",
      "Website",
      "Firma Adı",
      "Bağış Tutarı",
      "Bağış Para Birimi",
      "WhatsApp İlgi",
      "Referral Kaynağı",
      "Referral Detayı",
      "Referral Kodu",
    ];
    const rows = filtered.map((submission) => [
      new Date(submission.created_at).toLocaleDateString("tr-TR"),
      submission.form_type,
      submission.category || "",
      submission.status,
      submission.fullname,
      submission.country,
      submission.city,
      submission.business || "",
      submission.field,
      submission.email,
      submission.phone,
      submission.description || "",
      submission.notes || "",
      submission.contest_interest ? "Evet" : "Hayır",
      submission.linkedin || "",
      submission.instagram || "",
      submission.tiktok || "",
      submission.facebook || "",
      submission.twitter || "",
      submission.website || "",
      submission.company_name || "",
      submission.donation_amount != null ? String(submission.donation_amount) : "",
      submission.donation_currency || "",
      submission.whatsapp_interest ? "Evet" : "Hayır",
      submission.referral_source || "",
      submission.referral_detail || "",
      submission.referral_code || "",
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `diaspora-connect-kayitlar-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const updateSubmission = useCallback(
    async (submissionId: string, patch: Partial<Submission>) => {
      if (!session?.user?.id) return;

      setSavingSubmissionId(submissionId);
      const updatePayload: Partial<Submission> = {
        ...patch,
        reviewed_at: new Date().toISOString(),
        reviewed_by: session.user.id,
      };

      const { data, error } = await supabase
        .from("submissions")
        .update(updatePayload)
        .eq("id", submissionId)
        .select("*")
        .single();

      if (error) {
        toast({ title: "Kayıt güncellenemedi", description: error.message, variant: "destructive" });
      } else if (data) {
        setSubmissions((current) =>
          current.map((submission) => (submission.id === submissionId ? data : submission)),
        );
        toast({ title: "Kayıt güncellendi" });
      }

      setSavingSubmissionId(null);
    },
    [session?.user?.id, toast],
  );

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Giriş</CardTitle>
            <CardDescription>Kayıtlara erişmek için yetkili hesabınızla giriş yapın.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="email" placeholder="E-posta" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <Input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Button type="submit" disabled={authLoading} className="w-full">
                {authLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkingAccess) {
    return <div className="flex min-h-screen items-center justify-center bg-background">Yetki kontrol ediliyor...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Bu hesabın admin yetkisi yok</CardTitle>
            <CardDescription>
              Supabase üzerindeki <code>admin_users</code> tablosuna kullanıcı kimliği eklenmeden kayıtlara erişemezsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Giriş yapan kullanıcı: <span className="font-medium text-foreground">{session?.user.email}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Diaspora Connect Kayıtları</h1>
            <p className="text-sm text-muted-foreground">{session?.user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={exportCSV}>
              <Download className="h-4 w-4" />
              Excel / CSV İndir
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4" />
              Çıkış
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Ara..." value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
          </div>
          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">Tümü</option>
            <option value="register">Kayıtlar</option>
            <option value="support">Destek / Yatırım</option>
            <option value="new">Yeni</option>
            <option value="contacted">İletişime geçildi</option>
            <option value="archived">Arşivlendi</option>
            <option value="danisman">Danışman</option>
            <option value="isletme">İşletme</option>
            <option value="dernek">Dernek</option>
            <option value="vakif">Vakıf</option>
            <option value="radyo-tv">Radyo / TV</option>
            <option value="blogger-vlogger">Blogger / Vlogger</option>
            <option value="sehir-elcisi">Şehir Elçisi</option>
            <option value="bireysel">Bireysel</option>
          </select>
          <span className="text-sm text-muted-foreground">{filtered.length} kayıt</span>
        </div>

        {loading ? (
          <p className="py-12 text-center text-muted-foreground">Yükleniyor...</p>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Kayit Tablosu</CardTitle>
                <CardDescription>Listeyi filtreleyin, detay seçin ve dışarı aktarım alın.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Tur</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>Konum</TableHead>
                      <TableHead>İletişim</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((submission) => (
                      <TableRow
                        key={submission.id}
                        className={submission.id === selectedSubmission?.id ? "bg-muted/60" : undefined}
                        onClick={() => setSelectedSubmissionId(submission.id)}
                      >
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {new Date(submission.created_at).toLocaleDateString("tr-TR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={submission.form_type === "support" ? "secondary" : "default"}>
                            {getFormTypeLabel(submission.form_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getCategoryLabel(submission.category)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getStatusLabel(submission.status)}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{submission.fullname}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {submission.country}, {submission.city}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <a href={`mailto:${submission.email}`} className="block text-primary hover:underline">
                              {submission.email}
                            </a>
                            <span className="text-xs text-muted-foreground">{submission.phone}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                          Kayıt bulunamadı.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kayit Detayi</CardTitle>
                <CardDescription>Durum, not ve iletişim bilgilerini bu alandan yönetin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {selectedSubmission ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{getFormTypeLabel(selectedSubmission.form_type)}</Badge>
                        <Badge variant="outline">{getCategoryLabel(selectedSubmission.category)}</Badge>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">{selectedSubmission.fullname}</h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedSubmission.business || selectedSubmission.field}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm">
                      <a
                        href={`mailto:${selectedSubmission.email}`}
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {selectedSubmission.email}
                      </a>
                      <div>
                        Telefon: <span className="text-muted-foreground">{selectedSubmission.phone}</span>
                      </div>
                      <div>
                        Alan: <span className="text-muted-foreground">{selectedSubmission.field}</span>
                      </div>
                      <div>
                        Konum:{" "}
                        <span className="text-muted-foreground">
                          {selectedSubmission.country}, {selectedSubmission.city}
                        </span>
                      </div>
                      <div>
                        Basvuru:{" "}
                        <span className="text-muted-foreground">
                          {new Date(selectedSubmission.created_at).toLocaleString("tr-TR")}
                        </span>
                      </div>
                      <div>
                        Referral kaynağı:{" "}
                        <span className="text-muted-foreground">{getReferralSourceLabel(selectedSubmission.referral_source)}</span>
                      </div>
                      <div>
                        Referral detayı:{" "}
                        <span className="text-muted-foreground">{selectedSubmission.referral_detail || "Yok"}</span>
                      </div>
                      <div>
                        Referral kodu:{" "}
                        <span className="text-muted-foreground">{selectedSubmission.referral_code || "Yok"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Durum</label>
                      <select
                        value={selectedSubmission.status}
                        onChange={(event) =>
                          void updateSubmission(selectedSubmission.id, {
                            status: event.target.value as SubmissionStatus,
                          })
                        }
                        disabled={savingSubmissionId === selectedSubmission.id}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {submissionStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Açıklama</label>
                      <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                        {selectedSubmission.description || "Bu kayıt için açıklama girilmemiş."}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="submission-notes" className="text-sm font-medium">
                        Admin notu
                      </label>
                      <Textarea
                        id="submission-notes"
                        value={selectedSubmission.notes ?? ""}
                        onChange={(event) => {
                          const nextNotes = event.target.value;
                          setSubmissions((current) =>
                            current.map((submission) =>
                              submission.id === selectedSubmission.id
                                ? { ...submission, notes: nextNotes }
                                : submission,
                            ),
                          );
                        }}
                        placeholder="Bu kayda dair sonraki aksiyonları yazın."
                        rows={5}
                      />
                      <Button
                        variant="secondary"
                        onClick={() => void updateSubmission(selectedSubmission.id, { notes: selectedSubmission.notes ?? "" })}
                        disabled={savingSubmissionId === selectedSubmission.id}
                      >
                        {savingSubmissionId === selectedSubmission.id ? "Kaydediliyor..." : "Notu Kaydet"}
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>LinkedIn: {selectedSubmission.linkedin || "Yok"}</div>
                      <div>Instagram: {selectedSubmission.instagram || "Yok"}</div>
                      <div>TikTok: {selectedSubmission.tiktok || "Yok"}</div>
                      <div>Facebook: {selectedSubmission.facebook || "Yok"}</div>
                      <div>Twitter: {selectedSubmission.twitter || "Yok"}</div>
                      <div>Website: {selectedSubmission.website || "Yok"}</div>
                      <div>Yarışma ilgisi: {selectedSubmission.contest_interest ? "Evet" : "Hayır"}</div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Detayları görmek için listeden bir kayıt seçin.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
