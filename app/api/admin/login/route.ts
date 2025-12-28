import "server-only"
import { cookies } from "next/headers"
import { validateCredentials, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return Response.json(
        {
          success: false,
          error: "Felhasználónév és jelszó szükséges",
        },
        { status: 400 },
      )
    }

    if (await validateCredentials(username, password)) {
      const sessionId = createSession(username)

      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
      })

      return Response.json({
        success: true,
      })
    } else {
      return Response.json(
        {
          success: false,
          error: "Hibás felhasználónév vagy jelszó",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Szerver hiba",
      },
      { status: 500 },
    )
  }
}
