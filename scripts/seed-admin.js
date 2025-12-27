import { neon } from "@neondatabase/serverless"
import { hashPassword } from "../lib/auth"

async function seed {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }
  const sql = neon(process.env.DATABASE_URL!)

  const username = "admin"
  const password = "admin"
  const hashedPassword = await hashPassword(password)

  console.log(`Seeding admin user: ${username}`)

  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${hashedPassword})
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `

  console.log("Admin user seeded successfully.")

}

seed()
  .then(() => {
    console.log("🎉 Done")
    process.exit(0)
  })
  .catch((err) => {
    console.error("❌ Seed failed:", err)
    process.exit(1)
  })
