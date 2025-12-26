import type { Settings } from "./types"

// In-memory settings storage
let settings: Settings = {
  seasonStart: `${new Date().getFullYear()}-11-01`,
  seasonEnd: `${new Date().getFullYear()}-12-24`,
  maxBookingsPerDay: 20,
  unavailableDays: [],
  retrievalStart: `${new Date().getFullYear()}-12-20`,
  retrievalEnd: `${new Date().getFullYear()}-12-22`,
  pricePerTree: 8000,
}

export async function getSettings(): Promise<Settings> {
  return { ...settings }
}

export async function updateSettings(newSettings: Partial<Settings>): Promise<Settings> {
  settings = { ...settings, ...newSettings }
  return { ...settings }
}
