import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

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
      <section className="py-12 sm:py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Hogyan működik?</h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Lépésről lépésre végig megy az egész folyamaton, az online foglalástól az átvételig.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-6">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent text-accent-foreground font-bold text-lg">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && <div className="w-1 h-16 bg-border mt-4" />}
                </div>
                <Card className="p-6 flex-1">
                  <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA */}
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
