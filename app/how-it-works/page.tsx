"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Online napfoglalás",
      description: "Kiválasztasz egy szombatot vagy vasárnapot. Nem kell pontos időpont — 10 és 12 között érkezhetsz.",
    },
    {
      number: "02",
      title: "Kijössz a fenyvesbe, fát választasz",
      description: "Körbenéztek, kiválasztod, amelyik tetszik. Mindegyik más — van idő megnézni.",
    },
    {
      number: "03",
      title: "Megjelöljük a fát sorszámmal",
      description: "Számot kap a fád, bekerül a rendszerbe. Senki más nem veheti el.",
    },
    {
      number: "04",
      title: "Karácsony előtti hétvégén kivágjuk",
      description: "A kivágás akkor történik. Így kapsz tényleg friss fát.",
    },
    {
      number: "05",
      title: "Átvétel és fizetés a fenyvesben",
      description: "Sorszám alapján azonosítjuk, kész az átvételre. Készpénz vagy bankkártya. Több fát is elvihetsz.",
    },
  ]

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-14 sm:py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">A folyamat</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Hogyan működik?
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-xl">
              Az online foglalástól az átvételig — lépésről lépésre.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Steps */}
      <section className="py-10 sm:py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {steps.map((step, index) => (
            <AnimateOnScroll key={step.number} delay={index * 80}>
              <div className={`flex gap-6 items-start py-8 ${index < steps.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-sm font-bold text-muted-foreground/40 w-8 flex-shrink-0 mt-0.5 tabular-nums">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{step.description}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/booking">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                Időpontfoglalás
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
