import { sql } from "./db"
import type { Settings } from "./types"

export async function getSettings(): Promise<Settings> {
  const rows = await sql`SELECT * FROM settings WHERE id = 1`

  if (rows.length === 0) {
    // Return defaults if no settings exist
    return {
      seasonStart: `${new Date().getFullYear()}-11-01`,
      seasonEnd: `${new Date().getFullYear()}-12-24`,
      maxBookingsPerDay: 20,
      unavailableDays: [],
      retrievalStart: `${new Date().getFullYear()}-12-20`,
      retrievalEnd: `${new Date().getFullYear()}-12-22`,
      pricePerTree: 8000,
    }
  }

  const row = rows[0]

  return {
    seasonStart: row.season_start,
    seasonEnd: row.season_end,
    maxBookingsPerDay: row.max_bookings_per_day,
    unavailableDays: row.unavailable_days ? row.unavailable_days.split(",").filter(Boolean) : [],
    retrievalStart: row.retrieval_start || `${new Date().getFullYear()}-12-20`,
    retrievalEnd: row.retrieval_end || `${new Date().getFullYear()}-12-22`,
    pricePerTree: row.price,
  }
}

export async function updateSettings(newSettings: Partial<Settings>): Promise<Settings> {
  const current = await getSettings()

  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  if (newSettings.seasonStart !== undefined) {
    updates.push(`season_start = $${paramIndex++}`)
    values.push(newSettings.seasonStart)
  }
  if (newSettings.seasonEnd !== undefined) {
    updates.push(`season_end = $${paramIndex++}`)
    values.push(newSettings.seasonEnd)
  }
  if (newSettings.maxBookingsPerDay !== undefined) {
    updates.push(`max_bookings_per_day = $${paramIndex++}`)
    values.push(newSettings.maxBookingsPerDay)
  }
  if (newSettings.unavailableDays !== undefined) {
    updates.push(`unavailable_days = $${paramIndex++}`)
    values.push(newSettings.unavailableDays.join(","))
  }
  if (newSettings.retrievalStart !== undefined) {
    updates.push(`retrieval_start = $${paramIndex++}`)
    values.push(newSettings.retrievalStart)
  }
  if (newSettings.retrievalEnd !== undefined) {
    updates.push(`retrieval_end = $${paramIndex++}`)
    values.push(newSettings.retrievalEnd)
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
    seasonStart: row.season_start,
    seasonEnd: row.season_end,
    maxBookingsPerDay: row.max_bookings_per_day,
    unavailableDays: row.unavailable_days ? row.unavailable_days.split(",").filter(Boolean) : [],
    retrievalStart: row.retrieval_start,
    retrievalEnd: row.retrieval_end,
    pricePerTree: row.price,
  }
}
