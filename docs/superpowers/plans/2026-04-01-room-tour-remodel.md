# RooM-tour Visual Remodel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Tonya's Farm Christmas tree website from a generic blue/orange theme into a cinematic, editorial-minimalist experience inspired by the RooM-tour_by_RM design — warm forest palette, Ken Burns hero slideshow, glassmorphism nav, spotlight glow cards, and scroll-triggered animations.

**Architecture:** All changes are confined to the public-facing pages and shared UI components. Admin routes, API routes, booking logic, and database layer are untouched. New utility components (`SpotlightCard`, `AnimateOnScroll`) are pure CSS + React hooks with no new npm dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, `next/font/google` (Outfit + DM Sans), Intersection Observer API, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-04-01-room-tour-remodel-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/globals.css` | Modify | Color tokens, typography, keyframes, utility classes |
| `app/layout.tsx` | Modify | Font swap Geist → Outfit + DM Sans |
| `components/navigation.tsx` | Modify | Glassmorphism scroll behavior, white-on-hero text, link hover |
| `app/page.tsx` | Modify | Ken Burns hero, SpotlightCards, section labels, marquee, scroll animations |
| `app/trees/page.tsx` | Modify | SpotlightCard gallery, section label, AnimateOnScroll |
| `app/how-it-works/page.tsx` | Modify | Editorial step numbers, section label, AnimateOnScroll |
| `components/ui/spotlight-card.tsx` | Create | Cursor-tracking glow card wrapper |
| `components/ui/animate-on-scroll.tsx` | Create | Intersection Observer fade-in-up wrapper |

---

## Task 1: Color Tokens & CSS Foundations

**Files:**
- Modify: `app/globals.css`

Replace the entire `:root` and `.dark` blocks, and add animation keyframes + utility classes.

- [ ] **Step 1.1: Replace `:root` color block**

In `app/globals.css`, replace the entire `:root { ... }` block (the block that starts with `:root {` and ends at its matching `}`) with:

```css
:root {
  --background:              #f9f9f7;
  --foreground:              #1c2218;
  --card:                    #f4f3ef;
  --card-foreground:         #1c2218;
  --popover:                 #f4f3ef;
  --popover-foreground:      #1c2218;
  --primary:                 #2d5a27;
  --primary-foreground:      #ffffff;
  --secondary:               #e8e5db;
  --secondary-foreground:    #2d5a27;
  --muted:                   #efeee8;
  --muted-foreground:        #6b6b6b;
  --accent:                  #b5651d;
  --accent-foreground:       #ffffff;
  --destructive:             #dc2626;
  --destructive-foreground:  #ffffff;
  --border:                  #e0ddd4;
  --input:                   #e8e5db;
  --ring:                    #2d5a27;
  --radius:                  0.625rem;
  --chart-1:                 #2d5a27;
  --chart-2:                 #b5651d;
  --chart-3:                 #e8e5db;
  --chart-4:                 #4a7c3f;
  --chart-5:                 #8fa882;
  --sidebar:                 #f4f3ef;
  --sidebar-foreground:      #1c2218;
  --sidebar-primary:         #2d5a27;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent:          #b5651d;
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border:          #e0ddd4;
  --sidebar-ring:            #2d5a27;
  --ease-premium:            cubic-bezier(0.22, 1, 0.36, 1);
  --ease-card:               cubic-bezier(0.45, 0, 0.15, 1);
}
```

- [ ] **Step 1.2: Replace `.dark` color block**

Replace the entire `.dark { ... }` block with:

```css
.dark {
  --background:              #131a0f;
  --foreground:              #d8e0cc;
  --card:                    #1a2416;
  --card-foreground:         #d8e0cc;
  --popover:                 #1a2416;
  --popover-foreground:      #d8e0cc;
  --primary:                 #5a9e4f;
  --primary-foreground:      #131a0f;
  --secondary:               #253020;
  --secondary-foreground:    #d8e0cc;
  --muted:                   #1f2a1b;
  --muted-foreground:        #8a9e83;
  --accent:                  #d4845a;
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
}
```

- [ ] **Step 1.3: Add to `@theme inline` block**

Inside the existing `@theme inline { ... }` block in `globals.css`, add these lines after the existing `--color-sidebar-ring` line (before the closing `}`):

```css
  /* Font tokens — injected by next/font/google on <html> element.
     Names are identical on both sides intentionally — this re-exposes
     the CSS custom property as a Tailwind theme token. Not a copy-paste error. */
  --font-heading: var(--font-heading);
  --font-sans: var(--font-sans);
