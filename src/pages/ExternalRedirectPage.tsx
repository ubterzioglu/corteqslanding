import { useEffect } from "react";

interface ExternalRedirectPageProps {
  title: string;
  description: string;
  targetUrl: string;
}

const ExternalRedirectPage = ({ title, description, targetUrl }: ExternalRedirectPageProps) => {
  useEffect(() => {
    window.location.replace(targetUrl);
  }, [targetUrl]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-sm text-muted-foreground">Yonlendiriliyorsunuz...</p>
        <a
          href={targetUrl}
          className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Sayfa acilmazsa buraya tiklayin
        </a>
      </div>
    </div>
  );
};

export default ExternalRedirectPage;
