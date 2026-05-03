import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

import type {
  LansmanAdminRequest,
  LansmanRegistration,
} from "../../../src/types/lansman.ts";

const ALLOWED_ORIGINS = [
  "https://corteqs.net",
  "https://www.corteqs.net",
  "http://localhost:5173",
  "http://localhost:4173",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function jsonResponse(
  body: unknown,
  init: ResponseInit,
  corsHeaders: Record<string, string>,
) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      ...(init.headers ?? {}),
    },
  });
}

function validateConfiguredSecrets() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return {
    supabaseUrl,
    serviceRoleKey,
  };
}

function getBearerToken(req: Request) {
  const authorization = req.headers.get("Authorization") ?? req.headers.get("authorization") ?? "";
  if (!authorization.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 }, corsHeaders);
  }

  try {
    const { supabaseUrl, serviceRoleKey } = validateConfiguredSecrets();
    const payload = (await req.json()) as LansmanAdminRequest;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const accessToken = getBearerToken(req);

    if (!accessToken) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 }, corsHeaders);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return jsonResponse({ error: "Unauthorized" }, { status: 401 }, corsHeaders);
    }

    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError) throw adminError;

    if (!adminUser) {
      return jsonResponse({ error: "Forbidden" }, { status: 403 }, corsHeaders);
    }

    if (payload.action === "list") {
      const { data, error } = await supabase
        .from("lansman_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return jsonResponse(
        { registrations: (data ?? []) as LansmanRegistration[] },
        { status: 200 },
        corsHeaders,
      );
    }

    if (payload.action === "update-status") {
      if (payload.status !== "approved" && payload.status !== "rejected") {
        return jsonResponse({ error: "Invalid status" }, { status: 400 }, corsHeaders);
      }

      const { data, error } = await supabase
        .from("lansman_registrations")
        .update({ status: payload.status })
        .eq("id", payload.id)
        .select("*")
        .single();

      if (error) throw error;

      return jsonResponse(
        { registration: data as LansmanRegistration },
        { status: 200 },
        corsHeaders,
      );
    }

    return jsonResponse({ error: "Invalid action" }, { status: 400 }, corsHeaders);
  } catch (error) {
    console.error("lansman-admin error:", error);
    return jsonResponse(
      { error: "Internal server error" },
      { status: 500 },
      corsHeaders,
    );
  }
});
