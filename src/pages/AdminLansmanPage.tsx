import { useEffect, useMemo, useState } from "react";

import AdminLansmanTable from "@/components/AdminLansmanTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "corteqs.lansman.admin.access";
const PASSWORD_STORAGE_KEY = "corteqs.lansman.admin.password";

const AdminLansmanPage = () => {
  const configuredPassword = useMemo(
    () => import.meta.env.VITE_ADMIN_PASSWORD?.trim() ?? "",
    [],
  );
  const [password, setPassword] = useState("");
  const [hasAccess, setHasAccess] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.sessionStorage.getItem(STORAGE_KEY) === "granted" &&
      Boolean(window.sessionStorage.getItem(PASSWORD_STORAGE_KEY))
    );
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasAccess(
      window.sessionStorage.getItem(STORAGE_KEY) === "granted" &&
        Boolean(window.sessionStorage.getItem(PASSWORD_STORAGE_KEY)),
    );
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!configuredPassword) {
      setError("Admin şifresi yapılandırılmamış.");
      return;
    }

    if (password !== configuredPassword) {
      setError("Şifre hatalı.");
      return;
    }

    // MVP note: this only gates the UI. Real admin protection is enforced in the edge function.
    window.sessionStorage.setItem(STORAGE_KEY, "granted");
    window.sessionStorage.setItem(PASSWORD_STORAGE_KEY, password);
    setHasAccess(true);
    setPassword("");
    setError("");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
    setHasAccess(false);
    setPassword("");
    setError("");
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Lansman Admin</h1>
            <p className="text-sm text-muted-foreground">
              Bu ekran MVP seviyesinde geçici şifre koruması kullanır.
            </p>
            <p className="text-xs text-muted-foreground">
              Not: Gerçek yönetici koruması frontend değişkeni ile değil, edge function tarafında sağlanır.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
                Admin Şifresi
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Şifreyi girin"
              />
            </div>

            {error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Lansman Yönetimi</h1>
            <p className="text-sm text-muted-foreground">
              Tüm başvuruları görüntüleyin, onaylayın veya reddedin.
            </p>
          </div>

          <Button type="button" variant="outline" onClick={handleLogout}>
            Çıkış
          </Button>
        </div>

        <AdminLansmanTable />
      </div>
    </div>
  );
};

export default AdminLansmanPage;
