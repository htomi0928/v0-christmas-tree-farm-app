import "server-only"
import { sql } from "./db"
import type { Expense, CreateExpenseData } from "./types"

export async function listExpenses(filters?: { person?: "János" | "Sanyi" }): Promise<Expense[]> {
  let query = "SELECT * FROM expenses WHERE 1=1"
  const params: any[] = []

  if (filters?.person) {
    params.push(filters.person)
    query += ` AND person = $${params.length}`
  }

  query += " ORDER BY date DESC, created_at DESC"
  const rows = await sql.query(query, params)

  return rows.map((row: any) => ({
    id: row.id,
    description: row.description,
    amount: row.amount,
    person: row.person === "JÃ¡nos" ? "János" : (row.person as "János" | "Sanyi"),
    date: row.date,
    createdAt: row.created_at,
  }))
}

export async function createExpense(data: CreateExpenseData): Promise<{ success: boolean; data?: Expense; error?: string }> {
  if (!data.person || !data.amount || !data.description || !data.date) {
    return { success: false, error: "Minden mező kitöltése kötelező" }
  }

  if (data.amount <= 0) {
    return { success: false, error: "Az összeg pozitív szám kell legyen" }
  }

  const rows = await sql`
    INSERT INTO expenses (description, amount, person, date)
    VALUES (${data.description}, ${data.amount}, ${data.person}, ${data.date})
    RETURNING *
  `

  const row = rows[0]
  return {
    success: true,
    data: {
      id: row.id,
      description: row.description,
      amount: row.amount,
      person: row.person === "JÃ¡nos" ? "János" : (row.person as "János" | "Sanyi"),
      date: row.date,
      createdAt: row.created_at,
    },
  }
}

export async function deleteExpense(id: number): Promise<{ success: boolean; error?: string }> {
  const rows = await sql`DELETE FROM expenses WHERE id = ${id} RETURNING id`
  if (rows.length === 0) return { success: false, error: "Kiadás nem található" }
  return { success: true }
}

export async function getExpensesSummary(): Promise<{ janos: number; sanyi: number; total: number }> {
  const rows = await sql`
    SELECT person, COALESCE(SUM(amount), 0) as total_amount
    FROM expenses
    GROUP BY person
  `

  let janos = 0
  let sanyi = 0

  for (const row of rows) {
    if (row.person === "János" || row.person === "JÃ¡nos") janos = Number(row.total_amount)
    if (row.person === "Sanyi") sanyi = Number(row.total_amount)
  }

  return { janos, sanyi, total: janos + sanyi }
}
