import "server-only"
import { sql } from "./db"

const SESSION_DURATION_SECONDS = 8 * 60 * 60
const textEncoder = new TextEncoder()
const JWT_ALGORITHM = "HS256"
const AUTH_SECRET = process.env.AUTH_SECRET || "fallback-secret-for-dev-only"

type SessionPayload = {
  sub: string
  iat: number
  exp: number
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url")
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8")
}

async function getJwtKey() {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

async function signJwtSegment(segment: string): Promise<string> {
  const key = await getJwtKey()
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(segment))
  return Buffer.from(signature).toString("base64url")
}

async function verifyJwtSegment(segment: string, signature: string): Promise<boolean> {
  const key = await getJwtKey()
  return crypto.subtle.verify("HMAC", key, Buffer.from(signature, "base64url"), textEncoder.encode(segment))
}

function parsePayload(token: string): SessionPayload | null {
  try {
    const [, payload] = token.split(".")
    if (!payload) return null
    return JSON.parse(base64UrlDecode(payload)) as SessionPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string, saltHex?: string): Promise<string> {
  const saltBuffer = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16))
  const passwordBuffer = textEncoder.encode(password)

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer as BufferSource,
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer as BufferSource,
      iterations: 100_000,
      hash: "SHA-256",
    },
    importedKey,
    256,
  )

  return `${bytesToHex(saltBuffer)}:${bytesToHex(new Uint8Array(derivedBits))}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex] = storedHash.split(":")
  const newHash = await hashPassword(password, saltHex)
  return newHash === storedHash
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  try {
    const rows = await sql`SELECT password_hash FROM admin_users WHERE username = ${username}`
    if (rows.length === 0) return false

    return verifyPassword(password, rows[0].password_hash)
  } catch (error) {
    console.error("[auth] Failed to validate admin credentials:", error)
    return false
  }
}

export async function createSession(username: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = {
    alg: JWT_ALGORITHM,
    typ: "JWT",
  }
  const payload: SessionPayload = {
    sub: username,
    iat: now,
    exp: now + SESSION_DURATION_SECONDS,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signingInput = `${encodedHeader}.${encodedPayload}`
  const signature = await signJwtSegment(signingInput)

  return `${signingInput}.${signature}`
}

export async function validateSession(token: string): Promise<boolean> {
  const session = await getSessionUser(token)
  return session !== null
}

export async function destroySession(token: string): Promise<void> {
  // Stateless JWT sessions are invalidated by clearing the cookie client-side.
  void token
}

export async function getSessionUser(token: string): Promise<string | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts
    const isValidSignature = await verifyJwtSegment(`${encodedHeader}.${encodedPayload}`, signature)
    if (!isValidSignature) return null

    const payload = parsePayload(token)
    if (!payload?.sub || !payload.exp || !payload.iat) return null

    const now = Math.floor(Date.now() / 1000)
    if (payload.exp <= now) return null
    if (payload.iat > now + 60) return null

    return payload.sub
  } catch (error) {
    console.error("[auth] Failed to read admin session:", error)
    return null
  }
}
