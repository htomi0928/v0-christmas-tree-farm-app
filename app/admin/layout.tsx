import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { validateSession } from "@/lib/auth"
import { AdminShellNav } from "@/components/admin-shell-nav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const adminSessionId = cookieStore.get("admin_session")?.value

  if (!adminSessionId || !(await validateSession(adminSessionId))) {
    redirect("/admin-login")
  }

  return (
    <div className="min-h-screen bg-[#ededed]">
      <AdminShellNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 pt-10 md:pb-12">{children}</main>
    </div>
  )
}
