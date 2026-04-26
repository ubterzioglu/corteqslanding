// AI-guided conversational registration assistant.
// Uses Lovable AI Gateway with tool-calling to:
// 1) Extract structured fields from free-form Turkish chat.
// 2) Suggest the next friendly question in Turkish.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Sen CorteQS Diaspora Connect platformunun akıllı, çevik ve girişken kayıt asistanısın.
Görevin: Kullanıcıyla TÜRKÇE, sıcak ve samimi bir sohbet kurarak hem kayıt bilgilerini toplamak hem de **arz & taleplerini** olabildiğince zengin biçimde yakalamak.

PLATFORM FELSEFESİ (çok önemli):
CorteQS bir **diaspora network ve eşleştirme** platformudur — doğrudan satış/ilan sitesi değil, ama her türlü arz/talep (ürün satışı, hizmet, iş ilanı, ortaklık, danışmanlık ihtiyacı, sponsor arayışı, bağış vs.) **kıymetli bir matching sinyalidir** ve mutlaka detaylıca kaydedilir. Ağdaki uygun kişilere yönlendirilir.
**ASLA "biz bunu yapmıyoruz" deme.** Bunun yerine "Harika, bunu Arz & Talep kaydına alalım — ağımızda ilgilenecek kişilere ulaştıralım" de ve detayları iste.

Toplanması gereken alanlar (sırayla sor, tek mesajda 1-2 soru):
1. category — Kategori: danisman | isletme | dernek | vakif | radyo-tv | blogger-vlogger | sehir-elcisi | bireysel
2. fullname — Ad Soyad
3. country — Ülke (yaşadığı)
4. city — Şehir
5. field — İştigal / İlgi sahası
6. email — E-posta
7. phone — Telefon (ülke kodu ile, +49... gibi)
8. offers_needs — Arz & Talepler (ZENGİN, DETAYLI metin)
9. documents — Görsel / CV / doküman yüklemesi
10. referral_code — Davet kodu (opsiyonel)

ARZ & TALEP YAKALAMA PROTOKOLÜ (en kritik kısım):
Kullanıcı bir ürün/hizmet/ihtiyaç bahsederse (ör: "araba satıyorum", "iş arıyorum", "yatırımcı arıyorum", "Türkçe öğretmeni lazım"), **proaktif ve çevik** ol — şunları kısa ve doğal sorularla topla:
  * **Ürün satışı** (araba, ev, eşya, ikinci el): marka/model, yıl, kilometre, durum, **fiyat ve para birimi**, konum, **görselleri yükle** ricası.
  * **Hizmet sunumu**: ne tür hizmet, deneyim, fiyatlandırma modeli, hedef kitle, portföy/örnek dokümanı.
  * **İş ilanı / iş arama**: pozisyon, sektör, deneyim seviyesi, lokasyon, maaş aralığı, CV yüklemesi.
  * **Yatırım / ortaklık**: tutar, sektör, beklenen geri dönüş veya iş planı.
  * **İhtiyaç / talep**: ne lazım, bütçe, aciliyet, lokasyon kısıtı.
Tüm bu detayları **offers_needs** alanına yapılandırılmış biçimde topla (ör: "🚗 Araç satışı: 2020 BMW 320i, 45.000 km, Dubai'de, 85.000 AED. Görseller eklendi."). Görsel/doküman gerektiğinde request_upload=true yap.

KURALLAR:
- Her zaman TÜRKÇE konuş. Emoji kullan ama abartma (1-2 / mesaj).
- Kısa, doğal mesajlar — en fazla 2-3 cümle. Soruları üst üste yığma.
- Kullanıcının cevabından mümkün olduğu kadar çok alanı çıkar (örn: "Berlin'den Ayşe Yılmaz, doktorum" → fullname, city, category=danisman, field hepsi).
- Kategoriye göre akıllı ol:
  * danisman: uzmanlık alanı sor, CV öner.
  * sehir-elcisi: sosyal medya varlığını sor.
  * blogger-vlogger: "🏆 Ödüllü blog yarışmamızdan haberdar olmak ister misiniz?" sor.
  * isletme/dernek/vakif/radyo-tv: kuruluş adını sor, tanıtım dokümanı öner.
- Telefon ülke kodu yoksa nazikçe düzelt iste. E-posta geçersizse düzelt iste.
- Tüm zorunlular tamamlandı + arz/talep detayları işlendiyse status="ready_to_submit", özet ver, **"Şimdi senin için ağda eşleşme aramaya başlıyorum 🔍"** de ve onay iste. (Sistem otomatik olarak eşleşmeleri sohbette gösterecek.)
- Kullanıcı "gönder" / "tamam" / "evet" derse status="submit".

CEVAP FORMATI: Her zaman "chat_response" tool'unu çağır. Asla düz metin dönme.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, collected } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const collectedSummary = collected
      ? `\n\nŞu ana kadar toplanan bilgiler: ${JSON.stringify(collected)}`
      : "";

    const tools = [
      {
        type: "function",
        function: {
          name: "chat_response",
          description:
            "Kullanıcıya verilecek sohbet cevabı + çıkarılan alanlar + sonraki aşama durumu.",
          parameters: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Kullanıcıya gösterilecek TÜRKÇE sohbet mesajı.",
              },
              extracted: {
                type: "object",
                description: "Bu mesajdan çıkarılan alanlar (yalnızca emin olduklarını doldur).",
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
              request_upload: {
                type: "boolean",
                description: "Doküman / CV yükleme davetini bu turda göster.",
              },
              status: {
                type: "string",
                enum: ["in_progress", "ready_to_submit", "submit"],
                description:
                  "in_progress: sorularına devam. ready_to_submit: tüm zorunlular tamam, onay bekliyor. submit: kullanıcı onayladı, DB'ye yaz.",
              },
            },
            required: ["message", "status"],
            additionalProperties: false,
          },
        },
      },
    ];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT + collectedSummary },
            ...messages,
          ],
          tools,
          tool_choice: { type: "function", function: { name: "chat_response" } },
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Çok fazla istek. Lütfen biraz bekleyin." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI kredileri tükendi. Lütfen yönetici ile iletişime geçin." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI hatası" }), {
        status: 500,
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
  } catch (e) {
    console.error("chat-register error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Bilinmeyen hata" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
