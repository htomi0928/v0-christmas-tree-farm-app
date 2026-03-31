import "server-only"
import { listReservations } from "@/lib/reservations"
import { ReservationStatus } from "@/lib/types"
import { logApiError, requireAdminSessionResponse } from "@/lib/api"

export async function GET(request: Request) {
  try {
    const authError = await requireAdminSessionResponse()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get("status")
    const status = statusParam && Object.values(ReservationStatus).includes(statusParam as ReservationStatus)
      ? (statusParam as ReservationStatus)
      : null

    if (statusParam && !status) {
      return Response.json({ success: false, error: "Érvénytelen státusz szűrő" }, { status: 400 })
    }

    const filters = status ? { status } : undefined
    const reservations = await listReservations(filters)

    return Response.json({
      success: true,
      reservations,
    })
  } catch (error) {
    logApiError("admin reservations list failed", error)
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}

