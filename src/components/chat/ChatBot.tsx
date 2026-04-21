import { useEffect, useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";
import RegisterInterestForm from "@/components/RegisterInterestForm";
import { useChatMachine } from "@/hooks/useChatMachine";

const ChatBot = () => {
  const {
    state,
    sendMessage,
    selectQuickReply,
    uploadFiles,
    removeFile,
    submit,
    prefillCity,
  } = useChatMachine();

  const [classicFormOpen, setClassicFormOpen] = useState(false);
  const [presetCity, setPresetCity] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleSelectCity = (event: Event) => {
      const detail =
        (event as CustomEvent<{ city?: string; mode?: "ai" | "form" }>)
          .detail || {};
      const city = detail.city?.trim();
      if (!city) return;

      if (detail.mode === "form") {
        setPresetCity(city);
        setClassicFormOpen(true);
        return;
      }

      prefillCity(city);
    };

    window.addEventListener(
      "corteqs:select-city",
      handleSelectCity as EventListener
    );
    return () => {
      window.removeEventListener(
        "corteqs:select-city",
        handleSelectCity as EventListener
      );
    };
  }, [prefillCity]);

  useEffect(() => {
    if (
      state.step === "summary" &&
      state.messages.length > 0 &&
      state.messages[state.messages.length - 1].role === "user"
    ) {
      void submit();
    }
  }, [state.step, state.messages, submit]);

  const handleSendMessage = (input: string) => {
    sendMessage(input);
  };

  const handleSelectQuickReply = (value: string) => {
    if (value === "__confirm__") {
      void submit();
      return;
    }
    if (value === "__go_back__") {
      return;
    }
    selectQuickReply(value);
  };

  return (
    <section
      id="kaydol"
      className="relative overflow-hidden py-16 lg:py-24"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--accent) / 0.06) 50%, hsl(var(--background)) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "hsl(var(--accent))" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "hsl(var(--primary))" }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Akıllı Kayıt Deneyimi
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Form Doldurmaktan <span className="text-accent">Sıkıldın mı?</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Adım adım sohbet ile kaydını saniyeler içinde tamamla. İstersen klasik forma da geçebilirsin.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <span className="text-sm text-muted-foreground">
              Sohbet yerine klasik form mu istiyorsun?
            </span>
            <button
              type="button"
              onClick={() => setClassicFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary/5"
            >
              <FileText className="h-4 w-4 text-primary" />
              Ben Form Dolduracağım
            </button>
          </div>
        </div>

        <ChatWindow
          state={state}
          onSendMessage={handleSendMessage}
          onSelectQuickReply={handleSelectQuickReply}
          onUploadFiles={uploadFiles}
          onRemoveFile={removeFile}
        />
      </div>

      <RegisterInterestForm
        open={classicFormOpen}
        onOpenChange={(open) => {
          setClassicFormOpen(open);
          if (!open) setPresetCity(undefined);
        }}
        defaultCity={presetCity}
      />
    </section>
  );
};

export default ChatBot;
