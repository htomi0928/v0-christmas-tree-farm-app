import "server-only"
import { getReservationCountsByDay } from "@/lib/reservations"
import { logApiError, requireAdminSessionResponse } from "@/lib/api"
import { getViewYear } from "@/lib/years"

export async function GET(_request: Request) {
  try {
    const authError = await requireAdminSessionResponse()
    if (authError) return authError

    const year = await getViewYear()
    const counts = await getReservationCountsByDay(year)

    return Response.json({
      success: true,
      counts,
      year,
    })
  } catch (error) {
    logApiError("admin day-count stats fetch failed", error)
    return Response.json(
      { success: false, error: "Szerver hiba" },
      { status: 500 },
    )
  }
}
