import "server-only"
import { sql } from "./db"
import type { Expense, CreateExpenseData } from "./types"
import { PARTNERS, type Partner } from "./partners"

function rowToExpense(row: any): Expense {
  return {
    id: row.id,
    year: Number(row.year),
    description: row.description,
    amount: Number(row.amount),
    person: row.person as Partner,
    date: row.date,
    createdAt: row.created_at,
  }
}

export async function listExpenses(filters: {
  year: number
  person?: Partner
}): Promise<Expense[]> {
  let query = "SELECT * FROM expenses WHERE year = $1"
  const params: any[] = [filters.year]

  if (filters.person) {
    params.push(filters.person)
    query += ` AND person = $${params.length}`
  }

  query += " ORDER BY date DESC, created_at DESC"
  const rows = await sql.unsafe(query, params)
  return rows.map(rowToExpense)
}

export async function createExpense(
  data: CreateExpenseData,
  year: number,
): Promise<{ success: boolean; data?: Expense; error?: string }> {
  if (!data.person || !data.amount || !data.description || !data.date) {
    return { success: false, error: "Minden mező kitöltése kötelező" }
  }
  if (data.amount <= 0) {
    return { success: false, error: "Az összeg pozitív szám kell legyen" }
  }

  const rows = await sql`
    INSERT INTO expenses (year, description, amount, person, date)
    VALUES (${year}, ${data.description}, ${data.amount}, ${data.person}, ${data.date})
    RETURNING *
  `
  return { success: true, data: rowToExpense(rows[0]) }
}

export async function deleteExpense(id: number): Promise<{ success: boolean; error?: string }> {
  const rows = await sql`DELETE FROM expenses WHERE id = ${id} RETURNING id`
  if (rows.length === 0) return { success: false, error: "Kiadás nem található" }
  return { success: true }
}

export async function getExpensesSummary(
  year: number,
): Promise<{ byPartner: Record<Partner, number>; total: number }> {
  const rows = await sql`
    SELECT person, COALESCE(SUM(amount), 0) AS total_amount
    FROM expenses
    WHERE year = ${year}
    GROUP BY person
  `

  const byPartner = Object.fromEntries(PARTNERS.map((partner) => [partner, 0])) as Record<Partner, number>
  let total = 0

  for (const row of rows) {
    const amount = Number(row.total_amount)
    if (row.person in byPartner) {
      byPartner[row.person as Partner] = amount
      total += amount
    }
  }

  return { byPartner, total }
}
