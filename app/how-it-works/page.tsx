import Link from "next/link"
import { ArrowRight, BadgeCheck, CalendarRange, Scissors, Trees, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { howItWorksSteps } from "@/lib/site"

const icons = [CalendarRange, Trees, BadgeCheck, Scissors, Truck]

export default function HowItWorksPage() {
  return (
    <div>
      <section className="section-space">
        <div className="page-shell editorial-grid items-start">
          <div>
            <p className="section-kicker">Hogyan működik?</p>
            <h1 className="section-title">Lépésről lépésre átlátható, nyugodt és elegáns folyamat.</h1>
            <p className="section-subtitle mt-5">A foglalás nálunk nem feszes időbeosztást jelent, hanem egy kényelmes látogatási napot. Az egész rendszer arra épül, hogy legyen idő a választásra, és közben minden egyszerűen követhető maradjon.</p>
          </div>

          <Card className="bg-[linear-gradient(180deg,#12382f,#0c241f)] px-8 py-8 text-primary-foreground">
            <div className="px-6">
              <p className="text-sm uppercase tracking-[0.22em] text-white/68">Fontos tudnivaló</p>
              <h2 className="mt-2 text-2xl font-semibold">Nem percre pontos időpontot foglalsz.</h2>
              <p className="mt-3 text-base leading-7 text-white/80">Egy napot foglalsz, és aznap 10:00 és 12:00 között érkezel, amikor kényelmes. Így nincs kapkodás, és a választás valóban kellemes közös program marad.</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="page-shell">
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="tint-sky p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--sky-strong)]">Nyugodt szervezés</p>
              <p className="mt-3 text-2xl font-semibold text-primary">Az érkezési sáv azért kényelmes, mert nem kell mindenkinek ugyanarra a percre figyelni.</p>
            </div>
            <div className="tint-berry p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--berry-strong)]">Átlátható rendszer</p>
              <p className="mt-3 text-2xl font-semibold text-primary">A kiválasztott fa sorszámot kap, a folyamat minden pontja követhető, ezért a vásárló végig biztonságban érzi magát.</p>
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl before:absolute before:bottom-0 before:left-7 before:top-6 before:hidden before:w-px before:bg-primary/10 lg:before:block">
            <div className="space-y-5">
              {howItWorksSteps.map((step, index) => {
                const Icon = icons[index]
                const tints = ["tint-sky", "tint-forest", "tint-berry", "tint-sky", "tint-forest"]
                return (
                  <div key={step.title} className="grid gap-4 lg:grid-cols-[92px_1fr] lg:gap-6">
                    <div className="relative z-10 flex items-start lg:justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(145deg,#173f35,#255246)] text-primary-foreground shadow-[0_14px_30px_rgba(16,39,32,0.16)]">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <Card className={`px-7 py-7 ${tints[index]}`}>
                      <div className="px-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{String(index + 1).padStart(2, "0")}. lépés</p>
                        <h2 className="mt-3 text-3xl font-semibold text-primary">{step.title}</h2>
                        <p className="mt-4 text-base leading-7 text-foreground/74">{step.description}</p>
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-12 flex justify-center"><Button asChild size="lg"><Link href="/booking">Időpontfoglalás<ArrowRight className="h-4 w-4" /></Link></Button></div>
        </div>
      </section>
    </div>
  )
}
