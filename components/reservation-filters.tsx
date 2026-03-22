"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import type { Reservation, ReservationStatus } from "@/lib/types"
import { ChevronRight, ArrowUp, ArrowDown } from "lucide-react"

interface Props {
  reservations: Reservation[]
  statusLabels: Record<ReservationStatus, string>
  statusColors: Record<ReservationStatus, string>
}

type SortField = "createdAt" | "visitDate" | "pickupDate"
type SortDir = "asc" | "desc"

function formatDateHu(dateStr?: string) {
  if (!dateStr) return "—"
  const [y, m, d] = dateStr.split("-")
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("hu-HU")
}

export default function ReservationFilters({ reservations, statusLabels, statusColors }: Props) {
  const [statusFilter, setStatusFilter] = useState<string | ReservationStatus>("ALL")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const filtered = (statusFilter === "ALL" ? reservations : reservations.filter((r) => r.status === statusFilter))
    .slice()
    .sort((a, b) => {
      let aVal: string
      let bVal: string

      if (sortField === "createdAt") {
        aVal = a.createdAt ?? ""
        bVal = b.createdAt ?? ""
      } else if (sortField === "visitDate") {
        aVal = a.visitDate ?? ""
        bVal = b.visitDate ?? ""
      } else {
        aVal = a.pickupDate ?? ""
        bVal = b.pickupDate ?? ""
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })

  const SortButton = ({ field, label }: { field: SortField; label: string }) => {
    const active = sortField === field
    return (
      <button
        type="button"
        onClick={() => toggleSort(field)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
          active
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-foreground border-border hover:bg-secondary"
        }`}
      >
        {label}
        {active ? (
          sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 opacity-30" />
        )}
      </button>
    )
  }

  return (
    <>
      <Card className="p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div>
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
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Rendezés:</label>
          <div className="flex flex-wrap gap-2">
            <SortButton field="createdAt" label="Létrehozva" />
            <SortButton field="visitDate" label="Látogatás napja" />
            <SortButton field="pickupDate" label="Átvételi nap" />
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-foreground/70">Nincsenek foglalások</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((reservation) => (
            <Link key={reservation.id} href={`/admin/reservations/${reservation.id}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Név</p>
                      <p className="font-semibold text-foreground truncate">{reservation.name}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Látogatás napja</p>
                      <p className="font-semibold text-foreground">{formatDateHu(reservation.visitDate)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Átvételi nap</p>
                      <p className="font-semibold text-foreground">{formatDateHu(reservation.pickupDate)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Fák száma</p>
                      <p className="font-semibold text-foreground">{reservation.treeCount}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Státusz</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[reservation.status]
                        }`}
                      >
                        {statusLabels[reservation.status]}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-foreground/40 flex-shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
