import { useEffect, useMemo, useState } from "react";

import { setRoleFeatureFlagAsAdmin } from "@/lib/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type RoleRow = {
  id: string;
  key: string;
  label: string;
  sort_order: number;
  is_active: boolean;
};

type FeatureCatalogRow = {
  key: string;
  label: string;
  description: string | null;
  scope_role: string;
  is_active_globally: boolean;
};

type RoleFeatureFlagRow = {
  role_id: string;
  feature_key: string;
  is_enabled: boolean;
};

const AdminRolesFeaturesPage = () => {
  const { toast } = useToast();

  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [features, setFeatures] = useState<FeatureCatalogRow[]>([]);
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingFeatureKey, setUpdatingFeatureKey] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const [rolesResult, featuresResult] = await Promise.all([
        supabase
          .from("roles")
          .select("id, key, label, sort_order, is_active")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("feature_catalog")
          .select("key, label, description, scope_role, is_active_globally")
          .order("scope_role", { ascending: true })
          .order("key", { ascending: true }),
      ]);

      if (!isMounted) return;

      if (rolesResult.error || featuresResult.error) {
        setErrorMessage(rolesResult.error?.message ?? featuresResult.error?.message ?? "Bilinmeyen hata");
        setIsLoading(false);
        return;
      }

      const roleRows = (rolesResult.data ?? []) as RoleRow[];
      setRoles(roleRows);
      setFeatures((featuresResult.data ?? []) as FeatureCatalogRow[]);
      setSelectedRoleId((current) => current || roleRows[0]?.id || "");
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedRoleId) {
      setFlags({});
      return;
    }

    let isMounted = true;

    void (async () => {
      const { data, error } = await supabase
        .from("role_feature_flags")
        .select("role_id, feature_key, is_enabled")
        .eq("role_id", selectedRoleId);

      if (!isMounted) return;

      if (error) {
        setErrorMessage(error.message);
        setFlags({});
        return;
      }

      const nextFlags: Record<string, boolean> = {};
      for (const row of (data ?? []) as RoleFeatureFlagRow[]) {
        nextFlags[row.feature_key] = row.is_enabled;
      }
      setFlags(nextFlags);
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedRoleId]);

  const roleById = useMemo(() => {
    return new Map(roles.map((role) => [role.id, role]));
  }, [roles]);

  const selectedRole = roleById.get(selectedRoleId) ?? null;

  const scopedFeatures = useMemo(() => {
    if (!selectedRole) return [];
    return features.filter((feature) => feature.scope_role === selectedRole.key);
  }, [features, selectedRole]);

  const updateFeatureFlag = async (featureKey: string, nextEnabled: boolean) => {
    if (!selectedRole) return;

    const previous = flags[featureKey] ?? false;
    setFlags((current) => ({ ...current, [featureKey]: nextEnabled }));
    setUpdatingFeatureKey(featureKey);

    try {
      await setRoleFeatureFlagAsAdmin(selectedRole.key, featureKey, nextEnabled);
      toast({
        title: "Feature rol durumu güncellendi",
        description: `${selectedRole.label} için ${featureKey} ${nextEnabled ? "açık" : "kapalı"} yapıldı.`,
      });
    } catch (error) {
      setFlags((current) => ({ ...current, [featureKey]: previous }));
      toast({
        title: "Feature güncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUpdatingFeatureKey((current) => (current === featureKey ? null : current));
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>New Member System - Roller & Featurelar</CardTitle>
          <CardDescription>
            Roller için feature listesi ayrı yönetilir. Bu ekranda rol-feature açık/kapalı matrisi güncellenir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-1">
            <label className="text-[11px] text-muted-foreground">Rol seçimi</label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId} disabled={roles.length === 0}>
              <SelectTrigger className="h-8 text-xs">
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
          </div>

          {isLoading ? <p className="text-sm text-muted-foreground">Rol ve feature verileri yükleniyor...</p> : null}
          {errorMessage ? <p className="text-sm text-destructive">Liste alınamadı: {errorMessage}</p> : null}

          {!isLoading && !errorMessage ? (
            selectedRole ? (
              scopedFeatures.length > 0 ? (
                <div className="space-y-2 rounded-md border p-3">
                  {scopedFeatures.map((feature) => {
                    const enabled = flags[feature.key] ?? false;
                    const isUpdating = updatingFeatureKey === feature.key;

                    return (
                      <div key={feature.key} className="rounded-md border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold">{feature.label}</p>
                            <p className="text-xs text-muted-foreground">{feature.key}</p>
                            <p className="text-xs text-muted-foreground">{feature.description ?? "-"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded border px-2 py-0.5 text-[11px] ${
                                feature.is_active_globally
                                  ? "border-emerald-400 text-emerald-700"
                                  : "border-rose-400 text-rose-700"
                              }`}
                            >
                              Global: {feature.is_active_globally ? "Açık" : "Kapalı"}
                            </span>
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => void updateFeatureFlag(feature.key, !enabled)}
                              className="rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:opacity-60"
                            >
                              {isUpdating ? "Kaydediliyor..." : enabled ? "Rolde Açık" : "Rolde Kapalı"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Seçili role ait feature bulunamadı.</p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Aktif rol bulunamadı.</p>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesFeaturesPage;
