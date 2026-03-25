# AutoMarket — Used Vehicle Marketplace (Frontend Prototype)

## Overview

Front-end prototype of a used vehicle marketplace. Users can browse/search listings (cars, trucks, motorcycles, boats & more), view vehicle details, post listings, manage their own listings, and message sellers through a simulated chat system. All data is in-memory mock data — no database or real API calls.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: Next.js 15 (App Router) — client-side pages with mocked async data

## Design Theme

Golden/amber palette (primary: `#dfae2d`, dark: `#b8861f`, light: `#f1c85b`, tint: `#f9e6b2`, background: `#fff8e1`)

## Structure

```text
artifacts/
├── car-marketplace/            # Next.js 15 app (frontend prototype)
│   └── src/
│       ├── app/                # Next.js App Router (thin page wrappers)
│       ├── pages/              # Page component implementations ("use client")
│       │   ├── HomePage.tsx
│       │   ├── ListingsPage.tsx
│       │   ├── ListingDetailPage.tsx
│       │   ├── PostListingPage.tsx
│       │   ├── EditListingPage.tsx
│       │   ├── MyListingsPage.tsx
│       │   ├── MyInquiriesPage.tsx
│       │   ├── ReceivedInquiriesPage.tsx
│       │   ├── MessagesPage.tsx
│       │   └── ChatPage.tsx
│       ├── components/         # Reusable React components
│       │   ├── layout/Navbar.tsx
│       │   ├── car/CarCard.tsx
│       │   ├── ui/             # shadcn/ui primitives
│       │   └── providers.tsx   # MockAuthProvider wrapper
│       ├── contexts/
│       │   └── mock-auth-context.tsx  # Auth state (always logged in as John Doe)
│       └── lib/
│           ├── mock-data.ts    # 12 listings, 4 users, conversations, messages
│           ├── mock-api.ts     # All CRUD ops with 250ms simulated delay
│           └── utils.ts        # formatPrice, formatMileage helpers
└── api-server/                 # Legacy Express API server (unused)
```

## Mock Data

- **Current user**: John Doe (`user-me`), always logged in by default
- **Listings**: `lst-001` to `lst-012` — mix of cars, trucks, motorcycles, etc.
- **John's own listings**: `lst-009` (Tacoma), `lst-010` (Miata), `lst-011` (Civic, sold)
- **Other users**: `user-jane`, `user-bob`, `user-alice`
- **Auth**: `login()`/`logout()` toggle mock auth state — no real auth

## Mock API (`src/lib/mock-api.ts`)

All functions return a `Promise` with 250ms delay to simulate network latency:

- `getListings(filters?)` — list/search listings
- `getListing(id)` — get single listing
- `createListing(data)` — create (owned by current user)
- `updateListing(id, data)` — update (ownership checked)
- `deleteListing(id)` — soft-delete
- `getMyListings()` — current user's listings
- `getMyInquiries()` — inquiries sent by current user (enriched with listing/sender info)
- `getListingInquiries(listingId)` — inquiries for a listing (seller only)
- `sendInquiry(listingId, message)` — create inquiry
- `getConversations()` — all conversations for current user (enriched with buyer/seller MockUser objects)
- `getConversation(id)` — single conversation + messages
- `sendMessage(conversationId, text)` — append message

## Running the App

```bash
pnpm --filter @workspace/car-marketplace run dev
```

Runs on port `24519` (or `$PORT`).

## TypeScript Notes

- `next.config.ts` is minimal — no transpilePackages or serverExternalPackages (no external deps needed)
- `CarCard.tsx` uses `MockListing` from `@/lib/mock-data`
- No `src/app/api/` directory — all data comes from mock-api.ts
