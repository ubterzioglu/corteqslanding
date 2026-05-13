# Corteqs MVP Technical Overview for AI Agents

## 1. What This Project Is

This repository is the frontend for `corteqs.net`, a diaspora-oriented platform built with React, Vite, TypeScript, Tailwind, shadcn/ui, and Supabase.

The app combines:

- Public marketplace/listing pages for consultants, businesses, associations, events, bloggers, and ambassadors
- Conversion-oriented landing pages and campaigns
- Authentication and onboarding
- User profile and admin-like operational surfaces
- Supabase-backed forms, requests, notifications, and lightweight workflow features
- A few Supabase Edge Functions for search and chat-related capabilities

This is primarily a static SPA frontend deployed behind Nginx, with Supabase used for auth, data, storage, and edge functions.

## 2. Runtime and Build Basics

- Package manager in use: `npm` is the safe default in this repo
- Dev server: `npm run dev`
- Production build: `npm run build`
- Test runner: `npm run test`
- Frontend framework: React 18 + React Router 6
- Build tool: Vite 5
- Styling: Tailwind CSS + shadcn/ui + local design tokens
- Backend integration: Supabase JS client

Important root files:

- `package.json`: scripts and dependencies
- `vite.config.ts`: alias `@ -> ./src`, dev server on port `8080`
- `vitest.config.ts`: jsdom test environment
- `tailwind.config.ts`: theme tokens and design system setup
- `DEPLOY_COOLIFY.md`: deployment notes for static hosting on Coolify/Nginx
- `supabase/config.toml`: Supabase project ref

## 3. High-Level App Architecture

### App bootstrap

Entry path:

1. `src/main.tsx`
2. `src/App.tsx`
3. Route-level lazy pages under `src/pages`

`src/main.tsx`:

- mounts the React app
- renders a temporary bootstrap shell
- installs white-screen recovery listeners
- falls back to a manual reload screen if bootstrap fails

`src/App.tsx`:

- wraps the app with global providers
- configures lazy routes
- shows a route loading fallback
- installs the cookie consent banner

Global providers:

- `QueryClientProvider` for TanStack Query
- `AuthProvider` for Supabase session/profile state
- `DiasporaProvider` for active diaspora/language selection
- UI providers for toasts and tooltips

### Routing model

Routing is centralized in `src/App.tsx`. Key groups:

- Public content: `/`, `/consultants`, `/associations`, `/businesses`, `/events`, `/bloggers`
- Detail views: `/consultant/:id`, `/association/:id`, `/business/:id`, `/event/:id`, `/blogger/:id`, `/ambassador/:id`
- Auth/account: `/auth`, `/onboarding`, `/reset-password`, `/profile`
- Campaign pages: `/founders-1000`, `/blog-contest`, `/vlogger-contest`, `/city-ambassadors`, `/city-news`, `/register-diaspora`
- Utility/feature pages: `/map`, `/relocation`, `/hospital-appointment/:hospitalId?`, `/ai-twin`
- Internal/admin-like pages: `/admin`, `/internal-cq-dashboards-7f3a9b2e1d4c`
- Legal: `/legal/privacy`, `/legal/terms`, `/legal/kvkk`, `/legal/cookies`

## 4. Directory Map

### `src/pages`

Route-level pages. Start here when behavior is clearly page-specific.

Useful examples:

- `Index.tsx`: home page composition and diaspora split
- `Auth.tsx`: email auth, Google OAuth, password reset
- `Onboarding.tsx`: profile/account completion flow
- `RelocationEngine.tsx`: AI-assisted relocation workflow UI
- `Founders1000.tsx`, `BlogContest.tsx`, `VloggerContest.tsx`: campaign pages
- `AdminDashboard.tsx`, `Dashboards.tsx`: internal/admin operational views

### `src/components`

Reusable UI and feature sections. Notable areas:

- `ui/`: shadcn-based primitives
- `profiles/`: profile subviews by account type
- `admin/`: admin/ops panels
- `HeroSection.tsx`, `InternationalDiasporaHero.tsx`: top-of-funnel hero experiences
- `Navbar.tsx`, `Footer.tsx`: shell/navigation
- `InterestForm.tsx`, `CreateEventForm.tsx`, `ServiceRequestForm.tsx`: Supabase-backed write flows

### `src/contexts`