```

- [ ] **Step 1.4: Add typography rules and `.section-label` utility**

After the `@layer base { ... }` block at the end of `globals.css`, append:

```css
/* ── Editorial typography ─────────────────────── */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), 'Outfit', sans-serif;
  letter-spacing: -0.035em;
}

body {
  font-weight: 300;
  line-height: 1.7;
}

/* ── Section label (e.g. ── RÓLUNK ──) ──────── */
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
  font-family: var(--font-heading), 'Outfit', sans-serif;
}
.section-label::before,
.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
  max-width: 3rem;
}

/* ── SpotlightCard ──────────────────────────── */
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
  z-index: 0;
}
.spotlight-card:hover::before { opacity: 1; }
.spotlight-card:hover { transform: translateY(-5px); }

/* ── Scroll reveal (AnimateOnScroll) ────────── */
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s var(--ease-premium), transform 0.6s var(--ease-premium);
}
.scroll-reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* ── Marquee ─────────────────────────────────── */
.marquee-track {
  display: flex;
  gap: 3rem;
  white-space: nowrap;
  font-family: var(--font-heading), 'Outfit', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--background);
}

/* ── Animation keyframes (disabled when reduced-motion preferred) ── */
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

  .marquee-track {
    animation: marquee-scroll 20s linear infinite;
  }
}

/* ── Reduced-motion fallbacks ────────────────── */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal { opacity: 1; transform: none; transition: none; }
  .animate-ken-burns { animation: none !important; }
}
```

- [ ] **Step 1.5: Verify build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` — no TypeScript or CSS errors.

- [ ] **Step 1.6: Commit**

```bash
git add app/globals.css
git commit -m "feat: replace color tokens with warm forest palette and add design utilities"
```

---

## Task 2: Typography — Outfit + DM Sans

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 2.1: Swap fonts in `app/layout.tsx`**

Replace the existing content of `app/layout.tsx` with:

```tsx
import type React from "react"
import type { Metadata } from "next"
import { Outfit, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400"],
})

export const metadata: Metadata = {
  title: "Zalaegerszegi Nordmann Fenyők - Karácsonyfák",
  description:
    "Nordmann karácsonyfák Zalaegerszeg határában. Családias hangulat, barátoknak és ismerősöknek, beszélgetéssel – nem futószalagon.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png",  media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg",             type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Navigation />
        {/* pt-16 compensates for the fixed nav (h-16) so content on all pages isn't hidden underneath it */}
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 2.2: Verify build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 2.3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: swap Geist for Outfit + DM Sans typography"
```

---

## Task 3: Glassmorphism Navigation

**Files:**
- Modify: `components/navigation.tsx`

- [ ] **Step 3.1: Rewrite navigation component**

Replace the entire content of `components/navigation.tsx` with:

