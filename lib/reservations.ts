import { type Reservation, ReservationStatus, type CreateReservationData, type UpdateReservationData } from "./types"

// In-memory storage - replace with real database
const reservations: Reservation[] = [
  {
    id: 1,
    name: "Kovács István",
    phone: "+36301234567",
    email: "istvan@example.com",
    visitDate: "2024-12-07",
    treeCount: 2,
    notes: "Nagyobb fák, minimum 2m",
    treeNumbers: "12,13",
    status: ReservationStatus.BOOKED,
    createdAt: "2024-11-01T10:30:00Z",
  },
  {
    id: 2,
    name: "Nagy Magda",
    phone: "+36309876543",
    visitDate: "2024-12-08",
    treeCount: 1,
    status: ReservationStatus.TREE_TAGGED,
    createdAt: "2024-11-02T14:15:00Z",
  },
]

let nextId = 3

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
  let result = [...reservations]

  if (filters?.visitDate) {
    result = result.filter((r) => r.visitDate === filters.visitDate)
  }

  if (filters?.status) {
    result = result.filter((r) => r.status === filters.status)
  }

  return result
}

// Get single reservation
export async function getReservationById(id: number): Promise<Reservation | null> {
  return reservations.find((r) => r.id === id) || null
}

// Create reservation
export async function createReservation(
  data: CreateReservationData,
): Promise<{ success: boolean; data?: Reservation; errors?: string[] }> {
  const errors = validateReservationData(data)
  if (errors.length > 0) {
    return { success: false, errors }
  }

  const reservation: Reservation = {
    id: nextId++,
    ...data,
    status: ReservationStatus.BOOKED,
    createdAt: new Date().toISOString(),
  }

  reservations.push(reservation)
  return { success: true, data: reservation }
}

// Update reservation
export async function updateReservation(
  id: number,
  data: UpdateReservationData,
): Promise<{ success: boolean; data?: Reservation; error?: string }> {
  const index = reservations.findIndex((r) => r.id === id)
  if (index === -1) {
    return { success: false, error: "Foglalás nem található" }
  }

  if (data.name !== undefined || data.phone !== undefined || data.treeCount !== undefined) {
    const errors = validateReservationData({
      name: data.name ?? reservations[index].name,
      phone: data.phone ?? reservations[index].phone,
      email: data.email ?? reservations[index].email,
      visitDate: data.visitDate ?? reservations[index].visitDate,
      treeCount: data.treeCount ?? reservations[index].treeCount,
    })
    if (errors.length > 0) {
      return { success: false, error: errors[0] }
    }
  }

  reservations[index] = { ...reservations[index], ...data }
  return { success: true, data: reservations[index] }
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
  const today = new Date()
  const upcomingWeekend = reservations.filter((r) => {
    const date = new Date(r.visitDate)
    return date >= today && (date.getDay() === 0 || date.getDay() === 6)
  }).length

  // Calculate revenue from paid reservations
  const paidReservations = reservations.filter((r) => r.status === ReservationStatus.PICKED_UP_PAID)

  const revenueJanos = paidReservations
    .filter((r) => r.paidTo === "János")
    .reduce((sum, r) => sum + r.treeCount * 8000, 0)

  const revenueSanyi = paidReservations
    .filter((r) => r.paidTo === "Sanyi")
    .reduce((sum, r) => sum + r.treeCount * 8000, 0)

  return {
    totalReservations: reservations.length,
    totalTrees: reservations.reduce((sum, r) => sum + r.treeCount, 0),
    upcomingWeekend,
    revenueJanos,
    revenueSanyi,
    totalRevenue: revenueJanos + revenueSanyi,
  }
}
