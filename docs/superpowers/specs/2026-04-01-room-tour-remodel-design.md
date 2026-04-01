# Design Spec: Tonya's Farm — RooM-tour Visual Remodel
**Date:** 2026-04-01
**Status:** Approved by user (v3 — post spec-review fixes, round 2)

---

## 1. Goal

Remodel the public-facing visual design of the Tonya's Farm website (Nordmann Christmas tree farm, Next.js 16 / Tailwind CSS 4) to match the editorial, cinematic, premium aesthetic of the RooM-tour_by_RM reference project — while keeping all business logic, admin, and booking functionality untouched.

---

## 2. Reference Analysis

### Source project (tonyas-fa)
- Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI
- Generic blue-primary / orange-accent color scheme
- Basic hero with static background image + gradient
- Standard card components with hover shadow
- Geist font

### Reference project (RooM-tour_by_RM)
- Vite + React 19, Framer Motion 12, Tailwind CSS 4
- Cream `#f9f9f7` / deep charcoal `#1c2218` palette
- Ken Burns hero slideshow with line-by-line text reveal
- Glassmorphism navbar (transparent → blur on scroll)
- Cursor-tracking SpotlightCard components
- Outfit (headings) + Switzer light (body) typography
- Grain texture overlay, generous whitespace (8rem sections)
- Dark mode with surface ladder hierarchy
- Scroll-triggered fade-in-up animations (Intersection Observer)
- Marquee ticker strip

---

## 3. Design System

### 3.1 Complete Color Token Mapping

All 28 light-mode and 28 dark-mode tokens must be specified so no existing admin/chart tokens are dropped.
New tokens are in hex; existing functional tokens are converted to hex equivalents.

**IMPORTANT:** Also preserve `--radius: 0.625rem` in the `:root` block. It is defined alongside the color tokens in the current `globals.css` and is used by the `@theme inline` block for all border-radius utilities. If the `:root` block is fully replaced using this listing, `--radius` must be included explicitly.

```css
/* ── LIGHT MODE ─────────────────────────────────── */
--background:              #f9f9f7;   /* warm cream */
--foreground:              #1c2218;   /* near-black forest */
--card:                    #f4f3ef;   /* off-white card */
--card-foreground:         #1c2218;
--popover:                 #f4f3ef;
--popover-foreground:      #1c2218;
--primary:                 #2d5a27;   /* forest green */
--primary-foreground:      #ffffff;
--secondary:               #e8e5db;   /* warm muted */
--secondary-foreground:    #2d5a27;
--muted:                   #efeee8;
--muted-foreground:        #6b6b6b;
--accent:                  #b5651d;   /* warm clay/amber */
--accent-foreground:       #ffffff;
--destructive:             #dc2626;
--destructive-foreground:  #ffffff;
--border:                  #e0ddd4;
--input:                   #e8e5db;
--ring:                    #2d5a27;
--chart-1:                 #2d5a27;   /* forest green */
--chart-2:                 #b5651d;   /* clay */
--chart-3:                 #e8e5db;   /* warm muted */
--chart-4:                 #4a7c3f;   /* mid green */
--chart-5:                 #8fa882;   /* sage */
--sidebar:                 #f4f3ef;
--sidebar-foreground:      #1c2218;
--sidebar-primary:         #2d5a27;
--sidebar-primary-foreground: #ffffff;
--sidebar-accent:          #b5651d;
--sidebar-accent-foreground: #ffffff;
--sidebar-border:          #e0ddd4;
--sidebar-ring:            #2d5a27;

/* ── DARK MODE ──────────────────────────────────── */
--background:              #131a0f;   /* deep forest */
--foreground:              #d8e0cc;   /* pale sage */
--card:                    #1a2416;
--card-foreground:         #d8e0cc;
--popover:                 #1a2416;
--popover-foreground:      #d8e0cc;
--primary:                 #5a9e4f;   /* lighter green */
--primary-foreground:      #131a0f;
--secondary:               #253020;
--secondary-foreground:    #d8e0cc;
--muted:                   #1f2a1b;
--muted-foreground:        #8a9e83;
--accent:                  #d4845a;   /* warm clay light */
--accent-foreground:       #131a0f;
--destructive:             #7f1d1d;
--destructive-foreground:  #fca5a5;
--border:                  #2a3825;
--input:                   #253020;
--ring:                    #5a9e4f;
--chart-1:                 #5a9e4f;
--chart-2:                 #d4845a;
--chart-3:                 #253020;
--chart-4:                 #6aaf5e;
--chart-5:                 #8a9e83;
--sidebar:                 #1a2416;
--sidebar-foreground:      #d8e0cc;
--sidebar-primary:         #5a9e4f;
--sidebar-primary-foreground: #131a0f;
--sidebar-accent:          #d4845a;
--sidebar-accent-foreground: #131a0f;
--sidebar-border:          #2a3825;
--sidebar-ring:            #5a9e4f;
```

