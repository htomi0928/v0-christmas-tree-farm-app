import "server-only"
import { sql } from "./db"
import { type Reservation, ReservationStatus, type CreateReservationData, type UpdateReservationData } from "./types"

// Format a database date value to YYYY-MM-DD string without timezone shift
function formatDate(value: any): string {
  if (!value) return ""
  // If it's already a YYYY-MM-DD string, return as-is
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  // If it's an ISO string like "2025-12-06T00:00:00.000Z", extract the date part
  if (typeof value === "string" && value.includes("T")) return value.split("T")[0]
  // For Date objects, use local date parts to avoid UTC shift
  const d = new Date(value)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Validation
function validateReservationData(data: CreateReservationData): string[] {
  const errors: string[] = []

  if (!data.name?.trim()) errors.push("Név szükséges")
  if (!data.phone?.trim()) errors.push("Telefonszám szükséges")
  if (!data.visitDate) errors.push("Nap szükséges")
  if (!data.treeCount || data.treeCount < 1) errors.push("Fák száma minimum 1")

  // Basic email validation if provided
  if (data.email && !data.email.includes("@")) errors.push("Érvénytelen email cím")

  return errors
}

// List reservations with optional filters
export async function listReservations(filters?: { visitDate?: string; status?: ReservationStatus }): Promise<
  Reservation[]
> {
  let query = "SELECT * FROM reservations WHERE 1=1"
  const params: any[] = []

  if (filters?.visitDate) {
    params.push(filters.visitDate)
    query += ` AND visit_date = $${params.length}`
  }

  if (filters?.status) {
    params.push(filters.status)
    query += ` AND status = $${params.length}`
  }

  query += " ORDER BY visit_date DESC, created_at DESC"

  const rows = await sql.query(query, params)

  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || undefined,
    visitDate: formatDate(row.visit_date),
    pickupDate: row.pickup_date ? formatDate(row.pickup_date) : undefined,
    treeCount: row.tree_count,
    notes: row.notes || undefined,
    treeNumbers: row.tree_numbers || undefined,
    status: row.status as ReservationStatus,
    paidTo: row.paid_to || undefined,
    createdAt: row.created_at,
  }))
}

// Get single reservation
export async function getReservationById(id: number): Promise<Reservation | null> {
  const rows = await sql`SELECT * FROM reservations WHERE id = ${id}`

  if (rows.length === 0) return null

  const row = rows[0]
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || undefined,
    visitDate: formatDate(row.visit_date),
    pickupDate: row.pickup_date ? formatDate(row.pickup_date) : undefined,
    treeCount: row.tree_count,
    notes: row.notes || undefined,
    treeNumbers: row.tree_numbers || undefined,
    status: row.status as ReservationStatus,
    paidTo: row.paid_to || undefined,
    createdAt: row.created_at,
  }
}

// Create reservation
export async function createReservation(
  data: CreateReservationData,
): Promise<{ success: boolean; data?: Reservation; errors?: string[] }> {
  const errors = validateReservationData(data)
  if (errors.length > 0) {
    return { success: false, errors }
  }

  const rows = await sql`
    INSERT INTO reservations (name, phone, email, visit_date, pickup_date, tree_count, notes, status)
    VALUES (${data.name}, ${data.phone}, ${data.email || null}, ${data.visitDate}, ${data.pickupDate || null}, ${data.treeCount}, ${data.notes || null}, ${ReservationStatus.BOOKED})
    RETURNING *
  `

  const row = rows[0]
  const reservation: Reservation = {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || undefined,
    visitDate: formatDate(row.visit_date),
    pickupDate: row.pickup_date ? formatDate(row.pickup_date) : undefined,
    treeCount: row.tree_count,
    notes: row.notes || undefined,
    treeNumbers: row.tree_numbers || undefined,
    status: row.status as ReservationStatus,
    paidTo: row.paid_to || undefined,
    createdAt: row.created_at,
  }

  return { success: true, data: reservation }
}

