import { cookies } from "next/headers"
import { getSettings, updateSettings } from "@/lib/settings"
import { validateSession } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("adminSessionId")?.value

    if (!sessionId || !validateSession(sessionId)) {
      return Response.json(
        {
          success: false,
          error: "Nincs hitelesítés",
        },
        { status: 401 },
      )
    }

    const settings = await getSettings()

    return Response.json({
      success: true,
      settings,
    })
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
    const sessionId = cookieStore.get("adminSessionId")?.value

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

    return Response.json({
      success: true,
      settings,
    })
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
