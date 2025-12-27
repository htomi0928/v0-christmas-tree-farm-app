import { sql } from "../lib/db"

async function testConnection() {
  console.log("[v0] Starting database connection test...")
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("[v0] Database connection successful!")
    console.log("[v0] Current database time:", result[0].current_time)
  } catch (error) {
    console.error("[v0] Database connection failed!")
    console.error("[v0] Error details:", error instanceof Error ? error.message : error)

    if (error instanceof Error && error.message.includes("connection string")) {
      console.error("[v0] It appears the connection string is still missing or invalid.")
    }
  }
}

testConnection()
