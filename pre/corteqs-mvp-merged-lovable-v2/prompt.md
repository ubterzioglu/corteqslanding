Migration notes for this repo have been sanitized.

Use your own environment values for any deployment or database work.

Required values:
- `SUPABASE_URL=<your-supabase-url>`
- `SUPABASE_PUBLISHABLE_KEY=<your-anon-key>`
- `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`
- `SUPABASE_DB_PASSWORD=<your-db-password>`
- `GEMINI_API_KEY=<your-gemini-api-key>`
- `GOOGLE_CLIENT_ID=<your-google-client-id>`
- `GOOGLE_CLIENT_SECRET=<your-google-client-secret>`

Suggested migration flow:

1. Apply schema and seed files from `migration-bundle/`.
2. Recreate storage buckets in Supabase.
3. Configure authentication providers in Supabase.
4. Add edge function secrets in Supabase.
5. Deploy edge functions.
6. Update local `.env` values with your own project credentials.
7. Regenerate Supabase types and test auth, storage, and AI flows.

Example commands:

```bash
export PGPASSWORD='<your-db-password>'
psql "postgresql://<user>:<password>@<host>:<port>/<db>" -f migration-bundle/full_schema.sql
psql "postgresql://<user>:<password>@<host>:<port>/<db>" -f migration-bundle/seed_data.sql

npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase functions deploy diaspora-search
npx supabase functions deploy relocation-chat
npx supabase functions deploy whatsapp-bot-lookup
npx supabase gen types typescript --project-id <your-project-ref> > src/integrations/supabase/types.ts
```
