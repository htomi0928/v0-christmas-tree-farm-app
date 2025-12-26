// Simple in-memory session store
const VALID_CREDENTIALS = {
  username: "admin",
  password: "fenyo2025",
}

const sessions: Map<string, { username: string; createdAt: number }> = new Map()

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function validateCredentials(username: string, password: string): boolean {
  return username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password
}

export function createSession(username: string): string {
  const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  sessions.set(sessionId, {
    username,
    createdAt: Date.now(),
  })
  return sessionId
}

export function validateSession(sessionId: string): boolean {
  const session = sessions.get(sessionId)
  if (!session) return false

  const age = Date.now() - session.createdAt
  if (age > SESSION_DURATION) {
    sessions.delete(sessionId)
    return false
  }

  return true
}

export function destroySession(sessionId: string): void {
  sessions.delete(sessionId)
}

export function getSessionUser(sessionId: string): string | null {
  if (validateSession(sessionId)) {
    return sessions.get(sessionId)?.username || null
  }
  return null
}
