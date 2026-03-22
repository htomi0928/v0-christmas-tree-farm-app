export enum ReservationStatus {
  BOOKED = "BOOKED",
  TREE_TAGGED = "TREE_TAGGED",
  CUT = "CUT",
  PICKED_UP_PAID = "PICKED_UP_PAID",
  NO_SHOW = "NO_SHOW",
}

export interface Reservation {
  id: number
  name: string
  phone: string
  email?: string
  visitDate: string // ISO date string, day-only
  pickupDate?: string // ISO date string, day-only
  treeCount: number
  notes?: string
  treeNumbers?: string // e.g. "12,13,14"
  status: ReservationStatus
  createdAt: string // ISO datetime
  paidTo?: "János" | "Sanyi" // Who received the payment
}

export interface CreateReservationData {
  name: string
  phone: string
  email?: string
  visitDate: string
  pickupDate?: string
  treeCount: number
  notes?: string
}

export interface UpdateReservationData {
  status?: ReservationStatus
  treeNumbers?: string
  notes?: string
  name?: string
  phone?: string
  email?: string
  visitDate?: string
  pickupDate?: string
  treeCount?: number
  paidTo?: "János" | "Sanyi"
}

export interface Expense {
  id: number
  person: "János" | "Sanyi"
  amount: number
  description: string
  date: string // ISO date
  createdAt: string
}

export interface CreateExpenseData {
  person: "János" | "Sanyi"
  amount: number
  description: string
  date: string
}

export interface Settings {
  availableDays: string[] // Array of ISO date strings - days when booking is available
  maxBookingsPerDay: number
  retrievalDays: string[] // Array of ISO date strings - days when customers can pick up trees
  pricePerTree: number // Price in HUF
}
