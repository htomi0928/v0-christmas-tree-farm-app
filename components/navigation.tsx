"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { label: "Hogyan működik?", href: "/how-it-works" },
  { label: "Fenyőink",        href: "/trees" },
  { label: "GYIK",            href: "/faq" },
  { label: "Elérhetőség",     href: "/contact" },
]

export function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // On non-home pages there's no full-screen hero, so always use the solid style
  const isSolid = !isHome || scrolled

  const navLinkClass = isSolid
    ? "nav-link px-3 py-2 text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
    : "nav-link px-3 py-2 text-sm font-normal text-white/70 hover:text-white transition-colors"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isSolid
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className={`text-base font-bold tracking-tight transition-colors duration-300 ${isSolid ? "text-foreground" : "text-white"}`}>
              HOLLÓSI FENYŐ
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
            <Link href="/booking">
              <Button
                size="sm"
                className={`ml-4 text-sm font-semibold transition-colors duration-300 ${
                  isSolid
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-white text-foreground hover:bg-white/90"
                }`}
              >
                Időpontfoglalás
              </Button>
            </Link>
            <Link
              href="/admin"
              className="ml-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${isSolid ? "text-foreground" : "text-white"}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 bg-background/95 backdrop-blur-md rounded-b-lg">
            <Link
              href="/booking"
              className="block px-3 py-2 rounded-md text-base font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10"
              onClick={() => setIsOpen(false)}
            >
              Időpontfoglalás
            </Link>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="block px-3 py-2 text-xs text-muted-foreground"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
