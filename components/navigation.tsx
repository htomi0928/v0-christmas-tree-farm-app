"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const navigationItems = [
  { label: "Hogyan működik?", href: "/#hogyan-mukodik" },
  { label: "Fenyőink",        href: "/#fenyoink" },
  { label: "GYIK",            href: "/faq" },
  { label: "Elérhetőség",     href: "/contact" },
]

function LogoWave({ isSolid }: { isSolid: boolean }) {
  const chars = "HOLLÓSI FENYŐ".split("")

  return (
    <motion.span
      className={`inline-block cursor-pointer font-bold tracking-tight transition-colors duration-300 ${isSolid ? "text-foreground" : "text-white"}`}
      whileHover="hover"
      initial="initial"
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            initial: { y: 0, scale: 1 },
            hover: {
              y: -4,
              scale: 1.2,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: i * 0.03,
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHash, setActiveHash] = useState("")

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash)
    updateHash()
    window.addEventListener("hashchange", updateHash)
    return () => window.removeEventListener("hashchange", updateHash)
  }, [])

  // On non-home pages there's no full-screen hero, so always use the solid style
  const isSolid = !isHome || scrolled

  const navLinkClass = isSolid
    ? "nav-link px-3 py-2 text-sm font-normal text-[#4a4f4a] hover:text-[#3a3a3a] transition-colors"
    : "nav-link px-3 py-2 text-sm font-normal text-white/70 hover:text-white transition-colors"

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isSolid
          ? "bg-[#ededed]/95 backdrop-blur-md shadow-sm border-b border-[#bfc3c7]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-base">
            <LogoWave isSolid={isSolid} />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = !item.href.startsWith("/#") && pathname === item.href
              const activeClass = isSolid
                ? "text-[#6e7f6a]"
                : "text-white"
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${navLinkClass} ${isActive ? `${activeClass} active` : ""}`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link href="/booking">
              <Button
                size="sm"
                className={`ml-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${
                  isSolid
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_6px_20px_rgba(74,79,74,0.3)]"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_6px_20px_rgba(74,79,74,0.2)]"
                }`}
              >
                Időpontfoglalás
              </Button>
            </Link>
            <Link href="/admin" className={navLinkClass}>
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden cursor-pointer p-2 transition-colors duration-300 ${isSolid ? "text-foreground" : "text-white"}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 space-y-0 bg-[#ededed]/95 backdrop-blur-md rounded-b-lg">
                {navigationItems.map((item) => {
                  const isActive = item.href.startsWith("/#")
                    ? pathname === "/" && activeHash === item.href.slice(1)
                    : pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2.5 text-base font-medium transition-colors ${
                        isActive ? "text-[#3a3a3a]" : "text-[#4a4f4a]/70 hover:text-[#3a3a3a]"
                      }`}
                      onClick={() => {
                        if (item.href.startsWith("/#")) setActiveHash(item.href.slice(1))
                        setIsOpen(false)
                      }}
                    >
                      <span className={`relative inline-block ${isActive ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-current" : ""}`}>
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
                <Link
                  href="/booking"
                  className={`block px-3 py-2.5 text-base font-medium transition-colors ${
                    pathname === "/booking" ? "text-[#3a3a3a]" : "text-[#4a4f4a]/70 hover:text-[#3a3a3a]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={`relative inline-block ${pathname === "/booking" ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-current" : ""}`}>
                    Időpontfoglalás
                  </span>
                </Link>
                <Link
                  href="/admin"
                  className="block px-3 py-2.5 text-sm text-[#4a4f4a]/40 hover:text-[#4a4f4a]/70 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
