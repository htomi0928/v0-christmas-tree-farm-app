import "server-only"
import { cookies } from "next/headers"
import { destroySession } from "@/lib/auth"
import { enforceSameOrigin, logApiError } from "@/lib/api"

export async function POST(request: Request) {
  try {
    const originError = enforceSameOrigin(request)
    if (originError) return originError

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (sessionToken) {
      await destroySession(sessionToken)
    }

    cookieStore.delete("admin_session")

    return Response.json({ success: true })
  } catch (error) {
    logApiError("admin logout failed", error)
    return Response.json({ success: false, error: "Szerver hiba" }, { status: 500 })
  }
}
