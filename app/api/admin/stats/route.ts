import { getReservationStats } from "@/lib/reservations"
import { getSessionUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const sessionId = authHeader?.split(" ")[1]

    if (!sessionId || !getSessionUser(sessionId)) {
      return Response.json(
        {
          success: false,
          error: "Nincs hitelesítés",
        },
        { status: 401 },
      )
    }

    const stats = await getReservationStats()

    return Response.json({
      success: true,
      stats,
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
