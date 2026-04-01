"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: "Online napfoglalás",
      description:
        "A vendég kiválaszt egy szombat vagy vasárnapot, amikor 10:00 és 12:00 között érkezik. Nem percre pontos időpont, csak a nap és az idősáv.",
    },
    {
      number: 2,
      title: "Kijössz a fenyvesbe, fát választasz",
      description:
        "Körbenéztek a fák között, kiválasztja a család a nekik tetsző fát. Mindegyik egyedi, és megtalálod azt, amely legjobban tetszik neked.",
    },
    {
      number: 3,
      title: "Megjelöljük a fát sorszámmal",
      description:
        "Címkét teszünk a kiválasztott fára, rajta sorszámmal. A rendszerben rögzítjük: név, telefonszám, nap, sorszám.",
    },
    {
      number: 4,
      title: "Karácsony előtti hétvégén kivágjuk",
      description:
        "A fa ekkor kerül kivágásra, és készen áll az átvételre. Ez biztosítja, hogy valóban friss fát kapsz.",
    },
    {
      number: 5,
      title: "Átvétel és fizetés a fenyvesben",
      description:
        "A foglalt fa sorszám alapján azonosítható és kész az átvételre. Fizetés: készpénz vagy bankkártya. Lehet több fát is elvinni családtagoknak.",
    },
  ]

  return (
    <div className="w-full">
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

      {/* Steps */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <AnimateOnScroll key={step.number} delay={index * 120}>
                <div className="relative flex gap-8 items-start">
                  {/* Oversized background step number — decorative, aria-hidden */}
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

          {/* CTA — primary conversion action, preserved from original */}
          <div className="mt-12 text-center">
            <Link href="/booking">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Időpontfoglalás
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
