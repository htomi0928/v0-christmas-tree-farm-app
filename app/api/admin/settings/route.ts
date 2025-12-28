import { cookies } from "next/headers"
import { getSettings, updateSettings } from "@/lib/settings"
import { validateSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const settings = await getSettings()

    return Response.json(
      {
        success: true,
        settings,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("admin_session")?.value

    if (!sessionId || !validateSession(sessionId)) {
      return Response.json(
        {
          success: false,
          error: "Nincs hitelesítés",
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    const settings = await updateSettings(body)

    return Response.json(
      {
        success: true,
        settings,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Settings update error:", error)
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}
