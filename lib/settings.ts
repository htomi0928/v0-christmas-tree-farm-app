import "server-only"
import { sql } from "./db"
import type { Settings } from "./types"

export async function getSettings(): Promise<Settings> {
  const rows = await sql`SELECT * FROM settings WHERE id = 1`

  if (rows.length === 0) {
    // Return defaults if no settings exist
    return {
      availableDays: [],
      maxBookingsPerDay: 20,
      unavailableDays: [],
      retrievalDays: [],
      pricePerTree: 8000,
    }
  }

  const row = rows[0]

  return {
    availableDays: row.available_days ? row.available_days.split(",").filter(Boolean) : [],
    maxBookingsPerDay: row.max_bookings_per_day,
    unavailableDays: row.unavailable_days ? row.unavailable_days.split(",").filter(Boolean) : [],
    retrievalDays: row.retrieval_days ? row.retrieval_days.split(",").filter(Boolean) : [],
    pricePerTree: row.price,
  }
}

export async function updateSettings(newSettings: Partial<Settings>): Promise<Settings> {
  const current = await getSettings()

  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  if (newSettings.availableDays !== undefined) {
    updates.push(`available_days = $${paramIndex++}`)
    values.push(newSettings.availableDays.join(","))
  }
  if (newSettings.maxBookingsPerDay !== undefined) {
    updates.push(`max_bookings_per_day = $${paramIndex++}`)
    values.push(newSettings.maxBookingsPerDay)
  }
  if (newSettings.unavailableDays !== undefined) {
    updates.push(`unavailable_days = $${paramIndex++}`)
    values.push(newSettings.unavailableDays.join(","))
  }
  if (newSettings.retrievalDays !== undefined) {
    updates.push(`retrieval_days = $${paramIndex++}`)
    values.push(newSettings.retrievalDays.join(","))
  }
  if (newSettings.pricePerTree !== undefined) {
    updates.push(`price = $${paramIndex++}`)
    values.push(newSettings.pricePerTree)
  }

  if (updates.length === 0) {
    return current
  }

  values.push(1) // id = 1
  const query = `UPDATE settings SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`

  const rows = await sql.query(query, values)
  const row = rows[0]

  return {
    availableDays: row.available_days ? row.available_days.split(",").filter(Boolean) : [],
    maxBookingsPerDay: row.max_bookings_per_day,
    unavailableDays: row.unavailable_days ? row.unavailable_days.split(",").filter(Boolean) : [],
    retrievalDays: row.retrieval_days ? row.retrieval_days.split(",").filter(Boolean) : [],
    pricePerTree: row.price,
  }
}
