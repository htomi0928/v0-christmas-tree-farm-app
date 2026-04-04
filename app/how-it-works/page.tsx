"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Online napfoglalás",
      description: "Kiválasztasz egy szombatot vagy vasárnapot. 10 és 12 között érkezhetsz.",
    },
    {
      number: "02",
      title: "Kijössz, fát választasz",
      description: "Körbenéztek, kiválasztod, amelyik tetszik. Van idő megnézni.",
    },
    {
      number: "03",
      title: "Megjelöljük sorszámmal",
      description: "Számot kap a fád, bekerül a rendszerbe. Senki más nem veheti el.",
    },
    {
      number: "04",
      title: "Karácsony előtt kivágjuk",
      description: "A kivágás akkor történik. Így kapsz tényleg friss fát.",
    },
    {
      number: "05",
      title: "Átvétel és fizetés",
      description: "Sorszám alapján azonosítjuk. Készpénz vagy bankkártya.",
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — heading + CTA */}
          <div>
            <div className="section-label mb-3">A vásárlás folyamata</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
              Hogyan működünk?
            </h1>
            <p className="text-muted-foreground font-light mb-8 max-w-xs">
              Az online foglalástól az átvételig öt lépés.
            </p>
            <Link href="/booking">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                Időpontfoglalás
              </Button>
            </Link>
          </div>

          {/* Right — steps */}
          <div>
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex gap-5 items-start py-4 ${index < steps.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-xs font-bold text-muted-foreground/40 w-6 flex-shrink-0 mt-1 tabular-nums">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-0.5 tracking-tight">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
