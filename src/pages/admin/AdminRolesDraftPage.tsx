import { useEffect, useMemo, useState } from "react";

import { setUserProfileTypeAsAdmin } from "@/lib/admin";
import { profileTypeOptions, profileTypes, type ProfileType } from "@/lib/profile-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type GoogleUserProfileRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  profile_type: string;
  auth_provider: string | null;
  created_at: string;
};

type ProviderFilter = "google" | "all" | "unknown";
type SortFilter = "created_desc" | "created_asc" | "name_asc";

const AdminRolesDraftPage = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<GoogleUserProfileRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [profileTypeFilter, setProfileTypeFilter] = useState<ProfileType | "all">("all");
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("google");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortFilter, setSortFilter] = useState<SortFilter>("created_desc");

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      let query = supabase
        .from("user_profiles")
        .select("user_id, email, full_name, profile_type, auth_provider, created_at");

      if (providerFilter === "google") {
        query = query.eq("auth_provider", "google");
      } else if (providerFilter === "unknown") {
        query = query.or("auth_provider.is.null,auth_provider.eq.unknown");
      }

      if (profileTypeFilter !== "all") {
        query = query.eq("profile_type", profileTypeFilter);
      }

      const trimmedSearch = searchText.trim();
      if (trimmedSearch) {
        query = query.or(`full_name.ilike.%${trimmedSearch}%,email.ilike.%${trimmedSearch}%`);
      }

      if (fromDate) {
        query = query.gte("created_at", `${fromDate}T00:00:00.000Z`);
      }

      if (toDate) {
        const nextDate = new Date(`${toDate}T00:00:00.000Z`);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        query = query.lt("created_at", nextDate.toISOString());
      }

      if (sortFilter === "created_desc") {
        query = query.order("created_at", { ascending: false });
      } else if (sortFilter === "created_asc") {
        query = query.order("created_at", { ascending: true });
      } else {
        query = query.order("full_name", { ascending: true, nullsFirst: false });
      }

      const { data, error } = await query;

      if (!isMounted) return;

      if (error) {
        setErrorMessage(error.message);
        setRows([]);
        setIsLoading(false);
        return;
      }

      setRows((data ?? []) as GoogleUserProfileRow[]);
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [fromDate, profileTypeFilter, providerFilter, searchText, sortFilter, toDate]);

  const totalGoogleUsers = useMemo(() => rows.length, [rows]);
  const profileTypeLabelMap = useMemo(
    () => new Map(profileTypeOptions.map((option) => [option.type, option.title])),
    [],
  );

  const resetFilters = () => {
    setSearchText("");
    setProfileTypeFilter("all");
    setProviderFilter("google");
    setFromDate("");
    setToDate("");
    setSortFilter("created_desc");
  };

  const handleProfileTypeChange = async (row: GoogleUserProfileRow, value: string) => {
    if (!profileTypes.includes(value as ProfileType)) return;

    const nextType = value as ProfileType;
    const previousType = row.profile_type;
    if (nextType === previousType) return;

    setRows((current) =>
      current.map((item) => (item.user_id === row.user_id ? { ...item, profile_type: nextType } : item)),
    );
    setUpdatingUserId(row.user_id);

    try {
      await setUserProfileTypeAsAdmin(row.user_id, nextType);
      toast({
        title: "Profil tipi güncellendi",
        description: `${row.email ?? row.user_id} için profil tipi ${profileTypeLabelMap.get(nextType) ?? nextType} olarak kaydedildi.`,
      });
    } catch (error) {
      setRows((current) =>
        current.map((item) => (item.user_id === row.user_id ? { ...item, profile_type: previousType } : item)),
      );
      toast({
        title: "Profil tipi güncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId((current) => (current === row.user_id ? null : current));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Roller (Taslak)</CardTitle>
          <CardDescription>
            Google ile giriş yapmış kullanıcılar burada listelenir. Bu liste role/yetki dağıtımı için başlangıç havuzudur.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-3">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Arama (Ad/E-posta)</label>
                <Input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Örn: ayse / @mail.com"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Profil tipi</label>
                <Select value={profileTypeFilter} onValueChange={(value) => setProfileTypeFilter(value as ProfileType | "all")}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {profileTypeOptions.map((option) => (
                      <SelectItem key={option.type} value={option.type}>{option.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Provider</label>
                <Select value={providerFilter} onValueChange={(value) => setProviderFilter(value as ProviderFilter)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="unknown">Unknown / Boş</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Kayıt başlangıç</label>
                <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Kayıt bitiş</label>
                <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Sıralama</label>
                <Select value={sortFilter} onValueChange={(value) => setSortFilter(value as SortFilter)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_desc">En yeni kayıt</SelectItem>
                    <SelectItem value="created_asc">En eski kayıt</SelectItem>
                    <SelectItem value="name_asc">Ada göre (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
            Filtrelenen toplam kullanıcı: <span className="font-semibold text-foreground">{totalGoogleUsers}</span>
          </div>

          {isLoading ? <p className="text-sm text-muted-foreground">Kullanıcı listesi yükleniyor...</p> : null}
          {errorMessage ? <p className="text-sm text-destructive">Liste alınamadı: {errorMessage}</p> : null}

          {!isLoading && !errorMessage ? (
            rows.length > 0 ? (
              <div className="overflow-x-auto rounded-md border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 font-medium">Ad Soyad</th>
                      <th className="px-3 py-2 font-medium">E-posta</th>
                      <th className="px-3 py-2 font-medium">Profil Tipi</th>
                      <th className="px-3 py-2 font-medium">Provider</th>
                      <th className="px-3 py-2 font-medium">Kayıt Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.user_id} className="border-t">
                        <td className="px-3 py-2">{row.full_name || "-"}</td>
                        <td className="px-3 py-2">{row.email || "-"}</td>
                        <td className="px-3 py-2">
                          <Select
                            value={row.profile_type}
                            onValueChange={(value) => void handleProfileTypeChange(row, value)}
                            disabled={updatingUserId === row.user_id}
                          >
                            <SelectTrigger className="h-8 min-w-[180px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {profileTypeOptions.map((option) => (
                                <SelectItem key={option.type} value={option.type}>
                                  {option.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">{row.auth_provider || "-"}</td>
                        <td className="px-3 py-2">
                          {new Date(row.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Berlin" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Google ile giriş yapmış kullanıcı bulunamadı.</p>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesDraftPage;
