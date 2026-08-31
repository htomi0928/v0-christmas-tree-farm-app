import { NextResponse } from "next/server"
import { z } from "zod"
import { timingSafeEqual } from "node:crypto"
import { hashPassword } from "@/lib/auth"
import { logApiError, parseJsonBody } from "@/lib/api"
import { sql } from "@/lib/db"

const seedSchema = z.object({
  username: z.string().trim().min(1).max(100).default("admin"),
  password: z.string().min(5).max(200),
})

export async function POST(req: Request) {
  try {
    if (!process.env.SEED_ADMIN_KEY) {
      return NextResponse.json({ success: false, error: "SEED_ADMIN_KEY nincs beállítva" }, { status: 503 })
    }

    const providedKey = req.headers.get("x-seed-key") ?? ""
    const expectedKey: string = process.env.SEED_ADMIN_KEY
    const providedKeyBuffer = Buffer.from(providedKey)
    const expectedKeyBuffer = Buffer.from(expectedKey)
    const keysMatch =
      providedKeyBuffer.length === expectedKeyBuffer.length && timingSafeEqual(providedKeyBuffer, expectedKeyBuffer)

    if (!keysMatch) {
      return NextResponse.json({ success: false, error: "Nem engedélyezett" }, { status: 401 })
    }

    const parsedBody = await parseJsonBody(req, seedSchema)
    if (!parsedBody.success) return parsedBody.response

    const { username, password } = parsedBody.data
    const hashedPassword = await hashPassword(password)

    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${username}, ${hashedPassword})
      ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    logApiError("admin seed failed", error)
    return NextResponse.json({ success: false, error: "Szerver hiba" }, { status: 500 })
  }
}

