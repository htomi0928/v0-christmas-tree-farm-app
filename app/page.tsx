"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TreePine, Heart, MapPin, Users } from "lucide-react"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

const slides = [
  { src: "/christmas-tree-forest-field-zalaegerszeg.jpg", alt: "Nordmann fenyőerdő Zalaegerszeg határában",        anim: "ken-burns-1" },
  { src: "/nordmann-christmas-tree-family-farm.jpg",      alt: "Família a fenyőfarmon karácsonyfa választás közben", anim: "ken-burns-2" },
  { src: "/nordmann-christmas-tree-close-up-green.jpg",   alt: "Nordmann fenyő közelkép, dús zöld tűlevelek",       anim: "ken-burns-3" },
]

const cards = [
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
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${activeSlide === i ? "opacity-100" : "opacity-0"}`}
          >
            {/* NOTE: animate-[...] with hyphenated keyframe names relies on keyframes defined in globals.css.
                If animations don't apply, verify via DevTools that @keyframes ken-burns-* blocks exist. */}
            <img
              src={slide.src}
              alt={slide.alt}
              className={`w-full h-full object-cover ${activeSlide === i ? `animate-[${slide.anim}_10s_ease-in-out_infinite_alternate]` : ""}`}
            />
          </div>
        ))}

        {/* Gradient overlay — top band for nav legibility (≥4.5:1 for white text) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%)" }}
        />
        {/* Gradient overlay — bottom band for headline legibility */}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-12">A mi különlegességünk</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
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
    </div>
  )
}
