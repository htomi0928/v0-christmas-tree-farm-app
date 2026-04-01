import { Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Elérhetőség</h3>
            <p className="text-sm text-muted-foreground">+36 (30) 123 4567</p>
            <p className="text-sm text-muted-foreground">Szombat–vasárnap, 10:00–12:00</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Helyszín</h3>
            <p className="text-sm text-muted-foreground">Zalaegerszeg határa</p>
            <p className="text-sm text-muted-foreground">GPS koordináták alapján</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Kövess minket</h3>
            <a
              href="https://www.facebook.com/karacsonyfak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Facebook size={16} />
              <span>Facebook oldal</span>
            </a>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 Zalaegerszegi Nordmann Fenyők. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>
  )
}
