import { neon } from "@neondatabase/serverless"
import { hashPassword } from "../lib/auth"

async function seed() {
  const sql = neon(process.env.POSTGRES_URL!)

  const username = "admin"
  const password = "admin-password-change-me" // User should change this immediately
  const hashedPassword = await hashPassword(password)

  console.log(`Seeding admin user: ${username}`)

  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${hashedPassword})
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `

  console.log("Admin user seeded successfully.")
}

seed().catch(console.error)
