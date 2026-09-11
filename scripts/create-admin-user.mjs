/**
 * Standalone CLI script — deliberately does NOT import lib/auth.ts or lib/db.ts,
 * since both are marked "server-only" and throw when loaded outside Next.js's
 * server-component bundling. Duplicates the same PBKDF2 hashing scheme and
 * postgres connection config instead. Plain JS (no TypeScript/tsx needed) so
 * it can be run with nothing but `node`, independent of pnpm/corepack.
 */
import { randomBytes, pbkdf2Sync } from "node:crypto"
import postgres from "postgres"

for (const envFile of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(envFile)
    break
  } catch {
    // file doesn't exist — fall through, and ultimately rely on already-exported env vars
  }
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("[v0] DATABASE_URL environment variable is required")
  process.exit(1)
}

const sql = postgres(connectionString, {
  ssl: process.env.DEPLOY_TARGET === "vercel" ? "require" : false,
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
  prepare: false,
})

function hashPassword(password) {
  const salt = randomBytes(16)
  const derived = pbkdf2Sync(password, salt, 100_000, 32, "sha256")
  return `${salt.toString("hex")}:${derived.toString("hex")}`
}

function parsePasswordArg(args) {
  const inline = args.find((arg) => arg.startsWith("--password="))
  if (inline) return inline.slice("--password=".length)

  const flagIndex = args.indexOf("--password")
  if (flagIndex !== -1) return args[flagIndex + 1]

  return undefined
}

async function main() {
  const args = process.argv.slice(2)
  const reset = args.includes("--reset")
  const explicitPassword = parsePasswordArg(args)
  const username = args.find((arg, i) => !arg.startsWith("--") && args[i - 1] !== "--password")

  if (!username) {
    console.error("[v0] Usage: node scripts/create-admin-user.mjs <username> [--reset] [--password <value>]")
    process.exitCode = 1
    return
  }

  const existing = await sql`SELECT id FROM admin_users WHERE username = ${username}`

  if (reset && existing.length === 0) {
    console.error(`[v0] Cannot reset "${username}": no such admin user exists.`)
    process.exitCode = 1
    return
  }

  if (!reset && existing.length > 0) {
    console.error(`[v0] Admin user "${username}" already exists. Pass --reset to rotate its password.`)
    process.exitCode = 1
    return
  }

  // A password supplied on the command line is assumed to be a deliberate,
  // real password, so it isn't forced through a change on first login —
  // unlike a generated one, which is temporary by nature.
  const password = explicitPassword ?? randomBytes(18).toString("base64url")
  const mustChangePassword = explicitPassword === undefined
  const passwordHash = hashPassword(password)

  if (reset) {
    await sql`
      UPDATE admin_users
      SET password_hash = ${passwordHash}, must_change_password = ${mustChangePassword}
      WHERE username = ${username}
    `
    console.log(`[v0] Reset admin user "${username}"${explicitPassword ? "" : ` — temporary password: ${password}`}`)
  } else {
    await sql`
      INSERT INTO admin_users (username, password_hash, must_change_password)
      VALUES (${username}, ${passwordHash}, ${mustChangePassword})
    `
    console.log(`[v0] Created admin user "${username}"${explicitPassword ? "" : ` — temporary password: ${password}`}`)
  }

  if (mustChangePassword) {
    console.log("[v0] This password must be changed on first login and will not be shown again.")
  }
}

main()
  .catch((error) => {
    console.error("[v0] Failed to create/reset admin user:", error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => {
    void sql.end({ timeout: 5 })
  })
