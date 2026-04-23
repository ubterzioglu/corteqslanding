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
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type SubmissionPayload = {
  form_type: string;
  category: string | null;
  fullname: string;
  country: string;
  city: string;
  business: string | null;
  field: string;
  email: string;
  phone: string;
  referral_code: string | null;
  referral_detail: string | null;
  referral_source: string | null;
  description: string | null;
  contest_interest: boolean | null;
  linkedin: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  twitter: string | null;
  website: string | null;
  created_at: string;
};

function buildAdminHtml(submission: SubmissionPayload) {
  const rows = [
    ["Tur", submission.form_type],
    ["Kategori", submission.category ?? "-"],
    ["Ad Soyad", submission.fullname],
    ["Ulke", submission.country],
    ["Sehir", submission.city],
    ["Isletme", submission.business ?? "-"],
    ["Alan", submission.field],
    ["E-posta", submission.email],
    ["Telefon", submission.phone],
    ["Referral kaynagi", submission.referral_source ?? "-"],
    ["Referral detayi", submission.referral_detail ?? "-"],
    ["Referral kodu", submission.referral_code ?? "-"],
    ["Aciklama", submission.description ?? "-"],
    ["Yarisma ilgisi", submission.contest_interest ? "Evet" : "Hayir"],
    ["LinkedIn", submission.linkedin ?? "-"],
    ["Instagram", submission.instagram ?? "-"],
    ["TikTok", submission.tiktok ?? "-"],
    ["Facebook", submission.facebook ?? "-"],
    ["Twitter", submission.twitter ?? "-"],
    ["Website", submission.website ?? "-"],
    ["Tarih", new Date(submission.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Berlin" })],
  ];

  return `
    <h2>Yeni CorteQS basvurusu</h2>
    <p>Asagidaki form kaydi alindi.</p>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse; border-color: #d4d4d8;">
      ${rows
        .map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`)
        .join("")}
    </table>
  `;
}

function buildConfirmationHtml(submission: SubmissionPayload) {
  return `
    <h2>Kaydiniz alindi</h2>
    <p>Merhaba ${escapeHtml(submission.fullname)},</p>
    <p>CorteQS uzerinden ilettiginiz basvuru bize ulasti. Gerekli durumlarda sizinle e-posta veya telefon yoluyla iletisime gececegiz.</p>
    <p>Basvuru tipi: <strong>${escapeHtml(submission.form_type)}</strong></p>
    <p>Kayit zamani: <strong>${new Date(submission.created_at).toLocaleString("tr-TR", { timeZone: "Europe/Berlin" })}</strong></p>
  `;
}

async function sendWithResend(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${responseText}`);
  }
}

Deno.serve(async (request) => {
  const corsHeaders = getCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { submission } = await request.json();
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const mailFrom = Deno.env.get("MAIL_FROM");
    const mailToAdmin = Deno.env.get("MAIL_TO_ADMIN");
    const mailReplyTo = Deno.env.get("MAIL_REPLY_TO");
    const sendConfirmation = Deno.env.get("MAIL_SEND_CONFIRMATION") === "true";

    if (!submission || !submission.email || !isValidEmail(submission.email)) {
      return new Response(JSON.stringify({ error: "Invalid submission payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    if (!resendApiKey || !mailFrom || !mailToAdmin) {
      console.warn("Mail function skipped because env vars are missing.");
      return new Response(JSON.stringify({ skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
      });
    }

    await sendWithResend(resendApiKey, {
      from: mailFrom,
      to: [mailToAdmin],
      reply_to: mailReplyTo || submission.email,
      subject: `Yeni CorteQS basvurusu: ${submission.fullname}`,
      html: buildAdminHtml(submission),
    });

    if (sendConfirmation) {
      await sendWithResend(resendApiKey, {
        from: mailFrom,
        to: [submission.email],
        reply_to: mailReplyTo || mailToAdmin,
        subject: "CorteQS basvurunuz alindi",
        html: buildConfirmationHtml(submission),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
    });
  }
});

