import { deleteExpense } from "@/lib/expenses"
import { getSessionUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("admin_session")?.value

    if (!sessionId || !getSessionUser(sessionId)) {
      return Response.json({ success: false, error: "Nincs hitelesítés" }, { status: 401 })
    }

    const { id } = await params
    const result = await deleteExpense(Number.parseInt(id))

    if (result.success) {
      return Response.json({ success: true })
    }

    return Response.json({ success: false, error: result.error }, { status: 404 })
  } catch (error) {
    return Response.json({ success: false, error: "Szerver hiba" }, { status: 500 })
  }
}
