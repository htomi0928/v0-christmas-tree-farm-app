import "server-only"
import { z } from "zod"
import { createAdminQuickReservation } from "@/lib/reservations"
import { ReservationStatus } from "@/lib/types"
import { enforceSameOrigin, logApiError, parseJsonBody, requireAdminSessionResponse, requireAdminUser } from "@/lib/api"
import { getActiveYear } from "@/lib/years"

const quickCreateReservationSchema = z.object({
  treeCount: z.number().int().min(1).max(20),
  name: z.union([z.string().trim().max(120), z.literal(""), z.undefined()]).optional(),
  phone: z.union([z.string().trim().max(50), z.literal(""), z.undefined()]).optional(),
  email: z.union([z.string().trim().email(), z.literal(""), z.undefined()]).optional(),
  visitDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.undefined()]).optional(),
  pickupDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.undefined()]).optional(),
  notes: z.union([z.string().trim().max(1000), z.literal(""), z.undefined()]).optional(),
  status: z.nativeEnum(ReservationStatus).optional(),
  treeNumbers: z.union([z.string().trim().max(200), z.literal(""), z.undefined()]).optional(),
  paidTo: z.union([z.literal("János"), z.literal("Sanyi"), z.literal(""), z.undefined()]).optional(),
})

export async function POST(request: Request) {
  try {
    const originError = enforceSameOrigin(request)
    if (originError) return originError

    const authError = await requireAdminSessionResponse()
    if (authError) return authError
    const currentAdminUser = await requireAdminUser()
    if (!currentAdminUser) {
      return Response.json({ success: false, error: "Nincs hitelesites" }, { status: 401 })
    }

    const activeYear = await getActiveYear()
    if (activeYear === null) {
      return Response.json({ success: false, error: "Foglalas jelenleg nem erheto el" }, { status: 503 })
    }

    const parsedBody = await parseJsonBody(request, quickCreateReservationSchema)
    if (!parsedBody.success) return parsedBody.response

    const data = parsedBody.data
    const adminComment = `Hozzáadva ${currentAdminUser} által`
    const normalizedNotes = data.notes?.trim()
    const notesWithAdminComment = normalizedNotes ? `${normalizedNotes}\n${adminComment}` : adminComment

    const result = await createAdminQuickReservation(
      {
        treeCount: data.treeCount,
        name: data.name || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        visitDate: data.visitDate || undefined,
        pickupDate: data.pickupDate || undefined,
        notes: notesWithAdminComment,
        status: data.status,
        treeNumbers: data.treeNumbers || undefined,
        paidTo: data.paidTo || undefined,
      },
      activeYear,
    )

    if (!result.success) {
      return Response.json({ success: false, error: result.error }, { status: 400 })
    }

    return Response.json({ success: true, reservation: result.data })
  } catch (error) {
    logApiError("admin quick reservation create failed", error)
    return Response.json({ success: false, error: "Szerver hiba" }, { status: 500 })
  }
}