```tsx
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { label: "Kezdőlap",       href: "/" },
  { label: "Hogyan működik?", href: "/how-it-works" },
  { label: "Fenyőink",       href: "/trees" },
  { label: "Időpontfoglalás", href: "/booking" },
  { label: "GYIK",           href: "/faq" },
  { label: "Elérhetőség",    href: "/contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinkClass = scrolled
    ? "nav-link px-3 py-2 text-sm font-medium tracking-wide uppercase text-foreground"
    : "nav-link px-3 py-2 text-sm font-medium tracking-wide uppercase text-white"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className={`text-lg font-bold transition-colors duration-300 ${scrolled ? "text-primary" : "text-white"}`}>
              Zalaegerszegi
              <br className="hidden sm:block" />
              <span className="text-sm font-semibold">Nordmann Fenyők</span>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className={`ml-4 bg-transparent transition-colors duration-300 ${
                  scrolled ? "" : "border-white/50 text-white hover:bg-white/10"
                }`}
              >
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${
            scrolled
              ? "bg-background/95 backdrop-blur-md"
              : "bg-black/70 backdrop-blur-md rounded-b-lg"
          }`}>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 uppercase tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 px-3">
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-white/50 text-white bg-transparent hover:bg-white/10">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
```

Then add the `.nav-link` hover animation to `app/globals.css`, inside the typography section appended in Task 1 (add after `.section-label` block):

```css
/* ── Nav link hover underline ────────────────── */
.nav-link {
  position: relative;
  transition: color 0.2s ease;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0.75rem;
  right: 0.75rem;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease-out;
}
.nav-link:hover::after { transform: scaleX(1); }
```

- [ ] **Step 3.2: Verify build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 3.3: Commit**

```bash
git add components/navigation.tsx app/globals.css
git commit -m "feat: glassmorphism nav with scroll-aware transparency and link hover animation"
```

---

## Task 4: New Utility Components

**Files:**
- Create: `components/ui/spotlight-card.tsx`
- Create: `components/ui/animate-on-scroll.tsx`

- [ ] **Step 4.1: Create `components/ui/spotlight-card.tsx`**

```tsx
"use client"

import { useRef } from "react"

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`)
    ref.current.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className ?? ""}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4.2: Create `components/ui/animate-on-scroll.tsx`**

```tsx
"use client"

import { useEffect, useRef } from "react"

interface AnimateOnScrollProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimateOnScroll({ children, delay = 0, className }: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view")
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }} // transitionDelay, NOT animationDelay — CSS uses transition
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4.3: Verify build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 4.4: Commit**

```bash
git add components/ui/spotlight-card.tsx components/ui/animate-on-scroll.tsx
git commit -m "feat: add SpotlightCard and AnimateOnScroll utility components"
```

---

## Task 5: Ken Burns Hero

**Files:**
- Modify: `app/page.tsx` (hero section only — lines 1–30 roughly)

- [ ] **Step 5.1: Replace the hero section in `app/page.tsx`**

The hero is the first `<section>` in `app/page.tsx`. Replace it (from `{/* Hero Section */}` through its closing `</section>`) with:

