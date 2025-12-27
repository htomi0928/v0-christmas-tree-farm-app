import { neon } from "@neondatabase/serverless"

// POSTGRES_URL is provided by Vercel/Neon integration
// This variable MUST NOT be prefixed with NEXT_PUBLIC_ to keep it server-side only
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
  // Use console.log for server logs, console.error for v0 diagnostics if needed
  console.log("[v0] Database connection string is missing. Please check your environment variables.")
}

// Initialize Neon SQL client - ensure it's not exported to client components
export const sql = neon(connectionString!)
