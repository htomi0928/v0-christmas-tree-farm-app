"use client"

import { SpotlightCard } from "@/components/ui/spotlight-card"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

// Card import removed — replaced by SpotlightCard

export default function TreesPage() {
  const treeVariants = [
    { size: "Kisebb fa",    height: "1–1,5 m",  description: "Tökéletes kisebb szobákba vagy lakásokba." },
    { size: "Közepes fa",   height: "1,5–2 m",  description: "A legpopulárisabb választás, bármilyen lakásba illik." },
    { size: "Nagy fa",      height: "2–2,5 m",  description: "Nagyon szép, impozáns, és ideális nagyobb szobákba." },
    { size: "Extra magas fa", height: "2,5 m+", description: "Az igazi csodák. Álomszerű szépség minden nagy helyiségbe." },
  ]

  return (
    <div className="w-full">
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

      {/* Description */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll>
              <div className="section-label">A fajta</div>
              <h2 className="text-3xl font-bold text-primary mb-4">Miért Nordmann?</h2>
              <p className="text-foreground/70 mb-4">
                A Nordmann fenyő a legkedveltebb karácsonyfajta Közép-Európában. Tűlevél-tartása kiváló, soha nem szárad
                ki közvetlenül a karácsony után.
              </p>
              <p className="text-foreground/70 mb-4">
                Dús forma, kellemes zöld szín, és erős ágak, amelyek könnyűszerrel bírják a díszeket. Gyerekbarát, és az
                utolsó pillanatig friss marad.
              </p>
              <p className="text-foreground/70">
                Ideális a családoknak és mindazoknak, akik szeretik az igazi, friss karácsonyfa illatát és szépségét.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <div className="bg-secondary/30 rounded-lg aspect-square overflow-hidden">
                <img
                  src="/nordmann-christmas-tree-close-up-green.jpg"
                  alt="Nordmann fa közelről"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Price */}
      <section className="py-12 bg-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <div className="bg-accent text-accent-foreground p-8 rounded-lg">
              <p className="text-sm font-semibold mb-2">Minden fára</p>
              <p className="text-4xl sm:text-5xl font-bold">8000 Ft</p>
              <p className="text-sm mt-2">Mérettől függetlenül – nincs rejtett költség!</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Tree Variants */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Méretek és árak</div>
            <h2 className="text-3xl font-bold text-primary mb-12">Fák méretei</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {treeVariants.map((variant, index) => (
              <AnimateOnScroll key={index} delay={index * 100}>
                <SpotlightCard className="bg-card border border-border rounded-lg p-6 h-full">
                  <div className="bg-secondary/30 rounded-lg h-48 mb-4 overflow-hidden">
                    <img
                      src="/christmas-tree-.jpg"
                      alt={variant.size}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-1">{variant.size}</h3>
                  <p className="text-accent font-semibold mb-2">{variant.height}</p>
                  <p className="text-foreground/70">{variant.description}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <p className="text-lg text-foreground/70">
              <span className="font-semibold text-primary">Tipp:</span> Egy foglalással több fát is választhatsz – például
              családtagoknak vagy barátoknak. Jelezd a várható darabszámot a foglalási űrlapon.
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
