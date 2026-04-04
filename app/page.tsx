"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"
import MistBackground from "@/components/ui/mist-background"

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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16">
        {/* Hero image */}
        <img
          src="/spruce.webp"
          alt="Nordmann fenyőerdő"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* WebGL mist — sits between photo and dark gradients */}
        <MistBackground />

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
        <div className="absolute z-10 bottom-0 left-0 right-0 pb-10 sm:pb-14">
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
                <Button size="lg" className="w-full sm:w-auto h-12 px-7 text-base rounded-lg bg-white text-foreground hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.3)] active:translate-y-0 active:shadow-none font-semibold">
                  Időpontfoglalás
                </Button>
              </Link>
              <Link
                href="/how-it-works"
                className="cursor-pointer inline-flex items-center justify-center h-12 px-7 text-base font-normal text-white/75 border border-white/55 rounded-lg hover:text-white hover:border-white/80 transition-all duration-200 w-full sm:w-auto"
              >
                Hogyan működik?
              </Link>
            </div>
          </div>
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
      <section className="py-14 sm:py-20 bg-[#6e7f6a]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Miért minket?</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3a3a3a] mb-8 tracking-tight">A mi különlegességünk</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <AnimateOnScroll key={card.title} delay={i * 100}>
                <SpotlightCard className="bg-[#f5f4f1] border border-[#bfc3c7] rounded-lg p-6 h-full">
                  <p className="text-xs font-bold text-[#6e7f6a] mb-3 tracking-widest">{card.number}</p>
                  <h3 className="font-semibold text-base mb-2 tracking-tight text-[#3a3a3a]">{card.title}</h3>
                  <p className="text-sm text-[#4a4f4a] font-light leading-relaxed">{card.body}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-14 sm:py-20 bg-[#ededed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll>
              <div className="section-label">Rólunk</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#3a3a3a] mb-6 tracking-tight">
                Egy kis family farm<br />a város szélén
              </h2>
              <p className="text-[#4a4f4a] mb-4 font-light">
                Egy kis farm Zalaegerszeg határán. Nem ipar — a fák között van idő elbeszélgetni.
              </p>
              <p className="text-[#4a4f4a] mb-6 font-light">
                Nincs utcacím, nincs házszám. Egy kis erdő. Mindenki GPS-koordinátákkal érkezik, és mi személyesen fogadjuk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="h-12 px-7 text-base rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(74,79,74,0.25)] active:translate-y-0 active:shadow-none font-semibold">Térkép és megközelítés</Button>
                </Link>
                <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
                  <Button className="h-12 px-7 text-base rounded-lg border border-[#4a4f4a]/30 bg-transparent text-[#4a4f4a]/70 hover:bg-transparent hover:text-[#4a4f4a] hover:border-[#4a4f4a]/60 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-none font-normal">Kövess Facebookon</Button>
                </a>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <div className="bg-[#6e7f6a]/20 rounded-lg aspect-square overflow-hidden">
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
      <div aria-hidden="true" className="bg-primary py-4 overflow-hidden">
        <div className="marquee-track">
          {"Nordmann · Zalaegerszeg · 8 000 Ft · Csak Nordmann fenyő · Időpontfoglalás · ".repeat(4)}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-14 sm:py-20 bg-[#6e7f6a]/15">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <div className="section-label justify-center">Kövess minket</div>
            <h2 className="text-3xl font-bold text-[#3a3a3a] mb-4 tracking-tight">Ami éppen zajlik</h2>
            <p className="text-lg text-[#4a4f4a] mb-8 font-light">
              Ha tudni akarod, mikor nyitunk, vagy csak megnéznéd az idei fákat — Facebookon posztolunk.
            </p>
            <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
              <Button className="h-12 px-7 text-base rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(74,79,74,0.25)] active:translate-y-0 active:shadow-none font-semibold">
                Facebook oldal megnyitása
              </Button>
            </a>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
