import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Send, Paperclip, X, CheckCircle2, Loader2, Bot, User as UserIcon, Users, MapPin, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import RegisterInterestForm from "@/components/RegisterInterestForm";

type MatchPreview = {
  id: string;
  fullname: string;
  city: string;
  country: string;
  field: string;
  category: string | null;
  score: number;
  reason: string;
};

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  matches?: MatchPreview[];
};

type Collected = {
  category?: string;
  fullname?: string;
  country?: string;
  city?: string;
  business?: string;
  field?: string;
  email?: string;
  phone?: string;
  offers_needs?: string;
  referral_code?: string;
  contest_interest?: boolean;
};

type AIResponse = {
  message: string;
  extracted?: Collected;
  request_upload?: boolean;
  status: "in_progress" | "ready_to_submit" | "submit";
  error?: string;
};

const REQUIRED_FIELDS: (keyof Collected)[] = [
  "category",
  "fullname",
  "country",
  "city",
  "field",
  "email",
  "phone",
];

const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_DOC_BYTES = 10 * 1024 * 1024;
const MAX_DOC_COUNT = 5;

const INITIAL_MESSAGE: ChatMsg = {
  role: "assistant",
  content:
    "Merhaba! 👋 Ben CorteQS'in akıllı kayıt asistanıyım. Seni 1 dakikada diaspora ağımıza dahil edeyim.\n\n⚠️ **Dikkat:** Buraya girdiğin bilgi ile diasporadaki kaynaklara hem de cepten ulaşırsın. Bilgilerini eksiksiz ve doğru ver — eşleşme kaliten buna bağlı. 📱\n\nBana kısaca kendinden bahset: **Kimsin, nerede yaşıyorsun, ne yapıyorsun?** Gerisini ben halledeyim ✨",
};

