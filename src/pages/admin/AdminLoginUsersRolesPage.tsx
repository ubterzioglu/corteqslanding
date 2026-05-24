import { useEffect, useMemo, useState } from "react";

import { setUserRoleAsAdmin } from "@/lib/admin";
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

const AdminLoginUsersRolesPage = () => {
  const { toast } = useToast();

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

  const [searchText, setSearchText] = useState("");
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("google");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortFilter, setSortFilter] = useState<SortFilter>("created_desc");

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

  const resetFilters = () => {
    setSearchText("");
    setProviderFilter("google");
    setFromDate("");
    setToDate("");
    setSortFilter("created_desc");
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

  return (
    <div className="space-y-4">
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
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Örn: ayse / @mail.com"
                  className="h-8 text-xs"
                />
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
