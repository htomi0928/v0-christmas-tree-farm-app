# Dynamic Price Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 5 hardcoded price strings across 3 pages with values fetched from `GET /api/admin/settings` so the displayed price always reflects the admin-configured value.

**Architecture:** All 3 affected pages are `"use client"` components, so they fetch price via `useEffect` + `fetch("/api/admin/settings")`. A shared `formatPrice` utility handles Hungarian number formatting (`8000` → `"8 000 Ft"`). The booking page already fetches settings — only its `infoRows` needs updating.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, native `fetch`, `Intl.NumberFormat`

---

## File Map

| File | Change |
|------|--------|
| `lib/utils.ts` | Add `formatPrice(n: number): string` |
| `app/page.tsx` | Add settings fetch; replace 3 hardcoded prices |
| `app/trees/page.tsx` | Add settings fetch; replace 1 hardcoded price |
| `app/booking/page.tsx` | Move `infoRows` inside component; use fetched `pricePerTree` |

---

### Task 1: Add `formatPrice` utility

**Files:**
- Modify: `lib/utils.ts`

- [ ] **Step 1: Add the function**

Open `lib/utils.ts` (currently contains only `cn()`). Append:

```ts
export function formatPrice(n: number): string {
  return `${new Intl.NumberFormat("hu-HU").format(n)} Ft`
}
```

`Intl.NumberFormat("hu-HU").format(8000)` produces `"8 000"` (space as thousands separator, matching the existing hardcoded strings).

- [ ] **Step 2: Verify in TypeScript**

```bash
cd /Users/regenyimatyas/Documents/Projects/tonyas-fa
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/utils.ts
git commit -m "feat: add formatPrice utility for Hungarian Ft formatting"
```

---

### Task 2: Dynamic price in `app/page.tsx`

**Files:**
- Modify: `app/page.tsx`

This file already has `"use client"` and imports from React. There are 3 hardcoded `"8 000 Ft"` strings to replace:
- Line 72: inside the `cards` array (card title)
- Line 227: inside JSX price box
- Line 277: inside the marquee string

- [ ] **Step 1: Add import and state**

Add `formatPrice` to the import at the top of the file:

```ts
import { formatPrice } from "@/lib/utils"
```

Inside the `HomePage` function body (before the `return`), add:

```ts
const [pricePerTree, setPricePerTree] = useState<number>(8000)

useEffect(() => {
  fetch("/api/admin/settings")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) setPricePerTree(data.settings.pricePerTree)
    })
    .catch(() => {})
}, [])
```

`useState` and `useEffect` are not currently imported in this file — add them to the React import.

- [ ] **Step 2: Move `cards` array inside the component**

The `cards` array is currently defined at module level (lines 64–85). Move it inside `HomePage` (after the state declarations) so it can reference `pricePerTree`:

```ts
const cards = [
  {
    number: "01",
    title: "Csak Nordmann fenyő",
    body: "A legjobb, amit találsz — tűlevél-tartással, dús formával, frissen vágva.",
  },
  {
    number: "02",
    title: `Egységes ár: ${formatPrice(pricePerTree)}`,
    body: "Mérettől függetlenül. Nincs tárgyalás, nincs meglepetés.",
  },
  {
    number: "03",
    title: "Nyugodt, beszélgetős hangulat",
    body: "Van idő körbenézni. Nem sürgetünk senkit.",
  },
  {
    number: "04",
    title: "Megjelöljük a fádat",
    body: "Sorszámmal rögzítve. A kiválasztott fa a tied.",
  },
]
```

- [ ] **Step 3: Replace the price box (line ~227)**

Find this JSX block (inside the "Why Choose Us / Nordmann" section):

```tsx
<p className="text-3xl font-extrabold text-[#3a3a3a] tracking-tight">8 000 Ft</p>
```

Replace with:

```tsx
<p className="text-3xl font-extrabold text-[#3a3a3a] tracking-tight">{formatPrice(pricePerTree)}</p>
```

- [ ] **Step 4: Replace the marquee string (line ~277)**

Find:

```tsx
{"Nordmann · Zalaegerszeg · 8 000 Ft · Csak Nordmann fenyő · Időpontfoglalás · ".repeat(10)}
```

