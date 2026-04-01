"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

const slides = [
  { src: "/placeholder.jpg", alt: "Nordmann fenyőerdő",      anim: "ken-burns-1" },
  { src: "/placeholder.jpg", alt: "Fenyőfarm",               anim: "ken-burns-2" },
  { src: "/placeholder.jpg", alt: "Nordmann fenyő közelkép", anim: "ken-burns-3" },
]

const cards = [
  {
    number: "01",
    title: "Csak Nordmann fenyő",
    body: "A legjobb, amit találsz — tűlevél-tartással, dús formával, frissen vágva.",
  },
  {
    number: "02",
    title: "Egységes ár: 8 000 Ft",
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

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((s) => (s + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full">
      {/* Hero Section — Ken Burns slideshow */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16">
        {/* Slides */}
        {slides.map((slide, i) => (
          <div
            key={slide.src + i}
            className={`absolute inset-0 transition-opacity duration-1000 ${activeSlide === i ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className={`w-full h-full object-cover ${activeSlide === i ? `animate-[${slide.anim}_10s_ease-in-out_infinite_alternate]` : ""}`}
            />
          </div>
        ))}

        {/* Gradient overlay — top band for nav legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%)" }}
        />
        {/* Gradient overlay — bottom band for headline legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)" }}
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

        {/* Hero content — bottom-left anchored */}
        <div className="absolute z-10 bottom-0 left-0 right-0 pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <p
              className="text-xs font-medium tracking-[0.16em] uppercase text-white/50 mb-4"
              style={{ animation: "fade-in-up 0.5s var(--ease-premium) 0.2s both" }}
            >
              Zalaegerszeg · Nordmann fenyők
            </p>
            <h1
              className="text-5xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-[0.95] tracking-tight mb-6 max-w-2xl"
              style={{ animation: "fade-in-up 0.6s var(--ease-premium) 0.35s both" }}
            >
              Karácsonyfa,<br />ahogy kell.
            </h1>
            <p
              className="text-base sm:text-lg text-white/60 font-light mb-8 max-w-sm"
              style={{ animation: "fade-in-up 0.6s var(--ease-premium) 0.5s both" }}
            >
              Frissen vágva, személyesen fogadva.<br />Nem futószalagon.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-3"
              style={{ animation: "fade-in-up 0.6s var(--ease-premium) 0.65s both" }}
            >
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto bg-white text-foreground hover:bg-white/90 font-semibold">
                  Időpontfoglalás
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-white/75 hover:text-white hover:bg-transparent border-b border-white/30 rounded-none px-0 font-normal"
                >
                  Hogyan működik? →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-8 right-6 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              aria-label={`${i + 1}. dia`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === i ? "bg-white w-6" : "bg-white/40 w-2"
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

      {/* Why Choose Us Section */}
      <section className="py-24 sm:py-32 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Miért minket?</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 tracking-tight">A mi különlegességünk</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <AnimateOnScroll key={card.title} delay={i * 100}>
                <SpotlightCard className="bg-card border border-border rounded-lg p-6 h-full">
                  <p className="text-xs font-bold text-muted-foreground/40 mb-3 tracking-widest">{card.number}</p>
                  <h3 className="font-semibold text-base mb-2 tracking-tight">{card.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{card.body}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll>
              <div className="section-label">Rólunk</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
                Egy kis family farm<br />a város szélén
              </h2>
              <p className="text-muted-foreground mb-4 font-light">
                Egy kis farm Zalaegerszeg határán. Nem ipar — a fák között van idő elbeszélgetni.
              </p>
              <p className="text-muted-foreground mb-6 font-light">
                Nincs utcacím, nincs házszám. Egy kis erdő. Mindenki GPS-koordinátákkal érkezik, és mi személyesen fogadjuk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="bg-foreground text-background hover:bg-foreground/90">Térkép és megközelítés</Button>
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

      {/* Marquee strip */}
      <div aria-hidden="true" className="bg-foreground py-4 overflow-hidden">
        <div className="marquee-track">
          {"Nordmann · Zalaegerszeg · 8 000 Ft · Csak Nordmann fenyő · Időpontfoglalás · ".repeat(4)}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <div className="section-label">Kövess minket</div>
            <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Ami éppen zajlik</h2>
            <p className="text-lg text-muted-foreground mb-8 font-light">
              Ha tudni akarod, mikor nyitunk, vagy csak megnéznéd az idei fákat — Facebookon posztolunk.
            </p>
            <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                Facebook oldal megnyitása
              </Button>
            </a>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
