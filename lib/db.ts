import { neon } from "@neondatabase/serverless"

// Initialize Neon SQL client
export const sql = neon(process.env.DATABASE_URL!)