// Update reservation
export async function updateReservation(
  id: number,
  data: UpdateReservationData,
): Promise<{ success: boolean; data?: Reservation; error?: string }> {
  // First check if reservation exists
  const existing = await getReservationById(id)
  if (!existing) {
    return { success: false, error: "Foglalás nem található" }
  }

  // Validate if core fields are being updated
  if (data.name !== undefined || data.phone !== undefined || data.treeCount !== undefined) {
    const errors = validateReservationData({
      name: data.name ?? existing.name,
      phone: data.phone ?? existing.phone,
      email: data.email ?? existing.email,
      visitDate: data.visitDate ?? existing.visitDate,
      treeCount: data.treeCount ?? existing.treeCount,
    })
    if (errors.length > 0) {
      return { success: false, error: errors[0] }
    }
  }

  // Build update query dynamically
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex++}`)
    values.push(data.name)
  }
  if (data.phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`)
    values.push(data.phone)
  }
  if (data.email !== undefined) {
    updates.push(`email = $${paramIndex++}`)
    values.push(data.email || null)
  }
  if (data.visitDate !== undefined) {
    updates.push(`visit_date = $${paramIndex++}`)
    values.push(data.visitDate)
  }
  if (data.pickupDate !== undefined) {
    updates.push(`pickup_date = $${paramIndex++}`)
    values.push(data.pickupDate || null)
  }
  if (data.treeCount !== undefined) {
    updates.push(`tree_count = $${paramIndex++}`)
    values.push(data.treeCount)
  }
  if (data.notes !== undefined) {
    updates.push(`notes = $${paramIndex++}`)
    values.push(data.notes || null)
  }
  if (data.treeNumbers !== undefined) {
    updates.push(`tree_numbers = $${paramIndex++}`)
    values.push(data.treeNumbers || null)
  }
  if (data.status !== undefined) {
    updates.push(`status = $${paramIndex++}`)
    values.push(data.status)
  }
  if (data.paidTo !== undefined) {
    updates.push(`paid_to = $${paramIndex++}`)
    values.push(data.paidTo || null)
  }

  if (updates.length === 0) {
    return { success: true, data: existing }
  }

  values.push(id)
  const query = `UPDATE reservations SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`

  const rows = await sql.query(query, values)
  const row = rows[0]

  const updated: Reservation = {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || undefined,
    visitDate: formatDate(row.visit_date),
    pickupDate: row.pickup_date ? formatDate(row.pickup_date) : undefined,
    treeCount: row.tree_count,
    notes: row.notes || undefined,
    treeNumbers: row.tree_numbers || undefined,
    status: row.status as ReservationStatus,
    paidTo: row.paid_to || undefined,
    createdAt: row.created_at,
  }

  return { success: true, data: updated }
}

// Delete reservation
export async function deleteReservation(id: number): Promise<{ success: boolean; error?: string }> {
  const existing = await getReservationById(id)
  if (!existing) {
    return { success: false, error: "Foglalás nem található" }
  }
  await sql`DELETE FROM reservations WHERE id = ${id}`
  return { success: true }
}

// Get stats
export async function getReservationStats(): Promise<{
  totalReservations: number
  totalTrees: number
  upcomingWeekend: number
  revenueJanos: number
  revenueSanyi: number
  totalRevenue: number
}> {
  // Get totals
  const totalsRows = await sql`
    SELECT 
      COUNT(*) as total_reservations,
      COALESCE(SUM(tree_count), 0) as total_trees
    FROM reservations
  `

  // Get upcoming weekend count (Saturday = 6, Sunday = 0 in SQL)
  const today = new Date().toISOString().split("T")[0]
  const upcomingRows = await sql`
    SELECT COUNT(*) as upcoming_weekend
    FROM reservations
    WHERE visit_date >= ${today}
    AND EXTRACT(DOW FROM visit_date) IN (0, 6)
  `

  // Get revenue per person from paid reservations
  const revenueRows = await sql`
    SELECT 
      paid_to,
      SUM(tree_count) as total_trees
    FROM reservations
    WHERE status = ${ReservationStatus.PICKED_UP_PAID}
    AND paid_to IS NOT NULL
    GROUP BY paid_to
  `

  // Get price from settings
  const settingsRows = await sql`SELECT price FROM settings WHERE id = 1`
  const price = settingsRows[0]?.price || 8000

  let revenueJanos = 0
  let revenueSanyi = 0

  for (const row of revenueRows) {
    const revenue = Number(row.total_trees) * price
    if (row.paid_to === "János") {
      revenueJanos = revenue
    } else if (row.paid_to === "Sanyi") {
      revenueSanyi = revenue
    }
  }

  return {
    totalReservations: Number(totalsRows[0].total_reservations),
    totalTrees: Number(totalsRows[0].total_trees),
    upcomingWeekend: Number(upcomingRows[0].upcoming_weekend),
    revenueJanos,
    revenueSanyi,
    totalRevenue: revenueJanos + revenueSanyi,
  }
}
