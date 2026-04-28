import { Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-neutral-900 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-3">Elérhetőség</h3>
            <p className="text-sm text-neutral-400">+36 (30) 123 4567</p>
            <p className="text-sm text-neutral-400">Szombat–vasárnap, 10:00–12:00</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-3">Helyszín</h3>
            <p className="text-sm text-neutral-400">Zalaegerszeg határa</p>
            <p className="text-sm text-neutral-400">GPS koordináták alapján</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-100 mb-3">Kövess minket</h3>
            <a
              href="https://www.facebook.com/karacsonyfak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              <Facebook size={16} />
              <span>Facebook oldal</span>
            </a>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-xs text-neutral-500">
          <p>&copy; 2026 Zalaegerszegi Nordmann Fenyők. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>
  )
}
