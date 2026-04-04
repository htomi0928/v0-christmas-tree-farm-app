import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { treeSizeExamples } from "@/lib/site"

const facts = [
  "Csak nordmann fenyő érhető el.",
  "Minden fa ára egységesen 8000 Ft.",
  "A kiválasztott fa sorszámos jelölést kap.",
  "Egy foglalással több fa is választható.",
]

export default function TreesPage() {
  return (
    <div>
      <section className="section-space">
        <div className="page-shell grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="section-kicker">Fenyőink</p>
            <h1 className="section-title">Nálunk kizárólag nordmann fenyő közül választasz.</h1>
            <p className="section-subtitle mt-5">A kínálat tudatosan egyszerű: nem kell fajták között lavírozni, csak azt nézni, melyik forma, magasság és karakter illik legjobban az otthonotokhoz.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {facts.map((fact, index) => (
                <div key={fact} className={`${index % 2 === 0 ? "tint-sky" : "tint-berry"} px-4 py-4 text-sm font-medium text-foreground/78`}>
                  {fact}
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[450px] overflow-hidden rounded-[32px] border border-white/60 shadow-[0_28px_80px_rgba(16,39,32,0.14)]">
            <Image src="/nordmann-christmas-tree-close-up-green.jpg" alt="Nordmann fenyő közelről" fill className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,39,32,0.82),rgba(16,39,32,0.1))]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-white/72">Nordmann fenyő</p>
              <p className="mt-2 text-2xl font-semibold">Dús, szép tartású, sokak kedvence.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="page-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="overflow-hidden bg-[linear-gradient(180deg,#12382f,#0c241f)] px-8 py-8 text-primary-foreground">
            <div className="px-6">
              <p className="text-sm uppercase tracking-[0.22em] text-white/72">Egységes ár</p>
              <div className="mt-5 flex items-end gap-3"><span className="text-6xl font-semibold text-white sm:text-7xl">8000</span><span className="pb-2 text-2xl font-semibold text-white/86">Ft / fa</span></div>
              <p className="mt-5 text-base leading-7 text-white/80">Mérettől függetlenül minden kiválasztott nordmann fenyő ugyanannyiba kerül. Ez egyszerűvé teszi a döntést, és már előre pontosan tudható a költség.</p>
            </div>
          </Card>

          <Card className="tint-forest px-7 py-7">
            <div className="grid gap-5 px-6 md:grid-cols-3">
              {treeSizeExamples.map((item, index) => (
                <div key={item.label} className={`${index === 1 ? "bg-[rgba(241,223,182,0.72)]" : "bg-white/78"} rounded-3xl border border-primary/8 p-5`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary"><Ruler className="h-5 w-5" /></div>
                  <h2 className="mt-4 text-2xl font-semibold text-primary">{item.label}</h2>
                  <p className="mt-2 text-lg font-semibold text-accent">{item.height}</p>
                  <p className="mt-3 text-sm leading-6 text-foreground/72">{item.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="page-shell">
          <Card className="tint-berry px-8 py-8">
            <div className="grid gap-6 px-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="section-kicker">A választás megkönnyítésére</p>
                <h2 className="text-4xl font-semibold text-primary">A méret változhat, az élmény és az ár ugyanaz marad.</h2>
                <p className="mt-4 text-base leading-7 text-foreground/72">Ha több fát szeretnétek családtagoknak vagy barátoknak, azt egy foglalással is meg tudjátok oldani. A várható darabszámot elég előre jelezni.</p>
              </div>
              <Button asChild size="lg"><Link href="/booking">Foglalás indítása<ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