const ChatRegisterBar = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [collected, setCollected] = useState<Collected>({});
  const [docs, setDocs] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [classicFormOpen, setClassicFormOpen] = useState(false);
  const [presetCity, setPresetCity] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progress = useMemo(() => {
    const done = REQUIRED_FIELDS.filter((k) => !!collected[k]).length;
    return Math.round((done / REQUIRED_FIELDS.length) * 100);
  }, [collected]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#kaydol-form") {
        setClassicFormOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);

    const handleSelectCity = (e: Event) => {
      const detail = (e as CustomEvent<{ city?: string; mode?: "ai" | "form" }>).detail || {};
      const city = detail.city?.trim();
      if (!city) return;
      if (detail.mode === "form") {
        setPresetCity(city);
        setClassicFormOpen(true);
        return;
      }
      // AI chat path: prefill collected city + seed a user message
      setCollected((prev) => ({ ...prev, city }));
      setMessages((prev) => {
        // Avoid duplicate seeds
        if (prev.some((m) => m.role === "user" && m.content.includes(`📍 ${city}`))) return prev;
        return [
          ...prev,
          { role: "user", content: `📍 ${city} şehrindeyim — buradan devam edelim.` },
          {
            role: "assistant",
            content: `Harika! **${city}** olarak not aldım ✨ Şimdi bana **adını ve ne iş yaptığını** söyler misin? (İstersen sonra şehri değiştirebilirsin.)`,
          },
        ];
      });
    };
    window.addEventListener("corteqs:select-city", handleSelectCity as EventListener);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("corteqs:select-city", handleSelectCity as EventListener);
    };
  }, []);

  const callAI = async (history: ChatMsg[], nextCollected: Collected) => {
    const { data, error } = await supabase.functions.invoke<AIResponse>("chat-register", {
      body: { messages: history, collected: nextCollected },
    });
    if (error) throw error;
    if (!data) throw new Error("AI cevabı alınamadı");
    if ((data as any).error) throw new Error((data as any).error);
    return data;
  };

  const findMatches = async (
    payload: {
      sourceSubmissionId?: string;
      offers_needs?: string;
      field?: string;
      city?: string;
      country?: string;
      category?: string;
      persist?: boolean;
    },
  ): Promise<MatchPreview[]> => {
    if (!payload.offers_needs || payload.offers_needs.trim().length < 5) return [];
    try {
      const { data, error } = await supabase.functions.invoke<{ matches: MatchPreview[] }>(
        "find-matches",
        { body: payload },
      );
      if (error) throw error;
      return data?.matches ?? [];
    } catch (err) {
      console.error("find-matches error:", err);
      return [];
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const merged = [...docs];
    for (const file of Array.from(files)) {
      if (!ALLOWED_DOC_TYPES.includes(file.type)) {
        toast({ title: "Desteklenmeyen format", description: `${file.name} — PDF, DOC, JPG, PNG, WEBP olmalı.`, variant: "destructive" });
        continue;
      }
      if (file.size > MAX_DOC_BYTES) {
        toast({ title: "Dosya çok büyük", description: `${file.name} — maks. 10 MB.`, variant: "destructive" });
        continue;
      }
      if (merged.length >= MAX_DOC_COUNT) {
        toast({ title: "Dosya limiti", description: `En fazla ${MAX_DOC_COUNT} dosya.`, variant: "destructive" });
        break;
      }
      if (!merged.some((f) => f.name === file.name && f.size === file.size)) {
        merged.push(file);
      }
    }
    setDocs(merged);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (merged.length > docs.length) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: `📎 ${merged.length - docs.length} dosya eklendi: ${merged.slice(docs.length).map((f) => f.name).join(", ")}` },
      ]);
    }
  };

  const submitToDatabase = async () => {
    setLoading(true);
    try {
      // Upload docs
      const uploadedDocs: { url: string; name: string }[] = [];
      for (const file of docs) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("submission-documents")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("submission-documents").getPublicUrl(path);
        uploadedDocs.push({ url: pub.publicUrl, name: file.name });
      }

      const insertData = {
        form_type: "register",
        category: collected.category ?? null,
        fullname: collected.fullname ?? "",
        country: collected.country ?? "",
        city: collected.city ?? "",
        business: collected.business ?? null,
        field: collected.field ?? "",
        email: collected.email ?? "",
        phone: (collected.phone ?? "").replace(/[\s\-().]/g, ""),
        offers_needs: collected.offers_needs ?? null,
        contest_interest: collected.contest_interest ?? false,
        document_url: uploadedDocs[0]?.url ?? null,
        document_name: uploadedDocs[0]?.name ?? null,
        documents: uploadedDocs,
        referral_code: collected.referral_code?.toUpperCase() ?? null,
        referral_source: "ai-chat",
        consent: true,
      };

      const { data: inserted, error } = await supabase
        .from("submissions")
        .insert(insertData)
        .select("id")
        .single();
      if (error) throw error;

      setSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "🎉 **Harika! Kaydın başarıyla alındı.**\n\nPlatform açıldığında ilk haberi sen alacaksın. Hoş geldin aramıza — CorteQS ailesi seninle daha güçlü! 💫",
        },
      ]);
      toast({ title: "Kaydınız Alındı! ✅", description: "Teşekkürler! Yakında iletişime geçeceğiz." });

      // Run final matching with persistence (so admin can review + email later)
      if (collected.offers_needs && inserted?.id) {
        const finalMatches = await findMatches({
          sourceSubmissionId: inserted.id,
          offers_needs: collected.offers_needs,
          field: collected.field,
          city: collected.city,
          country: collected.country,
          category: collected.category,
          persist: true,
        });
        if (finalMatches.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `🔗 **${finalMatches.length} eşleşme** ağımıza kaydedildi. İlgilenen kişilere yönlendirme yapılacak — gelişmeleri e-posta ile bildireceğiz.`,
              matches: finalMatches,
            },
          ]);
        }
      }
    } catch (err: any) {
      console.error("Chat submit error:", err);
      toast({
        title: "Bir hata oluştu",
        description: err?.message || "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading || submitted) return;

    const userMsg: ChatMsg = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const ai = await callAI(newHistory, collected);
      const nextCollected = { ...collected, ...(ai.extracted ?? {}) };
      setCollected(nextCollected);

      setMessages((prev) => [...prev, { role: "assistant", content: ai.message }]);

      // Preview matches when AI signals readiness (no DB write yet)
      if (ai.status === "ready_to_submit" && nextCollected.offers_needs) {
        const preview = await findMatches({
          offers_needs: nextCollected.offers_needs,
          field: nextCollected.field,
          city: nextCollected.city,
          country: nextCollected.country,
          category: nextCollected.category,
          persist: false,
        });
        if (preview.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `🎯 **${preview.length} potansiyel eşleşme** buldum! Kaydını tamamladığında bu kişilere ulaştırılacaksın:`,
              matches: preview,
            },
          ]);
        }
      }

      if (ai.status === "submit") {
        if (!consent) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Son bir adım: aşağıdaki **onay kutusunu** işaretle ve **Gönder** butonuna bas — kaydını tamamlayalım. 📝",
            },
          ]);
        } else {
          await submitToDatabase();
        }
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "AI asistanına ulaşılamadı",
        description: err?.message || "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Üzgünüm, şu anda bir sorun yaşadım 😔 Bir kez daha dener misin?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSubmit =
    REQUIRED_FIELDS.every((k) => !!collected[k]) && consent && !submitted && !loading;

  return (
    <section
      id="kaydol"
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--accent) / 0.06) 50%, hsl(var(--background)) 100%)",
      }}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: "hsl(var(--accent))" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: "hsl(var(--primary))" }}
        aria-hidden
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Akıllı Kayıt Deneyimi
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Formu Unut. <span className="text-accent">Sohbet Et.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            AI asistanımız seninle konuşarak seni 60 saniyede kaydeder. Sorulara sırayla cevap ver — gerisi otomatik ve hemen diasporanla bağlantıya geç, iş yap, tanış, aradığını bul.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Sohbet etmek istemiyor musun?</span>
            <button
              type="button"
              onClick={() => setClassicFormOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary/30 bg-card text-foreground font-semibold text-sm hover:border-primary hover:bg-primary/5 transition-all"
            >
              <FileText className="w-4 h-4 text-primary" />
              Ben Form Dolduracağım
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
          {/* Header + progress */}
          <div className="px-6 py-4 border-b border-border bg-background/50 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card" style={{ background: "hsl(var(--primary))" }} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">CorteQS AI Asistanı</p>
                  <p className="text-xs text-muted-foreground">Online · Türkçe konuşur 💬</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">İlerleme</p>
                <p className="text-sm font-bold text-primary">%{progress}</p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Chat area */}
          <div
            ref={scrollRef}
            className="h-[420px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background/30 to-transparent"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className={`flex flex-col gap-2 max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: m.content
                        .replace(/</g, "&lt;")
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                    }}
                  />
                  {m.matches && m.matches.length > 0 && (
                    <div className="w-full grid gap-2">
                      {m.matches.map((mt) => (
                        <div
                          key={mt.id}
                          className="rounded-xl border border-primary/20 bg-card/80 backdrop-blur p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center shrink-0">
                                <Users className="w-3.5 h-3.5 text-primary-foreground" />
                              </div>
                              <p className="font-semibold text-sm text-foreground truncate">{mt.fullname}</p>
                            </div>
                            <span className="shrink-0 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              %{Math.round(mt.score)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1.5">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{mt.city}, {mt.country} · {mt.field}</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-snug">{mt.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 shadow">
                    <UserIcon className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Attached docs */}
          {docs.length > 0 && (
            <div className="px-6 py-3 border-t border-border bg-background/40 flex flex-wrap gap-2">
              {docs.map((f, i) => (
                <span
                  key={`${f.name}-${i}`}
                  className="inline-flex items-center gap-2 text-xs bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-full border border-primary/20"
                >
                  <Paperclip className="w-3 h-3" />
                  {f.name} ({(f.size / 1024 / 1024).toFixed(1)} MB)
                  <button
                    type="button"
                    onClick={() => setDocs(docs.filter((_, idx) => idx !== i))}
                    className="hover:text-destructive"
                    aria-label="Kaldır"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-border p-4 bg-card">
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitted || docs.length >= MAX_DOC_COUNT}
                className="shrink-0 w-10 h-10 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground flex items-center justify-center transition-colors disabled:opacity-50"
                title="CV / Doküman ekle"
                aria-label="Dosya ekle"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={submitted ? "Kayıt tamamlandı ✅" : "Mesajını yaz veya soruya cevap ver..."}
                rows={1}
                disabled={submitted || loading}
                className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-h-32"
                style={{ minHeight: "40px" }}
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading || submitted}
                className="shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                aria-label="Gönder"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>

            {/* Consent + final submit */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={submitted}
                  className="mt-0.5 rounded border-input"
                />
                <span className="leading-relaxed">
                  Kişisel bilgilerimin CorteQS ile paylaşılmasını onaylıyorum. Üçüncü şahıslarla paylaşılmayacaktır.
                </span>
              </label>
              {canSubmit && (
                <button
                  type="button"
                  onClick={submitToDatabase}
                  disabled={loading}
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-xl transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Kaydı Tamamla
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 max-w-xl mx-auto">
          🔒 Bilgilerin güvende. AI asistan sadece kaydını hızlandırmak için soruları yönetir — veriler Lovable Cloud altyapısında saklanır.
        </p>
      </div>

      <RegisterInterestForm
        open={classicFormOpen}
        onOpenChange={(o) => {
          setClassicFormOpen(o);
          if (!o) setPresetCity(undefined);
        }}
        defaultCity={presetCity}
      />
    </section>
  );
};

export default ChatRegisterBar;
