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
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(247,243,235,1),rgba(239,233,222,0.72))]">
      <AdminShellNav />
      <main className="page-shell pb-28 pt-6 sm:pt-8 md:pb-10">{children}</main>
    </div>
  )
}
