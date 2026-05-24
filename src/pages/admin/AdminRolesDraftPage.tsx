import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import {
  clearUserFeatureOverrideAsAdmin,
  setUserFeatureOverrideAsAdmin,
  setUserProfileTypeAsAdmin,
} from "@/lib/admin";
import {
  INDIVIDUAL_FEATURES,
  INDIVIDUAL_FEATURE_KEY_LIST,
  type IndividualFeatureKey,
} from "@/lib/features";
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

type FeatureCatalogRow = {
  key: IndividualFeatureKey;
  label: string;
  description: string | null;
  scope_role: string;
  is_active_globally: boolean;
};

type RoleFeatureDefaultRow = {
  profile_type: string;
  feature_key: IndividualFeatureKey;
  is_enabled: boolean;
};

type UserFeatureOverrideRow = {
  user_id: string;
  feature_key: IndividualFeatureKey;
  is_enabled: boolean;
};

type ProviderFilter = "google" | "all" | "unknown";
type SortFilter = "created_desc" | "created_asc" | "name_asc";
type FeatureFilterValue = IndividualFeatureKey | "all";
type FeatureStateFilter = "all" | "enabled" | "disabled";
type UserOverrideMap = Partial<Record<IndividualFeatureKey, boolean>>;
type FeatureSource = "override" | "role_default" | "fallback";

