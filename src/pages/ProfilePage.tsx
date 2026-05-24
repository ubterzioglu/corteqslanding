import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/components/auth/useAuth";
import { IndividualProfileCards } from "@/components/profile/IndividualProfileCards";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useIndividualProfileDetails } from "@/hooks/useIndividualProfileDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { INDIVIDUAL_FEATURES } from "@/lib/features";
import { defaultProfileType, isProfileType, profileTypeOptions, type ProfileType } from "@/lib/profile-types";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const [assignedType, setAssignedType] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  } = useIndividualProfileDetails(shouldLoadIndividualFeatures);

  const displayName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name;
    const name = user?.user_metadata?.name;
    return fullName || name || "CorteQS Üyesi";
  }, [user?.user_metadata?.full_name, user?.user_metadata?.name]);

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

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{selectedOption?.title ?? "Profilim"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">{selectedOption?.description}</p>
          <p>
            <span className="font-semibold">Ad:</span> {displayName}
          </p>
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

