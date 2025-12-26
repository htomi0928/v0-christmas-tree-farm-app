import { Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-2">Elérhetőség</h3>
            <p className="text-sm mb-2">Telefonszám: +36 (30) 123 4567</p>
            <p className="text-sm">Nyitva: szombat és vasárnap, 10:00-12:00</p>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-bold text-lg mb-2">Helyszín</h3>
            <p className="text-sm">Zalaegerszeg határa</p>
            <p className="text-sm">Google Maps link alapján érkezz meg</p>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-2">Kövess minket</h3>
            <a
              href="https://www.facebook.com/karacsonyfak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Facebook size={20} />
              <span className="text-sm">Facebook oldal</span>
            </a>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Zalaegerszegi Nordmann Fenyők. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>
  )
}
