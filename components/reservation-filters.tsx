"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, X, ArrowUpDown, Plus } from "lucide-react"
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
  const [sortAsc, setSortAsc] = useState(true)

  const hasActiveFilters = query.trim() !== "" || statusFilter !== "ALL" || visitDateFilter !== ""

  const clearFilters = () => {
    setQuery("")
    setStatusFilter("ALL")
    setVisitDateFilter("")
  }

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
        const dir = sortAsc ? 1 : -1
        if (visitDiff !== 0) return visitDiff * dir
        return toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
      })
  }, [query, reservations, statusFilter, visitDateFilter, sortAsc])

  return (
    <div className="space-y-4">
      <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6">
        <div className="mb-4 md:hidden">
          <Link
            href="/admin/reservations/quick"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#bfc3c7] bg-white px-4 py-3 text-sm font-semibold text-[#4a4f4a] shadow-sm transition-all hover:border-[#4a4f4a]/40 hover:bg-[#4a4f4a]/6 active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            Gyors foglalás
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.7fr_auto_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold text-[#3a3a3a] tracking-widest uppercase"><Search className="h-4 w-4 text-[#6e7f6a]" /> Keresés</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Név, telefonszám, megjegyzés vagy sorszám" className="w-full px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] placeholder:text-[#4a4f4a]/40 focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all" />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold text-[#3a3a3a] tracking-widest uppercase"><SlidersHorizontal className="h-4 w-4 text-[#6e7f6a]" /> Státusz</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all">
              <option value="ALL">Minden státusz</option>
              {Object.entries(reservationStatusMeta).map(([value, meta]) => (
                <option key={value} value={value}>{meta.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase">Nap szerint</span>
            <input type="date" value={visitDateFilter} onChange={(e) => setVisitDateFilter(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all" />
          </label>

          <button
            type="button"
            onClick={() => setSortAsc((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-sm font-semibold text-[#4a4f4a] hover:bg-[#f0efec] transition-colors whitespace-nowrap cursor-pointer"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortAsc ? "Legrégebbi elöl" : "Legújabb elöl"}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-sm font-semibold text-[#4a4f4a] hover:bg-[#f0efec] transition-colors whitespace-nowrap cursor-pointer"
            >
              <X className="h-4 w-4" />
              Szűrők törlése
            </button>
          )}
        </div>
      </div>

      <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg divide-y divide-[#bfc3c7] overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="px-8 py-10 text-center text-sm text-[#4a4f4a] font-light">Nincs a szűrésnek megfelelő foglalás.</div>
        ) : (
          filteredReservations.map((reservation) => {
            const meta = reservationStatusMeta[reservation.status] ?? {
              label: reservation.status,
              pillClassName: "border-[#bfc3c7] bg-[#f5f4f1] text-[#4a4f4a]",
            }
            return (
              <Link key={reservation.id} href={`/admin/reservations/${reservation.id}`} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-start md:justify-between hover:bg-[#4a4f4a]/4 transition-colors">
                <div className="space-y-2">
                  <div>
                    <p className="text-lg font-semibold text-[#3a3a3a] tracking-tight">{reservation.name}</p>
                    <p className="text-sm text-[#4a4f4a] font-light">
                      {reservation.phone}
                      {reservation.email ? ` · ${reservation.email}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#4a4f4a]">
                    <p><span className="font-semibold text-[#3a3a3a]">Nap:</span> <span className="font-light">{formatDateHu(reservation.visitDate)}</span></p>
                    <p><span className="font-semibold text-[#3a3a3a]">Darab:</span> <span className="font-light">{reservation.treeCount} fa</span></p>
                    <p><span className="font-semibold text-[#3a3a3a]">Sorszám:</span> <span className="font-light">{reservation.treeNumbers || "Még nincs"}</span></p>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between gap-2 md:flex-col md:items-end flex-shrink-0">
                  <span className={`inline-block rounded-full px-4 py-1 text-xs font-medium border ${meta.pillClassName}`}>{meta.label}</span>
                  <span className="text-xs font-semibold text-[#6e7f6a] tracking-widest uppercase">Megnyitás →</span>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
