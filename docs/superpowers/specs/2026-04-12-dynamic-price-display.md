# Dynamic Price Display

**Date:** 2026-04-12  
**Status:** Approved

## Problem

The price per tree (default 8 000 Ft) is hardcoded in 5 places across 3 public-facing pages. When an admin changes the price via the settings panel, the UI does not reflect the update.

## Goal

Replace all hardcoded price strings with values fetched from `GET /api/admin/settings` so the displayed price stays in sync with the admin-configured value.

## Scope

5 instances across 3 files:

| File | Location | Current value |
|------|----------|---------------|
| `app/page.tsx` | Line 72 — card title | `"Egységes ár: 8 000 Ft"` |
| `app/page.tsx` | Line 227 — price box | `"8 000 Ft"` |
| `app/page.tsx` | Line 277 — marquee strip | `"8 000 Ft"` inside string |
| `app/booking/page.tsx` | Line 32 — infoRows | `"8 000 Ft / fa"` |
| `app/trees/page.tsx` | Line 63 — price box | `"8 000 Ft"` |

## Constraints

- All 3 pages are `"use client"` components — `getSettings()` (server-only) cannot be called directly.
- `GET /api/admin/settings` already exists and returns `{ success: boolean, settings: { pricePerTree: number, ... } }`.
- The booking page already fetches settings via this endpoint in a `useEffect`.

## Design

### 1. `formatPrice` utility

Add to `lib/utils.ts`:

```ts
export function formatPrice(n: number): string {
  return `${new Intl.NumberFormat("hu-HU").format(n)} Ft`
}
```

`formatPrice(8000)` → `"8 000 Ft"` (Hungarian thousand-separator, space).

### 2. `app/page.tsx`

- Add `useState<number>(8000)` for `pricePerTree` (default avoids empty flash).
- Add `useEffect` that fetches `/api/admin/settings` and sets state on success — identical pattern to the booking page.
- Replace the 3 hardcoded strings with `formatPrice(pricePerTree)` (template literal for the card title and marquee, direct render for the price box).

### 3. `app/trees/page.tsx`

- Same pattern: `useState<number>(8000)` + `useEffect` fetch.
- Replace the single hardcoded `"8 000 Ft"` with `{formatPrice(pricePerTree)}`.

### 4. `app/booking/page.tsx`

- `settings` is already fetched; `pricePerTree` is available as `settings?.pricePerTree`.
- `infoRows` is currently a module-level static array. Move it inside the component as a derived value so the Ár row uses the live price:

```ts
const infoRows = [
  { label: "Érkezés", value: "10:00 – 12:00 között" },
  { label: "Ár", value: `${formatPrice(settings?.pricePerTree ?? 8000)} / fa` },
  { label: "Fizetés", value: "Készpénz vagy bankkártya" },
  { label: "Helyszín", value: "GPS-koordinátákkal (visszaigazolásban)" },
]
```

## Data flow

```
Admin settings page
  → PATCH /api/admin/settings { pricePerTree: N }
  → Database updated

Public pages (on mount)
  → GET /api/admin/settings
  → { settings: { pricePerTree: N } }
  → formatPrice(N) rendered in UI
```

## Non-goals

- No caching layer or polling — a single fetch on mount is sufficient for a low-traffic site.
- No loading skeleton — the default state (8000) serves as the pre-fetch value, matching the DB default, so no visual change is expected in the common case.
- No changes to the API route or database schema.
