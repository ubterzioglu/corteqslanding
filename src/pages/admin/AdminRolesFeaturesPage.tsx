import { useEffect, useMemo, useState } from "react";

import AdminPageGuideAccordion, { type AdminPageGuideSection } from "@/components/admin/AdminPageGuideAccordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setFeatureGlobalStateAsAdmin, setRoleFeatureFlagAsAdmin } from "@/lib/admin";

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

const guideSections: AdminPageGuideSection[] = [
  {
    title: "Bu ekran ne için kullanılır?",
    items: [
      "Bu ekran, hangi rolün hangi özelliği kullanabileceğini belirlediğin ana yetki ekranıdır.",
      "Satırlar feature'ları, sütunlar rolleri temsil eder. Böylece tek bakışta hangi rolün neye eriştiği görülür.",
      "Bir özellik kullanıcıda çalışmıyorsa veya gereksiz açık görünüyorsa çoğu zaman sebep bu matrix içindedir.",
    ],
  },
  {
    title: "Adım adım nasıl kullanılır?",
    items: [
      "1. Önce ilgili feature satırını bul. Satırın solunda feature adı, key'i ve kısa açıklaması görünür.",
      "2. Aynı satırdaki `Global` alanına bak. Burasi kapalıysa feature genel olarak çalışmaz.",
      "3. Feature herkeste çalışsın istiyorsan önce `Global` alanını aç.",
      "4. Sonra ilgili rol sütunundaki switch'i açarak sadece o role izin ver veya kapatarak rolü engelle.",
      "5. Scope badge'lerine bakarak feature'ın normalde hangi rol ailesi için tasarlandığını da kontrol et.",
    ],
  },
  {
    title: "Hangi durumda ne yapmalısın?",
    items: [
      "Sorun bir rolün tamamını etkiliyorsa düzeltmeyi burada yap.",
      "Sorun sadece tek kullanıcıdaysa burada matrixi bozma; `Feature Override` ekranına git.",
      "Global kapalı ama rol açık durumunda kullanıcı yine özelliği kullanamaz; önce global durumu çöz.",
    ],
  },
  {
    title: "Kaydettikten sonra ne kontrol etmelisin?",
    items: [
      "Switch değişince toast mesajı geldi mi kontrol et.",
      "Yanlış rolü açmadığından emin olmak için aynı feature satırındaki diğer rol sütunlarına da hızlı bak.",
      "Bir kullanıcı yine farklı davranıyorsa o kullanıcı için override kaydı olup olmadığını ayrıca kontrol et.",
    ],
  },
];

const AdminRolesFeaturesPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [features, setFeatures] = useState<FeatureCatalogRow[]>([]);
  const [flagMap, setFlagMap] = useState<Record<string, Record<string, boolean>>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const [rolesResult, featuresResult, flagsResult] = await Promise.all([
        supabase.from("roles").select("id, key, label, sort_order, is_active").eq("is_active", true).order("sort_order"),
        supabase.from("feature_catalog").select("key, label, description, scope_role, is_active_globally").order("key"),
        supabase.from("role_feature_flags").select("role_id, feature_key, is_enabled"),
      ]);

      if (!isMounted) return;

      if (rolesResult.error || featuresResult.error || flagsResult.error) {
        setErrorMessage(rolesResult.error?.message ?? featuresResult.error?.message ?? flagsResult.error?.message ?? "Bilinmeyen hata");
        setIsLoading(false);
        return;
      }

      const roleRows = (rolesResult.data ?? []) as RoleRow[];
      const featureRows = (featuresResult.data ?? []) as FeatureCatalogRow[];
      const nextFlagMap: Record<string, Record<string, boolean>> = {};
      for (const role of roleRows) {
        nextFlagMap[role.id] = {};
      }
      for (const row of (flagsResult.data ?? []) as RoleFeatureFlagRow[]) {
        if (!nextFlagMap[row.role_id]) nextFlagMap[row.role_id] = {};
        nextFlagMap[row.role_id][row.feature_key] = row.is_enabled;
      }

      setRoles(roleRows);
      setFeatures(featureRows);
      setFlagMap(nextFlagMap);
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const roleByKey = useMemo(() => {
    return new Map(roles.map((role) => [role.key, role]));
  }, [roles]);

  const matrixFeatures = useMemo(() => {
    const uniqueByKey = new Map<string, FeatureCatalogRow>();
    for (const feature of features) {
      if (!uniqueByKey.has(feature.key)) {
        uniqueByKey.set(feature.key, feature);
      }
    }
    return Array.from(uniqueByKey.values());
  }, [features]);

  const handleRoleToggle = async (role: RoleRow, featureKey: string, nextEnabled: boolean) => {
    const previous = flagMap[role.id]?.[featureKey] ?? false;
    setFlagMap((current) => ({
      ...current,
      [role.id]: { ...(current[role.id] ?? {}), [featureKey]: nextEnabled },
    }));
    setSavingKey(`${role.id}:${featureKey}`);
    try {
      await setRoleFeatureFlagAsAdmin(role.key, featureKey, nextEnabled);
      toast({
        title: "Rol feature güncellendi",
        description: `${role.label} için ${featureKey} ${nextEnabled ? "açıldı" : "kapatıldı"}.`,
      });
    } catch (error) {
      setFlagMap((current) => ({
        ...current,
        [role.id]: { ...(current[role.id] ?? {}), [featureKey]: previous },
      }));
      toast({
        title: "Rol feature güncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSavingKey(null);
    }
  };

  const handleGlobalToggle = async (featureKey: string, nextEnabled: boolean) => {
    const previousFeatures = features;
    setFeatures((current) =>
      current.map((feature) => (feature.key === featureKey ? { ...feature, is_active_globally: nextEnabled } : feature)),
    );
    setSavingKey(`global:${featureKey}`);
    try {
      await setFeatureGlobalStateAsAdmin(featureKey, nextEnabled);
      toast({
        title: "Global feature durumu güncellendi",
        description: `${featureKey} ${nextEnabled ? "global açık" : "global kapalı"} yapıldı.`,
      });
    } catch (error) {
      setFeatures(previousFeatures);
      toast({
        title: "Global state güncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <AdminPageGuideAccordion
        summary="Feature'ların global ve rol bazlı açık-kapalı durumunu aynı matrixten yönetmek için bu ekran kullanılır."
        sections={guideSections}
      />
      <Card>
        <CardHeader>
          <CardTitle>New Member System - Rol / Feature Matrix</CardTitle>
          <CardDescription>
            Satır bazında feature, sütun bazında rol görünümü. Global durum ve role göre açık/kapalı durumu aynı ekranda yönetilir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-sm text-muted-foreground">Feature matrisi yükleniyor...</p> : null}
          {errorMessage ? <p className="text-sm text-destructive">Veri alınamadı: {errorMessage}</p> : null}

          {!isLoading && !errorMessage ? (
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-[1100px] w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium">Feature</th>
                    <th className="px-3 py-3 text-left font-medium">Global</th>
                    {roles.map((role) => (
                      <th key={role.id} className="px-3 py-3 text-left font-medium">
                        {role.label}
                        <p className="text-[11px] font-normal text-muted-foreground">{role.key}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixFeatures.map((feature) => (
                    <tr key={feature.key} className="border-t align-top">
                      <td className="px-3 py-3">
                        <p className="font-medium">{feature.label}</p>
                        <p className="text-xs text-muted-foreground">{feature.key}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{feature.description ?? "-"}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {Array.from(new Set(features.filter((item) => item.key === feature.key).map((item) => item.scope_role))).map((scopeRole) => (
                            <Badge key={scopeRole} variant="outline">
                              {roleByKey.get(scopeRole)?.label ?? scopeRole}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={feature.is_active_globally}
                            disabled={savingKey === `global:${feature.key}`}
                            onCheckedChange={(checked) => void handleGlobalToggle(feature.key, checked)}
                          />
                          <Badge variant={feature.is_active_globally ? "secondary" : "outline"}>
                            {feature.is_active_globally ? "Açık" : "Kapalı"}
                          </Badge>
                        </div>
                      </td>
                      {roles.map((role) => (
                        <td key={`${feature.key}-${role.id}`} className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={flagMap[role.id]?.[feature.key] ?? false}
                              disabled={savingKey === `${role.id}:${feature.key}`}
                              onCheckedChange={(checked) => void handleRoleToggle(role, feature.key, checked)}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesFeaturesPage;
