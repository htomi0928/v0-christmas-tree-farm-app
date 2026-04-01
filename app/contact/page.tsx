import { Button } from "@/components/ui/button"
import { Phone, MapPin, Facebook } from "lucide-react"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-14 sm:py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Kapcsolat</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">Elérhetőség</h1>
            <p className="text-lg text-muted-foreground font-light max-w-xl">
              Telefonon elérhetők vagyunk. GPS-koordinátákkal megtalálsz.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Phone */}
            <AnimateOnScroll delay={0} className="h-full">
              <div className="border border-border rounded-lg p-8 h-full">
                <Phone className="h-6 w-6 text-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2 tracking-tight">Telefonszám</h3>
                <p className="text-2xl font-bold text-foreground mb-2 tracking-tight">+36 (30) 123 4567</p>
                <p className="text-sm text-muted-foreground font-light">Szombat–vasárnap, 10:00–12:00</p>
              </div>
            </AnimateOnScroll>

            {/* Contact Person */}
            <AnimateOnScroll delay={100} className="h-full">
              <div className="border border-border rounded-lg p-8 h-full">
                <MapPin className="h-6 w-6 text-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2 tracking-tight">A helyszínen</h3>
                <p className="text-muted-foreground font-light mb-2">
                  A foglalási napokon 10–12 között mindig ott vagyunk a fenyvesben.
                </p>
                <p className="text-sm text-muted-foreground font-light">Egyéb időpontban előre egyeztess.</p>
              </div>
            </AnimateOnScroll>

            {/* Facebook */}
            <AnimateOnScroll delay={200} className="h-full">
              <div className="border border-border rounded-lg p-8 h-full">
                <Facebook className="h-6 w-6 text-foreground mb-4" />
                <h3 className="font-semibold text-foreground mb-2 tracking-tight">Facebook</h3>
                <p className="text-muted-foreground font-light mb-4">Képek és hírek az idei szezonról.</p>
                <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 cursor-pointer">
                    Facebook oldal
                  </Button>
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-14 sm:py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Megközelítés</div>
            <h2 className="text-3xl font-bold text-foreground mb-8 tracking-tight">A helyszín</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <AnimateOnScroll>
              <div className="rounded-lg overflow-hidden h-96 bg-secondary/30">
                <iframe
                  title="Zalaegerszeg map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2717.1234567890!2d16.8412!3d46.8206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476551234567%3A0x1234567890abcdef!2sZalaegerszeg!5e0!3m2!1shu!2shu!4v1234567890"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </AnimateOnScroll>

            {/* Info */}
            <AnimateOnScroll delay={150}>
              <p className="text-muted-foreground font-light mb-6">
                Nincs utcacím, nincs házszám. Egy kis erdő Zalaegerszeg határán. GPS-koordinátákkal érkezhetsz — ezt
                a foglalás visszaigazolásában küldjük el.
              </p>
              <div className="space-y-4">
                {[
                  "Zalaegerszeg északi részéről közelítsd meg, a 74-es főút irányából.",
                  "Egy rövid földúton kell behajtani — normál autóval simán járható.",
                  "Parkolás ingyen, közvetlenül a fenyvesnél. Pár autónak van hely.",
                  "Ha elvéted az utat, hívj — megtalálunk.",
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-muted-foreground/40 font-bold text-sm tabular-nums flex-shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-muted-foreground font-light">{item}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </div>
  )
}
