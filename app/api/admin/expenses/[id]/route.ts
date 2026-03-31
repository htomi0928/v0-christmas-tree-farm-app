import "server-only"
import { deleteExpense } from "@/lib/expenses"
import { enforceSameOrigin, logApiError, parseNumericId, requireAdminSessionResponse } from "@/lib/api"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const originError = enforceSameOrigin(request)
    if (originError) return originError

    const authError = await requireAdminSessionResponse()
    if (authError) return authError

    const { id } = await params
    const expenseId = parseNumericId(id)
    if (!expenseId) {
      return Response.json({ success: false, error: "Érvénytelen kiadás azonosító" }, { status: 400 })
    }

    const result = await deleteExpense(expenseId)

    if (result.success) {
      return Response.json({ success: true })
    }

    return Response.json({ success: false, error: result.error }, { status: 404 })
  } catch (error) {
    logApiError("admin expense delete failed", error)
    return Response.json({ success: false, error: "Szerver hiba" }, { status: 500 })
  }
}

