import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BadgeCheck, CalendarClock, Facebook, MapPinned, Trees, WalletCards } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { facebookUrl, publicHighlights } from "@/lib/site"

const trustCards = [
  {
    title: "Csak nordmann fenyő",
    text: "Nálunk egyféle fa van: szép formájú, dús nordmann, amit könnyű szeretni és öröm hazavinni.",
    icon: Trees,
    tint: "tint-sky",
  },
  {
    title: "Egységes ár: 8000 Ft / fa",
    text: "Mérettől függetlenül minden fa ugyanannyiba kerül, így nincs bizonytalanság vagy helyszíni meglepetés.",
    icon: WalletCards,
    tint: "tint-berry",
  },
  {
    title: "Előre megjelölt fa",
    text: "A helyszínen sorszámos címkével jelöljük meg a kiválasztott fát, így később is ugyanaz vár vissza.",
    icon: BadgeCheck,
    tint: "tint-forest",
  },
  {
    title: "Nyugodt hétvégi látogatás",
    text: "Napot foglalsz, nem percet. 10:00 és 12:00 között érkezel, amikor kényelmes, futószalag-érzés nélkül.",
    icon: CalendarClock,
    tint: "tint-sky",
  },
]

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/christmas-tree-forest-field-zalaegerszeg.jpg" alt="Nordmann fenyők Zalaegerszeg közelében" fill priority className="object-cover scale-[1.04]" />
          <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(12,36,31,0.9),rgba(20,59,50,0.76)_42%,rgba(20,59,50,0.24))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(197,155,77,0.34),transparent_30%)]" />
        </div>

        <div className="page-shell relative py-18 sm:py-24 lg:py-30">
          <div className="max-w-4xl text-white">
            <p className="eyebrow-stat">Zalaegerszeg közelében • családi vállalkozás • csak nordmann</p>
            <h1 className="mt-6 max-w-4xl text-5xl leading-[0.92] font-semibold sm:text-6xl lg:text-[6.2rem]">
              Téli erdei hangulat, karakteres fenyők és nyugodt választás.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
              Hétvégén kijöttök a fenyvesbe, kiválasztjátok a fát, sorszámmal megjelöljük, és később frissen kivágva vehetitek át. Meleg, emberi és kicsit ünnepi élmény, nem sablonos vásárlás.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-[linear-gradient(135deg,#f6e3b7,#c59b4d)] text-primary hover:brightness-105">
                <Link href="/booking">
                  Időpontfoglalás
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/28 bg-white/12 text-white hover:bg-white/18 hover:text-white">
                <Link href="/how-it-works">Hogyan működik?</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {publicHighlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/14 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] px-4 py-3 text-sm font-medium text-white/92 backdrop-blur-sm shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="mb-10 max-w-3xl">
            <p className="section-kicker">Bizalom és karakter</p>
            <h2 className="section-title">Színesebb, gazdagabb jelenlét, de továbbra is emberi hangon.</h2>
            <p className="section-subtitle mt-4">
              Az oldal most tudatosabban vállalja a hangulatot: melegebb fények, mélyebb zöldek, több tónus, több képi ritmus. Ettől különlegesebb lett, miközben az információ továbbra is gyorsan megtalálható.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trustCards.map((card) => (
              <Card key={card.title} className={`h-full overflow-hidden px-0 py-0 ${card.tint}`}>
                <div className="h-1.5 bg-[linear-gradient(90deg,#c59b4d,#1f5a4a,#c9a7b7)]" />
                <div className="px-6 py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(197,155,77,0.22),rgba(18,56,47,0.12))] text-primary">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-primary">{card.title}</h3>
                  <p className="mt-3 text-base leading-7 text-foreground/74">{card.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="page-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="tint-berry p-6 sm:p-8">
            <p className="section-kicker">Családias fenyves</p>
            <h2 className="text-4xl font-semibold text-primary sm:text-5xl">Nem csak megveszitek a fát, hanem megérkeztek egy hangulatba.</h2>
            <p className="mt-5 text-lg leading-8 text-foreground/74">
              A legtöbben ismerősök, barátok vagy visszatérő vásárlók révén érkeznek hozzánk. Ez meg is látszik a légkörön: van idő körbejárni, kérdezni, összehasonlítani, és végül nyugodtan dönteni.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-primary/10 bg-white/70 p-4 text-sm leading-6 text-foreground/76">Napot foglalsz, nem percet, ezért nincs futószalag-érzés.</div>
              <div className="rounded-[24px] border border-primary/10 bg-white/70 p-4 text-sm leading-6 text-foreground/76">A megközelítés Google Maps alapján egyszerű, és telefonon is segítünk.</div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/contact">Elérhetőség és megközelítés<MapPinned className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook oldal<Facebook className="h-4 w-4" /></a></Button>
            </div>
          </div>

          <div className="relative min-h-[480px] overflow-hidden rounded-[34px] border border-white/50 shadow-[0_34px_90px_rgba(12,36,31,0.18)]">
            <Image src="/nordmann-christmas-tree-family-farm.jpg" alt="Családias hangulatú fenyves" fill className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,36,31,0.86),rgba(12,36,31,0.12))]" />
            <div className="absolute left-0 right-0 top-0 flex justify-between p-6 text-white/88">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-sm">Valódi fenyves</span>
              <span className="rounded-full bg-[rgba(197,155,77,0.22)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-sm">Prémium hangulat</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.18em] text-white/72">Egyszerű folyamat</p>
              <p className="mt-3 text-3xl font-semibold">Kijöttök, választotok, megjelöljük, később átveszitek.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="page-shell grid gap-6 lg:grid-cols-3">
          <div className="tint-forest p-7 lg:col-span-2">
            <p className="section-kicker">Miért működik jól?</p>
            <h2 className="text-4xl font-semibold text-primary sm:text-5xl">Egyszerű üzleti tények, szépen tálalva.</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-white/78 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Ár</p>
                <p className="mt-2 text-3xl font-semibold text-primary">8000 Ft</p>
                <p className="mt-2 text-sm leading-6 text-foreground/72">Minden fa egységes áron.</p>
              </div>
              <div className="rounded-[24px] bg-white/78 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Fajta</p>
                <p className="mt-2 text-3xl font-semibold text-primary">Nordmann</p>
                <p className="mt-2 text-sm leading-6 text-foreground/72">Nincs túl sok döntési pont.</p>
              </div>
              <div className="rounded-[24px] bg-white/78 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Látogatás</p>
                <p className="mt-2 text-3xl font-semibold text-primary">10-12 óra</p>
                <p className="mt-2 text-sm leading-6 text-foreground/72">Aznap akkor érkeztek, amikor kényelmes.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[30px] bg-[linear-gradient(180deg,#12382f,#0c241f)] p-7 text-white shadow-[0_24px_60px_rgba(12,36,31,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Közösségi jelenlét</p>
            <h2 className="mt-3 text-3xl font-semibold">Facebookon is látszik a valódi hangulat.</h2>
            <p className="mt-4 text-base leading-7 text-white/78">Friss képek, szezonális információk és gyors kapcsolatfelvétel is elérhető ott, így foglalás előtt is könnyebb képet kapni a helyszínről.</p>
            <Button asChild size="lg" className="mt-6 w-full bg-[linear-gradient(135deg,#f6e3b7,#c59b4d)] text-primary hover:brightness-105">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook megnyitása<ArrowRight className="h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