The `@theme inline` block in `globals.css` is preserved as-is — it maps each `--color-*` Tailwind utility to its corresponding CSS custom property via `var(--token-name)`, which works with hex just as well as OKLch.

### 3.2 Typography

Replace Geist with Outfit + DM Sans via `next/font/google`.

**`app/layout.tsx` implementation:**
```tsx
import { Outfit, DM_Sans } from "next/font/google"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",  // replaces existing --font-sans so font-sans utility works
  weight: ["300", "400"],
})

// In <html>:
// className={`${outfit.variable} ${dmSans.variable}`}
```

**`globals.css` additions (inside `@theme inline`):**
```css
/* Note: the names are identical on both sides intentionally.
   next/font/google injects --font-heading and --font-sans at the <html> element
   via the .variable class names. The @theme inline block re-exposes them as
   Tailwind theme tokens using the same name. This is not a copy-paste error. */
--font-heading: var(--font-heading);
--font-sans: var(--font-sans);
```

**Global typography rules (in globals.css):**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), 'Outfit', sans-serif;
  letter-spacing: -0.035em;
}
body {
  font-weight: 300;
  line-height: 1.7;
}
```

Do NOT add `@import url(...)` for Google Fonts in globals.css — `next/font/google` handles this entirely.

### 3.3 Spacing & Layout
- Section vertical padding: `py-24 sm:py-32` (mirrors `--spacing-xl: 8rem`)
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (unchanged)
- Section label style: uppercase, letter-spaced, with decorative side lines

### 3.4 Key Design Tokens (additions to globals.css)
```css
:root {
  --ease-premium: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-card:    cubic-bezier(0.45, 0, 0.15, 1);
}
```

### 3.5 Section Label Utility Class

```css
.section-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  margin-bottom: 1rem;
}
.section-label::before,
.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
  max-width: 3rem;
}
```

### 3.6 Animation Keyframes

All keyframes wrapped in `@media (prefers-reduced-motion: no-preference)` so they are disabled for users who opt out.

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes ken-burns-1 {
    0%   { transform: scale(1)    translate(0, 0); }
    100% { transform: scale(1.08) translate(-1%, -1%); }
  }
  @keyframes ken-burns-2 {
    0%   { transform: scale(1)    translate(0, 0); }
    100% { transform: scale(1.08) translate(1%, -0.5%); }
  }
  @keyframes ken-burns-3 {
    0%   { transform: scale(1.08) translate(-0.5%, 0); }
    100% { transform: scale(1)    translate(0, 0); }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulse-line {
    0%, 100% { transform: scaleY(1);   opacity: 1; }
    50%       { transform: scaleY(0.4); opacity: 0.4; }
  }
}

/* Fallback: ensure content is visible even with motion disabled */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up { opacity: 1 !important; transform: none !important; }
  .animate-ken-burns  { animation: none !important; }
}
```

---

## 4. Component Changes

### 4.1 `app/globals.css`
1. Replace all color tokens with the full set defined in §3.1
2. Add typography rules from §3.2
3. Add design tokens from §3.4
4. Add `.section-label` from §3.5
5. Add keyframes from §3.6
6. Preserve `@theme inline` block (no changes needed there)
7. Preserve all Tailwind/tw-animate imports at the top

### 4.2 `app/layout.tsx`
1. Remove `Geist` and `Geist_Mono` imports
2. Import `Outfit` and `DM_Sans` from `next/font/google` (see §3.2 for exact config)
3. Apply both `.variable` classes to `<html className={...}>` alongside existing `lang="hu"`
4. Keep `font-sans antialiased` on `<body>` — DM Sans is wired to `--font-sans` so this resolves correctly

