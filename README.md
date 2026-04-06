# CorteQS Landing

React + Vite landing page backed by Supabase for form collection, admin review, and email notifications.

## What is included

- Public landing page forms writing to `public.submissions`
- Admin panel at `/admin`
- Supabase Auth based admin access with `public.admin_users`
- Supabase Edge Function for email notifications
- Reference workflow docs under [`referans/README.md`](/c:/.temp_private/corteqslanding/referans/README.md)

## Local setup

1. Install dependencies with `npm install`.
2. Provide the Supabase client env vars in `.env.local`.
3. Apply Supabase migrations.
4. Create at least one admin auth user and insert its UUID into `public.admin_users`.
5. Deploy the Edge Function and set its secrets.

## Required app env

```env
VITE_SUPABASE_PROJECT_ID=injprdrsklkxgnaiixzh
VITE_SUPABASE_URL=https://injprdrsklkxgnaiixzh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## Server-only secret

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it to frontend code or rename it with a `VITE_` prefix.

## Required function secrets

```bash
supabase secrets set RESEND_API_KEY=...
supabase secrets set MAIL_FROM=...
supabase secrets set MAIL_TO_ADMIN=...
supabase secrets set MAIL_REPLY_TO=...
supabase secrets set MAIL_SEND_CONFIRMATION=true
```

## Deploying the mail function

```bash
supabase functions deploy send-submission-email
```

## Docker / Coolify deployment

This repo now includes a production `Dockerfile` for Coolify.

Required runtime environment variables in Coolify:

```env
VITE_SUPABASE_URL=https://injprdrsklkxgnaiixzh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=injprdrsklkxgnaiixzh
```

The container serves the built Vite app with nginx and writes `/env-config.js` on startup so frontend runtime config works without committing `.env`.

## Notes

- Form submission must succeed even if email delivery fails.
- Non-admin authenticated users cannot read submissions.
- The admin panel supports filtering, CSV export, status updates, and internal notes.
