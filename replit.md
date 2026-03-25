# AutoMarket — Used Vehicle Marketplace

## Overview

Full-stack used vehicle marketplace. Users can browse/search listings (cars, trucks, motorcycles, boats & more), view vehicle details, post listings (auth required), manage their own listings, and message sellers directly through a real-time chat system organized by advertisement. Uses Replit Auth (OpenID Connect) for login/logout.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend + API**: Next.js 15 (App Router) — unified app with React Server Components and Route Handlers
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Auth**: Replit OIDC (`openid-client` v6, PKCE flow, session-based via PostgreSQL `sessions` table)

## Design Theme

Golden/amber palette (primary: `#dfae2d`, dark: `#b8861f`, light: `#f1c85b`, tint: `#f9e6b2`, background: `#fff8e1`)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── car-marketplace/    # Next.js 15 app (frontend + API Route Handlers)
│   │   ├── src/app/        # Next.js App Router
│   │   │   ├── api/        # Route Handlers (auth, listings, inquiries)
│   │   │   ├── layout.tsx  # Root layout
│   │   │   ├── page.tsx    # Home page
│   │   │   └── */page.tsx  # Listings, post, my-listings, edit, my-inquiries
│   │   ├── src/components/ # Reusable React components
│   │   ├── src/pages/      # Page component implementations (client)
│   │   └── src/lib/        # Auth helpers (session, OIDC)
│   └── api-server/         # Legacy Express API server (kept for reference)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Authentication

- Login: `GET /api/login` → redirects to Replit OIDC
- Callback: `GET /api/callback` → exchanges code, creates session in DB
- Logout: `GET /api/logout` → deletes session, redirects to Replit end-session
- Session: `sid` HTTP-only cookie → stored in `sessions` table in PostgreSQL
- Auth helper: `src/lib/auth.ts` — `getSessionUser(request)` for Route Handlers

## API Routes (Next.js Route Handlers)

- `GET /api/auth/user` — current auth state
- `GET /api/login` — OIDC login redirect
- `GET /api/callback` — OIDC callback + session creation
- `GET /api/logout` — session deletion + OIDC end-session
- `GET /api/healthz` — health check
- `GET /api/listings` — list listings with filters
- `POST /api/listings` — create listing (auth required)
- `GET /api/listings/[id]` — get listing detail
- `PUT /api/listings/[id]` — update listing (auth + ownership)
- `DELETE /api/listings/[id]` — soft-delete listing (auth + ownership)
- `GET /api/listings/[id]/inquiries` — get inquiries for listing (seller only)
- `POST /api/listings/[id]/inquiries` — send inquiry (auth required)
- `GET /api/my-inquiries` — get inquiries sent by current user
- `GET /api/conversations` — list all conversations for current user (buyer or seller)
- `POST /api/conversations` — start or resume a conversation about a listing
- `GET /api/conversations/[id]` — get conversation details + full message history
- `POST /api/conversations/[id]/messages` — send a message in a conversation

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by Next.js.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/car-marketplace` (`@workspace/car-marketplace`)

Next.js 15 full-stack app. All pages use the App Router. API routes are in `src/app/api/`. Page implementations are in `src/pages/` (client components with "use client"). `src/app/*/page.tsx` files are thin wrappers that import from `src/pages/`.

- `pnpm --filter @workspace/car-marketplace run dev` — dev server (`next dev -p ${PORT:-24519}`)
- `pnpm --filter @workspace/car-marketplace run build` — production build
- `pnpm --filter @workspace/car-marketplace run start` — production server

### `artifacts/api-server` (`@workspace/api-server`)

Legacy Express 5 API server (kept for reference). No longer the primary API — Next.js Route Handlers serve the API instead.

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)

Production migrations are handled by Replit when publishing. In development, use `pnpm --filter @workspace/db run push`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec. Used by car-marketplace API routes for request and response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec. Used by all client components.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run via `pnpm --filter @workspace/scripts run <script>`.
