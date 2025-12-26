import type { Expense, CreateExpenseData } from "./types"

// In-memory expenses storage - replace with real database
const expenses: Expense[] = []

let nextId = 1

// List expenses with optional filters
export async function listExpenses(filters?: { person?: "János" | "Sanyi" }): Promise<Expense[]> {
  let result = [...expenses]

  if (filters?.person) {
    result = result.filter((e) => e.person === filters.person)
  }

  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Create expense
export async function createExpense(
  data: CreateExpenseData,
): Promise<{ success: boolean; data?: Expense; error?: string }> {
  if (!data.person || !data.amount || !data.description || !data.date) {
    return { success: false, error: "Minden mező kitöltése kötelező" }
  }

  if (data.amount <= 0) {
    return { success: false, error: "Az összeg pozitív szám kell legyen" }
  }

  const expense: Expense = {
    id: nextId++,
    ...data,
    createdAt: new Date().toISOString(),
  }

  expenses.push(expense)
  return { success: true, data: expense }
}

// Delete expense
export async function deleteExpense(id: number): Promise<{ success: boolean; error?: string }> {
  const index = expenses.findIndex((e) => e.id === id)
  if (index === -1) {
    return { success: false, error: "Kiadás nem található" }
  }

  expenses.splice(index, 1)
  return { success: true }
}

// Get expenses summary per person
export async function getExpensesSummary(): Promise<{
  janos: number
  sanyi: number
  total: number
}> {
  const janos = expenses.filter((e) => e.person === "János").reduce((sum, e) => sum + e.amount, 0)
  const sanyi = expenses.filter((e) => e.person === "Sanyi").reduce((sum, e) => sum + e.amount, 0)

  return {
    janos,
    sanyi,
    total: janos + sanyi,
  }
}