Replace with:

```tsx
{`Nordmann · Zalaegerszeg · ${formatPrice(pricePerTree)} · Csak Nordmann fenyő · Időpontfoglalás · `.repeat(10)}
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: replace hardcoded prices in homepage with dynamic value"
```

---

### Task 3: Dynamic price in `app/trees/page.tsx`

**Files:**
- Modify: `app/trees/page.tsx`

This file has `"use client"` and one hardcoded `"8 000 Ft"` at line 63 (inside the price box).

- [ ] **Step 1: Add imports and state**

Add to the import section:

```ts
import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"
```

Inside `TreesPage` (before the `return`), add:

```ts
const [pricePerTree, setPricePerTree] = useState<number>(8000)

useEffect(() => {
  fetch("/api/admin/settings")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) setPricePerTree(data.settings.pricePerTree)
    })
    .catch(() => {})
}, [])
```

- [ ] **Step 2: Replace the hardcoded price**

Find (line ~63):

```tsx
<p className="text-3xl font-extrabold text-foreground tracking-tight">8 000 Ft</p>
```

Replace with:

```tsx
<p className="text-3xl font-extrabold text-foreground tracking-tight">{formatPrice(pricePerTree)}</p>
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/trees/page.tsx
git commit -m "feat: replace hardcoded price in trees page with dynamic value"
```

---

### Task 4: Dynamic price in `app/booking/page.tsx`

**Files:**
- Modify: `app/booking/page.tsx`

`settings` is already fetched and stored in state. `infoRows` is currently a module-level static array (lines 30–35). It needs to move inside the component so it can reference the live `settings?.pricePerTree`.

- [ ] **Step 1: Add formatPrice import**

Add to the existing import section:

```ts
import { formatPrice } from "@/lib/utils"
```

- [ ] **Step 2: Remove module-level `infoRows`**

Delete lines 30–35 (the static `infoRows` array):

```ts
const infoRows = [
  { label: "Érkezés", value: "10:00 – 12:00 között" },
  { label: "Ár", value: "8 000 Ft / fa" },
  { label: "Fizetés", value: "Készpénz vagy bankkártya" },
  { label: "Helyszín", value: "GPS-koordinátákkal (visszaigazolásban)" },
]
```

- [ ] **Step 3: Add computed `infoRows` inside the component**

Inside `BookingPage`, after the existing state declarations, add:

```ts
const infoRows = [
  { label: "Érkezés", value: "10:00 – 12:00 között" },
  { label: "Ár", value: `${formatPrice(settings?.pricePerTree ?? 8000)} / fa` },
  { label: "Fizetés", value: "Készpénz vagy bankkártya" },
  { label: "Helyszín", value: "GPS-koordinátákkal (visszaigazolásban)" },
]
```

The `?? 8000` fallback matches the DB default and is consistent with the `useState(8000)` pattern in the other pages.

> **Note:** The booking page also renders `pricePerTree` inline in two other places (the form summary row and inline price display) using `settings.pricePerTree.toLocaleString("hu-HU")`. These are not in scope for this plan — they use a different formatting pattern but are separate UI elements not covered by the spec.

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/booking/page.tsx
git commit -m "feat: replace hardcoded price in booking page infoRows with dynamic value"
```

---

### Task 5: Smoke test

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify homepage**

Open `http://localhost:3000`. Check:
- "Why Choose Us" card 02 title shows current price (e.g. `"Egységes ár: 8 000 Ft"`)
- Price box in the Nordmann section shows the price
- Marquee strip contains the price

- [ ] **Step 3: Verify trees page**

Open `http://localhost:3000/trees`. Check price box shows current price.

- [ ] **Step 4: Verify booking page**

Open `http://localhost:3000/booking`. Check the info row "Ár" shows `"8 000 Ft / fa"`.

- [ ] **Step 5: Change price in admin and re-verify**

Open `http://localhost:3000/admin/settings`. Change price to a different value (e.g. 9000). Save. Navigate to each of the 3 public pages fresh (navigate away and back, or open in a new tab) — the fetch fires on mount, so a navigation is the cleanest way to confirm the update path.

- [ ] **Step 6: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: dynamic price display — smoke test complete"
```
