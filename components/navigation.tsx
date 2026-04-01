"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, Trees, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { publicNavigation } from "@/lib/site"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-[linear-gradient(180deg,rgba(248,244,236,0.9),rgba(246,239,226,0.78))] backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(197,155,77,0.65),transparent)]" />
      <div className="page-shell">
        <div className="flex min-h-22 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-13 w-13 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(145deg,#1c4b3e,#102d26)] text-primary-foreground shadow-[0_14px_34px_rgba(16,39,32,0.22)] transition group-hover:scale-[1.02]">
              <Trees className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold text-primary sm:text-xl">Zalaegerszegi Nordmann fenyők</div>
              <div className="text-sm text-foreground/62">Csendes fenyves, egységes ár, emberi hangulat</div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-semibold transition",
                  pathname === item.href
                    ? "bg-[linear-gradient(135deg,#173f35,#255246)] text-primary-foreground shadow-[0_12px_25px_rgba(16,39,32,0.15)]"
                    : "text-foreground/74 hover:bg-white/80 hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin" prefetch={false}>
              <Button variant="outline" size="sm" className="ml-3 border-[color:var(--champagne-border)] bg-[rgba(241,223,182,0.38)] text-primary hover:bg-[rgba(241,223,182,0.55)]">
                Admin
              </Button>
            </Link>
          </div>

          <button
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary/12 bg-white/85 shadow-[0_10px_28px_rgba(16,39,32,0.08)] xl:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menü megnyitása"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="pb-5 xl:hidden">
            <div className="surface-card mt-1 space-y-2 p-3">
              {publicNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-base font-semibold transition",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground/72 hover:bg-secondary/60 hover:text-primary",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-1">
                <Link href="/admin" prefetch={false} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full border-[color:var(--champagne-border)] bg-[rgba(241,223,182,0.3)] text-primary hover:bg-[rgba(241,223,182,0.46)]">
                    Admin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
