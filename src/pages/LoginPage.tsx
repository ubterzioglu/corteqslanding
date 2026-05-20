import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/components/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const { session, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo = useMemo(() => `${window.location.origin}/login`, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Giriş | CorteQS";

    let metaRobots = document.querySelector('meta[name="robots"]');
    const hadExistingMeta = Boolean(metaRobots);
    const previousRobotsContent = metaRobots?.getAttribute("content");

    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute("content", "noindex, nofollow");

    return () => {
      document.title = previousTitle;
      if (!metaRobots) return;
      if (hadExistingMeta) {
        if (previousRobotsContent) {
          metaRobots.setAttribute("content", previousRobotsContent);
        } else {
          metaRobots.removeAttribute("content");
        }
      } else {
        metaRobots.remove();
      }
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
    }
  };

  if (!isLoading && session) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>CorteQS Giriş</CardTitle>
          <CardDescription>Google hesabınızla giriş yapın.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" className="w-full" onClick={handleGoogleSignIn} disabled={submitting || isLoading}>
            {submitting ? "Yönlendiriliyor..." : "Google ile giriş yap"}
          </Button>
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

