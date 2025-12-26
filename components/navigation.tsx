"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { label: "Kezdőlap", href: "/" },
  { label: "Hogyan működik?", href: "/how-it-works" },
  { label: "Fenyőink", href: "/trees" },
  { label: "Időpontfoglalás", href: "/booking" },
  { label: "GYIK", href: "/faq" },
  { label: "Elérhetőség", href: "/contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-lg font-bold text-primary">
              Zalaegerszegi
              <br className="hidden sm:block" />
              <span className="text-sm font-semibold">Nordmann Fenyők</span>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary/30 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin">
              <Button variant="outline" size="sm" className="ml-4 bg-transparent">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary/30 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
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
