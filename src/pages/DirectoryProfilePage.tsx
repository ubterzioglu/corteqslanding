import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type DirectoryProfilePayload = {
  user_id: string;
  role_key: string;
  role_label: string;
  role_slug: string;
  display_name: string;
  short_bio: string | null;
  country: string | null;
  city: string | null;
  profile_image_url: string | null;
  special_attribute_label: string | null;
  special_attribute_value: string | null;
  is_featured: boolean;
  is_verified: boolean;
};

const DirectoryProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<DirectoryProfilePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);
      const { data, error } = await supabase.rpc("get_public_directory_profile", { target_user_id: userId });

      if (!isMounted) return;

      if (error) {
        setErrorMessage(error.message);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setProfile((data as DirectoryProfilePayload | null) ?? null);
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (!userId) {
    return <Navigate to="/directory" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link to="/directory">Directory'ye Dön</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{profile?.display_name ?? "Profil"}</CardTitle>
          <CardDescription>{profile?.role_label ?? "Directory Profili"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? <p className="text-sm text-muted-foreground">Profil yükleniyor...</p> : null}
          {errorMessage ? <p className="text-sm text-destructive">Profil alınamadı: {errorMessage}</p> : null}

          {!isLoading && !errorMessage && !profile ? (
            <p className="text-sm text-muted-foreground">Bu profil görünür değil veya bulunamadı.</p>
          ) : null}

          {profile ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {profile.is_featured ? <Badge>Featured</Badge> : null}
                {profile.is_verified ? <Badge variant="outline">Onaylı</Badge> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Konum</p>
                  <p className="mt-2 text-base">{profile.country ?? "-"} {profile.city ? `• ${profile.city}` : ""}</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Rol Özel Alan</p>
                  <p className="mt-2 text-base">
                    {profile.special_attribute_label && profile.special_attribute_value
                      ? `${profile.special_attribute_label}: ${profile.special_attribute_value}`
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Kısa Açıklama</p>
                <p className="mt-2 whitespace-pre-wrap text-base">{profile.short_bio ?? "Henüz public açıklama paylaşılmadı."}</p>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectoryProfilePage;
