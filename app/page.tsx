import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TreePine, Heart, MapPin, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-96 sm:h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: `url('/christmas-tree-forest-field-zalaegerszeg.jpg')`,
          }}
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4">
            Nordmann karácsonyfák Zalaegerszeg határában
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 mb-8">
            Családias hangulat, barátoknak és ismerősöknek, beszélgetéssel – nem futószalagon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90">
                Időpontfoglalás
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Hogyan működik?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-12">Miért minket válassz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <TreePine className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Csak Nordmann fenyő</h3>
                  <p className="text-foreground/70">
                    A legkiválóbb minőségű karácsonyfát biztosítunk, amely tűlevél-tartással és dús formával
                    rendelkezik.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <Heart className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Egységes ár: 8000 Ft</h3>
                  <p className="text-foreground/70">
                    Mérettől függetlenül minden fa ugyanaz az ár. Nincs rejtett költség, csak tiszta, korrekt árazás.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <Users className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Nyugodt, beszélgetős hangulat</h3>
                  <p className="text-foreground/70">
                    Nem a gyorsaság a cél. Van idő körbenézni, beszélgetni, és valódi karácsonyvároszt élni meg.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <MapPin className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Biztosan azt kapod, amit kinéztél</h3>
                  <p className="text-foreground/70">
                    Előre kiválasztott és megjelölt fa. Nem kell féltened, hogy mások vesznek el a kiválasztottat.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">Rólunk</h2>
              <p className="text-foreground/70 mb-4">
                Egy kis családi fenyőfarmműködtetés a Zalaegerszeg határán. Szeretjük azt, amit csinálunk, és
                szeretnénk, ha te is szeretned azt az élményt, amely itt születik.
              </p>
              <p className="text-foreground/70 mb-6">
                Nincsen utcacím vagy házszám – a hely egy kis erdő a város szélén. Minden vendég GPS koordináták alapján
                érkezik meg, és személyesen fogadjuk őket.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90">Térkép és megközelítés</Button>
                </Link>
                <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Kövess Facebookon</Button>
                </a>
              </div>
            </div>
            <div className="bg-secondary/30 rounded-lg aspect-square flex items-center justify-center">
              <img src="/nordmann-christmas-tree-family-farm.jpg" alt="Fergetö" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Facebook Section */}
      <section className="py-16 sm:py-20 bg-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Kövess minket Facebookon</h2>
          <p className="text-lg text-foreground/70 mb-8">
            Friss képekért és hírekért, valamint aktuális nyitva tartásért kövess Facebookon.
          </p>
          <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Facebook oldal megnyitása
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
