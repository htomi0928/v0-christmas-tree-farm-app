import { createReservation } from "@/lib/reservations"
import type { CreateReservationData } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const data: CreateReservationData = {
      name: body.name,
      phone: body.phone,
      email: body.email,
      visitDate: body.visitDate,
      treeCount: body.treeCount,
      notes: body.notes,
    }

    const result = await createReservation(data)

    if (!result.success) {
      return Response.json(
        {
          success: false,
          errors: result.errors,
        },
        { status: 400 },
      )
    }

    return Response.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        errors: ["Szerver hiba. Kérjük, próbáld újra."],
      },
      { status: 500 },
    )
  }
}