```tsx
{/* Hero Section — Ken Burns slideshow */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Slides */}
  {[
    { src: "/christmas-tree-forest-field-zalaegerszeg.jpg", alt: "Nordmann fenyőerdő Zalaegerszeg határában", anim: "ken-burns-1" },
    { src: "/nordmann-christmas-tree-family-farm.jpg",      alt: "Família a fenyőfarmon karácsonyfa választás közben", anim: "ken-burns-2" },
    { src: "/nordmann-christmas-tree-close-up-green.jpg",   alt: "Nordmann fenyő közelkép, dús zöld tűlevelek",       anim: "ken-burns-3" },
  ].map((slide, i) => (
    <div
      key={slide.src}
      className={`absolute inset-0 transition-opacity duration-1000 ${activeSlide === i ? "opacity-100" : "opacity-0"}`}
    >
      {/* NOTE: animate-[...] with hyphenated keyframe names (ken-burns-1 etc.) relies on the keyframes
          being defined in globals.css. If the animation doesn't apply, verify via DevTools that the
          @keyframes block exists. Fallback: replace with a dedicated CSS class per slide. */}
      <img
        src={slide.src}
        alt={slide.alt}
        className={`w-full h-full object-cover ${activeSlide === i ? `animate-[${slide.anim}_10s_ease-in-out_infinite_alternate]` : ""}`}
      />
    </div>
  ))}

  {/* Gradient overlays — top band for nav legibility, bottom for headline */}
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none"
    style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%)" }}
  />
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none"
    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)" }}
  />

  {/* Grain texture overlay */}
  <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.04]">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </div>

  {/* Hero content */}
  <div className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
      {"Nordmann karácsonyfák Zalaegerszeg határában".split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.25em]"
          style={{
            animation: "fade-in-up 0.6s var(--ease-premium) both",
            animationDelay: `${i * 0.08}s`,
          }}
        >
          {word}
        </span>
      ))}
    </h1>
    <p
      className="text-lg sm:text-xl text-white/80 mb-10"
      style={{ animation: "fade-in-up 0.6s var(--ease-premium) 0.6s both" }}
    >
      Családias hangulat, barátoknak és ismerősöknek, beszélgetéssel – nem futószalagon.
    </p>
    <div
      className="flex flex-col sm:flex-row gap-4 justify-center"
      style={{ animation: "fade-in-up 0.6s var(--ease-premium) 0.8s both" }}
    >
      <Link href="/booking">
        <Button size="lg" className="w-full sm:w-auto bg-white text-foreground hover:bg-white/90 font-semibold">
          Időpontfoglalás
        </Button>
      </Link>
      <Link href="/how-it-works">
        <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/60 text-white bg-transparent hover:bg-white/10">
          Hogyan működik?
        </Button>
      </Link>
    </div>
  </div>

  {/* Slide dots */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
    {[0, 1, 2].map((i) => (
      <button
        key={i}
        onClick={() => setActiveSlide(i)}
        aria-label={`${i + 1}. dia`}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          activeSlide === i ? "bg-white w-6" : "bg-white/40"
        }`}
      />
    ))}
  </div>

  {/* Scroll indicator */}
  <div
    aria-hidden="true"
    className="absolute right-6 bottom-12 hidden md:flex flex-col items-center gap-2 text-white/60"
    style={{ animation: "fade-in-up 0.6s var(--ease-premium) 1.2s both" }}
  >
    <span className="text-xs tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>Scroll</span>
    <div className="w-px h-12 bg-white/40" style={{ animation: "pulse-line 2s ease-in-out infinite" }} />
  </div>
</section>
```

- [ ] **Step 5.2: Add `activeSlide` state to the component**

The home page is currently a server component (no `"use client"`). Because the hero requires state, add `"use client"` at the top and add the state + interval effect.

At the very top of `app/page.tsx`, before the imports, add:

```tsx
"use client"
```

After the existing imports, add:

```tsx
import { useState, useEffect } from "react"
```

At the top of the `HomePage` function body, before the `return`, add:

```tsx
const [activeSlide, setActiveSlide] = useState(0)

useEffect(() => {
  const timer = setInterval(() => {
    setActiveSlide((s) => (s + 1) % 3)
  }, 5000)
  return () => clearInterval(timer)
}, [])
```

- [ ] **Step 5.3: Verify build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 5.4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: Ken Burns hero slideshow with text reveal and scroll indicator"
```

---

## Task 6: Home Page — Cards, Marquee & Scroll Animations

**Files:**
- Modify: `app/page.tsx` (remaining sections)

- [ ] **Step 6.1: Add imports for new components**

At the top of `app/page.tsx`, add these imports:

```tsx
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"
```

- [ ] **Step 6.2: Remodel the "Why Us" section**

Replace the `{/* Why Choose Us Section */}` block with:

