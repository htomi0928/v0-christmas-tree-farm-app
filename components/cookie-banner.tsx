"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCookieConsent } from "@/contexts/cookie-consent-context"

export function CookieBanner() {
  const pathname = usePathname()
  const { consent, acceptConsent, rejectConsent } = useCookieConsent()

  if (pathname.startsWith("/admin") || consent !== null) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-neutral-400 leading-relaxed">
          <strong className="text-neutral-100 font-semibold">Sütik és adatvédelem</strong>
          {" – "}
          Az oldal analitikai sütiket használ a látogatások mérésére. Részletek az{" "}
          <Link href="/adatvedelem" className="text-[#8fa88b] underline underline-offset-2 hover:text-[#a0bfa0] transition-colors">
            adatvédelmi tájékoztatóban
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={rejectConsent}
            className="px-4 py-2 text-sm font-medium text-neutral-400 border border-neutral-700 rounded-lg hover:border-neutral-500 hover:text-neutral-200 transition-colors"
          >
            Elutasítom
          </button>
          <button
            onClick={acceptConsent}
            className="px-4 py-2 text-sm font-semibold bg-neutral-100 text-neutral-900 rounded-lg hover:bg-white transition-colors"
          >
            Elfogadom
          </button>
        </div>
      </div>
    </div>
  )
}
