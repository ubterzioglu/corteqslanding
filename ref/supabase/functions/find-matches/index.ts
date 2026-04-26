// Hybrid keyword + AI matcher. Given a new submission's offers/needs,
// find up to 5 best matches from existing submissions in the database.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Candidate = {
  id: string;
  fullname: string;
  city: string;
  country: string;
  field: string;
  category: string | null;
  offers_needs: string | null;
  email: string;
  created_at: string;
};

// Tiny stopword list (TR + EN essentials)
const STOPWORDS = new Set([
  "ve","ile","bir","bu","şu","de","da","mi","mı","mu","mü","ben","sen","biz",
  "için","ama","veya","ya","ki","de","den","dan","çok","az","bir","the","a",
  "an","and","or","of","to","in","on","at","is","are","with","for","my","i",
]);

function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function keywordScore(query: string, candidate: Candidate): number {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return 0;
  const cText = [
    candidate.offers_needs,
    candidate.field,
    candidate.category,
    candidate.city,
    candidate.country,
  ]
    .filter(Boolean)
    .join(" ");
  const cTokens = new Set(tokenize(cText));
  let overlap = 0;
  for (const t of qTokens) if (cTokens.has(t)) overlap++;
  return overlap / qTokens.size; // 0..1
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { sourceSubmissionId, offers_needs, field, city, country, category, persist } =
      await req.json();

    if (!offers_needs || typeof offers_needs !== "string" || offers_needs.trim().length < 5) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Pull recent candidates (excluding the source itself)
    let q = supabase
      .from("submissions")
      .select(
        "id, fullname, city, country, field, category, offers_needs, email, created_at",
      )
      .not("offers_needs", "is", null)
      .order("created_at", { ascending: false })
      .limit(200);
    if (sourceSubmissionId) q = q.neq("id", sourceSubmissionId);

    const { data: candidates, error } = await q;
    if (error) throw error;

    const queryText = [offers_needs, field, city, country, category]
      .filter(Boolean)
      .join(" ");

    // Step 1: keyword pre-filter — keep candidates with any token overlap
    const scored = (candidates as Candidate[])
      .map((c) => ({ c, k: keywordScore(queryText, c) }))
      .filter((x) => x.k > 0)
      .sort((a, b) => b.k - a.k)
      .slice(0, 20); // top 20 by keyword goes to AI

    if (scored.length === 0) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2: AI semantic ranking — pick best 5 with reasons
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const candidatesForAI = scored.map((s, idx) => ({
      idx,
      id: s.c.id,
      profile: `${s.c.fullname} (${s.c.city}, ${s.c.country}) — ${s.c.category ?? "-"} / ${s.c.field}`,
      offers_needs: s.c.offers_needs,
      keyword_score: Math.round(s.k * 100),
    }));

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "Sen bir diaspora ağında arz/talep eşleştirme asistanısın. Kullanıcının arz/talebine en uygun 5 adayı seç. TÜRKÇE kısa gerekçe yaz.",
            },
            {
              role: "user",
              content: `Kullanıcının arz/talebi:\n${queryText}\n\nAdaylar:\n${JSON.stringify(candidatesForAI, null, 2)}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "rank_matches",
                description: "En uygun 5 eşleşmeyi döndür.",
                parameters: {
                  type: "object",
                  properties: {
                    matches: {
                      type: "array",
                      maxItems: 5,
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "Adayın id'si" },
                          score: { type: "number", description: "0-100 arası uygunluk skoru" },
                          reason: { type: "string", description: "Neden eşleştiği — 1 cümle TR" },
                        },
                        required: ["id", "score", "reason"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["matches"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "rank_matches" } },
        }),
      },
    );

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Çok fazla istek. Tekrar deneyin." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI kredisi tükendi." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI error:", aiResp.status, t);
      throw new Error("AI ranking failed");
    }

    const aiData = await aiResp.json();
    const args = JSON.parse(aiData.choices[0].message.tool_calls[0].function.arguments);

    // Enrich with candidate profile data for display
    const idToCand = new Map(scored.map((s) => [s.c.id, s.c]));
    const enriched = (args.matches as Array<{ id: string; score: number; reason: string }>)
      .map((m) => {
        const c = idToCand.get(m.id);
        if (!c) return null;
        return {
          id: c.id,
          fullname: c.fullname,
          city: c.city,
          country: c.country,
          field: c.field,
          category: c.category,
          score: m.score,
          reason: m.reason,
          // email intentionally omitted from chat preview
        };
      })
      .filter(Boolean);

    // Optionally persist matches (after submit, when sourceSubmissionId is real)
    if (persist && sourceSubmissionId) {
      const rows = enriched.map((m: any) => ({
        source_submission_id: sourceSubmissionId,
        matched_submission_id: m.id,
        match_score: m.score,
        match_reason: m.reason,
      }));
      if (rows.length > 0) {
        const { error: insErr } = await supabase.from("matches").upsert(rows, {
          onConflict: "source_submission_id,matched_submission_id",
          ignoreDuplicates: true,
        });
        if (insErr) console.error("matches insert error:", insErr);
      }
    }

    return new Response(JSON.stringify({ matches: enriched }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("find-matches error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Bilinmeyen hata" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