```tsx
{/* Why Choose Us Section */}
<section className="py-24 sm:py-32 bg-secondary/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <AnimateOnScroll>
      <div className="section-label">Miért minket?</div>
      <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-12">A mi különlegességünk</h2>
    </AnimateOnScroll>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          icon: <TreePine className="h-8 w-8 text-accent flex-shrink-0 mt-1" />,
          title: "Csak Nordmann fenyő",
          body: "A legkiválóbb minőségű karácsonyfát biztosítunk, amely tűlevél-tartással és dús formával rendelkezik.",
        },
        {
          icon: <Heart className="h-8 w-8 text-accent flex-shrink-0 mt-1" />,
          title: "Egységes ár: 8000 Ft",
          body: "Mérettől függetlenül minden fa ugyanaz az ár. Nincs rejtett költség, csak tiszta, korrekt árazás.",
        },
        {
          icon: <Users className="h-8 w-8 text-accent flex-shrink-0 mt-1" />,
          title: "Nyugodt, beszélgetős hangulat",
          body: "Nem a gyorsaság a cél. Van idő körbenézni, beszélgetni, és valódi karácsonyvároszt élni meg.",
        },
        {
          icon: <MapPin className="h-8 w-8 text-accent flex-shrink-0 mt-1" />,
          title: "Biztosan azt kapod, amit kinéztél",
          body: "Előre kiválasztott és megjelölt fa. Nem kell féltened, hogy mások vesznek el a kiválasztottat.",
        },
      ].map((card, i) => (
        <AnimateOnScroll key={card.title} delay={i * 100}>
          <SpotlightCard className="bg-card border border-border rounded-lg p-6 h-full">
            <div className="flex gap-4">
              {card.icon}
              <div>
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-foreground/70">{card.body}</p>
              </div>
            </div>
          </SpotlightCard>
        </AnimateOnScroll>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 6.3: Remodel the "About" section**

Replace `{/* About Section */}` with:

```tsx
{/* About Section */}
<section className="py-24 sm:py-32 bg-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <AnimateOnScroll>
        <div className="section-label">Rólunk</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">Egy kis family farm a város szélén</h2>
        <p className="text-foreground/70 mb-4">
          Egy kis családi fenyőfarmműködtetés a Zalaegerszeg határán. Szeretjük azt, amit csinálunk, és
          szeretnénk, ha te is szeretned azt az élményt, amely itt születik.
        </p>
        <p className="text-foreground/70 mb-6">
          Nincsen utcacím vagy házszám – a hely egy kis erdő a város szélén. Minden vendég GPS koordináták alapján
          érkezik meg, és személyesen fogadjuk őket.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90">Térkép és megközelítés</Button>
          </Link>
          <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Kövess Facebookon</Button>
          </a>
        </div>
      </AnimateOnScroll>
      <AnimateOnScroll delay={200}>
        <div className="bg-secondary/30 rounded-lg aspect-square overflow-hidden">
          <img
            src="/nordmann-christmas-tree-family-farm.jpg"
            alt="A família a zalaegerszegi fenyőfarmon"
            className="w-full h-full object-cover"
          />
        </div>
      </AnimateOnScroll>
    </div>
  </div>
</section>
```

- [ ] **Step 6.4: Add the marquee strip**

Between the About section and the Facebook section, insert:

```tsx
{/* Marquee strip */}
<div aria-hidden="true" className="bg-foreground py-4 overflow-hidden">
  <div className="marquee-track">
    {"Nordmann · Zalaegerszeg · 8 000 Ft · Csak Nordmann fenyő · Időpontfoglalás · ".repeat(4)}
  </div>
</div>
```

- [ ] **Step 6.5: Remodel the Facebook/CTA section**

Replace `{/* Facebook Section */}` with:

```tsx
{/* CTA Section */}
<section className="py-24 sm:py-32 bg-secondary/20">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <AnimateOnScroll>
      <div className="section-label">Kövess minket</div>
      <h2 className="text-3xl font-bold text-primary mb-4">Friss képek és hírek</h2>
      <p className="text-lg text-foreground/70 mb-8">
        Aktuális nyitva tartásért és szezoni képekért kövess Facebookon.
      </p>
      <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Facebook oldal megnyitása
        </Button>
      </a>
    </AnimateOnScroll>
  </div>
