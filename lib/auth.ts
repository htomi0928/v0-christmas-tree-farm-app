// Simple in-memory session store
const VALID_CREDENTIALS = {
  username: "admin",
  password: "fenyo2025",
}

const SECRET = "fenyo-farm-secret-key-2025"

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function validateCredentials(username: string, password: string): boolean {
  return username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password
}

export function createSession(username: string): string {
  const timestamp = Date.now()
  const data = `${username}:${timestamp}`
  // In production, use crypto.createHmac or a JWT library
  const signature = btoa(data + SECRET).substring(0, 16)
  return btoa(`${data}:${signature}`)
}

export function validateSession(token: string): boolean {
  try {
    const decoded = atob(token)
    const [username, timestampStr, signature] = decoded.split(":")
    const timestamp = Number.parseInt(timestampStr)

    // Check if it's the right "signature"
    const expectedSignature = btoa(`${username}:${timestampStr}${SECRET}`).substring(0, 16)
    if (signature !== expectedSignature) return false

    // Check expiration
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