const AdminRolesDraftPage = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<GoogleUserProfileRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [draftProfileType, setDraftProfileType] = useState<ProfileType | null>(null);

  const [featureCatalog, setFeatureCatalog] = useState<FeatureCatalogRow[]>([]);
  const [roleDefaults, setRoleDefaults] = useState<Partial<Record<IndividualFeatureKey, boolean>>>({});
  const [overridesByUser, setOverridesByUser] = useState<Record<string, UserOverrideMap>>({});
  const [isFeatureDataLoading, setIsFeatureDataLoading] = useState(true);
  const [featureDataError, setFeatureDataError] = useState<string | null>(null);

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [featureActionKey, setFeatureActionKey] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [profileTypeFilter, setProfileTypeFilter] = useState<ProfileType | "all">("all");
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("google");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortFilter, setSortFilter] = useState<SortFilter>("created_desc");
  const [featureFilterKey, setFeatureFilterKey] = useState<FeatureFilterValue>("all");
  const [featureStateFilter, setFeatureStateFilter] = useState<FeatureStateFilter>("all");

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsFeatureDataLoading(true);
      setFeatureDataError(null);

      const [catalogResult, defaultsResult, overridesResult] = await Promise.all([
        supabase
          .from("feature_catalog")
          .select("key, label, description, scope_role, is_active_globally")
          .eq("scope_role", "bireysel")
          .order("key", { ascending: true }),
        supabase
          .from("role_feature_defaults")
          .select("profile_type, feature_key, is_enabled")
          .eq("profile_type", "bireysel"),
        supabase
          .from("user_feature_overrides")
          .select("user_id, feature_key, is_enabled")
          .in("feature_key", INDIVIDUAL_FEATURE_KEY_LIST),
      ]);

      if (!isMounted) return;

      if (catalogResult.error || defaultsResult.error || overridesResult.error) {
        setFeatureDataError(catalogResult.error?.message ?? defaultsResult.error?.message ?? overridesResult.error?.message ?? "Bilinmeyen hata");
        setIsFeatureDataLoading(false);
        return;
      }

      const catalogRows = (catalogResult.data ?? []) as FeatureCatalogRow[];
      const defaultRows = (defaultsResult.data ?? []) as RoleFeatureDefaultRow[];
      const overrideRows = (overridesResult.data ?? []) as UserFeatureOverrideRow[];

      const nextDefaults: Partial<Record<IndividualFeatureKey, boolean>> = {};
      for (const row of defaultRows) {
        nextDefaults[row.feature_key] = row.is_enabled;
      }

      const nextOverrides: Record<string, UserOverrideMap> = {};
      for (const row of overrideRows) {
        const currentUserMap = nextOverrides[row.user_id] ?? {};
        currentUserMap[row.feature_key] = row.is_enabled;
        nextOverrides[row.user_id] = currentUserMap;
      }

      setFeatureCatalog(catalogRows);
      setRoleDefaults(nextDefaults);
      setOverridesByUser(nextOverrides);
      setIsFeatureDataLoading(false);
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

  const catalogByKey = useMemo(() => {
    return new Map(featureCatalog.map((feature) => [feature.key, feature]));
  }, [featureCatalog]);

  const profileTypeLabelMap = useMemo(
    () => new Map(profileTypeOptions.map((option) => [option.type, option.title])),
    [],
  );

  const computeUserFeatureState = useCallback(
    (row: GoogleUserProfileRow, featureKey: IndividualFeatureKey) => {
      const catalog = catalogByKey.get(featureKey);
      const userOverride = overridesByUser[row.user_id]?.[featureKey];
      const defaultForRole = row.profile_type === "bireysel" ? (roleDefaults[featureKey] ?? false) : false;
      const globalActive = catalog?.is_active_globally ?? false;
      const effective = globalActive && (userOverride ?? defaultForRole ?? false);

      let source: FeatureSource = "fallback";
      if (typeof userOverride === "boolean") {
        source = "override";
      } else if (row.profile_type === "bireysel") {
        source = "role_default";
      }

      return {
        globalActive,
        userOverride,
        defaultForRole,
        effective,
        source,
      };
    },
    [catalogByKey, overridesByUser, roleDefaults],
  );

  const filteredRows = useMemo(() => {
    if (featureFilterKey === "all" || featureStateFilter === "all") {
      return rows;
    }

    return rows.filter((row) => {
      const state = computeUserFeatureState(row, featureFilterKey);
      return featureStateFilter === "enabled" ? state.effective : !state.effective;
    });
  }, [rows, featureFilterKey, featureStateFilter, computeUserFeatureState]);

  const totalUsers = useMemo(() => filteredRows.length, [filteredRows]);

  const resetFilters = () => {
    setSearchText("");
    setProfileTypeFilter("all");
    setProviderFilter("google");
    setFromDate("");
    setToDate("");
    setSortFilter("created_desc");
    setFeatureFilterKey("all");
    setFeatureStateFilter("all");
  };

  const startEdit = (row: GoogleUserProfileRow) => {
    setEditingUserId(row.user_id);
    setDraftProfileType(profileTypes.includes(row.profile_type as ProfileType) ? (row.profile_type as ProfileType) : null);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setDraftProfileType(null);
  };

  const saveProfileType = async (row: GoogleUserProfileRow) => {
    if (!draftProfileType) return;
    if (draftProfileType === row.profile_type) {
      cancelEdit();
      return;
    }

    setUpdatingUserId(row.user_id);

    try {
      await setUserProfileTypeAsAdmin(row.user_id, draftProfileType);
      setRows((current) =>
        current.map((item) => (item.user_id === row.user_id ? { ...item, profile_type: draftProfileType } : item)),
      );
      toast({
        title: "Profil tipi güncellendi",
        description: `${row.email ?? row.user_id} için profil tipi ${profileTypeLabelMap.get(draftProfileType) ?? draftProfileType} olarak kaydedildi.`,
      });
      cancelEdit();
    } catch (error) {
      toast({
        title: "Profil tipi güncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUpdatingUserId((current) => (current === row.user_id ? null : current));
    }
  };

  const setFeatureOverride = async (row: GoogleUserProfileRow, featureKey: IndividualFeatureKey, isEnabled: boolean) => {
    if (row.profile_type !== "bireysel") {
      toast({
        title: "Override uygulanamadı",
        description: "İlk fazda feature yönetimi sadece bireysel kullanıcılar için aktif.",
        variant: "destructive",
      });
      return;
    }

    const previousUserMap = overridesByUser[row.user_id] ? { ...overridesByUser[row.user_id] } : undefined;
    setOverridesByUser((current) => ({
      ...current,
      [row.user_id]: {
        ...(current[row.user_id] ?? {}),
        [featureKey]: isEnabled,
      },
    }));

    const actionKey = `${row.user_id}:${featureKey}:set`;
    setFeatureActionKey(actionKey);

    try {
      await setUserFeatureOverrideAsAdmin(row.user_id, featureKey, isEnabled);
      toast({
        title: "Feature override kaydedildi",
        description: `${row.email ?? row.user_id} için ${featureKey} ${isEnabled ? "aktif" : "pasif"} yapıldı.`,
      });
    } catch (error) {
      setOverridesByUser((current) => {
        const next = { ...current };
        if (previousUserMap) {
          next[row.user_id] = previousUserMap;
        } else {
          delete next[row.user_id];
        }
        return next;
      });

      toast({
        title: "Feature override kaydedilemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setFeatureActionKey((current) => (current === actionKey ? null : current));
    }
  };

  const clearFeatureOverride = async (row: GoogleUserProfileRow, featureKey: IndividualFeatureKey) => {
    const previousUserMap = overridesByUser[row.user_id] ? { ...overridesByUser[row.user_id] } : undefined;

    setOverridesByUser((current) => {
      const next = { ...current };
      const userMap = { ...(next[row.user_id] ?? {}) };
      delete userMap[featureKey];

      if (Object.keys(userMap).length === 0) {
        delete next[row.user_id];
      } else {
        next[row.user_id] = userMap;
      }

      return next;
    });

    const actionKey = `${row.user_id}:${featureKey}:clear`;
    setFeatureActionKey(actionKey);

    try {
      await clearUserFeatureOverrideAsAdmin(row.user_id, featureKey);
      toast({
        title: "Feature default'a döndürüldü",
        description: `${row.email ?? row.user_id} için ${featureKey} override kaldırıldı.`,
      });
    } catch (error) {
      setOverridesByUser((current) => {
        const next = { ...current };
        if (previousUserMap) {
          next[row.user_id] = previousUserMap;
        } else {
          delete next[row.user_id];
        }
        return next;
      });

      toast({
        title: "Feature override temizlenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setFeatureActionKey((current) => (current === actionKey ? null : current));
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
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-8">
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
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Feature</label>
                <Select value={featureFilterKey} onValueChange={(value) => setFeatureFilterKey(value as FeatureFilterValue)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    {INDIVIDUAL_FEATURES.map((feature) => (
                      <SelectItem key={feature.key} value={feature.key}>{feature.key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">Feature durumu</label>
                <Select value={featureStateFilter} onValueChange={(value) => setFeatureStateFilter(value as FeatureStateFilter)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="enabled">Açık</SelectItem>
                    <SelectItem value="disabled">Kapalı</SelectItem>
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
            Filtrelenen toplam kullanıcı: <span className="font-semibold text-foreground">{totalUsers}</span>
          </div>

          {isFeatureDataLoading ? <p className="text-sm text-muted-foreground">Feature yapılandırması yükleniyor...</p> : null}
          {featureDataError ? <p className="text-sm text-destructive">Feature verisi alınamadı: {featureDataError}</p> : null}
          {isLoading ? <p className="text-sm text-muted-foreground">Kullanıcı listesi yükleniyor...</p> : null}
          {errorMessage ? <p className="text-sm text-destructive">Liste alınamadı: {errorMessage}</p> : null}

          {!isLoading && !errorMessage ? (
            filteredRows.length > 0 ? (
              <div className="overflow-x-auto rounded-md border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 font-medium">Ad Soyad</th>
                      <th className="px-3 py-2 font-medium">E-posta</th>
                      <th className="px-3 py-2 font-medium">Profil Tipi</th>
                      <th className="px-3 py-2 font-medium">Rol İşlemi</th>
                      <th className="px-3 py-2 font-medium">Feature Yönetimi</th>
                      <th className="px-3 py-2 font-medium">Provider</th>
                      <th className="px-3 py-2 font-medium">Kayıt Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <Fragment key={row.user_id}>
                        <tr key={row.user_id} className="border-t">
                          <td className="px-3 py-2">{row.full_name || "-"}</td>
                          <td className="px-3 py-2">{row.email || "-"}</td>
                          <td className="px-3 py-2">
                            <Select
                              value={editingUserId === row.user_id ? (draftProfileType ?? row.profile_type) : row.profile_type}
                              onValueChange={(value) => setDraftProfileType(value as ProfileType)}
                              disabled={editingUserId !== row.user_id || updatingUserId === row.user_id}
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
                          <td className="px-3 py-2">
                            {editingUserId === row.user_id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => void saveProfileType(row)}
                                  disabled={updatingUserId === row.user_id || !draftProfileType}
                                  className="rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground disabled:opacity-60"
                                >
                                  {updatingUserId === row.user_id ? "Saving..." : "Save"}
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  disabled={updatingUserId === row.user_id}
                                  className="rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEdit(row)}
                                disabled={Boolean(editingUserId)}
                                className="rounded-md border px-2.5 py-1.5 text-xs text-foreground hover:bg-muted disabled:opacity-60"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => setExpandedUserId((current) => (current === row.user_id ? null : row.user_id))}
                              className="rounded-md border px-2.5 py-1.5 text-xs text-foreground hover:bg-muted"
                            >
                              {expandedUserId === row.user_id ? "Kapat" : "Aç"}
                            </button>
                          </td>
                          <td className="px-3 py-2">{row.auth_provider || "-"}</td>
                          <td className="px-3 py-2">
                            {new Date(row.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Berlin" })}
                          </td>
                        </tr>

                        {expandedUserId === row.user_id ? (
                          <tr className="border-t bg-muted/20">
                            <td className="px-3 py-3" colSpan={7}>
                              {row.profile_type !== "bireysel" ? (
                                <p className="text-xs text-muted-foreground">
                                  Bu kullanıcı bireysel profile sahip değil. İlk fazda feature yönetimi sadece bireysel profiller için açıktır.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {INDIVIDUAL_FEATURES.map((feature) => {
                                    const featureState = computeUserFeatureState(row, feature.key);
                                    const actionPrefix = `${row.user_id}:${feature.key}:`;
                                    const isFeatureActionLoading = featureActionKey?.startsWith(actionPrefix) ?? false;

                                    return (
                                      <div key={feature.key} className="rounded-md border bg-background p-2.5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          <div>
                                            <p className="text-sm font-semibold">{feature.label}</p>
                                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                                            <p className="mt-1 text-[11px] text-muted-foreground">
                                              key: {feature.key} | default: {featureState.defaultForRole ? "açık" : "kapalı"} | override:{" "}
                                              {typeof featureState.userOverride === "boolean"
                                                ? featureState.userOverride
                                                  ? "aktif"
                                                  : "pasif"
                                                : "yok"}
                                              {" "}| source: {featureState.source}
                                            </p>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-1.5">
                                            <span
                                              className={`rounded border px-2 py-0.5 text-[11px] ${
                                                featureState.effective ? "border-emerald-400 text-emerald-600" : "border-rose-400 text-rose-600"
                                              }`}
                                            >
                                              Effective: {featureState.effective ? "Açık" : "Kapalı"}
                                            </span>
                                            {!featureState.globalActive ? (
                                              <span className="rounded border border-amber-400 px-2 py-0.5 text-[11px] text-amber-700">
                                                Global Kapalı
                                              </span>
                                            ) : null}
                                          </div>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => void setFeatureOverride(row, feature.key, true)}
                                            disabled={isFeatureActionLoading}
                                            className="rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:opacity-60"
                                          >
                                            Override Aktif
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => void setFeatureOverride(row, feature.key, false)}
                                            disabled={isFeatureActionLoading}
                                            className="rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:opacity-60"
                                          >
                                            Override Pasif
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => void clearFeatureOverride(row, feature.key)}
                                            disabled={isFeatureActionLoading || typeof featureState.userOverride !== "boolean"}
                                            className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-60"
                                          >
                                            Default'a Döndür
                                          </button>
                                          {isFeatureActionLoading ? (
                                            <span className="text-[11px] text-muted-foreground">Kaydediliyor...</span>
                                          ) : null}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Filtrelere uygun kullanıcı bulunamadı.</p>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesDraftPage;
