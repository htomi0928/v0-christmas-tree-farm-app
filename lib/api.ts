import "server-only"
import { cookies } from "next/headers"
import { z, type ZodType } from "zod"
import { getSessionUser } from "./auth"

export function jsonError(message: string, status: number) {
  return Response.json({ success: false, error: message }, { status })
}

export function jsonErrors(messages: string[], status: number) {
  return Response.json({ success: false, errors: messages }, { status })
}

export async function parseJsonBody<T>(request: Request, schema: ZodType<T>): Promise<
  | { success: true; data: T }
  | { success: false; response: Response }
> {
  try {
    const raw = await request.json()
    const parsed = schema.safeParse(raw)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message)
      return { success: false, response: jsonErrors(messages, 400) }
    }

    return { success: true, data: parsed.data }
  } catch {
    return { success: false, response: jsonError("Érvénytelen JSON kérés.", 400) }
  }
}

export function parseNumericId(value: string): number | null {
  const parsed = z.coerce.number().int().positive().safeParse(value)
  return parsed.success ? parsed.data : null
}

export async function requireAdminUser(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("admin_session")?.value
  if (!sessionToken) return null
  return getSessionUser(sessionToken)
}

export async function requireAdminSessionResponse(): Promise<Response | null> {
  const user = await requireAdminUser()
  if (!user) {
    return jsonError("Nincs hitelesites", 401)
  }

  return null
}

export function enforceSameOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin")
  if (!origin) return null

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  if (!host) {
    return jsonError("Hianyzo host fejlec.", 400)
  }

  const forwardedProto = request.headers.get("x-forwarded-proto")
  const protocol = forwardedProto ?? new URL(origin).protocol.replace(":", "")
  const expectedOrigin = `${protocol}://${host}`

  if (origin !== expectedOrigin) {
    return jsonError("Tiltott keres eredet.", 403)
  }

  return null
}

export function logApiError(context: string, error: unknown) {
  console.error(`[api] ${context}:`, error)
}
