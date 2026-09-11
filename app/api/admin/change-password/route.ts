import "server-only"
import { z } from "zod"
import { hashPassword, verifyPassword } from "@/lib/auth"
import { enforceSameOrigin, jsonError, logApiError, parseJsonBody, requireAdminUser } from "@/lib/api"
import { sql } from "@/lib/db"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "A jelenlegi jelszó szükséges."),
  newPassword: z.string().min(1, "Új jelszó szükséges.").max(200, "A jelszó legfeljebb 200 karakter lehet."),
})

export async function POST(request: Request) {
  try {
    const originError = enforceSameOrigin(request)
    if (originError) return originError

    const username = await requireAdminUser()
    if (!username) {
      return jsonError("Nincs hitelesites", 401)
    }

    const parsedBody = await parseJsonBody(request, changePasswordSchema)
    if (!parsedBody.success) return parsedBody.response

    const { currentPassword, newPassword } = parsedBody.data

    const rows = await sql`SELECT password_hash FROM admin_users WHERE username = ${username}`
    if (rows.length === 0) {
      return jsonError("Nincs hitelesites", 401)
    }

    const isValid = await verifyPassword(currentPassword, rows[0].password_hash)
    if (!isValid) {
      return jsonError("Hibás jelenlegi jelszó.", 400)
    }

    const newHash = await hashPassword(newPassword)
    await sql`
      UPDATE admin_users
      SET password_hash = ${newHash}, must_change_password = FALSE
      WHERE username = ${username}
    `

    return Response.json({ success: true })
  } catch (error) {
    logApiError("admin change-password failed", error)
    return jsonError("Szerver hiba", 500)
  }
}
