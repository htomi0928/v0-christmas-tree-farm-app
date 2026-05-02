"use client"

import Link from "next/link"
import { Facebook } from "lucide-react"
import { useCookieConsent } from "@/contexts/cookie-consent-context"

export function Footer() {
  const { resetConsent } = useCookieConsent()

  return (
    <footer className="bg-foreground mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-sm font-semibold text-background mb-3">Elérhetőség</h3>
            <p className="text-sm text-background/65">+36 (30) 123 4567</p>
            <p className="text-sm text-background/65">Szombat–vasárnap, 10:00–12:00</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-background mb-3">Helyszín</h3>
            <p className="text-sm text-background/65">Zalaegerszeg határa</p>
            <p className="text-sm text-background/65">GPS koordináták alapján</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-background mb-3">Kövess minket</h3>
            <a
              href="https://www.facebook.com/karacsonyfak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-background/65 hover:text-background transition-colors"
            >
              <Facebook size={16} />
              <span>Facebook oldal</span>
            </a>
          </div>
        </div>
        <div className="border-t border-background/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/40">
            &copy; 2026 Zalaegerszegi Nordmann Fenyők. Minden jog fenntartva.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/aszf" className="text-xs text-background/40 hover:text-background/70 transition-colors">
              ASZF
            </Link>
            <Link href="/adatvedelem" className="text-xs text-background/40 hover:text-background/70 transition-colors">
              Adatvédelmi tájékoztató
            </Link>
            <button
              onClick={resetConsent}
              className="text-xs text-background/40 hover:text-background/70 transition-colors cursor-pointer"
            >
              Süti-beállítások
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
