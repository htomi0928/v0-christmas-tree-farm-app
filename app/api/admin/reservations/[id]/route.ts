import "server-only"
import { z } from "zod"
import { deleteReservation, getReservationById, updateReservation } from "@/lib/reservations"
import { ReservationStatus } from "@/lib/types"
import { enforceSameOrigin, logApiError, parseJsonBody, parseNumericId, requireAdminSessionResponse } from "@/lib/api"

const updateReservationSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().min(1).max(50).optional(),
    email: z.union([z.string().trim().email(), z.literal(""), z.null()]).optional(),
    visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    pickupDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.null()]).optional(),
    treeCount: z.number().int().min(1).max(20).optional(),
    status: z.nativeEnum(ReservationStatus).optional(),
    treeNumbers: z.union([z.string().trim().max(200), z.literal(""), z.null()]).optional(),
    notes: z.union([z.string().trim().max(1000), z.literal(""), z.null()]).optional(),
    paidTo: z.union([z.literal("János"), z.literal("Sanyi"), z.literal(""), z.null()]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Legalább egy mezőt meg kell adni.",
  })

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireAdminSessionResponse()
    if (authError) return authError

    const { id } = await params
    const reservationId = parseNumericId(id)
    if (!reservationId) {
      return Response.json({ success: false, error: "Érvénytelen foglalás azonosító" }, { status: 400 })
    }

    const reservation = await getReservationById(reservationId)

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
    logApiError("admin reservation fetch failed", error)
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const originError = enforceSameOrigin(request)
    if (originError) return originError

    const authError = await requireAdminSessionResponse()
    if (authError) return authError

    const { id } = await params
    const reservationId = parseNumericId(id)
    if (!reservationId) {
      return Response.json({ success: false, error: "Érvénytelen foglalás azonosító" }, { status: 400 })
    }

    const parsedBody = await parseJsonBody(request, updateReservationSchema)
    if (!parsedBody.success) return parsedBody.response

    const data = parsedBody.data
    const result = await updateReservation(reservationId, {
      name: data.name,
      phone: data.phone,
      email: data.email === "" ? undefined : data.email ?? undefined,
      visitDate: data.visitDate,
      pickupDate: data.pickupDate === "" ? undefined : data.pickupDate ?? undefined,
      treeCount: data.treeCount,
      status: data.status,
      treeNumbers: data.treeNumbers === "" ? undefined : data.treeNumbers ?? undefined,
      notes: data.notes === "" ? undefined : data.notes ?? undefined,
      paidTo: data.paidTo === "" ? undefined : data.paidTo ?? undefined,
    })

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
    logApiError("admin reservation update failed", error)
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const originError = enforceSameOrigin(request)
    if (originError) return originError

    const authError = await requireAdminSessionResponse()
    if (authError) return authError

    const { id } = await params
    const reservationId = parseNumericId(id)
    if (!reservationId) {
      return Response.json({ success: false, error: "Érvénytelen foglalás azonosító" }, { status: 400 })
    }

    const result = await deleteReservation(reservationId)

    if (!result.success) {
      return Response.json({ success: false, error: result.error }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    logApiError("admin reservation delete failed", error)
    return Response.json({ success: false, error: "Szerver hiba" }, { status: 500 })
  }
}

