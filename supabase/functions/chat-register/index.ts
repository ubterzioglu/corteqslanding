const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Sen CorteQS Diaspora Connect platformunun akıllı, çevik ve girişken kayıt asistanısın.
Görevin: Kullanıcıyla TÜRKÇE, sıcak ve samimi bir sohbet kurarak hem kayıt bilgilerini toplamak hem de **arz & taleplerini** olabildiğince zengin biçimde yakalamak.

PLATFORM FELSEFESİ (çok önemli):
CorteQS bir **diaspora network ve eşleştirme** platformudur. Her türlü arz/talep (ürün satışı, hizmet, iş ilanı, ortaklık, danışmanlık ihtiyacı, sponsor arayışı, bağış vs.) kıymetli bir matching sinyalidir ve mutlaka detaylıca kaydedilir.

Toplanması gereken alanlar:
1. category — danisman | isletme | dernek | vakif | radyo-tv | blogger-vlogger | sehir-elcisi | bireysel
2. fullname
3. country
4. city
5. field
6. email
7. phone
8. offers_needs
9. referral_code

Kurallar:
- Her zaman Türkçe konuş.
- Kısa, doğal mesajlar ver.
- Kullanıcının cevabından mümkün olduğu kadar çok alan çıkar.
- Telefon ülke kodu yoksa düzeltme iste.
- E-posta geçersizse düzeltme iste.
- Tüm zorunlu alanlar tamamlandıysa status="ready_to_submit" dön.
- Kullanıcı onay verirse status="submit" dön.

Her zaman "chat_response" tool'unu çağır.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, collected } = await req.json();
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const collectedSummary = collected
      ? `\n\nŞu ana kadar toplanan bilgiler: ${JSON.stringify(collected)}`
      : "";

    const tools = [
      {
        type: "function",
        function: {
          name: "chat_response",
          description: "Kullanıcıya verilecek sohbet cevabı ve çıkarılan alanlar.",
          parameters: {
            type: "object",
            properties: {
              message: { type: "string" },
              extracted: {
                type: "object",
                properties: {
                  category: {
                    type: "string",
                    enum: [
                      "danisman",
                      "isletme",
                      "dernek",
                      "vakif",
                      "radyo-tv",
                      "blogger-vlogger",
                      "sehir-elcisi",
                      "bireysel",
                    ],
                  },
                  fullname: { type: "string" },
                  country: { type: "string" },
                  city: { type: "string" },
                  business: { type: "string" },
                  field: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  offers_needs: { type: "string" },
                  referral_code: { type: "string" },
                  contest_interest: { type: "boolean" },
                },
                additionalProperties: false,
              },
              request_upload: { type: "boolean" },
              status: {
                type: "string",
                enum: ["in_progress", "ready_to_submit", "submit"],
              },
            },
            required: ["message", "status"],
            additionalProperties: false,
          },
        },
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT + collectedSummary }, ...messages],
        tools,
        tool_choice: { type: "function", function: { name: "chat_response" } },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI hatası" }), {
        status: response.status >= 400 && response.status < 600 ? response.status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(
        JSON.stringify({
          message: "Bir şeyler ters gitti, tekrar dener misiniz?",
          status: "in_progress",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const args = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("chat-register error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Bilinmeyen hata" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
