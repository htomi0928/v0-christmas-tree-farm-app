"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { label: "Kezdőlap",        href: "/" },
  { label: "Hogyan működik?", href: "/how-it-works" },
  { label: "Fenyőink",        href: "/trees" },
  { label: "Időpontfoglalás", href: "/booking" },
  { label: "GYIK",            href: "/faq" },
  { label: "Elérhetőség",     href: "/contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinkClass = scrolled
    ? "nav-link px-3 py-2 text-sm font-medium tracking-wide uppercase text-foreground"
    : "nav-link px-3 py-2 text-sm font-medium tracking-wide uppercase text-white"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className={`text-lg font-bold transition-colors duration-300 ${scrolled ? "text-primary" : "text-white"}`}>
              Zalaegerszegi
              <br className="hidden sm:block" />
              <span className="text-sm font-semibold">Nordmann Fenyők</span>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className={`ml-4 bg-transparent transition-colors duration-300 ${
                  scrolled ? "" : "border-white/50 text-white hover:bg-white/10"
                }`}
              >
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${
            scrolled
              ? "bg-background/95 backdrop-blur-md"
              : "bg-black/70 backdrop-blur-md rounded-b-lg"
          }`}>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 uppercase tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 px-3">
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full border-white/50 text-white bg-transparent hover:bg-white/10">
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