</section>
```

- [ ] **Step 6.6: Verify build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 6.7: Commit**

```bash
git add app/page.tsx
git commit -m "feat: remodel home page sections with spotlight cards, marquee, and scroll animations"
```

---

## Task 7: Trees Page Remodel

**Files:**
- Modify: `app/trees/page.tsx`

- [ ] **Step 7.1: Add `"use client"` directive and new imports**

At the very top of `app/trees/page.tsx`, add:

```tsx
"use client"

import { SpotlightCard } from "@/components/ui/spotlight-card"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"
```

The existing `import { Card } from "@/components/ui/card"` line will be removed in Step 7.3 once the cards are replaced (the price section uses a plain `<div>`, not `<Card>`).

- [ ] **Step 7.2: Add section label to the page header**

Replace the trees hero section:
```tsx
{/* Hero */}
<section className="py-12 sm:py-16 bg-secondary/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Nordmann Fenyőink</h1>
    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
      Minden fa gondosan gondozva és kiválasztva az ideális karácsonyhoz.
    </p>
  </div>
</section>
```

With:

```tsx
{/* Hero */}
<section className="py-24 sm:py-32 bg-secondary/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <AnimateOnScroll>
      <div className="section-label">Kínálatunk</div>
      <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Nordmann Fenyőink</h1>
      <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
        Minden fa gondosan gondozva és kiválasztva az ideális karácsonyhoz.
      </p>
    </AnimateOnScroll>
  </div>
</section>
```

- [ ] **Step 7.3: Wrap tree variant cards with SpotlightCard and remove unused Card import**

Find the `{/* Tree Variants */}` section. The cards are rendered with `<Card>`. Replace each `<Card className="p-6">` wrapper with `<SpotlightCard className="bg-card border border-border rounded-lg p-6 h-full">` and wrap each in `<AnimateOnScroll delay={index * 100}>`.

The tree variants are mapped with `.map((variant, index) => ...)`. Wrap:

```tsx
// Before:
<Card className="p-6">
  ...card content...
</Card>

// After:
<AnimateOnScroll delay={index * 100}>
  <SpotlightCard className="bg-card border border-border rounded-lg p-6 h-full">
    ...card content...
  </SpotlightCard>
</AnimateOnScroll>
```

Also add a section label above the tree variants heading. Before the `<h2>` tag in that section, add:
```tsx
<div className="section-label">Méretek és árak</div>
```

**Also remove the now-unused `Card` import** — the price section uses a plain `<div>`, not `<Card>`. Delete the line:
```tsx
import { Card } from "@/components/ui/card"
```

- [ ] **Step 7.4: Verify build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 7.5: Commit**

```bash
git add app/trees/page.tsx
git commit -m "feat: remodel trees page with spotlight cards and editorial headers"
```

---

## Task 8: How-It-Works Page Remodel

**Files:**
- Modify: `app/how-it-works/page.tsx`

- [ ] **Step 8.1: Add `"use client"` and new imports**

At the very top of `app/how-it-works/page.tsx`, add:

```tsx
"use client"

import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"
```

- [ ] **Step 8.2: Replace hero section with editorial header**

Replace:

```tsx
{/* Hero */}
<section className="py-12 sm:py-16 bg-secondary/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Hogyan működik?</h1>
    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
      Lépésről lépésre végig megy az egész folyamaton, az online foglalástól az átvételig.
    </p>
  </div>
</section>
```

With:

```tsx
{/* Hero */}
<section className="py-24 sm:py-32 bg-secondary/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <AnimateOnScroll>
      <div className="section-label">A folyamat</div>
      <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Hogyan működik?</h1>
      <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
        Lépésről lépésre végig megy az egész folyamaton, az online foglalástól az átvételig.
      </p>
    </AnimateOnScroll>
  </div>
