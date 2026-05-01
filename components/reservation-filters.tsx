"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, X, ArrowUp, ArrowDown, ArrowUpDown, Plus } from "lucide-react"
import type { Reservation } from "@/lib/types"
import { reservationStatusMeta, formatDateHu } from "@/lib/site"

interface Props {
  reservations: Reservation[]
}

type SortField = "createdAt" | "visitDate" | "pickupDate" | "treeNumbers"

const sortFieldLabels: Record<SortField, string> = {
  createdAt: "Beérkezés szerint",
  visitDate: "Látogatás napja szerint",
  pickupDate: "Átvétel napja szerint",
  treeNumbers: "Fa sorszám szerint",
}

function toTimestamp(value: unknown) {
  if (typeof value === "string" || value instanceof Date) {
    const timestamp = new Date(value).getTime()
    return Number.isNaN(timestamp) ? 0 : timestamp
  }

  return 0
}

function compareField(a: Reservation, b: Reservation, field: SortField): number {
  if (field === "treeNumbers") {
    return (a.treeNumbers ?? "").localeCompare(b.treeNumbers ?? "", "hu", { numeric: true })
  }
  if (field === "pickupDate") {
    return toTimestamp(a.pickupDate) - toTimestamp(b.pickupDate)
  }
  if (field === "visitDate") {
    return toTimestamp(a.visitDate) - toTimestamp(b.visitDate)
  }
  return toTimestamp(a.createdAt) - toTimestamp(b.createdAt)
}

