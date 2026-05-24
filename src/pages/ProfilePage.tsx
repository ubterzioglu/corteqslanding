import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Clock3, Globe2, Lock, ShieldCheck } from "lucide-react";

import { useAuth } from "@/components/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUserProfile } from "@/hooks/useCurrentUserProfile";
import { GENERIC_FEATURE_KEYS, type GenericFeatureKey } from "@/lib/features";
import { submitFeatureRequest, submitRoleChangeRequest, updateProfileAttribute } from "@/lib/member-profile-api";
import { getAttributeStringValue, type AttributeVisibility, type ProfileAttributeState } from "@/lib/member-profile";
import { defaultProfileType, getRoleMeta, isProfileType, profileTypeOptions, type ProfileType } from "@/lib/profile-types";
import { supabase } from "@/integrations/supabase/client";

type DraftValueMap = Record<string, string | boolean>;
type DraftVisibilityMap = Record<string, AttributeVisibility>;

const VISIBILITY_OPTIONS: { value: AttributeVisibility; label: string }[] = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "admin_only", label: "Sadece Admin" },
];

const REQUESTABLE_FEATURES: { key: GenericFeatureKey; title: string; description: string }[] = [
  {
    key: GENERIC_FEATURE_KEYS.directoryVisible,
    title: "Directory Görünürlüğü",
    description: "Public directory’de görünmek için onay isteği oluştur.",
  },
  {
    key: GENERIC_FEATURE_KEYS.directoryFeatured,
    title: "Featured Profil",
    description: "Profilinin öne çıkarılmış kart olarak listelenmesini iste.",
  },
  {
    key: GENERIC_FEATURE_KEYS.contactShowWhatsapp,
    title: "WhatsApp Yayınlama",
    description: "WhatsApp bilgisini public göstermek için onay isteği gönder.",
  },
  {
    key: GENERIC_FEATURE_KEYS.eventsCreate,
    title: "Etkinlik Oluşturma",
    description: "Etkinlik oluşturma akışına erişim için talep bırak.",
  },
  {
    key: GENERIC_FEATURE_KEYS.offersCreate,
    title: "Teklif / Hizmet Oluşturma",
    description: "Teklif yayınlama erişimi için talep bırak.",
  },
  {
    key: GENERIC_FEATURE_KEYS.referralCreate,
    title: "Referral Oluşturma",
    description: "Referral oluşturma erişimi için talep bırak.",
  },
];

