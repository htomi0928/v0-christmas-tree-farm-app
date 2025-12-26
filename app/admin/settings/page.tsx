import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { validateSession } from "@/lib/auth"
import { getSettings } from "@/lib/settings"
import SettingsClient from "@/components/settings-client"

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("adminSessionId")?.value

  // Server-side auth check
  if (!sessionId || !validateSession(sessionId)) {
    redirect("/admin/login")
  }

  const settings = await getSettings()

  return <SettingsClient initialSettings={settings} />
}
