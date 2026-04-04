"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Reservation } from "@/lib/types"
import { reservationStatusMeta, formatDateHu } from "@/lib/site"

interface Props {
  reservations: Reservation[]
}

function toTimestamp(value: unknown) {
  if (typeof value === "string" || value instanceof Date) {
    const timestamp = new Date(value).getTime()
    return Number.isNaN(timestamp) ? 0 : timestamp
  }

  return 0
}

export default function ReservationFilters({ reservations }: Props) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [visitDateFilter, setVisitDateFilter] = useState("")

  const filteredReservations = useMemo(() => {
    return reservations
      .filter((reservation) => (statusFilter === "ALL" ? true : reservation.status === statusFilter))
      .filter((reservation) => (visitDateFilter ? reservation.visitDate === visitDateFilter : true))
      .filter((reservation) => {
        if (!query.trim()) return true
        const normalized = query.toLowerCase()
        return [reservation.name, reservation.phone, reservation.notes ?? "", reservation.treeNumbers ?? ""].some((value) => value.toLowerCase().includes(normalized))
      })
      .sort((a, b) => {
        const visitDiff = toTimestamp(a.visitDate) - toTimestamp(b.visitDate)
        if (visitDiff !== 0) return visitDiff
        return toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
      })
  }, [query, reservations, statusFilter, visitDateFilter])

  return (
    <div className="space-y-4">
      <Card className="admin-card px-6 py-6">
        <div className="grid gap-4 px-6 lg:grid-cols-[1.2fr_0.8fr_0.7fr]">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><Search className="h-4 w-4" /> Keresés</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Név, telefonszám, megjegyzés vagy sorszám" className="input-base" />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><SlidersHorizontal className="h-4 w-4" /> Státusz</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-base">
              <option value="ALL">Minden státusz</option>
              {Object.entries(reservationStatusMeta).map(([value, meta]) => (
                <option key={value} value={value}>{meta.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-foreground">Nap szerint</span>
            <input type="date" value={visitDateFilter} onChange={(e) => setVisitDateFilter(e.target.value)} className="input-base" />
          </label>
        </div>
      </Card>

      <div className="grid gap-3">
        {filteredReservations.length === 0 ? (
          <Card className="admin-card px-8 py-10">
            <div className="px-6 text-center text-base text-foreground/68">Nincs a szűrésnek megfelelő foglalás.</div>
          </Card>
        ) : (
          filteredReservations.map((reservation) => {
            const meta = reservationStatusMeta[reservation.status]
            return (
              <Link key={reservation.id} href={`/admin/reservations/${reservation.id}`}>
                <Card className="admin-card gap-4 px-6 py-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(16,39,32,0.12)]">
                  <div className="flex flex-col gap-4 px-6 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-semibold text-primary">{reservation.name}</p>
                        <p className="mt-1 text-sm text-foreground/64">
                          {reservation.phone}
                          {reservation.email ? ` • ${reservation.email}` : ""}
                        </p>
                      </div>
                      <div className="grid gap-2 text-sm text-foreground/72 sm:grid-cols-3">
                        <p><span className="font-semibold text-primary">Nap:</span> {formatDateHu(reservation.visitDate)}</p>
                        <p><span className="font-semibold text-primary">Darab:</span> {reservation.treeCount} fa</p>
                        <p><span className="font-semibold text-primary">Sorszám:</span> {reservation.treeNumbers || "Még nincs"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span className={`status-pill ${meta.pillClassName}`}>{meta.label}</span>
                      <span className="text-sm font-semibold text-primary">Megnyitás</span>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
