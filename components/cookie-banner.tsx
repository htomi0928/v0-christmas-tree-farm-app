"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCookieConsent } from "@/contexts/cookie-consent-context"

export function CookieBanner() {
  const pathname = usePathname()
  const { consent, acceptConsent, rejectConsent } = useCookieConsent()

  if (pathname.startsWith("/admin") || consent !== null) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-foreground border-t border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-background font-semibold">Sütik és adatvédelem</strong>
          {" – "}
          Az oldal analitikai sütiket használ a látogatások mérésére. Részletek az{" "}
          <Link href="/adatvedelem" className="text-secondary underline underline-offset-2 hover:text-secondary/80 transition-colors">
            adatvédelmi tájékoztatóban
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={rejectConsent}
            className="px-4 py-2 text-sm font-medium text-muted-foreground border border-primary/30 rounded-lg hover:border-primary/60 hover:text-background transition-colors"
          >
            Elutasítom
          </button>
          <button
            onClick={acceptConsent}
            className="px-4 py-2 text-sm font-semibold bg-background text-foreground rounded-lg hover:bg-card transition-colors"
          >
            Elfogadom
          </button>
        </div>
      </div>
    </div>
  )
}
