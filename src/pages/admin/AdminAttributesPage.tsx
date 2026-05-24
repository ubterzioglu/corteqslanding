import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { setAttributeRuleAsAdmin } from "@/lib/admin";

type RoleRow = {
  id: string;
  key: string;
  label: string;
  sort_order: number;
};

type AttributeRow = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  data_type: string;
  is_active: boolean;
  is_system: boolean;
  sort_order: number;
};

type RuleRow = {
  id: string;
  role_id: string;
  attribute_id: string;
  is_enabled: boolean;
  is_required: boolean;
  is_public_default: boolean;
  user_can_edit: boolean;
  user_can_hide: boolean;
  requires_admin_approval_on_change: boolean;
  sort_order: number;
};

const AdminAttributesPage = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);
  const [rules, setRules] = useState<RuleRow[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      const [rolesResult, attributesResult, rulesResult] = await Promise.all([
        supabase.from("roles").select("id, key, label, sort_order").eq("is_active", true).order("sort_order"),
        supabase
          .from("attribute_catalog")
          .select("id, key, label, description, data_type, is_active, is_system, sort_order")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("role_attribute_rules")
          .select(
            "id, role_id, attribute_id, is_enabled, is_required, is_public_default, user_can_edit, user_can_hide, requires_admin_approval_on_change, sort_order",
          ),
      ]);

      if (!isMounted) return;

      if (rolesResult.error || attributesResult.error || rulesResult.error) {
        setErrorMessage(rolesResult.error?.message ?? attributesResult.error?.message ?? rulesResult.error?.message ?? "Bilinmeyen hata");
        return;
      }

      const roleRows = (rolesResult.data ?? []) as RoleRow[];
      setRoles(roleRows);
      setAttributes((attributesResult.data ?? []) as AttributeRow[]);
      setRules((rulesResult.data ?? []) as RuleRow[]);
      setSelectedRoleId(roleRows[0]?.id ?? "");
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const roleById = useMemo(() => new Map(roles.map((role) => [role.id, role])), [roles]);

  const ruleByAttributeId = useMemo(() => {
    const nextMap = new Map<string, RuleRow>();
    for (const rule of rules) {
      if (rule.role_id === selectedRoleId) {
        nextMap.set(rule.attribute_id, rule);
      }
    }
    return nextMap;
  }, [rules, selectedRoleId]);

  const updateRule = async (attribute: AttributeRow, patch: Partial<RuleRow>) => {
    const role = roleById.get(selectedRoleId);
    if (!role) return;

    const currentRule = ruleByAttributeId.get(attribute.id);
    const nextRule = {
      is_enabled: patch.is_enabled ?? currentRule?.is_enabled ?? true,
      is_required: patch.is_required ?? currentRule?.is_required ?? false,
      is_public_default: patch.is_public_default ?? currentRule?.is_public_default ?? false,
      user_can_edit: patch.user_can_edit ?? currentRule?.user_can_edit ?? true,
      user_can_hide: patch.user_can_hide ?? currentRule?.user_can_hide ?? true,
      requires_admin_approval_on_change:
        patch.requires_admin_approval_on_change ?? currentRule?.requires_admin_approval_on_change ?? false,
      sort_order: patch.sort_order ?? currentRule?.sort_order ?? attribute.sort_order,
    };

    setSavingKey(`${role.id}:${attribute.id}`);
    try {
      await setAttributeRuleAsAdmin(role.key, attribute.key, nextRule);
      setRules((current) => {
        const withoutCurrent = current.filter((rule) => !(rule.role_id === role.id && rule.attribute_id === attribute.id));
        return [
          ...withoutCurrent,
          {
            id: currentRule?.id ?? `${role.id}:${attribute.id}`,
            role_id: role.id,
            attribute_id: attribute.id,
            ...nextRule,
          },
        ];
      });
      toast({
        title: "Attribute kuralı güncellendi",
        description: `${role.label} için ${attribute.label} ayarları kaydedildi.`,
      });
    } catch (error) {
      toast({
        title: "Kural güncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Attribute Yönetimi</CardTitle>
          <CardDescription>Role göre açık alanları, görünürlük varsayımlarını ve onay kurallarını yönet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm">
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger>
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

          {errorMessage ? <p className="text-sm text-destructive">Liste alınamadı: {errorMessage}</p> : null}

          <div className="space-y-3">
            {attributes.map((attribute) => {
              const rule = ruleByAttributeId.get(attribute.id);
              const disabled = savingKey === `${selectedRoleId}:${attribute.id}`;
              return (
                <div key={`${selectedRoleId}:${attribute.id}`} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{attribute.label}</p>
                      <p className="text-xs text-muted-foreground">{attribute.key}</p>
                      <p className="text-xs text-muted-foreground">{attribute.description ?? "-"}</p>
                    </div>
                    <div className="grid min-w-[320px] gap-3 md:grid-cols-2">
                      <ToggleLine
                        label="Aktif"
                        checked={rule?.is_enabled ?? true}
                        disabled={disabled}
                        onCheckedChange={(checked) => void updateRule(attribute, { is_enabled: checked })}
                      />
                      <ToggleLine
                        label="Zorunlu"
                        checked={rule?.is_required ?? false}
                        disabled={disabled}
                        onCheckedChange={(checked) => void updateRule(attribute, { is_required: checked })}
                      />
                      <ToggleLine
                        label="Public default"
                        checked={rule?.is_public_default ?? false}
                        disabled={disabled}
                        onCheckedChange={(checked) => void updateRule(attribute, { is_public_default: checked })}
                      />
                      <ToggleLine
                        label="Kullanıcı düzenler"
                        checked={rule?.user_can_edit ?? true}
                        disabled={disabled}
                        onCheckedChange={(checked) => void updateRule(attribute, { user_can_edit: checked })}
                      />
                      <ToggleLine
                        label="Kullanıcı gizler"
                        checked={rule?.user_can_hide ?? true}
                        disabled={disabled}
                        onCheckedChange={(checked) => void updateRule(attribute, { user_can_hide: checked })}
                      />
                      <ToggleLine
                        label="Admin onayı gerekir"
                        checked={rule?.requires_admin_approval_on_change ?? false}
                        disabled={disabled}
                        onCheckedChange={(checked) =>
                          void updateRule(attribute, { requires_admin_approval_on_change: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 max-w-[160px]">
                    <label className="mb-1 block text-xs text-muted-foreground">Sıralama</label>
                    <Input
                      type="number"
                      defaultValue={String(rule?.sort_order ?? attribute.sort_order)}
                      disabled={disabled}
                      onBlur={(event) => void updateRule(attribute, { sort_order: Number(event.target.value) || attribute.sort_order })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ToggleLine = ({
  label,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border px-3 py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </div>
  );
};

export default AdminAttributesPage;
