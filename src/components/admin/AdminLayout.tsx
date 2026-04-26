import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link, NavLink, Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Download, Layers3, Plus, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { userIsAdmin } from "@/lib/admin";
import { advisorProfileSections } from "@/lib/resource-links";

type AdminOutletContext = {
  session: Session;
};

export function useAdminOutletContext() {
  return useOutletContext<AdminOutletContext>();
}

const navItems = [
  { to: "/admin/members", label: "Üye Takibi" },
  { to: "/admin/referral", label: "Referral Kod Oluştur" },
  { to: "/admin/muhasebe", label: "Muhasebe" },
  { to: "/admin/marquee", label: "Haber Bandı" },
  { to: "/admin/advisors", label: "Danışman/SM" },
  { to: "/admin/social-media", label: "Sosyal Medya" },
  { to: "/admin/about", label: "Güncellemeler" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;

const secondaryLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary/10 text-primary"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;

const AdminLayout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const showAdvisorSubnav = location.pathname.startsWith("/admin/advisors");

  const syncSession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    setAuthenticated(Boolean(nextSession));
    setCheckingAccess(true);

    if (!nextSession?.user) {
      setIsAdmin(false);
      setCheckingAccess(false);
      return;
    }

    try {
      const allowed = await userIsAdmin(nextSession.user.id);
      setIsAdmin(allowed);
    } catch (error) {
      console.error(error);
      setIsAdmin(false);
      toast({
        title: "Admin erişimi doğrulanamadı",
        description: "Yetki kontrolü sırasında bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setCheckingAccess(false);
    }
  }, [toast]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession);
    });

    void supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      void syncSession(initialSession);
    });

    return () => data.subscription.unsubscribe();
  }, [syncSession]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Giriş başarısız", description: error.message, variant: "destructive" });
    }
    setAuthLoading(false);
  };

  const handlePasswordReset = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast({
        title: "E-posta gerekli",
        description: "Sıfırlama bağlantısı için önce e-posta adresinizi girin.",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);

    if (error) {
      toast({
        title: "Sıfırlama isteği alınamadı",
        description: "Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "İstek alındı",
      description: "Bu e-posta kayıtlıysa sıfırlama bağlantısı gönderilecek.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
    setIsAdmin(false);
    setSession(null);
  };

  const globalActions = useMemo(
    () => [
      {
        label: "Yeni kayıt ekle",
        icon: Plus,
        onClick: () => navigate("/admin/members?action=create-member"),
      },
      {
        label: "Referral oluştur",
        icon: Share2,
        onClick: () => navigate("/admin/referral?action=create"),
      },
      {
        label: "Export / Import",
        icon: Download,
        onClick: () => navigate("/admin/members?action=import-export"),
      },
      {
        label: "Toplu işlem",
        icon: Layers3,
        onClick: () => navigate("/admin/members?action=bulk"),
      },
    ],
    [navigate],
  );

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Giriş</CardTitle>
            <CardDescription>Kayıtlara erişmek için yetkili hesabınızla giriş yapın.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="email" placeholder="E-posta" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <Input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Button type="submit" disabled={authLoading} className="w-full">
                {authLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
              <button
                type="button"
                onClick={() => void handlePasswordReset()}
                disabled={resetLoading}
                className="w-full text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-60"
              >
                {resetLoading ? "Gönderiliyor..." : "Şifremi unuttum"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkingAccess) {
    return <div className="flex min-h-screen items-center justify-center bg-background">Yetki kontrol ediliyor...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Bu hesabın admin yetkisi yok</CardTitle>
            <CardDescription>
              Supabase üzerindeki <code>admin_users</code> tablosuna kullanıcı kimliği eklenmeden kayıtlara erişemezsiniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Giriş yapan kullanıcı: <span className="font-medium text-foreground">{session?.user.email}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>Çıkış Yap</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-foreground">CorteQS Admin</h1>
              <span className="text-xs text-muted-foreground">{session?.user.email}</span>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
              {location.pathname.startsWith("/admin/referral/sources") && (
                <Link to="/admin/referral" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                  {"<- Referral"}
                </Link>
              )}
              {location.pathname.startsWith("/admin/referral/groups") && (
                <Link to="/admin/referral" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                  {"<- Referral"}
                </Link>
              )}
              {location.pathname.startsWith("/admin/referral/types") && (
                <Link to="/admin/referral" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
                  {"<- Referral"}
                </Link>
              )}
              <button onClick={() => void handleLogout()} className={linkClass({ isActive: false })}>
                Çıkış
              </button>
            </nav>
          </div>
          {showAdvisorSubnav && (
            <nav className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {advisorProfileSections.map((section) => (
                <NavLink
                  key={section.key}
                  to={`/admin/advisors/${section.key}`}
                  className={secondaryLinkClass}
                >
                  {section.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
          {globalActions.map((action) => (
            <Button key={action.label} variant="outline" size="sm" onClick={action.onClick}>
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
        {session && <Outlet context={{ session }} />}
      </main>
    </div>
  );
};

export default AdminLayout;
