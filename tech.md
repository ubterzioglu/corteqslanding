# Tech Stack – CorteQS Landing

Übersicht des aktuell im Repository verwendeten Technologie-Stacks (Stand: 2026-04-24).

## Projektart

- Single Page Application (SPA) mit Admin-Bereich
- Landing Page mit Formularerfassung, Admin-Panel unter `/admin`
- Deployment via Docker/Nginx (Coolify-kompatibel)

## Frontend

### Core
- **React** `18.3.1` (inkl. `react-dom` mit Hydration)
- **TypeScript** `5.8.3` (mit `allowJs`, lockerem strict-Modus: `noImplicitAny: false`, `strictNullChecks: false`)
- **Vite** `5.4.19` (Build- und Dev-Server, Port `8080`)
- **@vitejs/plugin-react-swc** `3.11.0` (SWC-basierter React-Plugin)
- **lovable-tagger** `1.1.13` (nur in Development-Mode)

### Routing & State
- **react-router-dom** `6.30.1` (BrowserRouter, verschachtelte Routen für Admin)
- **@tanstack/react-query** `5.83.0` (Server-State)
- **@tanstack/react-table** `8.21.3` (Tabellen im Admin)

### UI / Styling
- **Tailwind CSS** `3.4.17` mit `tailwindcss-animate` und `@tailwindcss/typography`
- **PostCSS** `8.5.6` + **Autoprefixer** `10.4.21`
- **shadcn/ui** (style: `default`, baseColor: `slate`, CSS-Variablen aktiviert) – siehe `components.json`
- **Radix UI** – umfangreiches Primitives-Set (Accordion, Dialog, Dropdown, Popover, Select, Tabs, Toast, Tooltip, Navigation-Menu, Sidebar etc.)
- **lucide-react** `0.462.0` (Icons)
- **class-variance-authority**, **clsx**, **tailwind-merge** (Utility-First Patterns)
- **next-themes** `0.3.0` (Theme-Switching)
- **sonner** `1.7.4` (Toasts), **vaul** `0.9.9` (Drawer), **cmdk** `1.1.1` (Command Palette)
- **Inter** Font (via `fontFamily.sans` in Tailwind)

### Formulare & Validierung
- **react-hook-form** `7.61.1`
- **@hookform/resolvers** `3.10.0`
- **zod** `3.25.76` (Schema-Validierung)
- **input-otp** `1.4.2`

### Daten- und UI-Komponenten
- **recharts** `2.15.4` (Charts)
- **embla-carousel-react** `8.6.0` (Carousel)
- **react-day-picker** `8.10.1` + **date-fns** `3.6.0`
- **react-resizable-panels** `2.1.9`

## Backend / BaaS

- **Supabase** (`@supabase/supabase-js` `2.101.1`)
  - Postgres-DB mit Migrationen unter `supabase/migrations/`
  - **Supabase Auth** für Admin-Zugang (`public.admin_users`)
  - **Edge Functions** (Deno):
    - `send-submission-email` (E-Mail-Benachrichtigungen via Resend)
    - `chat-register` (verify_jwt = true)
    - `find-matches` (verify_jwt = true)
- **Resend** (Transactional Mail via `RESEND_API_KEY`)

## Testing

- **Vitest** `3.2.4` (Unit/Integration, `jsdom` Environment, Setup unter `src/test/setup.ts`)
- **@testing-library/react** `16.0.0` + **@testing-library/jest-dom** `6.6.0`
- **jsdom** `20.0.3`
- **Playwright** `1.57.0` via `lovable-agent-playwright-config` (E2E)

## Linting & Code-Qualität

- **ESLint** `9.32.0` (Flat Config) mit:
  - `typescript-eslint` `8.38.0`
  - `eslint-plugin-react-hooks` `5.2.0`
  - `eslint-plugin-react-refresh` `0.4.20`

## Build & Deployment

- **Dockerfile** (Multi-Stage):
  - Stage 1: `node:22-alpine` → `npm ci` + `npm run build`
  - Stage 2: `nginx:1.27-alpine` serviert `/usr/share/nginx/html`
- **Nginx**-Konfiguration mit Security-Headern (X-Frame-Options, HSTS, CSP-nahe Header, Referrer-Policy, Permissions-Policy)
- **Runtime-Env-Injection**: `docker-entrypoint-env.sh` schreibt `/env-config.js` beim Container-Start (ermöglicht env ohne Rebuild)
- Zielplattform: **Coolify** (laut README)
- **Node.js**: `22` (im Docker-Build festgesetzt)

## Projektstruktur (relevant)

```
src/
  components/           # App- und UI-Komponenten (inkl. shadcn/ui in components/ui)
    admin/              # Admin-Layout
    chat/               # Chatbot-Komponenten
  hooks/                # Custom Hooks (useChatMachine, use-toast, use-mobile)
  integrations/
    supabase/client.ts  # Supabase-Client
  lib/                  # admin, submissions, referral-codes, marquee, mail, utils
  pages/                # Seiten-Komponenten
    admin/              # Admin-Seiten
  test/                 # Vitest Setup
supabase/
  migrations/           # SQL-Migrationen
  functions/            # Edge Functions (Deno)
  config.toml           # Supabase-Projektkonfiguration
```

## Skripte (package.json)

| Skript | Befehl |
|---|---|
| `dev` | `vite` |
| `build` | `vite build` |
| `build:dev` | `vite build --mode development` |
| `lint` | `eslint .` |
| `preview` | `vite preview` |
| `test` | `vitest run` |
| `test:watch` | `vitest` |

## Aliase / Konventionen

- Path-Alias: `@/* → ./src/*` (tsconfig + vite + components.json)
- shadcn-Aliase: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`
- Dedupe in Vite für `react`, `react-dom`, JSX-Runtime und `@tanstack/react-query`/`query-core`
- Dark-Mode via CSS-Klasse (`darkMode: ["class"]`)

## Umgebungsvariablen

### Frontend (VITE_*)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Server-only
- `SUPABASE_SERVICE_ROLE_KEY` (niemals mit `VITE_`-Prefix exposen)

### Edge-Function-Secrets
- `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO_ADMIN`, `MAIL_REPLY_TO`, `MAIL_SEND_CONFIRMATION`
