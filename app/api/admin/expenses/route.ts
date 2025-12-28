import "server-only"
import { listExpenses, createExpense } from "@/lib/expenses"
import { getSessionUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("admin_session")?.value

    if (!sessionId || !getSessionUser(sessionId)) {
      return Response.json({ success: false, error: "Nincs hitelesítés" }, { status: 401 })
    }

    const expenses = await listExpenses()

    return Response.json({ success: true, expenses })
  } catch (error) {
    return Response.json({ success: false, error: "Szerver hiba" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("admin_session")?.value

    if (!sessionId || !getSessionUser(sessionId)) {
      return Response.json({ success: false, error: "Nincs hitelesítés" }, { status: 401 })
    }

    const body = await request.json()
    const result = await createExpense(body)

    if (result.success) {
      return Response.json({ success: true, expense: result.data })
    }

    return Response.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    return Response.json({ success: false, error: "Szerver hiba" }, { status: 500 })
  }
}
