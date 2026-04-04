import { z } from "zod"
import { createReservation } from "@/lib/reservations"
import { logApiError, parseJsonBody } from "@/lib/api"

const reservationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(50),
  email: z.union([z.string().trim().email(), z.literal(""), z.undefined()]).optional(),
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickupDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.undefined()]).optional(),
  treeCount: z.number().int().min(1).max(20),
  notes: z.union([z.string().trim().max(1000), z.literal(""), z.undefined()]).optional(),
})

export async function POST(request: Request) {
  try {
    const parsedBody = await parseJsonBody(request, reservationSchema)
    if (!parsedBody.success) return parsedBody.response

    const data = parsedBody.data
    const result = await createReservation({
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      visitDate: data.visitDate,
      pickupDate: data.pickupDate || undefined,
      treeCount: data.treeCount,
      notes: data.notes || undefined,
    })

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
    logApiError("public reservation create failed", error)
    return Response.json(
      {
        success: false,
        errors: ["Szerver hiba. Kérjük, próbáld újra."],
      },
      { status: 500 },
    )
  }
}

