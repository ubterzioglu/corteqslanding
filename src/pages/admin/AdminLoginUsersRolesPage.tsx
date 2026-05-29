import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { setUserRoleAsAdmin } from "@/lib/admin";
import AdminPageGuideAccordion, { type AdminPageGuideSection } from "@/components/admin/AdminPageGuideAccordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UserRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  profile_type: string;
  auth_provider: string | null;
  created_at: string;
};

type RoleRow = {
  id: string;
  key: string;
  label: string;
  sort_order: number;
  is_active: boolean;
};

type AssignmentRow = {
  user_id: string;
  role_id: string;
};

type ProviderFilter = "google" | "all" | "unknown";
type SortFilter = "created_desc" | "created_asc" | "name_asc";
type UsersRolesBackFilters = {
  q?: string;
  provider?: ProviderFilter;
  from?: string;
  to?: string;
  sort?: SortFilter;
};

const DEFAULT_PROVIDER_FILTER: ProviderFilter = "google";
const DEFAULT_SORT_FILTER: SortFilter = "created_desc";

const parseProviderFilter = (value: string | null): ProviderFilter => {
  if (value === "all" || value === "unknown" || value === "google") {
    return value;
  }
  return DEFAULT_PROVIDER_FILTER;
};

const parseSortFilter = (value: string | null): SortFilter => {
  if (value === "created_asc" || value === "name_asc" || value === "created_desc") {
    return value;
  }
  return DEFAULT_SORT_FILTER;
};

const buildUsersRolesSearchParams = (filters: UsersRolesBackFilters) => {
  const next = new URLSearchParams();
  if (filters.q) next.set("q", filters.q);
  if (filters.provider && filters.provider !== DEFAULT_PROVIDER_FILTER) next.set("provider", filters.provider);
  if (filters.from) next.set("from", filters.from);
  if (filters.to) next.set("to", filters.to);
  if (filters.sort && filters.sort !== DEFAULT_SORT_FILTER) next.set("sort", filters.sort);
  return next;
};

const guideSections: AdminPageGuideSection[] = [
  {
    title: "Bu ekran ne için kullanılır?",
    items: [
      "Bu ekran, sisteme giriş yapmış kullanıcıların hangi rolde olduğunu görmek ve gerekiyorsa rolünü düzeltmek için kullanılır.",
      "Kullanıcının bekleyen onayı veya ekstra feature override ihtiyacı var mı ilk bakışta burada anlaşılır.",
      "Bir kullanıcı yanlış dashboard, yanlış profil formu veya yanlış taxonomy seçim grubu görüyorsa ilk bakılacak yer burasıdır.",
    ],
  },
  {
    title: "Adım adım nasıl kullanılır?",
    items: [
      "1. Üstteki arama kutusuna kullanıcının adını veya e-postasını yaz.",
      "2. Gerekirse `Provider`, `Kayıt başlangıç`, `Kayıt bitiş` ve `Sıralama` filtreleriyle listeyi daralt.",
      "3. Doğru kullanıcı satırını bulunca `Rol` sütunundaki mevcut rolü kontrol et.",
      "4. Rol yanlışsa `Düzenle` butonuna tıkla, doğru rolü seç ve `Kaydet` ile işlemi tamamla.",
      "5. Kaydetmeden sonra aynı satırdaki `Pending` ve `Override` sayılarına bak; ekstra işlem gerekip gerekmediğini hemen anla.",
      "6. Rol değişikliği sonrası kullanıcıda görünüm kartı sorunu varsa `Profile Sections`, sınıflandırma sorunu varsa `Taxonomy Yönetimi`, alan/form sorunu varsa `Attribute Yönetimi` ekranına geç.",
    ],
  },
  {
    title: "Hangi durumda hangi kararı ver?",
    items: [
      "Kullanıcının tüm deneyimi değişecekse rolü burada değiştir. Sadece tek bir izin farklı olsun istiyorsan role dokunma, `Feature Override` ekranına git.",
      "Kullanıcı yanlış role atanmışsa önce burada düzelt, sonra gerekiyorsa `Roller & Featurelar`, `Attribute Yönetimi`, `Profile Sections` veya `Taxonomy Yönetimi` tarafını kontrol et.",
      "Bir kullanıcı için `Pending` sayısı yüksekse rolü değiştirip çıkma; ilgili onay kuyruklarını da ayrıca incele.",
    ],
  },
  {
    title: "Kaydettikten sonra ne kontrol etmelisin?",
    items: [
      "Rol değişince kullanıcı satırında yeni rol label'ının göründüğünü kontrol et.",
      "Kullanıcının işi rol değişikliğiyle çözüldüyse ekstra override vermemeye çalış; sistem temiz kalsın.",
      "Emin değilsen kullanıcıyı profilde veya ilgili admin ekranlarında tekrar açıp yeni davranışı doğrula.",
      "Özellikle `danisman` ve `isletme` rollerinde, taxonomy'ye bağlı zorunlu alanlar değişebileceği için profil ekranını ayrıca kontrol et.",
    ],
  },
];

const AdminLoginUsersRolesPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [roleByUserId, setRoleByUserId] = useState<Record<string, string>>({});
  const [pendingCountByUserId, setPendingCountByUserId] = useState<Record<string, number>>({});
  const [overrideCountByUserId, setOverrideCountByUserId] = useState<Record<string, number>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [draftRoleByUserId, setDraftRoleByUserId] = useState<Record<string, string>>({});

  const searchText = searchParams.get("q") ?? "";
  const providerFilter = parseProviderFilter(searchParams.get("provider"));
  const fromDate = searchParams.get("from") ?? "";
  const toDate = searchParams.get("to") ?? "";
  const sortFilter = parseSortFilter(searchParams.get("sort"));

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("id, key, label, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!isMounted) return;

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setRoles((data ?? []) as RoleRow[]);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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
        setRows([]);
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      const userRows = (data ?? []) as UserRow[];
      setRows(userRows);

      if (userRows.length === 0) {
        setRoleByUserId({});
        setPendingCountByUserId({});
        setOverrideCountByUserId({});
        setIsLoading(false);
        return;
      }

      const [assignmentsResult, approvalsResult, overridesResult] = await Promise.all([
        supabase
          .from("user_role_assignments")
          .select("user_id, role_id")
          .in("user_id", userRows.map((row) => row.user_id)),
        supabase
          .from("approval_requests")
          .select("user_id, status")
          .eq("status", "pending")
          .in("user_id", userRows.map((row) => row.user_id)),
        supabase
          .from("user_feature_overrides")
          .select("user_id, feature_key")
          .in("user_id", userRows.map((row) => row.user_id)),
      ]);

      if (!isMounted) return;

      if (assignmentsResult.error || approvalsResult.error || overridesResult.error) {
        setErrorMessage(assignmentsResult.error?.message ?? approvalsResult.error?.message ?? overridesResult.error?.message ?? "Bilinmeyen hata");
        setRoleByUserId({});
        setPendingCountByUserId({});
        setOverrideCountByUserId({});
        setIsLoading(false);
        return;
      }

      const nextMap: Record<string, string> = {};
      for (const item of (assignmentsResult.data ?? []) as AssignmentRow[]) {
        nextMap[item.user_id] = item.role_id;
      }

      const nextPendingCountByUserId: Record<string, number> = {};
      for (const row of approvalsResult.data ?? []) {
        nextPendingCountByUserId[row.user_id] = (nextPendingCountByUserId[row.user_id] ?? 0) + 1;
      }

      const nextOverrideCountByUserId: Record<string, number> = {};
      for (const row of overridesResult.data ?? []) {
        nextOverrideCountByUserId[row.user_id] = (nextOverrideCountByUserId[row.user_id] ?? 0) + 1;
      }

      setRoleByUserId(nextMap);
      setPendingCountByUserId(nextPendingCountByUserId);
      setOverrideCountByUserId(nextOverrideCountByUserId);
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [fromDate, providerFilter, searchText, sortFilter, toDate]);

  useEffect(() => {
    if (!editingUserId) return;
    if (rows.some((row) => row.user_id === editingUserId)) return;
    setEditingUserId(null);
  }, [editingUserId, rows]);

  const roleById = useMemo(() => {
    return new Map(roles.map((role) => [role.id, role]));
  }, [roles]);

  const roleIdByKey = useMemo(() => {
    return new Map(roles.map((role) => [role.key, role.id]));
  }, [roles]);

  const totalUsers = rows.length;

  const updateFilter = (key: keyof UsersRolesBackFilters, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const handleRoleChange = async (row: UserRow, nextRoleId: string) => {
    const nextRole = roleById.get(nextRoleId);
    if (!nextRole) return;

    const prevRoleId = roleByUserId[row.user_id] ?? roleIdByKey.get(row.profile_type) ?? "";
    setRoleByUserId((current) => ({ ...current, [row.user_id]: nextRoleId }));
    setUpdatingUserId(row.user_id);

    try {
      await setUserRoleAsAdmin(row.user_id, nextRole.key);
      setRows((current) =>
        current.map((item) => (item.user_id === row.user_id ? { ...item, profile_type: nextRole.key } : item)),
      );
      setEditingUserId((current) => (current === row.user_id ? null : current));
      toast({
        title: "Rol güncellendi",
        description: `${row.email ?? row.user_id} için rol ${nextRole.label} olarak kaydedildi.`,
      });
    } catch (error) {
      setRoleByUserId((current) => ({ ...current, [row.user_id]: prevRoleId }));
      toast({
        title: "Rol güncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId((current) => (current === row.user_id ? null : current));
    }
  };

  const handleStartEdit = (row: UserRow) => {
    if (updatingUserId) return;
    const currentRoleId = roleByUserId[row.user_id] ?? roleIdByKey.get(row.profile_type) ?? "";
    setDraftRoleByUserId((current) => ({ ...current, [row.user_id]: currentRoleId }));
    setEditingUserId(row.user_id);
  };

  const handleCancelEdit = (userId: string) => {
    setEditingUserId((current) => (current === userId ? null : current));
    setDraftRoleByUserId((current) => {
      const next = { ...current };
      delete next[userId];
      return next;
    });
  };

  const handleDraftRoleChange = (userId: string, nextRoleId: string) => {
    setDraftRoleByUserId((current) => ({ ...current, [userId]: nextRoleId }));
  };

  const handleSaveRole = async (row: UserRow) => {
    const draftRoleId = draftRoleByUserId[row.user_id];
    const currentRoleId = roleByUserId[row.user_id] ?? roleIdByKey.get(row.profile_type) ?? "";
    if (!draftRoleId || draftRoleId === currentRoleId) {
      handleCancelEdit(row.user_id);
      return;
    }
    await handleRoleChange(row, draftRoleId);
  };

  const handleOpenAttributes = (row: UserRow) => {
    const selectedRoleId = roleByUserId[row.user_id] ?? roleIdByKey.get(row.profile_type) ?? "";
    const backSearchParams = buildUsersRolesSearchParams({
      q: searchText || undefined,
      provider: providerFilter,
      from: fromDate || undefined,
      to: toDate || undefined,
      sort: sortFilter,
    });
    const nextSearchParams = new URLSearchParams(backSearchParams);

    if (selectedRoleId) {
      nextSearchParams.set("selectedRoleId", selectedRoleId);
    }

    const search = nextSearchParams.toString();
    const backSearch = backSearchParams.toString();
    navigate(
      {
        pathname: "/admin/new-member/attributes",
        search: search ? `?${search}` : "",
      },
      {
        state: {
          userId: row.user_id,
          userName: row.full_name,
          userEmail: row.email,
          selectedRoleId,
          backTo: `/admin/new-member/users-roles${backSearch ? `?${backSearch}` : ""}`,
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <AdminPageGuideAccordion
        summary="Loginli kullanıcıların rol atamasını, pending approval sinyallerini ve override ihtiyacını bu ekrandan takip edebilirsin."
        sections={guideSections}
      />
      <Card>
        <CardHeader>
          <CardTitle>New Member System - Loginli Kullanıcılar & Roller</CardTitle>
          <CardDescription>
            Sadece login olmuş kullanıcılar listelenir. Bu ekranda kullanıcıya tek aktif rol atanır.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-3">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Arama (Ad/E-posta)</label>
                <Input
                  value={searchText}
                  onChange={(event) => updateFilter("q", event.target.value)}
                  placeholder="Örn: ayse / @mail.com"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Provider</label>
                <Select value={providerFilter} onValueChange={(value) => updateFilter("provider", value === DEFAULT_PROVIDER_FILTER ? "" : value)}>
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
                <Input type="date" value={fromDate} onChange={(event) => updateFilter("from", event.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Kayıt bitiş</label>
                <Input type="date" value={toDate} onChange={(event) => updateFilter("to", event.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Sıralama</label>
                <Select value={sortFilter} onValueChange={(value) => updateFilter("sort", value === DEFAULT_SORT_FILTER ? "" : value)}>
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
            Filtrelenen toplam login kullanıcı: <span className="font-semibold text-foreground">{totalUsers}</span>
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
                      <th className="px-3 py-2 font-medium">Rol</th>
                      <th className="px-3 py-2 font-medium">Durum Özeti</th>
                      <th className="px-3 py-2 font-medium">Provider</th>
                      <th className="px-3 py-2 font-medium">Kayıt Tarihi</th>
                      <th className="px-3 py-2 font-medium">Aksiyon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const selectedRoleId = roleByUserId[row.user_id] ?? roleIdByKey.get(row.profile_type) ?? "";
                      const selectedRoleLabel = roleById.get(selectedRoleId)?.label ?? "-";
                      const isEditing = editingUserId === row.user_id;
                      const draftRoleId = draftRoleByUserId[row.user_id] ?? selectedRoleId;

                      return (
                        <tr key={row.user_id} className="border-t">
                          <td className="px-3 py-2">{row.full_name || "-"}</td>
                          <td className="px-3 py-2">{row.email || "-"}</td>
                          <td className="px-3 py-2">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <Select
                                  value={draftRoleId}
                                  onValueChange={(value) => handleDraftRoleChange(row.user_id, value)}
                                  disabled={updatingUserId === row.user_id || roles.length === 0}
                                >
                                  <SelectTrigger className="h-8 min-w-[220px] text-xs">
                                    <SelectValue placeholder="Rol seç" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roles.map((role) => (
                                      <SelectItem key={role.id} value={role.id}>
                                        {role.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <button
                                  type="button"
                                  onClick={() => void handleSaveRole(row)}
                                  disabled={updatingUserId === row.user_id || !draftRoleId}
                                  className="rounded-md border px-2.5 py-1.5 text-xs transition-colors hover:bg-muted disabled:opacity-60"
                                >
                                  {updatingUserId === row.user_id ? "Kaydediliyor..." : "Kaydet"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCancelEdit(row.user_id)}
                                  disabled={updatingUserId === row.user_id}
                                  className="rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
                                >
                                  İptal
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex h-8 min-w-[220px] items-center rounded-md border px-2.5 text-xs">
                                  {selectedRoleLabel}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(row)}
                                  disabled={Boolean(updatingUserId)}
                                  className="rounded-md border px-2.5 py-1.5 text-xs transition-colors hover:bg-muted disabled:opacity-60"
                                >
                                  Düzenle
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="rounded-md border px-2 py-1">
                                Pending: {pendingCountByUserId[row.user_id] ?? 0}
                              </span>
                              <span className="rounded-md border px-2 py-1">
                                Override: {overrideCountByUserId[row.user_id] ?? 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2">{row.auth_provider || "-"}</td>
                          <td className="px-3 py-2">
                            {new Date(row.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Berlin" })}
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => handleOpenAttributes(row)}
                              className="rounded-md border px-2.5 py-1.5 text-xs transition-colors hover:bg-muted"
                            >
                              Attribute
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Kullanıcı bulunamadı.</p>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginUsersRolesPage;
