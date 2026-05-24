import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/components/auth/useAuth";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
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
        </CardContent>
      </Card>

      {type === "bireysel" ? (
        <Card>
          <CardHeader>
            <CardTitle>Bireysel Modüller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {isFeaturesLoading ? <p className="text-muted-foreground">Modüller yükleniyor...</p> : null}
            {!isFeaturesLoading && featureErrorMessage ? (
              <p className="text-muted-foreground">
                Feature verisi alınamadı. Güvenli mod nedeniyle modüller gizlenmiştir.
              </p>
            ) : null}
            {!isFeaturesLoading && !featureErrorMessage && visibleIndividualModules.length === 0 ? (
              <p className="text-muted-foreground">Bu hesap için aktif bireysel modül bulunmuyor.</p>
            ) : null}
            {!isFeaturesLoading && !featureErrorMessage && visibleIndividualModules.length > 0
              ? visibleIndividualModules.map((feature) => (
                  <div key={feature.key} className="rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{feature.label}</p>
                      <span className="rounded border px-2 py-0.5 text-[11px] text-muted-foreground">
                        kaynak: {featureSources[feature.key] ?? "fallback"}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{feature.description}</p>
                  </div>
                ))
              : null}
          </CardContent>
        </Card>
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

