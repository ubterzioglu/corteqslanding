import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/components/auth/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { defaultProfileType, isProfileType, profileTypeOptions, type ProfileType } from "@/lib/profile-types";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const [assignedType, setAssignedType] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [isSavingNickname, setIsSavingNickname] = useState(false);
  const [savedNickname, setSavedNickname] = useState<string | null>(null);

  const displayName = useMemo(() => {
    const fullName = user?.user_metadata?.full_name;
    const name = user?.user_metadata?.name;
    return fullName || name || "CorteQS Uyesi";
  }, [user?.user_metadata?.full_name, user?.user_metadata?.name]);

  const shownNickname = savedNickname ?? displayName;

  useEffect(() => {
    if (isEditingNickname) return;
    setNicknameInput(shownNickname);
  }, [isEditingNickname, shownNickname]);

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

  const handleSaveNickname = async () => {
    if (!user) return;

    const normalizedName = nicknameInput.trim();
    if (!normalizedName) {
      toast({
        title: "Nickname zorunlu",
        description: "Lutfen gecerli bir nickname girin.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingNickname(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ full_name: normalizedName })
        .eq("user_id", user.id);

      if (error) throw error;

      await supabase.auth.updateUser({
        data: {
          full_name: normalizedName,
          name: normalizedName,
        },
      });

      setSavedNickname(normalizedName);
      setIsEditingNickname(false);
      toast({
        title: "Profil guncellendi",
        description: "Nickname kaydedildi.",
      });
    } catch (error) {
      toast({
        title: "Profil guncellenemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata olustu.",
        variant: "destructive",
      });
    } finally {
      setIsSavingNickname(false);
    }
  };

  if (!type || !isProfileType(type)) {
    return <Navigate to={`/profile/${defaultProfileType}`} replace />;
  }

  if (isLoading) {
    return <div className="flex min-h-[70vh] items-center justify-center">Profiliniz yukleniyor...</div>;
  }

  if (assignedType && assignedType !== type) {
    return <Navigate to={`/profile/${assignedType}`} replace />;
  }

  const selectedOption = profileTypeOptions.find((option) => option.type === type);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{selectedOption?.title ?? "Profilim"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">{selectedOption?.description}</p>

          <div className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">Nickname</p>
              {!isEditingNickname ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingNickname(true)}>
                  Duzenle
                </Button>
              ) : null}
            </div>

            {isEditingNickname ? (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={nicknameInput}
                  onChange={(event) => setNicknameInput(event.target.value)}
                  className="min-w-[240px] flex-1"
                  placeholder="Nickname"
                />
                <Button type="button" size="sm" disabled={isSavingNickname} onClick={() => void handleSaveNickname()}>
                  {isSavingNickname ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isSavingNickname}
                  onClick={() => {
                    setNicknameInput(shownNickname);
                    setIsEditingNickname(false);
                  }}
                >
                  Iptal
                </Button>
              </div>
            ) : (
              <p>
                <span className="font-semibold">Nickname:</span> {shownNickname}
              </p>
            )}
          </div>

          <p>
            <span className="font-semibold">E-posta:</span> {user?.email ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Kullanici ID:</span> {user?.id ?? "-"}
          </p>
        </CardContent>
      </Card>

      <div>
        <Button type="button" variant="outline" onClick={handleSignOut}>
          Cikis yap
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