### 4.3 Navigation component (`components/navigation.tsx`)

**Scroll behavior:**
- Add `useEffect` with `window.addEventListener('scroll', ...)` in the existing `"use client"` component
- `scrolled` state: `true` when `window.scrollY > 20`
- When `scrolled`: `bg-background/95 backdrop-blur-md shadow-sm border-border`
- When not `scrolled` (hero overlay): `bg-transparent border-transparent`

**Positioning — change `sticky` to `fixed`:**
- The nav must be changed from `sticky top-0` to `fixed top-0 left-0 right-0` so it overlays the hero images
- Add `pt-0` to the hero section (hero is the first child of `<main>` and starts at the top of the viewport)
- All other page sections are unaffected — they start after the hero's `min-h-screen` height

**Nav text contrast over hero (critical — WCAG AA):**
- When not scrolled: force `text-white` on nav links and logo text (hero is always dark-image)
- Add `data-scrolled` attribute or conditional class: links use `text-foreground` when scrolled, `text-white` when transparent
- The hero must always have a top gradient band dark enough that white text achieves 4.5:1

**Nav link hover animation:**
- Add `relative` + `::after` underline pseudo-element: `scaleX(0)` → `scaleX(1)` on hover, `transform-origin: left`
- Duration: `200ms`, `ease-out`

**Important:** The `Navigation` component is only used in the public layout (`app/layout.tsx`). Admin pages use their own header inside `app/admin/layout.tsx` (lines 22–60). Nav changes do NOT affect admin.

### 4.4 `app/page.tsx` — Hero Section

**Image assets (all exist in `/public`):**
- Slide 1: `/christmas-tree-forest-field-zalaegerszeg.jpg`
- Slide 2: `/nordmann-christmas-tree-family-farm.jpg`
- Slide 3: `/nordmann-christmas-tree-close-up-green.jpg`

**Implementation:**
1. State: `activeSlide` (0–2), `useEffect` interval of 5000ms to cycle
2. Three `<img>` layers, absolutely positioned, `opacity-0`/`opacity-100` transition on active slide
3. Each image gets its corresponding `ken-burns-1/2/3` animation class
4. **Gradient overlay** (two bands):
   - Top: `linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%)` — keeps white nav text readable (≥4.5:1)
   - Bottom: `linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)` — keeps headline text readable
5. **Grain overlay:** `<div aria-hidden="true">` with SVG `feTurbulence` filter, `opacity-[0.04]`, `pointer-events-none`
6. **Heading reveal:** Split heading string into words, each wrapped in `<span>` with `animation: fade-in-up` + staggered `animation-delay` (0.1s per word)
7. **Scroll indicator:** Right edge, `position: absolute`, vertical flex column with "Scroll" text rotated 90° and a pulsing line below

### 4.5 `components/ui/spotlight-card.tsx` (new file)

Pure CSS + `onMouseMove` — no framer-motion dependency:

```tsx
'use client'
import { useRef } from 'react'

export function SpotlightCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ref.current.style.setProperty('--spotlight-x', `${x}px`)
    ref.current.style.setProperty('--spotlight-y', `${y}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
```

```css
/* in globals.css */
.spotlight-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.45s var(--ease-card);
}
.spotlight-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
    rgba(45, 90, 39, 0.12),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.spotlight-card:hover::before { opacity: 1; }
.spotlight-card:hover { transform: translateY(-5px); }
```

### 4.6 `components/ui/animate-on-scroll.tsx` (new file)

Intersection Observer wrapper that adds `animate-fade-in-up` class when element enters viewport:

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function AnimateOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in-view'); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className ?? ''}`}
      style={{ transitionDelay: `${delay}ms` }}  {/* transitionDelay, NOT animationDelay — CSS uses transition not animation */}
    >
      {children}
    </div>
  )
}
```

```css
/* in globals.css */
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s var(--ease-premium), transform 0.6s var(--ease-premium);
}
.scroll-reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal { opacity: 1; transform: none; transition: none; }
}
```

### 4.7 `app/page.tsx` — Updated Sections

**Why Us Cards:**
- Replace `<Card>` with `<SpotlightCard>` wrapper + existing card content
- Wrap each card in `<AnimateOnScroll delay={index * 100}>`

**Section headers:**
All `<h2>` headings get a sibling `<div className="section-label">` above them (see §3.5).

**About section:**
- Wrap content blocks in `<AnimateOnScroll>`
- Apply `py-24 sm:py-32` to section

**Marquee strip (between About and CTA):**
```html
<section aria-hidden="true" class="bg-foreground py-4 overflow-hidden">
  <div class="marquee-track flex gap-12 whitespace-nowrap">
    <!-- duplicate content for seamless loop -->
    Nordmann · Zalaegerszeg · 8 000 Ft · Csak Nordmann fenyő · Időpontfoglalás ·
    Nordmann · Zalaegerszeg · 8 000 Ft · Csak Nordmann fenyő · Időpontfoglalás ·
  </div>
