## Coolify Deploy

This app is a static Vite frontend served by Nginx.

### Recommended setup

- Build pack: `Dockerfile`
- Port: `80`

### Required build args

Vite injects these values at build time, so set them in Coolify as build args:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Example values

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-ref
```

### Notes

- If you change any `VITE_...` value, redeploy so the frontend is rebuilt.
- Routing is configured for SPA fallback, so direct page refreshes work.
