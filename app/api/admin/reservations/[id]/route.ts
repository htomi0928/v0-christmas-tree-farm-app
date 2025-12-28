import "server-only"
import { cookies } from "next/headers"
import { getReservationById, updateReservation } from "@/lib/reservations"
import type { UpdateReservationData } from "@/lib/types"
import { validateSession } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const reservation = await getReservationById(Number.parseInt(params.id))

    if (!reservation) {
      return Response.json(
        {
          success: false,
          error: "Foglalás nem található",
        },
        { status: 404 },
      )
    }

    return Response.json({
      success: true,
      reservation,
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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
    const updateData: UpdateReservationData = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      visitDate: body.visitDate,
      treeCount: body.treeCount,
      status: body.status,
      treeNumbers: body.treeNumbers,
      notes: body.notes,
    }

    const result = await updateReservation(Number.parseInt(params.id), updateData)

    if (!result.success) {
      return Response.json(
        {
          success: false,
          error: result.error,
        },
        { status: 404 },
      )
    }

    return Response.json({
      success: true,
      reservation: result.data,
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
