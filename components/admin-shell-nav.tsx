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
      <header className="sticky top-16 z-40 border-b border-[#bfc3c7] bg-[#ededed]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#6e7f6a]">Admin</span>
            <div className="hidden md:flex items-center gap-1 ml-4">
              {adminNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-[#4a4f4a] text-[#ededed]"
                      : "text-[#4a4f4a]/60 hover:text-[#4a4f4a] hover:bg-[#4a4f4a]/8",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#bfc3c7] text-sm font-medium text-[#4a4f4a] hover:bg-[#4a4f4a]/5 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Kijelentkezés</span>
          </button>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#bfc3c7] bg-[#ededed]/98 px-3 py-2 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-4 gap-2">
          {adminNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-xl text-[11px] font-semibold transition",
                isActive(item.href) ? "bg-[#4a4f4a] text-[#ededed]" : "text-[#4a4f4a]/60 hover:bg-[#4a4f4a]/8 hover:text-[#4a4f4a]",
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
