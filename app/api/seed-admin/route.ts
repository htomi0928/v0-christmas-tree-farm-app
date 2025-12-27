import { neon } from "@neondatabase/serverless"
import { hashPassword } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  if (req.headers.get("x-seed-key") !== process.env.SEED_ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const sql = neon(process.env.DATABASE_URL!)

  const username = "admin"
  const password = "admin" // User should change this immediately
  const hashedPassword = await hashPassword(password)

  console.log(`Seeding admin user: ${username}`)

  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${hashedPassword})
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `

  console.log("Admin user seeded successfully.")

  return NextResponse.json({ ok: true })
}
