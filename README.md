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
2. Provide the Supabase client env vars in `.env`.
3. Apply Supabase migrations.
4. Create at least one admin auth user and insert its UUID into `public.admin_users`.
5. Deploy the Edge Function and set its secrets.

## Required app env

```env
VITE_SUPABASE_URL=https://nhvbikijjkymkcldgznv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

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

## Notes

- Form submission must succeed even if email delivery fails.
- Non-admin authenticated users cannot read submissions.
- The admin panel supports filtering, CSV export, status updates, and internal notes.
