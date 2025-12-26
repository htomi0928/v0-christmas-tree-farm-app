"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import type { Reservation, ReservationStatus } from "@/lib/types"

interface Props {
  reservations: Reservation[]
  statusLabels: Record<ReservationStatus, string>
  statusColors: Record<ReservationStatus, string>
}

export default function ReservationFilters({ reservations, statusLabels, statusColors }: Props) {
  const [statusFilter, setStatusFilter] = useState<string | ReservationStatus>("ALL")

  const filtered = statusFilter === "ALL" ? reservations : reservations.filter((r) => r.status === statusFilter)

  return (
    <Card className="p-4 mb-6">
      <label className="block text-sm font-semibold text-foreground mb-2">Szűrés státusz szerint:</label>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="ALL">Összes ({reservations.length})</option>
        {Object.entries(statusLabels).map(([key, label]) => {
          const count = reservations.filter((r) => r.status === key).length
          return (
            <option key={key} value={key}>
              {label} ({count})
            </option>
          )
        })}
      </select>
    </Card>
  )
}
