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
  visitDate: string
  pickupDate?: string
  treeCount: number
  notes?: string
  treeNumbers?: string
  status: ReservationStatus
  createdAt: string
  paidTo?: "János" | "Sanyi"
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
  date: string
  createdAt: string
}

export interface CreateExpenseData {
  person: "János" | "Sanyi"
  amount: number
  description: string
  date: string
}

export interface Settings {
  availableDays: string[]
  maxBookingsPerDay: number
  retrievalDays: string[]
  pricePerTree: number
}