</section>
```

- [ ] **Step 8.3: Replace steps section with editorial oversized-number layout**

Replace the entire `{/* Steps */}` section with:

```tsx
{/* Steps */}
<section className="py-24 sm:py-32 bg-background">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="space-y-16">
      {steps.map((step, index) => (
        <AnimateOnScroll key={step.number} delay={index * 120}>
          <div className="relative flex gap-8 items-start">
            {/* Oversized background number */}
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-6 text-[8rem] font-bold leading-none text-foreground/[0.06] select-none pointer-events-none"
            >
              {step.number}
            </div>
            {/* Step badge */}
            <div className="relative flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-accent text-accent-foreground font-bold text-lg z-10">
              {step.number}
            </div>
            {/* Content */}
            <div className="relative z-10 pt-1">
              <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{step.description}</p>
            </div>
          </div>
        </AnimateOnScroll>
      ))}
    </div>

    {/* CTA — preserve from original page, primary conversion action */}
    <div className="mt-12 text-center">
      <Link href="/booking">
        <Button size="lg" className="bg-accent hover:bg-accent/90">
          Időpontfoglalás
        </Button>
      </Link>
    </div>
  </div>
</section>
```

Also ensure `Link` and `Button` imports are present at the top of the file (they are in the original, keep them).

- [ ] **Step 8.4: Verify build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 8.5: Commit**

```bash
git add app/how-it-works/page.tsx
git commit -m "feat: remodel how-it-works page with editorial step layout and scroll animations"
```

---

## Task 9: Final Verification

- [ ] **Step 9.1: Full production build**

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run build 2>&1
```

Expected: All pages compile. Zero TypeScript errors. Zero CSS errors.

- [ ] **Step 9.2: Smoke-test admin is unaffected**

Start dev server and verify:

```bash
cd /Users/regenyimatyas/Documents/MySelf/tonyas-fa && npm run dev &
sleep 3
curl -s http://localhost:3000/admin-login | grep -q "admin" && echo "Admin login OK" || echo "Admin login BROKEN"
curl -s http://localhost:3000/ | grep -q "Nordmann" && echo "Home OK" || echo "Home BROKEN"
```

- [ ] **Step 9.3: Final commit**

```bash
git add docs/superpowers/specs/ docs/superpowers/plans/
git commit -m "docs: add remodel design spec and implementation plan"
```

---

## Implementation Notes

1. **`"use client"` on `app/page.tsx`** — adding it converts the home page to a client component. This is fine because it doesn't fetch server-side data (all data comes from the booking/admin API routes which are separate).

2. **Ken Burns animation syntax** — Tailwind CSS 4 supports arbitrary animation values: `animate-[ken-burns-1_10s_ease-in-out_infinite_alternate]`. The keyframe name `ken-burns-1` must exactly match what's defined in `globals.css`. If animations don't apply, verify in browser DevTools that the `@keyframes ken-burns-1` block is present in the computed styles.

3. **`marquee-scroll` animation duration** — The marquee content is `.repeat(4)` so the string is 4× duplicated. The animation covers `-50%` translateX (half the doubled content). If the text feels too fast/slow, adjust `20s` in the `marquee-track` animation rule in `globals.css`.

4. **Mobile nav** — When transparent and `isOpen` is true, the mobile dropdown uses `bg-black/70 backdrop-blur-md` so links remain readable over the hero image. When scrolled, the dropdown uses `bg-background/95 backdrop-blur-md` so links are readable on non-hero pages.

5. **Dark mode** — The `ThemeProvider` component exists in the codebase but is not currently wired into `app/layout.tsx`. The dark mode CSS tokens defined in `globals.css` will not activate until `ThemeProvider` is added to the layout. This is a pre-existing condition, not introduced by this plan. The tokens are correct and will work once wired up.

6. **Typography rules outside `@layer base`** — The `h1–h6`, `body`, `.section-label` and other rules added in Step 1.4 are intentionally placed outside `@layer base`. This gives them higher specificity than Tailwind's base layer while still being overridable by utility classes. Do not move them into `@layer base`.

7. **SpotlightCard with interactive children** — The `::before` glow layer uses `z-index: 0`. If you ever place interactive elements (inputs, buttons) directly inside a `SpotlightCard`, wrap them in `<div className="relative z-10">` to ensure they paint above the glow layer.
