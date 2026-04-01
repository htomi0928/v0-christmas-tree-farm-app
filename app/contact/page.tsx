import { Facebook, MapPinned, PhoneCall, Trees } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { facebookUrl, mapsEmbedUrl, mapsUrl, phoneNumber } from "@/lib/site"

const approachTips = [
  "A helyszínnek nincs klasszikus utca-házszáma, ezért érdemes a Google Maps útvonalat követni.",
  "A foglalási napon 10:00 és 12:00 között biztosan kint vagyunk a fenyvesben.",
  "Ha bizonytalan vagy útközben, telefonon segítünk eligazodni.",
  "A közelben lehet parkolni, a helyszín autóval kényelmesen megközelíthető.",
]

export default function ContactPage() {
  return (
    <div>
      <section className="section-space">
        <div className="page-shell editorial-grid items-start">
          <div>
            <p className="section-kicker">Elérhetőség</p>
            <h1 className="section-title">Könnyen megtalálsz minket, még pontos utca-házszám nélkül is.</h1>
            <p className="section-subtitle mt-5">A fenyves Zalaegerszeg közelében található, térképes útvonallal jól megközelíthető helyen. Ha először jössz, a Google Maps sokat segít, mi pedig telefonon is elérhetőek vagyunk.</p>
          </div>

          <Card className="px-7 py-7">
            <div className="grid gap-4 px-6">
              <div className="rounded-[24px] border border-primary/8 bg-secondary/35 p-5">
                <PhoneCall className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-2xl font-semibold text-primary">Telefon</h2>
                <p className="mt-2 text-lg font-semibold text-foreground">{phoneNumber}</p>
                <p className="mt-2 text-sm leading-6 text-foreground/70">Foglalási napokon és egyeztetéshez is ez a leggyorsabb.</p>
              </div>
              <div className="rounded-[24px] border border-[color:var(--champagne-border)] bg-[rgba(241,223,182,0.38)] p-5">
                <Facebook className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-2xl font-semibold text-primary">Facebook és térkép</h2>
                <p className="mt-2 text-sm leading-6 text-foreground/70">Képek, friss információk és gyors üzenetküldés egy helyen.</p>
                <div className="mt-4 flex flex-wrap gap-3"><Button asChild variant="outline"><a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook oldal</a></Button><Button asChild><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps megnyitása</a></Button></div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="page-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[32px] border border-white/60 shadow-[0_28px_80px_rgba(16,39,32,0.14)]">
            <iframe title="Fenyves helyszín" width="100%" height="100%" className="min-h-[460px] w-full" frameBorder="0" src={mapsEmbedUrl} style={{ border: 0 }} allowFullScreen loading="lazy" />
          </div>

          <div className="space-y-5">
            <Card className="tint-sky px-7 py-7">
              <div className="px-6">
                <div className="flex items-start gap-3">
                  <MapPinned className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-3xl font-semibold text-primary">Megközelítés</h2>
                    <p className="mt-3 text-base leading-7 text-foreground/72">A helyszín természetközeli terület, ezért nincs hagyományos utca-házszám. A térképes link alapján könnyű odatalálni, és ha kell, telefonon is segítünk.</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {approachTips.map((tip, index) => (
                <div key={tip} className={`${index % 2 === 0 ? "tint-berry" : "tint-forest"} p-5 shadow-[0_12px_28px_rgba(16,39,32,0.05)]`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">0{index + 1}</p>
                  <p className="mt-2 text-base leading-7 text-foreground/74">{tip}</p>
                </div>
              ))}
            </div>

            <Card className="bg-[linear-gradient(180deg,#12382f,#0c241f)] px-7 py-7 text-primary-foreground">
              <div className="px-6">
                <div className="flex items-start gap-3">
                  <Trees className="mt-1 h-5 w-5 text-white/80" />
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Kapcsolattartás a helyszínen</h2>
                    <p className="mt-3 text-base leading-7 text-white/80">A foglalási napokon személyesen fogadunk benneteket a fenyvesben. Ha eltévednél vagy késnél, egy rövid telefonhívás elég, és segítünk.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