</section>
```
```css
.marquee-track {
  animation: marquee-scroll 20s linear infinite;
  color: var(--background);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: var(--font-heading);
}
```

### 4.8 `app/trees/page.tsx`
- Replace card containers with `<SpotlightCard>`
- Add section label + editorial header
- Wrap cards in `<AnimateOnScroll>`
- No framer-motion needed here

### 4.9 `app/how-it-works/page.tsx`
- Each step: oversized step number `opacity-10` in background, content overlaid
- Wrap each step in `<AnimateOnScroll delay={index * 150}>`
- Section label + editorial header

---

## 5. What Is NOT Changed
- All admin routes and components (`/admin`, `/admin/reservations`, etc.)
- `app/admin/layout.tsx` — has its own header, fully isolated from public nav
- All API routes
- Booking page logic and calendar (`/booking`)
- FAQ page content structure
- Contact page
- Database schema and queries
- Authentication logic
- Dark mode toggle mechanism (next-themes stays)
- Radix UI primitives (Button, Dialog, Select, etc.)
- `@theme inline` block in `globals.css` (no changes)

---

## 6. Dependencies

**No new npm dependencies required.**

All animations are CSS-only or use Intersection Observer (browser-native). The `framer-motion` dependency originally considered is not needed — all described effects are achievable with CSS + vanilla JS event handlers.

---

## 7. File Change Summary

| File | Change Type |
|------|-------------|
| `app/globals.css` | Color tokens (full 28-token set), typography rules, keyframes, utility classes |
| `app/layout.tsx` | Font swap: Geist → Outfit + DM Sans (next/font/google) |
| `components/navigation.tsx` | Scroll-aware glassmorphism + white text on hero + link hover animation |
| `app/page.tsx` | Ken Burns hero, SpotlightCards, marquee, scroll animations, section labels |
| `app/trees/page.tsx` | SpotlightCard gallery + section label + AnimateOnScroll |
| `app/how-it-works/page.tsx` | Editorial step layout + AnimateOnScroll |
| `components/ui/spotlight-card.tsx` | New component |
| `components/ui/animate-on-scroll.tsx` | New component |

---

## 8. Accessibility & Performance

- All CSS keyframes wrapped in `@media (prefers-reduced-motion: no-preference)` — disabled automatically for users who opt out
- `scroll-reveal` and `animate-fade-in-up` reset to visible state under `prefers-reduced-motion: reduce`
- Ken Burns images each have descriptive `alt` text
- SpotlightCard glow is `pointer-events-none` and `aria-hidden`
- Marquee strip is `aria-hidden="true"` (purely decorative)
- Google Fonts loaded via `next/font/google` with `display: swap` (auto-handled by Next.js)
- No framer-motion bundle cost
- All hero gradient bands ensure nav white text ≥4.5:1 contrast against image backgrounds

---

## 9. Success Criteria

- Hero feels cinematic: photos cycle with Ken Burns, text reveals on load
- Navigation glass effect is visible when scrolled; white text readable over hero before scroll
- Cards have visible spotlight glow on mouse hover and lift on hover
- Section transitions are smooth and staggered (disabled with reduced-motion)
- Colour palette reads as warm/forest, not generic blue
- Typography feels editorial and premium (Outfit headings, thin DM Sans body)
- All existing booking + admin functionality works identically
- Passes WCAG AA contrast in both light and dark mode (verified for nav, hero text, cards)
- No layout shift during animations
