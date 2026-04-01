import Link from "next/link"
import { ArrowRight, Facebook, MapPinned, PhoneCall, Sparkles } from "lucide-react"
import { facebookUrl, phoneNumber, publicNavigation } from "@/lib/site"

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-primary/10 bg-[linear-gradient(180deg,rgba(18,56,47,0.98),rgba(12,36,31,1))] text-primary-foreground">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(241,223,182,0.7),transparent)]" />
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[rgba(241,223,182,0.08)] blur-3xl" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[rgba(234,217,227,0.1)] blur-3xl" />
      <div className="page-shell relative py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.85fr_0.75fr]">
          <div>
            <p className="section-kicker border-white/14 bg-[rgba(255,255,255,0.08)] text-white/76">Családi nordmann fenyves</p>
            <h3 className="max-w-lg text-3xl font-semibold text-white sm:text-4xl">
              Nyugodt választás, tiszta ár, erős hangulat és valódi fenyvesélmény Zalaegerszeg közelében.
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/72">
              Nálunk nem futószalagos a vásárlás. Hétvégén kijöttök, kiválasztjátok a fát, megjelöljük sorszámmal, és később ugyanazt a fát vehetitek át frissen kivágva.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/booking" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f6e3b7,#c59b4d)] px-5 py-3 text-sm font-semibold text-primary transition hover:brightness-105">
                Időpontfoglalás
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/88 transition hover:bg-white/8">
                <Facebook className="h-4 w-4" />
                Facebook oldal
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white">Kapcsolat</h3>
            <div className="mt-4 space-y-4 text-white/74">
              <div className="flex items-start gap-3">
                <PhoneCall className="mt-1 h-5 w-5 text-[color:var(--champagne-soft)]" />
                <div>
                  <p className="font-semibold text-white">{phoneNumber}</p>
                  <p className="text-sm">Szombat és vasárnap 10:00 és 12:00 között biztosan elérhetőek vagyunk.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinned className="mt-1 h-5 w-5 text-[color:var(--champagne-soft)]" />
                <div>
                  <p className="font-semibold text-white">Megközelítés Google Maps alapján</p>
                  <p className="text-sm">Nincs pontos utca-házszám, a helyszínhez térképes útvonal segít.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-[color:var(--champagne-soft)]" />
                <div>
                  <p className="font-semibold text-white">Nem percre pontos érkezés</p>
                  <p className="text-sm">A foglalás egy napra szól, aznap 10:00 és 12:00 között jöttök, amikor kényelmes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white">Oldalak</h3>
            <div className="mt-4 space-y-3">
              {publicNavigation.map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm text-white/74 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/12 pt-6 text-sm text-white/55">
          <p>&copy; 2026 Zalaegerszegi Nordmann fenyők. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>
  )
}
