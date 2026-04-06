import { createRoot } from "react-dom/client";
import "./index.css";
import { recoverFromWhiteScreen, setupWhiteScreenRecovery } from "@/lib/recoveryReload";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element bulunamadı.");
}

const root = createRoot(rootElement);

const renderBootstrapFallback = () => {
  root.render(
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <h1 className="text-2xl font-extrabold mb-3">Sayfa yüklenemedi</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Uygulama başlatılırken bir hata oluştu. Tekrar denemek için sayfayı yenileyin.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>,
  );
};

const bootstrapApp = async () => {
  setupWhiteScreenRecovery();

  try {
    const { default: App } = await import("./App.tsx");
    root.render(<App />);
  } catch (error) {
    console.error("Application bootstrap error:", error);
    const recovered = recoverFromWhiteScreen();
    if (!recovered) {
      renderBootstrapFallback();
    }
  }
};

void bootstrapApp();

