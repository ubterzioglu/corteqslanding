# CorteQS Database Info

## Active Supabase Project

- Project ref: `nhvbikijjkymkcldgznv`
- URL: `https://nhvbikijjkymkcldgznv.supabase.co`
- Client env source: `.env`
- Local Supabase config source: `supabase/config.toml`

## Tables

### `public.submissions`

Stores registrations from the landing page and support form.

| Column | Type | Required | Default |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | `gen_random_uuid()` |
| `form_type` | `text` | yes | `register` |
| `category` | `text` | no | - |
| `fullname` | `text` | yes | - |
| `country` | `text` | yes | - |
| `city` | `text` | yes | - |
| `business` | `text` | no | - |
| `field` | `text` | yes | - |
| `email` | `text` | yes | - |
| `phone` | `text` | yes | - |
| `description` | `text` | no | - |
| `contest_interest` | `boolean` | no | `false` |
| `linkedin` | `text` | no | - |
| `instagram` | `text` | no | - |
| `tiktok` | `text` | no | - |
| `facebook` | `text` | no | - |
| `twitter` | `text` | no | - |
| `website` | `text` | no | - |
| `consent` | `boolean` | yes | `false` |
| `status` | `text` | yes | `new` |
| `notes` | `text` | no | - |
| `reviewed_at` | `timestamptz` | no | - |
| `reviewed_by` | `uuid` | no | - |
| `created_at` | `timestamptz` | yes | `now()` |

Allowed `status` values:

- `new`
- `contacted`
- `archived`

### `public.admin_users`

Allowlist table for admin access.

| Column | Type | Required | Default |
| --- | --- | --- | --- |
| `user_id` | `uuid` | yes | - |
| `created_at` | `timestamptz` | yes | `now()` |

## RLS Summary

- `submissions`
  - `INSERT`: `anon`, `authenticated`
  - `SELECT`: only authenticated users present in `admin_users`
  - `UPDATE`: only authenticated users present in `admin_users`
- `admin_users`
  - `SELECT`: authenticated users can only read their own membership row

## Admin Setup

1. Create the admin user in Supabase Auth.
2. Insert the user's auth UUID into `public.admin_users`.
3. Sign in at `/admin`.

Example SQL:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_ID');
```

## Mail Function Setup

Edge Function: `send-submission-email`

Required function secrets:

- `RESEND_API_KEY`
- `MAIL_FROM`
- `MAIL_TO_ADMIN`

Optional:

- `MAIL_REPLY_TO`
- `MAIL_SEND_CONFIRMATION=true`
