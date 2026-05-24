import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/components/auth/useAuth";
import { IndividualProfileCards } from "@/components/profile/IndividualProfileCards";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useIndividualProfileDetails } from "@/hooks/useIndividualProfileDetails";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { INDIVIDUAL_FEATURES } from "@/lib/features";
import { defaultProfileType, isProfileType, profileTypeOptions, type ProfileType } from "@/lib/profile-types";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const [assignedType, setAssignedType] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingBasicProfile, setIsEditingBasicProfile] = useState(false);
  const [basicDisplayNameInput, setBasicDisplayNameInput] = useState("");
  const [isSavingBasicProfile, setIsSavingBasicProfile] = useState(false);
  const [savedDisplayName, setSavedDisplayName] = useState<string | null>(null);
  const shouldLoadIndividualFeatures = type === "bireysel" && assignedType === "bireysel" && !isLoading;
  const {
    isLoading: isFeaturesLoading,
    errorMessage: featureErrorMessage,
    featureSources,
    isFeatureEnabled,
  } = useFeatureFlags(shouldLoadIndividualFeatures);
  const {
    isLoading: isIndividualProfileLoading,
    errorMessage: individualProfileErrorMessage,
    details: individualProfileDetails,
    isSaving: isSavingIndividualProfile,
    saveErrorMessage: saveIndividualProfileErrorMessage,
    saveDetails: saveIndividualProfileDetails,
    refreshDetails: refreshIndividualProfileDetails,
  } = useIndividualProfileDetails(shouldLoadIndividualFeatures);

  const displayName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name;
    const name = user?.user_metadata?.name;
    return fullName || name || "CorteQS Üyesi";
  }, [user?.user_metadata?.full_name, user?.user_metadata?.name]);
  const shownDisplayName = savedDisplayName ?? displayName;

  useEffect(() => {
    if (isEditingBasicProfile) return;
    setBasicDisplayNameInput(shownDisplayName);
  }, [isEditingBasicProfile, shownDisplayName]);

  useEffect(() => {
    if (!user || !type || !isProfileType(type)) return;
    let isMounted = true;

    void (async () => {
      const { data } = await supabase
        .from("user_profiles")
        .select("profile_type")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!isMounted) return;

      const nextType = data?.profile_type;
      if (nextType && isProfileType(nextType)) {
        setAssignedType(nextType);
      } else {
        setAssignedType(defaultProfileType);
      }
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [user, type]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const handleSaveIndividualProfile = async (input: Parameters<typeof saveIndividualProfileDetails>[0]) => {
    try {
      await saveIndividualProfileDetails(input);
      toast({
        title: "Profil kaydedildi",
        description: "Panel bilgileriniz guncellendi.",
      });
    } catch (error) {
      toast({
        title: "Profil kaydedilemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata olustu.",
        variant: "destructive",
      });
    }
  };

  const handleSaveBasicProfile = async () => {
    if (!user) return;
    const normalizedName = basicDisplayNameInput.trim();
    if (!normalizedName) {
      toast({
        title: "Ad alani zorunlu",
        description: "Lutfen gecerli bir ad girin.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingBasicProfile(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ full_name: normalizedName })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      await supabase.auth.updateUser({
        data: {
          full_name: normalizedName,
          name: normalizedName,
        },
      });

      if (type === "bireysel") {
        await refreshIndividualProfileDetails();
      }

      setSavedDisplayName(normalizedName);
      setIsEditingBasicProfile(false);
      toast({
        title: "Profil guncellendi",
        description: "Ad bilginiz kaydedildi.",
      });
    } catch (error) {
      toast({
        title: "Profil guncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata olustu.",
        variant: "destructive",
      });
    } finally {
      setIsSavingBasicProfile(false);
    }
  };

  if (!type || !isProfileType(type)) {
    return <Navigate to={`/profile/${defaultProfileType}`} replace />;
  }

  if (isLoading) {
    return <div className="flex min-h-[70vh] items-center justify-center">Profiliniz yükleniyor...</div>;
  }

  if (assignedType && assignedType !== type) {
    return <Navigate to={`/profile/${assignedType}`} replace />;
  }

  const selectedOption = profileTypeOptions.find((option) => option.type === type);
  const visibleIndividualModules = INDIVIDUAL_FEATURES.filter((feature) => isFeatureEnabled(feature.key));
  const showIndividualLoading = type === "bireysel" && shouldLoadIndividualFeatures && isIndividualProfileLoading;
  const showBasicProfileEditor = type !== "bireysel";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{selectedOption?.title ?? "Profilim"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">{selectedOption?.description}</p>
          <div className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">Temel Profil Bilgisi</p>
              {showBasicProfileEditor && !isEditingBasicProfile ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingBasicProfile(true)}>
                  Duzenle
                </Button>
              ) : null}
            </div>
            {showBasicProfileEditor && isEditingBasicProfile ? (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={basicDisplayNameInput}
                  onChange={(event) => setBasicDisplayNameInput(event.target.value)}
                  className="min-w-[240px] flex-1"
                  placeholder="Ad Soyad"
                />
                <Button type="button" size="sm" disabled={isSavingBasicProfile} onClick={() => void handleSaveBasicProfile()}>
                  {isSavingBasicProfile ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isSavingBasicProfile}
                  onClick={() => {
                    setBasicDisplayNameInput(shownDisplayName);
                    setIsEditingBasicProfile(false);
                  }}
                >
                  Iptal
                </Button>
              </div>
            ) : (
              <p>
                <span className="font-semibold">Ad:</span> {shownDisplayName}
              </p>
            )}
          </div>
          <p>
            <span className="font-semibold">E-posta:</span> {user?.email ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Kullanıcı ID:</span> {user?.id ?? "-"}
          </p>
          {type === "bireysel" && individualProfileErrorMessage ? (
            <p className="text-muted-foreground">
              Profil detayları yedek verilerle gösteriliyor: {individualProfileErrorMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {type === "bireysel" ? (
        showIndividualLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Bireysel profil alanları yükleniyor...
            </CardContent>
          </Card>
        ) : individualProfileDetails ? (
          <IndividualProfileCards
            details={individualProfileDetails}
            visibleModules={visibleIndividualModules}
            featureSources={featureSources as Record<string, string>}
            isFeaturesLoading={isFeaturesLoading}
            featureErrorMessage={featureErrorMessage}
            isSavingProfile={isSavingIndividualProfile}
            saveProfileError={saveIndividualProfileErrorMessage}
            onSaveProfile={handleSaveIndividualProfile}
          />
        ) : null
      ) : null}

      <div>
        <Button type="button" variant="outline" onClick={handleSignOut}>
          Çıkış yap
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;

