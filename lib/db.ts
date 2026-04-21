import "server-only"
import { neon } from "@neondatabase/serverless"

// DATABASE_URL is provided by the database integration
// This variable MUST NOT be prefixed with NEXT_PUBLIC_ to keep it server-side only
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required")
}

// Initialize Neon SQL client - ensure it's not exported to client components
export const sql = neon(connectionString!)