- `AuthContext.tsx`: session, user, profile, sign-out, profile refresh
- `DiasporaContext.tsx`: active diaspora selection and translated copy for hero/nav

### `src/lib`

Small shared logic modules:

- `recoveryReload.ts`: white-screen and chunk-load recovery
- `runtimeEnv.ts`: site URL, redirect URL, environment helpers
- `whatsappLandings.ts`: data access helpers for WhatsApp landing records
- `mapEntities.ts`: mapping helpers for map/search related entities
- `demoFlags.ts`: demo-mode related toggles

### `src/integrations/supabase`

- `client.ts`: Supabase client setup
- `types.ts`: generated database types, do not hand-edit

### `supabase`

- `migrations/`: SQL migrations
- `functions/`: Edge Functions
- `.temp/project-ref`: current Supabase project ref metadata

## 5. State and Data Flow

### Authentication

Auth is managed via Supabase Auth in `src/contexts/AuthContext.tsx`.

Behavior:

- subscribes to `supabase.auth.onAuthStateChange`
- stores `user`, `session`, `loading`
- fetches `profiles` row after login/session restore
- exposes `accountType` and `onboardingCompleted`

Important implication:

- If a page depends on user role/profile state, it usually reads from `useAuth()`, not directly from the Supabase session.

### Diaspora/language mode

`src/contexts/DiasporaContext.tsx` controls:

- selected diaspora key: `tr | in | cn | ph`
- translated labels for nav and hero copy
- current diaspora option metadata
- selected country filter state

Important implication:

- Home page content branches on diaspora mode. Turkish (`tr`) and international flows are intentionally different.

### Query/data access style

This app mixes:

- direct `supabase.from(...).select/insert/update/delete` calls inside pages/components
- helper modules for a few domains such as WhatsApp landings
- TanStack Query provider is installed, but much of the current code still uses direct async effects rather than centralized query hooks

Important implication:

- Before introducing new data access patterns, inspect the local area. The codebase is not fully standardized around one pattern yet.

## 6. Main Product Domains

The project is multi-surface. The fastest way for an AI agent to orient is by domain:

### Top-of-funnel / public discovery

- Home page hero and section composition
- Consultant, association, business, event, blogger listings
- Detail pages for each entity
- Map search and city news surfaces

These areas are mostly content- and conversion-driven UI with some Supabase-backed forms.

### Identity and onboarding

- Email/password auth
- Google OAuth
- Password reset
- Onboarding flow tied to `profiles` and `user_roles`

These areas are sensitive because they depend on both frontend routing and Supabase dashboard configuration.

### Service and request workflows

- Service requests and proposals
- Notifications
- Consultant categories
- City ambassador applications
- Welcome pack orders

These areas contain the most operational workflow logic and direct table access.

### Campaign and growth pages

- Founders 1000
- Blogger/Vlogger contest pages
- Register Diaspora
- WhatsApp group landing flows

These are high-change marketing surfaces. Expect frequent UI edits.

### AI-assisted features

- `RelocationEngine.tsx`
- `AITwin.tsx`
- Supabase Edge Functions such as `relocation-chat`

These features rely on frontend orchestration plus server-side function calls.

## 7. Supabase Surfaces Used by the Frontend

The following tables/buckets are actively referenced in the codebase and matter for understanding behavior:

### Frequently used tables

- `profiles`
- `user_roles`
- `events`
- `consultant_categories`
- `service_requests`
- `service_proposals`
- `notifications`
- `interest_registrations`
- `welcome_pack_orders`
- `city_ambassador_applications`
- `whatsapp_landings`
- `whatsapp_join_requests`

### Storage buckets referenced

- `interest-uploads`
- `service-attachments`

### Supabase Edge Functions present

- `diaspora-search`
- `relocation-chat`
- `whatsapp-bot-lookup`

Important implication:

- If a feature appears “static” in the UI, still search for Supabase writes before changing it. Several flows that look like simple forms create records or upload files.

## 8. Environment Variables and Deployment

