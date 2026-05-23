import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type GoogleUserProfileRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  profile_type: string;
  auth_provider: string | null;
  created_at: string;
};

const AdminRolesDraftPage = () => {
  const [rows, setRows] = useState<GoogleUserProfileRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from("user_profiles")
        .select("user_id, email, full_name, profile_type, auth_provider, created_at")
        .eq("auth_provider", "google")
        .order("created_at", { ascending: false });

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
  }, []);

  const totalGoogleUsers = useMemo(() => rows.length, [rows]);

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
          <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
            Toplam Google kullanıcı: <span className="font-semibold text-foreground">{totalGoogleUsers}</span>
          </div>

          {isLoading ? <p className="text-sm text-muted-foreground">Kullanıcı listesi yükleniyor...</p> : null}
          {errorMessage ? <p className="text-sm text-destructive">Liste alınamadı: {errorMessage}</p> : null}

          {!isLoading && !errorMessage ? (
            rows.length > 0 ? (
              <div className="overflow-x-auto rounded-md border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 font-medium">Ad Soyad</th>
                      <th className="px-3 py-2 font-medium">E-posta</th>
                      <th className="px-3 py-2 font-medium">Profil Tipi</th>
                      <th className="px-3 py-2 font-medium">Provider</th>
                      <th className="px-3 py-2 font-medium">Kayıt Tarihi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.user_id} className="border-t">
                        <td className="px-3 py-2">{row.full_name || "-"}</td>
                        <td className="px-3 py-2">{row.email || "-"}</td>
                        <td className="px-3 py-2">{row.profile_type}</td>
                        <td className="px-3 py-2">{row.auth_provider || "-"}</td>
                        <td className="px-3 py-2">
                          {new Date(row.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Berlin" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Google ile giriş yapmış kullanıcı bulunamadı.</p>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRolesDraftPage;
