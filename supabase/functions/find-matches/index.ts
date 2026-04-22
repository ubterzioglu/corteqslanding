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

type RankedMatch = {
  id: string;
  score: number;
  reason: string;
};

type EnrichedMatch = {
  id: string;
  fullname: string;
  city: string;
  country: string;
  field: string;
  category: string | null;
  score: number;
  reason: string;
};

const STOPWORDS = new Set([
  "ve", "ile", "bir", "bu", "şu", "de", "da", "mi", "mı", "mu", "mü", "ben", "sen", "biz",
  "için", "ama", "veya", "ya", "ki", "den", "dan", "çok", "az", "the", "a",
  "an", "and", "or", "of", "to", "in", "on", "at", "is", "are", "with", "for", "my", "i",
]);

function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOPWORDS.has(token));
}

function keywordScore(query: string, candidate: Candidate): number {
  const queryTokens = new Set(tokenize(query));
  if (!queryTokens.size) return 0;

  const candidateText = [
    candidate.offers_needs,
    candidate.field,
    candidate.category,
    candidate.city,
    candidate.country,
  ]
    .filter(Boolean)
    .join(" ");
  const candidateTokens = new Set(tokenize(candidateText));

  let overlap = 0;
  for (const token of queryTokens) {
    if (candidateTokens.has(token)) overlap += 1;
  }
  return overlap / queryTokens.size;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceSubmissionId, offers_needs, field, city, country, category, persist } = await req.json();

    if (!offers_needs || typeof offers_needs !== "string" || offers_needs.trim().length < 5) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!supabaseUrl || !serviceKey || !lovableApiKey) {
      throw new Error("Missing one of SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or LOVABLE_API_KEY");
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    let query = supabase
      .from("submissions")
      .select("id, fullname, city, country, field, category, offers_needs, email, created_at")
      .not("offers_needs", "is", null)
      .order("created_at", { ascending: false })
      .limit(200);

    if (sourceSubmissionId) {
      query = query.neq("id", sourceSubmissionId);
    }

    const { data: candidates, error } = await query;
    if (error) throw error;

    const queryText = [offers_needs, field, city, country, category].filter(Boolean).join(" ");
    const scored = (candidates as Candidate[])
      .map((candidate) => ({ candidate, score: keywordScore(queryText, candidate) }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 20);

    if (!scored.length) {
      return new Response(JSON.stringify({ matches: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const candidatesForAI = scored.map((entry, idx) => ({
      idx,
      id: entry.candidate.id,
      profile: `${entry.candidate.fullname} (${entry.candidate.city}, ${entry.candidate.country}) — ${entry.candidate.category ?? "-"} / ${entry.candidate.field}`,
      offers_needs: entry.candidate.offers_needs,
      keyword_score: Math.round(entry.score * 100),
    }));

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Sen bir diaspora ağında arz/talep eşleştirme asistanısın. Kullanıcının arz/talebine en uygun 5 adayı seç. Türkçe kısa gerekçe yaz.",
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
                        id: { type: "string" },
                        score: { type: "number" },
                        reason: { type: "string" },
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
    });

    if (!aiResponse.ok) {
      const text = await aiResponse.text();
      console.error("AI ranking error:", aiResponse.status, text);
      throw new Error("AI ranking failed");
    }

    const aiData = await aiResponse.json();
    const args = JSON.parse(aiData.choices[0].message.tool_calls[0].function.arguments);
    const candidateMap = new Map(scored.map((entry) => [entry.candidate.id, entry.candidate]));

    const enriched = (args.matches as RankedMatch[])
      .map((match) => {
        const candidate = candidateMap.get(match.id);
        if (!candidate) return null;
        return {
          id: candidate.id,
          fullname: candidate.fullname,
          city: candidate.city,
          country: candidate.country,
          field: candidate.field,
          category: candidate.category,
          score: match.score,
          reason: match.reason,
        };
      })
      .filter((match): match is EnrichedMatch => Boolean(match));

    if (persist && sourceSubmissionId) {
      const rows = enriched.map((match) => ({
        source_submission_id: sourceSubmissionId,
        matched_submission_id: match.id,
        match_score: match.score,
        match_reason: match.reason,
      }));

      if (rows.length) {
        const { error: insertError } = await supabase.from("matches").upsert(rows, {
          onConflict: "source_submission_id,matched_submission_id",
          ignoreDuplicates: true,
        });
        if (insertError) console.error("matches insert error:", insertError);
      }
    }

    return new Response(JSON.stringify({ matches: enriched }), {
      headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("find-matches error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Bilinmeyen hata" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } },
    );
  }
});

