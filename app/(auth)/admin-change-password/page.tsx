import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth"
import { AdminChangePasswordForm } from "@/components/admin-change-password-form"

export default async function AdminChangePasswordPage() {
  const cookieStore = await cookies()
  const adminSessionId = cookieStore.get("admin_session")?.value
  const username = adminSessionId ? await getSessionUser(adminSessionId) : null

  if (!username) {
    redirect("/admin-login")
  }

  return <AdminChangePasswordForm />
}
