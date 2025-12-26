import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, MapPin, Facebook } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-12 sm:py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Elérhetőség</h1>
          <p className="text-lg text-foreground/70">Lépj kapcsolatba velünk. Szívesen beszélgetünk!</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Phone className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Telefonszám</h3>
              <p className="text-2xl font-semibold text-accent mb-2">+36 (30) 123 4567</p>
              <p className="text-foreground/70 text-sm">Nyitva szombat és vasárnap, 10:00-12:00</p>
            </Card>

            {/* Contact Person */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Kapcsolattartó</h3>
              <p className="text-foreground/70 mb-2">
                Apa neve – mindig kint van 10–12-ig a fenyvesben a foglalási napokon.
              </p>
              <p className="text-sm text-foreground/60">Egyéb időpontban előzetes egyeztetés szükséges.</p>
            </Card>

            {/* Facebook */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <Facebook className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Kövess</h3>
              <p className="text-foreground/70 mb-4">Friss képek és hírek a Facebookon.</p>
              <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-accent hover:bg-accent/90">
                  Facebook oldal
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 sm:py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Megközelítés és helyszín</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map placeholder */}
            <div className="rounded-lg overflow-hidden h-96 bg-secondary/30 flex items-center justify-center">
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

            {/* Info */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">A helyszín</h3>
              <p className="text-foreground/70 mb-4">
                Egy kis erdő Zalaegerszeg szélén, amely nem rendelkezik közúti utcacímmel. Az érkezéshez a Google Maps
                alkalmazás szükséges.
              </p>
              <h4 className="font-semibold text-primary mb-3">Megközelítési útmutató:</h4>
              <ul className="space-y-3 text-foreground/70">
                <li className="flex gap-3">
                  <span className="text-accent font-bold">→</span>
                  <span>Zalaegerszeg városának északi részéről közelítsd meg (az 74-es számú főút felé)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">→</span>
                  <span>Kövess egy földutat az erdő felé (ne félj a paraszt úttól – ideális az autók számára)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">→</span>
                  <span>Parkolás ingyenes, közvetlenül a fenyvesben. 5-6 autó számára van hely.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">→</span>
                  <span>Ha elvétednéd az utat, hívd fel a telefonszámon – megtalálunk!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
