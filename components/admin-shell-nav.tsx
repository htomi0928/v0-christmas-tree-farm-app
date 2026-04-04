"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { adminNavigation } from "@/lib/site"

export function AdminShellNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin-login"
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-[rgba(247,243,235,0.94)] backdrop-blur">
        <div className="page-shell flex min-h-18 items-center justify-between gap-4 py-3">
          <div>
            <Link href="/admin" className="text-lg font-semibold text-primary">
              Fenyves admin
            </Link>
            <p className="text-sm text-foreground/62">Mobilra optimalizált napi kezelőfelület</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/12 bg-white/70 px-4 text-sm font-semibold text-primary transition hover:bg-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Kijelentkezés</span>
          </button>
        </div>
        <div className="page-shell hidden gap-2 overflow-x-auto pb-3 md:flex">
          {adminNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-[0_12px_24px_rgba(16,39,32,0.14)]"
                  : "text-foreground/70 hover:bg-white/80 hover:text-primary",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/10 bg-[rgba(255,253,249,0.98)] px-3 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-2">
          {adminNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-2xl text-[11px] font-semibold transition",
                isActive(item.href) ? "bg-primary text-primary-foreground" : "text-foreground/62 hover:bg-primary/6",
              )}
            >
              <item.icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
