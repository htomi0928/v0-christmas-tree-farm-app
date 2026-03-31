import "server-only"
import { getReservationStats } from "@/lib/reservations"
import { logApiError, requireAdminSessionResponse } from "@/lib/api"

export async function GET(_request: Request) {
  try {
    const authError = await requireAdminSessionResponse()
    if (authError) return authError

    const stats = await getReservationStats()

    return Response.json({
      success: true,
      stats,
    })
  } catch (error) {
    logApiError("admin stats fetch failed", error)
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}