Current frontend expects Vite-time environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SITE_URL` is optional but strongly recommended for deterministic auth redirects

Other non-Vite values may exist in `.env`, but only `VITE_...` values are injected into the frontend at build time.

Deployment model:

- static Vite build
- served by Nginx
- SPA fallback configured for client-side routing

Important implication:

- Changing `VITE_...` values requires a rebuild/redeploy
- Auth redirect behavior depends on both frontend env values and Supabase/Google dashboard settings

## 9. Reliability and Recovery Behavior

White-screen recovery logic lives in `src/lib/recoveryReload.ts`.

Current behavior:

- recovery only reacts to real chunk/dynamic import failures
- auto-recovery is disabled on `pre.corteqs.net`
- bootstrap and slow route loading no longer trigger forced auto-reload
- manual reload fallback remains available

Why this matters:

- If you touch lazy loading, route splitting, or boot flow, re-check `_recover` behavior
- Avoid reintroducing time-based reload loops

## 10. Auth and OAuth Notes

`src/pages/Auth.tsx` is the main entry for:

- sign up
- sign in
- Google OAuth
- password reset

Important implementation detail:

- Redirect URLs should be derived from `src/lib/runtimeEnv.ts`, not hardcoded from `window.location.origin`

Operational dependency:

- Even correct frontend code will fail if Supabase Auth and Google OAuth dashboard settings are misaligned
- For Google auth, the Supabase callback URL must match the configured Google OAuth redirect URI

## 11. Styling and UI Conventions

The app uses:

- Tailwind utility classes heavily
- shadcn/ui primitives under `src/components/ui`
- local design tokens and gradients from Tailwind config
- Lucide icons

Patterns to preserve:

- Existing conversion pages often use strong gradients, rounded cards, and layered blur/shadow composition
- New UI work should match the current visual language of the specific page, not generic default shadcn styling
- Reuse `Button`, existing cards, and local helper styles before inventing new primitives

## 12. Testing Reality

There is basic Vitest setup, but the repository is currently light on automated tests.

Relevant files:

- `src/test/setup.ts`
- `src/test/example.test.ts`
- `vitest.config.ts`

Practical guidance:

- For UI-heavy changes, `npm run build` is currently the minimum safety check
- For logic-heavy changes, prefer adding targeted tests if you touch helpers or stateful flows
- For auth, routing, or Supabase mutations, manual verification is still important

## 13. Recommended AI-Agent Workflow in This Repo

When taking a task, use this sequence:

1. Identify whether it is page-level, component-level, or Supabase-integrated.
2. Read the route entry page first.
3. Trace child components and any `supabase.from(...)` or helper modules.
4. Check `AuthContext` or `DiasporaContext` if the behavior is user- or locale-dependent.
5. For auth or redirect work, also inspect `runtimeEnv.ts` and deployment assumptions.
6. Run `npm run build` after meaningful UI or routing changes.

## 14. Known Constraints and Footguns

- `src/integrations/supabase/types.ts` is generated; do not manually maintain it unless intentionally regenerating types.
- The app is not yet consistently organized around repository-level data services; some data access is embedded in components.
- Marketing pages and hero sections change frequently, so expect visual churn in those files.
- Some pages are very large, especially campaign/admin/AI pages; avoid broad refactors unless necessary.
- Route lazy loading and recovery behavior are coupled enough that changing one can affect the other.
- Build output currently emits large chunk warnings; this is known and not necessarily caused by your change.

## 15. Best Entry Points by Task Type

If the task is about:

- Home page or hero: `src/pages/Index.tsx`, `src/components/HeroSection.tsx`
- Login or onboarding: `src/pages/Auth.tsx`, `src/pages/Onboarding.tsx`, `src/contexts/AuthContext.tsx`
- International diaspora experience: `src/components/InternationalDiasporaHero.tsx`, `src/pages/RegisterDiaspora.tsx`
- WhatsApp landing system: `src/pages/WhatsAppGroups.tsx`, `src/pages/WhatsAppGroupLanding.tsx`, `src/lib/whatsappLandings.ts`
- AI relocation/chat: `src/pages/RelocationEngine.tsx`, `supabase/functions/relocation-chat/index.ts`
- Admin workflows: `src/pages/AdminDashboard.tsx`, `src/components/admin/*`
- Events: `src/pages/Events.tsx`, `src/components/CreateEventForm.tsx`
- Recovery or hard-to-reproduce loading issues: `src/main.tsx`, `src/App.tsx`, `src/lib/recoveryReload.ts`

## 16. Suggested Future Documentation

If this repo keeps growing, the most valuable next docs would be:

- a route-to-feature ownership map
- a table-by-table Supabase schema summary
- an auth/OAuth setup runbook
- a campaign page content ownership guide
- an admin operations guide for non-engineers

