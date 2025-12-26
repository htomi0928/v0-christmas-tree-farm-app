import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { validateSession } from "@/lib/auth"
import LogoutButton from "@/components/admin-logout-button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const adminSessionId = cookieStore.get("adminSessionId")?.value

  if (!adminSessionId || !validateSession(adminSessionId)) {
    redirect("/admin-login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/admin" className="font-bold text-lg text-primary">
            Admin Panel
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="border-b border-border bg-background sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1">
          <Link
            href="/admin"
            className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground border-b-2 border-transparent hover:border-accent transition-colors"
          >
            Áttekintés
          </Link>
          <Link
            href="/admin/reservations"
            className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground border-b-2 border-transparent hover:border-accent transition-colors"
          >
            Foglalások
          </Link>
          <Link
            href="/admin/expenses"
            className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground border-b-2 border-transparent hover:border-accent transition-colors"
          >
            Kiadások
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground border-b-2 border-transparent hover:border-accent transition-colors"
          >
            Beállítások
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
