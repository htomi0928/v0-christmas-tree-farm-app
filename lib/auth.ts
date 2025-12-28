import "server-only"
import { sql } from "./db"

// AUTH_SECRET should be a long, random string stored in Vercel environment variables
const SECRET = process.env.AUTH_SECRET || "fallback-secret-for-dev-only"

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes
}

export async function hashPassword(password: string, saltHex?: string): Promise<string> {
  const enc = new TextEncoder()

  const saltBuffer = saltHex
    ? hexToBytes(saltHex)
    : crypto.getRandomValues(new Uint8Array(16))

  const passwordBuffer = enc.encode(password)

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100_000,
      hash: "SHA-256",
    },
    importedKey,
    256
  )

  const hashHex = [...new Uint8Array(derivedBits)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")

  const saltHexOut = [...saltBuffer]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")

  return `${saltHexOut}:${hashHex}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, _] = storedHash.split(":")
  const newHash = await hashPassword(password, saltHex)
  console.log("NewHash: " + newHash)
  console.log("StoredHash: " + storedHash)
  return newHash === storedHash
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  try {
    const rows = await sql`SELECT password_hash FROM admin_users WHERE username = ${username}`
    if (rows.length === 0) return false

    return await verifyPassword(password, rows[0].password_hash)
  } catch (error) {
    console.error("[v0] Auth database error:", error)
    return false
  }
}

export function createSession(username: string): string {
  const timestamp = Date.now()
  const data = `${username}:${timestamp}`

  // Simple signature - in a full production app, consider using jose for JWT
  const signature = btoa(data + SECRET).substring(0, 32)
  return btoa(`${data}:${signature}`)
}

export function validateSession(token: string): boolean {
  try {
    const decoded = atob(token)
    const [username, timestampStr, signature] = decoded.split(":")
    const timestamp = Number.parseInt(timestampStr)

    const expectedSignature = btoa(`${username}:${timestampStr}${SECRET}`).substring(0, 32)
    if (signature !== expectedSignature) return false

    const age = Date.now() - timestamp
    if (age > SESSION_DURATION) return false

    return true
  } catch (e) {
    return false
  }
}

export function destroySession(_sessionId: string): void {
  // Stateless sessions are "destroyed" by clearing the cookie on the client/response
}

export function getSessionUser(token: string): string | null {
  if (validateSession(token)) {
    try {
      return atob(token).split(":")[0]
    } catch (e) {
      return null
    }
  }
  return null
}
