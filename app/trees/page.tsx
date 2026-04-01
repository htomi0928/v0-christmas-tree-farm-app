"use client"

import { SpotlightCard } from "@/components/ui/spotlight-card"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

export default function TreesPage() {
  const treeVariants = [
    {
      number: "01",
      size: "Kisebb fa",
      height: "1–1,5 m",
      description: "Kisebb helyiségekbe, lakásokba. Nem nyomasztó, de pont elég.",
    },
    {
      number: "02",
      size: "Közepes fa",
      height: "1,5–2 m",
      description: "A legtöbben ezt viszik. Bármilyen nappaliba belefér.",
    },
    {
      number: "03",
      size: "Nagy fa",
      height: "2–2,5 m",
      description: "Erős jelenléte van. Nagyobb szobákba, ahol van neki hely.",
    },
    {
      number: "04",
      size: "Extra magas fa",
      height: "2,5 m felett",
      description: "Magasabb terű helyiségekbe. Ritka, de van belőlük.",
    },
  ]

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-14 sm:py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Kínálatunk</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Nordmann fenyőink
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-xl">
              Csak Nordmann. Mérettől függetlenül 8 000 Ft.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Why Nordmann */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll>
              <div className="section-label">A fajta</div>
              <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Miért Nordmann?</h2>
              <p className="text-muted-foreground mb-4 font-light">
                Nem hullik a tűje. Ez az egyetlen komoly különbség, ami számít, ha otthon szeretnéd tartani az ünnep
                után is.
              </p>
              <p className="text-muted-foreground mb-4 font-light">
                Dús forma, erős ágak — a nehezebb díszeket is elbírja. Gyerekbarát, nincs szúrós tűlevele.
              </p>
              <p className="text-muted-foreground font-light">
                Frissen vágva adjuk át. Nem hetekkel korábban vágott, ponyva alatt tárolt fa.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <div className="bg-secondary/30 rounded-lg aspect-square overflow-hidden">
                <img
                  src="/nordmann-christmas-tree-close-up-green.jpg"
                  alt="Nordmann fa közelről"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Price block */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="border border-border rounded-lg p-8 text-center">
              <p className="text-xs font-bold text-muted-foreground/40 tracking-widest mb-3 uppercase">Egységes ár</p>
              <p className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight">8 000 Ft</p>
              <p className="text-muted-foreground font-light mt-3">Mérettől függetlenül. Nincs tárgyalás, nincs meglepetés.</p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Tree Variants */}
      <section className="py-14 sm:py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Méretek</div>
            <h2 className="text-3xl font-bold text-foreground mb-8 tracking-tight">Mekkora fát keresel?</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {treeVariants.map((variant, index) => (
              <AnimateOnScroll key={variant.number} delay={index * 100}>
                <SpotlightCard className="bg-card border border-border rounded-lg p-6 h-full">
                  <p className="text-xs font-bold text-muted-foreground/40 mb-3 tracking-widest">{variant.number}</p>
                  <h3 className="font-semibold text-base mb-1 tracking-tight">{variant.size}</h3>
                  <p className="text-sm text-muted-foreground/60 font-light mb-2">{variant.height}</p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{variant.description}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Tip */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <p className="text-muted-foreground font-light">
              Egy foglalással több fát is elvihetsz — például szülőknek, szomszédoknak. Jelezd a várható darabszámot a
              foglalási űrlapon.
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