const mapAttributeDraftValue = (attribute: ProfileAttributeState): string | boolean => {
  if (attribute.dataType === "boolean") {
    return Boolean(attribute.valueJson);
  }

  if (attribute.dataType === "multi_select" && Array.isArray(attribute.valueJson)) {
    return attribute.valueJson.join(", ");
  }

  return getAttributeStringValue(attribute);
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const { isLoading, errorMessage, profile, refreshProfile } = useCurrentUserProfile(true);

  const [draftValues, setDraftValues] = useState<DraftValueMap>({});
  const [draftVisibilities, setDraftVisibilities] = useState<DraftVisibilityMap>({});
  const [savingAttributeKey, setSavingAttributeKey] = useState<string | null>(null);
  const [roleRequestTarget, setRoleRequestTarget] = useState<ProfileType | "">("");
  const [roleRequestNote, setRoleRequestNote] = useState("");
  const [submittingRoleRequest, setSubmittingRoleRequest] = useState(false);
  const [featureRequestingKey, setFeatureRequestingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    const nextValues: DraftValueMap = {};
    const nextVisibilities: DraftVisibilityMap = {};
    for (const attribute of profile.attributes) {
      nextValues[attribute.attributeKey] = mapAttributeDraftValue(attribute);
      nextVisibilities[attribute.attributeKey] = attribute.visibility;
    }
    setDraftValues(nextValues);
    setDraftVisibilities(nextVisibilities);
  }, [profile]);

  const roleMeta = useMemo(() => getRoleMeta(profile?.profileType ?? type), [profile?.profileType, type]);

  const availableRoleTargets = useMemo(() => {
    return profileTypeOptions.filter((option) => option.type !== profile?.profileType);
  }, [profile?.profileType]);

  const featureMap = useMemo(() => {
    return new Map((profile?.features ?? []).map((feature) => [feature.key, feature]));
  }, [profile?.features]);

  const groupedAttributes = useMemo(() => {
    const common: ProfileAttributeState[] = [];
    const roleSpecific: ProfileAttributeState[] = [];

    for (const attribute of profile?.attributes ?? []) {
      if (["full_name", "country", "city", "profile_photo_url", "bio_short"].includes(attribute.attributeKey)) {
        common.push(attribute);
      } else {
        roleSpecific.push(attribute);
      }
    }

    return { common, roleSpecific };
  }, [profile?.attributes]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const handleDraftChange = (attributeKey: string, nextValue: string | boolean) => {
    setDraftValues((current) => ({ ...current, [attributeKey]: nextValue }));
  };

  const handleSaveAttribute = async (attribute: ProfileAttributeState) => {
    const rawValue = draftValues[attribute.attributeKey];
    const visibility = draftVisibilities[attribute.attributeKey] ?? attribute.visibility;

    let valueToSend: unknown = rawValue;
    if (attribute.dataType === "boolean") {
      valueToSend = Boolean(rawValue);
    } else if (attribute.dataType === "multi_select") {
      valueToSend = String(rawValue ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else {
      valueToSend = String(rawValue ?? "").trim();
    }

    setSavingAttributeKey(attribute.attributeKey);
    try {
      const result = (await updateProfileAttribute(attribute.attributeKey, valueToSend, visibility)) as { status?: string } | null;
      await refreshProfile();
      toast({
        title: result?.status === "pending" ? "Onay Bekliyor" : "Alan Güncellendi",
        description:
          result?.status === "pending"
            ? `${attribute.label} değişikliği admin onay kuyruğuna alındı.`
            : `${attribute.label} kaydedildi.`,
      });
    } catch (error) {
      toast({
        title: "Alan kaydedilemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSavingAttributeKey(null);
    }
  };

  const handleSubmitRoleRequest = async () => {
    if (!roleRequestTarget) return;

    setSubmittingRoleRequest(true);
    try {
      await submitRoleChangeRequest(roleRequestTarget, roleRequestNote.trim());
      setRoleRequestNote("");
      setRoleRequestTarget("");
      await refreshProfile();
      toast({
        title: "Rol başvurusu gönderildi",
        description: "Başvurun admin onay kuyruğuna eklendi.",
      });
    } catch (error) {
      toast({
        title: "Başvuru gönderilemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSubmittingRoleRequest(false);
    }
  };

  const handleRequestFeature = async (featureKey: GenericFeatureKey) => {
    setFeatureRequestingKey(featureKey);
    try {
      await submitFeatureRequest(featureKey, { requested_from: "profile" });
      await refreshProfile();
      toast({
        title: "Talep gönderildi",
        description: "İlgili feature için admin onay isteği oluşturuldu.",
      });
    } catch (error) {
      toast({
        title: "Talep gönderilemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setFeatureRequestingKey(null);
    }
  };

  if (!type || !isProfileType(type)) {
    return <Navigate to={`/profile/${defaultProfileType}`} replace />;
  }

  if (isLoading) {
    return <div className="flex min-h-[70vh] items-center justify-center">Profiliniz hazırlanıyor...</div>;
  }

  if (profile?.profileType && profile.profileType !== type) {
    return <Navigate to={`/profile/${profile.profileType}`} replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl">{roleMeta?.title ?? "Profilim"}</CardTitle>
            <CardDescription className="max-w-2xl">{roleMeta?.description}</CardDescription>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{profile?.roleLabel ?? roleMeta?.adminLabel ?? "Rol"}</Badge>
              <Badge variant="outline">Tamamlanma %{profile?.profileCompletion.percentage ?? 0}</Badge>
              {errorMessage ? <Badge variant="destructive">Kısmi veri yüklendi</Badge> : null}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refreshProfile()}>
              Yenile
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Çıkış Yap
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Görünen İsim</p>
            <p className="mt-2 text-lg font-semibold">{profile?.fullName || user?.user_metadata?.name || "CorteQS Üyesi"}</p>
          </div>
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">E-posta</p>
            <p className="mt-2 break-all text-sm">{profile?.email ?? user?.email ?? "-"}</p>
          </div>
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Bekleyen Talep</p>
            <p className="mt-2 text-lg font-semibold">{profile?.pendingRequests.length ?? 0}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ortak Profil Alanları</CardTitle>
              <CardDescription>Bu alanlar profil kartın ve directory görünümün için kullanılır.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedAttributes.common.map((attribute) => (
                <ProfileAttributeEditor
                  key={attribute.attributeKey}
                  attribute={attribute}
                  draftValue={draftValues[attribute.attributeKey]}
                  draftVisibility={draftVisibilities[attribute.attributeKey] ?? attribute.visibility}
                  displayNameLabel={roleMeta?.displayNameLabel ?? "Görünen İsim"}
                  isSaving={savingAttributeKey === attribute.attributeKey}
                  onValueChange={(nextValue) => handleDraftChange(attribute.attributeKey, nextValue)}
                  onVisibilityChange={(nextVisibility) =>
                    setDraftVisibilities((current) => ({ ...current, [attribute.attributeKey]: nextVisibility }))
                  }
                  onSave={() => void handleSaveAttribute(attribute)}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rolüne Özel Alanlar</CardTitle>
              <CardDescription>Aktif rolüne bağlı dinamik alanlar burada görünür.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedAttributes.roleSpecific.length > 0 ? (
                groupedAttributes.roleSpecific.map((attribute) => (
                  <ProfileAttributeEditor
                    key={attribute.attributeKey}
                    attribute={attribute}
                    draftValue={draftValues[attribute.attributeKey]}
                    draftVisibility={draftVisibilities[attribute.attributeKey] ?? attribute.visibility}
                    displayNameLabel={roleMeta?.displayNameLabel ?? "Görünen İsim"}
                    isSaving={savingAttributeKey === attribute.attributeKey}
                    onValueChange={(nextValue) => handleDraftChange(attribute.attributeKey, nextValue)}
                    onVisibilityChange={(nextVisibility) =>
                      setDraftVisibilities((current) => ({ ...current, [attribute.attributeKey]: nextVisibility }))
                    }
                    onSave={() => void handleSaveAttribute(attribute)}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Bu rol için ek alan bulunmuyor.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rol Başvurusu</CardTitle>
              <CardDescription>Tek aktif rol modeli korunur. Yeni rol için başvuru admin onayına düşer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={roleRequestTarget} onValueChange={(value) => setRoleRequestTarget(value as ProfileType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Başvurmak istediğin rolü seç" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoleTargets.map((option) => (
                    <SelectItem key={option.type} value={option.type}>
                      {option.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={roleRequestNote}
                onChange={(event) => setRoleRequestNote(event.target.value)}
                placeholder="Kısa bir açıklama veya ek bilgi yazabilirsin."
              />
              <Button className="w-full" disabled={!roleRequestTarget || submittingRoleRequest} onClick={() => void handleSubmitRoleRequest()}>
                {submittingRoleRequest ? "Gönderiliyor..." : "Rol Başvurusu Gönder"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Talepleri</CardTitle>
              <CardDescription>Kapalı veya onay gerektiren akışlar için tek tıkla talep bırak.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {REQUESTABLE_FEATURES.map((item) => {
                const state = featureMap.get(item.key);
                const isPending = profile?.pendingRequests.some((request) => request.targetFeatureKey === item.key) ?? false;
                return (
                  <div key={item.key} className="rounded-xl border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <Badge variant={state?.isEnabled ? "secondary" : "outline"}>
                            {state?.isEnabled ? "Açık" : "Kapalı"}
                          </Badge>
                          <Badge variant="outline">Kaynak: {state?.source ?? "fallback"}</Badge>
                          {isPending ? <Badge variant="outline">Beklemede</Badge> : null}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={Boolean(state?.isEnabled) || isPending || featureRequestingKey === item.key}
                        onClick={() => void handleRequestFeature(item.key)}
                      >
                        {featureRequestingKey === item.key ? "Gönderiliyor..." : state?.isEnabled ? "Aktif" : "Talep Et"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bekleyen Talepler</CardTitle>
              <CardDescription>Admin değerlendirmesi bekleyen son işlemler burada görünür.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile?.pendingRequests.length ? (
                profile.pendingRequests.map((request) => (
                  <div key={request.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{request.requestType}</p>
                        <p className="text-xs text-muted-foreground">{new Date(request.createdAt).toLocaleString("tr-TR")}</p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Şu anda bekleyen talebin yok.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

type ProfileAttributeEditorProps = {
  attribute: ProfileAttributeState;
  draftValue: string | boolean | undefined;
  draftVisibility: AttributeVisibility;
  displayNameLabel: string;
  isSaving: boolean;
  onValueChange: (value: string | boolean) => void;
  onVisibilityChange: (value: AttributeVisibility) => void;
  onSave: () => void;
};

const ProfileAttributeEditor = ({
  attribute,
  draftValue,
  draftVisibility,
  displayNameLabel,
  isSaving,
  onValueChange,
  onVisibilityChange,
  onSave,
}: ProfileAttributeEditorProps) => {
  const attributeLabel = attribute.attributeKey === "full_name" ? displayNameLabel : attribute.label;

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{attributeLabel}</p>
            {attribute.isRequired ? <Badge variant="secondary">Zorunlu</Badge> : null}
            {attribute.requiresAdminApprovalOnChange ? <Badge variant="outline">Onaylı</Badge> : null}
          </div>
          {attribute.description ? <p className="text-sm text-muted-foreground">{attribute.description}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {attribute.approvalStatus === "approved" ? (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Onaylı
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-700">
              <Clock3 className="h-3.5 w-3.5" />
              Beklemede
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-slate-600">
            {draftVisibility === "public" ? <Globe2 className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            {draftVisibility}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <AttributeInput attribute={attribute} value={draftValue} onChange={onValueChange} />

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-xs">
            <Select
              value={draftVisibility}
              onValueChange={(value) => onVisibilityChange(value as AttributeVisibility)}
              disabled={!attribute.userCanHide}
            >
              <SelectTrigger>
                <SelectValue placeholder="Görünürlük seç" />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onSave} disabled={!attribute.userCanEdit || isSaving}>
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>

        {attribute.requiresAdminApprovalOnChange ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4" />
              <p>Bu alan güncellendiğinde public görünmeden önce admin onayı bekler.</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

type AttributeInputProps = {
  attribute: ProfileAttributeState;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
};

const AttributeInput = ({ attribute, value, onChange }: AttributeInputProps) => {
  if (attribute.dataType === "textarea" || attribute.dataType === "multi_select" || attribute.dataType === "json") {
    return (
      <Textarea
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={attribute.dataType === "multi_select" ? "Virgülle ayırarak yaz" : attribute.label}
      />
    );
  }

  if (attribute.dataType === "boolean") {
    return (
      <div className="flex items-center justify-between rounded-xl border px-3 py-2">
        <div>
          <p className="font-medium">{attribute.label}</p>
          <p className="text-sm text-muted-foreground">Açık / kapalı durumu</p>
        </div>
        <Switch checked={Boolean(value)} onCheckedChange={(checked) => onChange(checked)} />
      </div>
    );
  }

  return (
    <Input
      type={attribute.dataType === "url" ? "url" : "text"}
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={attribute.label}
    />
  );
};

export default ProfilePage;
