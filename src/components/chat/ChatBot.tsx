import { useEffect, useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";
import RegisterInterestForm from "@/components/RegisterInterestForm";
import { useChatMachine } from "@/hooks/useChatMachine";
import {
  getStepMessage,
  shouldRedirectToKnowledgeAssistant,
  shouldStartRegistration,
} from "@/lib/chatConfig";
import { askRag } from "@/lib/ragApi";

const ChatBot = () => {
  const {
    state,
    sendMessage,
    goBack,
    selectQuickReply,
    uploadFiles,
    removeFile,
    submit,
    prefillCity,
    beginRegistration,
    appendMessage,
  } = useChatMachine();

  const [classicFormOpen, setClassicFormOpen] = useState(false);
  const [presetCity, setPresetCity] = useState<string | undefined>(undefined);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);

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

  const answerKnowledgeQuestion = async (input: string) => {
    appendMessage({ role: "user", content: input });
    setKnowledgeError(null);
    setKnowledgeLoading(true);

    try {
      const { answer, hasContext } = await askRag(input);
      appendMessage({
        role: "bot",
        content: hasContext
          ? answer
          : "Üzgünüm, bu konuda yeterli bilgi bulamadım. Daha farklı bir şekilde sorabilir misin?",
      });

      if (state.step !== "welcome" && !state.submitted) {
        const { content, quickReplies } = getStepMessage(state.step, state.data);
        appendMessage({
          role: "bot",
          content: `Kayıt için kaldığımız yerden devam edelim.\n\n${content}`,
          quickReplies,
        });
      }
    } catch {
      const message = "Bilgi asistanına şu anda ulaşılamıyor. Lütfen birazdan tekrar dene.";
      setKnowledgeError(message);
      appendMessage({ role: "bot", content: message });
    } finally {
      setKnowledgeLoading(false);
    }
  };

  const handleSendMessage = (input: string) => {
    if (knowledgeLoading || state.loading) return;
    setKnowledgeError(null);

    if (state.step === "welcome") {
      if (shouldStartRegistration(input)) {
        beginRegistration(input);
        return;
      }

      void answerKnowledgeQuestion(input);
      return;
    }

    if (state.submitted || shouldRedirectToKnowledgeAssistant(input)) {
      void answerKnowledgeQuestion(input);
      return;
    }

    sendMessage(input);
  };

  const handleSelectQuickReply = (value: string) => {
    if (value === "__confirm__") {
      void submit();
      return;
    }
    if (value === "__go_back__") {
      goBack();
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
              Yapay Zeka Destekli Asistan
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Sorularını Sor, <span className="text-accent">İstersen Kaydını da Bırak</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Aynı sohbet içinde önce CorteQS hakkında bilgi alabilir, hazır olduğunda kayıt akışına geçebilirsin.
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
          assistantTitle="CorteQS Asistanı"
          assistantStatus={
            state.submitted
              ? "Kayıt tamamlandı, sorularına devam edebilirsin ✅"
              : state.step === "welcome"
                ? "Sorulara cevap verir, istediğinde kayda geçer"
                : "Kayıt modunda, ama sorularını da yanıtlayabilir"
          }
          loadingOverride={state.loading || knowledgeLoading}
          errorOverride={knowledgeError ?? state.error}
          allowInputAfterSubmit
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