export default function ReservationFilters({ reservations }: Props) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [visitDateFilter, setVisitDateFilter] = useState("")
  const [dateFocused, setDateFocused] = useState(false)
  const [sortField, setSortField] = useState<SortField>("createdAt")
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
        const diff = compareField(a, b, sortField)
        const dir = sortAsc ? 1 : -1
        if (diff !== 0) return diff * dir
        return toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
      })
  }, [query, reservations, statusFilter, visitDateFilter, sortField, sortAsc])

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
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.7fr_1fr_auto] lg:items-end">
          <label className="block min-w-0">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold text-[#3a3a3a] tracking-widest uppercase"><Search className="h-4 w-4 text-[#6e7f6a]" /> Keresés</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Név, telefonszám, megjegyzés vagy sorszám" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} className="w-full min-w-0 px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] placeholder:text-[#4a4f4a]/40 focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all" />
          </label>

          <label className="block min-w-0">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold text-[#3a3a3a] tracking-widest uppercase"><SlidersHorizontal className="h-4 w-4 text-[#6e7f6a]" /> Státusz</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full min-w-0 px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all">
              <option value="ALL">Minden státusz</option>
              {Object.entries(reservationStatusMeta).map(([value, meta]) => (
                <option key={value} value={value}>{meta.label}</option>
              ))}
            </select>
          </label>

          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase">Nap szerint</span>
            <div className="relative">
              <input type="date" value={visitDateFilter} onChange={(e) => setVisitDateFilter(e.target.value)} onFocus={() => setDateFocused(true)} onBlur={() => setDateFocused(false)} autoComplete="off" className={`w-full min-w-0 max-w-full px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all appearance-none [color-scheme:light] ${!visitDateFilter && !dateFocused ? "text-transparent md:text-[#3a3a3a]" : "text-[#3a3a3a]"}`} style={{ WebkitAppearance: "none" }} />
              {!visitDateFilter && !dateFocused && (
                <span className="pointer-events-none absolute inset-0 flex items-center px-4 text-sm text-[#4a4f4a]/40 md:hidden">
                  Válassz dátumot
                </span>
              )}
            </div>
          </label>

          <div className="block min-w-0">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold text-[#3a3a3a] tracking-widest uppercase">
              <ArrowUpDown className="h-4 w-4 text-[#6e7f6a]" /> Rendezés
            </span>
            <div className="flex gap-1">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="flex-1 min-w-0 px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all"
              >
                {(Object.entries(sortFieldLabels) as [SortField, string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setSortAsc((v) => !v)}
                aria-label={sortAsc ? "Növekvő sorrend" : "Csökkenő sorrend"}
                className="flex items-center justify-center px-3 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#4a4f4a] hover:bg-[#f0efec] transition-colors cursor-pointer shrink-0"
              >
                {sortAsc ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex w-full items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-sm font-semibold text-[#4a4f4a] hover:bg-[#f0efec] transition-colors lg:w-auto lg:whitespace-nowrap cursor-pointer"
            >
              <X className="h-4 w-4 shrink-0" />
              Szűrők törlése
            </button>
          )}
        </div>
      </div>

      <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="px-8 py-10 text-center text-sm text-[#4a4f4a] font-light">Nincs a szűrésnek megfelelő foglalás.</div>
        ) : (
          <>
            {/* Desktop table header */}
            <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_56px_1fr_152px_28px] items-center gap-4 px-6 py-2.5 bg-[#edecea] border-b border-[#bfc3c7]">
              {["Név", "Beérkezett", "Látogatás", "Átvétel", "Db", "Sorszám", "Státusz", ""].map((h) => (
                <span key={h} className="text-[9px] font-bold tracking-widest uppercase text-[#6e7f6a]">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-[#bfc3c7]">
              {filteredReservations.map((reservation) => {
                const meta = reservationStatusMeta[reservation.status] ?? {
                  label: reservation.status,
                  pillClassName: "border-[#bfc3c7] bg-[#f5f4f1] text-[#4a4f4a]",
                }
                const createdShort = new Date(reservation.createdAt).toLocaleDateString("hu-HU", { month: "short", day: "numeric" })
                const visitShort = new Date(reservation.visitDate).toLocaleDateString("hu-HU", { month: "short", day: "numeric" })
                const pickupShort = reservation.pickupDate ? new Date(reservation.pickupDate).toLocaleDateString("hu-HU", { month: "short", day: "numeric" }) : "—"
                return (
                  <Link key={reservation.id} href={`/admin/reservations/${reservation.id}`} className="block hover:bg-[#4a4f4a]/4 transition-colors">
                    {/* Mobile — Option A: label/value grid */}
                    <div className="md:hidden flex flex-col gap-4 px-6 py-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-[#3a3a3a] tracking-tight">{reservation.name}</p>
                          <p className="text-sm text-[#4a4f4a] font-light">{reservation.phone}{reservation.email ? <><br />{reservation.email}</> : ""}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`inline-block rounded-full px-4 py-1 text-xs font-medium border ${meta.pillClassName}`}>{meta.label}</span>
                          <span className="text-xs font-semibold text-[#6e7f6a] tracking-widest uppercase">Megnyitás →</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#6e7f6a] whitespace-nowrap pt-px">Beérkezett</span>
                        <span className="text-sm text-[#3a3a3a] font-light">{formatDateHu(new Date(reservation.createdAt).toISOString().slice(0, 10))}</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#6e7f6a] whitespace-nowrap pt-px">Látogatás</span>
                        <span className="text-sm text-[#3a3a3a] font-light">{formatDateHu(reservation.visitDate)}</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#6e7f6a] whitespace-nowrap pt-px">Átvétel</span>
                        <span className="text-sm text-[#3a3a3a] font-light">{reservation.pickupDate ? formatDateHu(reservation.pickupDate) : "—"}</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#6e7f6a] whitespace-nowrap pt-px">Darab</span>
                        <span className="text-sm text-[#3a3a3a] font-light">{reservation.treeCount} fa</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#6e7f6a] whitespace-nowrap pt-px">Sorszám</span>
                        <span className="text-sm text-[#3a3a3a] font-light">{reservation.treeNumbers || "Még nincs"}</span>
                      </div>
                    </div>
                    {/* Desktop — Option C: table row */}
                    <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_56px_1fr_152px_28px] items-center gap-4 px-6 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-[#3a3a3a]">{reservation.name}</p>
                        <p className="text-xs text-[#4a4f4a] font-light mt-0.5">{reservation.phone}{reservation.email ? <><br />{reservation.email}</> : ""}</p>
                      </div>
                      <span className="text-sm text-[#4a4f4a] font-light">{createdShort}</span>
                      <span className="text-sm text-[#4a4f4a] font-light">{visitShort}</span>
                      <span className="text-sm text-[#4a4f4a] font-light">{pickupShort}</span>
                      <span className="text-sm text-[#4a4f4a] font-light">{reservation.treeCount} fa</span>
                      <span className="text-sm text-[#4a4f4a] font-light">{reservation.treeNumbers || <span className="text-[#bfc3c7]">—</span>}</span>
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium border whitespace-nowrap ${meta.pillClassName}`}>{meta.label}</span>
                      <span className="text-xs font-semibold text-[#6e7f6a] tracking-widest uppercase whitespace-nowrap">→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
