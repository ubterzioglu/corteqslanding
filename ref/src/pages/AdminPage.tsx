import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, LogOut, Search } from "lucide-react";

interface Submission {
  id: string;
  form_type: string;
  category: string | null;
  fullname: string;
  country: string;
  city: string;
  business: string | null;
  field: string;
  email: string;
  phone: string;
  description: string | null;
  offers_needs: string | null;
  document_url: string | null;
  document_name: string | null;
  documents: { url: string; name: string }[] | null;
  contest_interest: boolean | null;
  linkedin: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  twitter: string | null;
  website: string | null;
  consent: boolean;
  created_at: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
      if (session) fetchSubmissions();
      else setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      if (session) fetchSubmissions();
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast({ title: "Veri yüklenemedi", variant: "destructive" });
    } else {
      setSubmissions((data as unknown as Submission[]) || []);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setSubmissions([]);
  };

  const exportCSV = () => {
    const headers = ["Tarih", "Tür", "Kategori", "Ad Soyad", "Ülke", "Şehir", "İşletme", "İştigal", "E-posta", "Telefon", "Açıklama", "Arz & Talep", "Doküman", "Yarışma", "LinkedIn", "Instagram", "TikTok", "Facebook", "Twitter", "Website"];
    const rows = filtered.map(s => [
      new Date(s.created_at).toLocaleDateString("tr-TR"),
      s.form_type,
      s.category || "",
      s.fullname,
      s.country,
      s.city,
      s.business || "",
      s.field,
      s.email,
      s.phone,
      s.description || "",
      s.offers_needs || "",
      (s.documents && s.documents.length > 0
        ? s.documents.map((d) => `${d.name}: ${d.url}`).join(" | ")
        : s.document_url || ""),
      s.contest_interest ? "Evet" : "Hayır",
      s.linkedin || "",
      s.instagram || "",
      s.tiktok || "",
      s.facebook || "",
      s.twitter || "",
      s.website || "",
    ]);

    const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diaspora-connect-kayitlar-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = submissions.filter(s => {
    const matchType = filterType === "all" || s.form_type === filterType || s.category === filterType;
    const matchSearch = search === "" || Object.values(s).some(v => String(v || "").toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Admin Giriş</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {authLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Diaspora Connect — Kayıtlar</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Excel / CSV İndir
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Çıkış
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">Tümü</option>
            <option value="register">Kayıtlar</option>
            <option value="support">Destek/Yatırım</option>
            <option value="danisman">Danışman / Doktor / Avukat</option>
            <option value="isletme">İşletme</option>
            <option value="dernek">Dernek</option>
            <option value="vakif">Vakıf</option>
            <option value="radyo-tv">Radyo/TV</option>
            <option value="blogger-vlogger">Blogger/Vlogger</option>
            <option value="sehir-elcisi">Şehir Elçisi / City Business Partner</option>
            <option value="bireysel">Bireysel</option>
          </select>
          <span className="text-sm text-muted-foreground">{filtered.length} kayıt</span>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Yükleniyor...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-3 font-semibold text-foreground">Tarih</th>
                  <th className="text-left p-3 font-semibold text-foreground">Tür</th>
                  <th className="text-left p-3 font-semibold text-foreground">Kategori</th>
                  <th className="text-left p-3 font-semibold text-foreground">Ad Soyad</th>
                  <th className="text-left p-3 font-semibold text-foreground">Ülke / Şehir</th>
                  <th className="text-left p-3 font-semibold text-foreground">İşletme</th>
                  <th className="text-left p-3 font-semibold text-foreground">İştigal</th>
                  <th className="text-left p-3 font-semibold text-foreground">E-posta</th>
                  <th className="text-left p-3 font-semibold text-foreground">Telefon</th>
                  <th className="text-left p-3 font-semibold text-foreground">Arz & Talep</th>
                  <th className="text-left p-3 font-semibold text-foreground">Doküman</th>
                  <th className="text-left p-3 font-semibold text-foreground">Sosyal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.form_type === "support" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                        {s.form_type === "support" ? "Destek" : "Kayıt"}
                      </span>
                    </td>
                    <td className="p-3 text-foreground">{s.category || "—"}</td>
                    <td className="p-3 text-foreground font-medium">{s.fullname}</td>
                    <td className="p-3 text-foreground">{s.country}, {s.city}</td>
                    <td className="p-3 text-foreground">{s.business || "—"}</td>
                    <td className="p-3 text-foreground">{s.field}</td>
                    <td className="p-3">
                      <a href={`mailto:${s.email}`} className="text-primary hover:underline">{s.email}</a>
                    </td>
                    <td className="p-3 text-foreground whitespace-nowrap">{s.phone}</td>
                    <td className="p-3 text-foreground max-w-[220px]">
                      {s.offers_needs ? (
                        <span className="text-xs line-clamp-3" title={s.offers_needs}>{s.offers_needs}</span>
                      ) : "—"}
                    </td>
                    <td className="p-3">
                      {s.documents && s.documents.length > 0 ? (
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          {s.documents.map((d, i) => (
                            <a
                              key={i}
                              href={d.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline truncate"
                              title={d.name}
                            >
                              📎 {d.name}
                            </a>
                          ))}
                        </div>
                      ) : s.document_url ? (
                        <a
                          href={s.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          📎 {s.document_name || "Dosya"}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {s.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">LI</a>}
                        {s.instagram && <span className="text-xs text-muted-foreground">{s.instagram}</span>}
                        {s.tiktok && <span className="text-xs text-muted-foreground">{s.tiktok}</span>}
                        {!s.linkedin && !s.instagram && !s.tiktok && "—"}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={12} className="p-8 text-center text-muted-foreground">Kayıt bulunamadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
