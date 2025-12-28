import "server-only"
import { cookies } from "next/headers"
import { listReservations } from "@/lib/reservations"
import type { ReservationStatus } from "@/lib/types"
import { validateSession } from "@/lib/auth"

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as ReservationStatus | null

    const filters = status ? { status } : undefined
    const reservations = await listReservations(filters)

    return Response.json({
      success: true,
      reservations,
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
