import "server-only"
import { z } from "zod"
import { getSettings, updateSettings } from "@/lib/settings"
import { enforceSameOrigin, logApiError, parseJsonBody, requireAdminSessionResponse } from "@/lib/api"

const settingsSchema = z.object({
  availableDays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(366).optional(),
  maxBookingsPerDay: z.number().int().min(1).max(500).optional(),
  retrievalDays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(366).optional(),
  pricePerTree: z.number().int().min(0).max(100000000).optional(),
})

export async function GET(_request: Request) {
  try {
    const settings = await getSettings()

    return Response.json(
      {
        success: true,
        settings,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    logApiError("settings fetch failed", error)
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const originError = enforceSameOrigin(request)
    if (originError) return originError

    const authError = await requireAdminSessionResponse()
    if (authError) return authError

    const parsedBody = await parseJsonBody(request, settingsSchema)
    if (!parsedBody.success) return parsedBody.response

    const settings = await updateSettings(parsedBody.data)

    return Response.json(
      {
        success: true,
        settings,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    logApiError("settings update failed", error)
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}

