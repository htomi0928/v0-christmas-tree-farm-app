import "server-only"
import postgres from "postgres"

const connectionString = process.env.DATABASE_URL
const dbSsl = process.env.DEPLOY_TARGET === "vercel"

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required")
}

const globalForDb = globalThis as typeof globalThis & {
  christmasTreeFarmSql?: ReturnType<typeof postgres>
}

export const sql =
  globalForDb.christmasTreeFarmSql ??
  postgres(connectionString, {
    ssl: dbSsl ? "require" : false,
    max: 2,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  })

globalForDb.christmasTreeFarmSql = sql
