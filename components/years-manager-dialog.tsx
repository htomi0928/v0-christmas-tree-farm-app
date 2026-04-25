"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { Plus, Trash2, X, Zap } from "lucide-react"
import type { YearWithCounts } from "@/lib/types"

interface YearsManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  viewYear: number
  activeYear: number | null
}

export function YearsManagerDialog({ open, onOpenChange, activeYear }: YearsManagerDialogProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [years, setYears] = useState<YearWithCounts[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyYear, setBusyYear] = useState<number | null>(null)
  const [newYear, setNewYear] = useState<string>("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch("/api/admin/years")
      .then((r) => r.json())
      .then((body) => {
        if (cancelled) return
        if (body.success) {
          setYears(body.years as YearWithCounts[])
          // Default the "new year" input to highest+1
          const max = body.years.length > 0 ? Math.max(...body.years.map((y: YearWithCounts) => y.year)) : new Date().getFullYear()
          setNewYear(String(max + 1))
        } else {
          setError(body.error ?? "Nem sikerült betölteni az éveket")
        }
      })
      .catch(() => {
        if (!cancelled) setError("Hálózati hiba")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open])

  const refresh = async () => {
    const body = await fetch("/api/admin/years").then((r) => r.json())
    if (body.success) setYears(body.years as YearWithCounts[])
    startTransition(() => router.refresh())
  }

  const handleActivate = async (year: number) => {
    setBusyYear(year)
    setError(null)
    const response = await fetch(`/api/admin/years/${year}/activate`, { method: "POST" })
    const body = await response.json()
    if (!body.success) setError(body.error ?? "Aktiválás sikertelen")
    else await refresh()
    setBusyYear(null)
  }

  const handleDelete = async (year: number) => {
    if (!confirm(`Biztosan törlöd a(z) ${year}-os évet?`)) return
    setBusyYear(year)
    setError(null)
    const response = await fetch(`/api/admin/years/${year}`, { method: "DELETE" })
    const body = await response.json()
    if (!body.success) setError(body.error ?? "Törlés sikertelen")
    else await refresh()
    setBusyYear(null)
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    const parsed = Number.parseInt(newYear, 10)
    if (!Number.isInteger(parsed)) {
      setError("Érvénytelen év")
      return
    }
    setCreating(true)
    setError(null)
    const response = await fetch("/api/admin/years", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ year: parsed }),
    })
    const body = await response.json()
    if (!body.success) setError(body.error ?? "Létrehozás sikertelen")
    else {
      setNewYear(String(parsed + 1))
      await refresh()
    }
    setCreating(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#bfc3c7] bg-[#ededed] p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold text-[#4a4f4a]">Évek kezelése</Dialog.Title>
            <Dialog.Close className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#4a4f4a]/60 hover:bg-[#4a4f4a]/8 hover:text-[#4a4f4a] cursor-pointer">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-1 text-sm text-[#4a4f4a]/70">
            Az aktív év kerül a nyilvános foglalási oldalra. Csak üres év törölhető.
          </Dialog.Description>

          <form onSubmit={handleCreate} className="mt-4 flex items-center gap-2">
            <input
              type="number"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value)}
              min={2000}
              max={3000}
              className="h-9 w-28 rounded-lg border border-[#bfc3c7] bg-white px-3 text-sm font-medium text-[#4a4f4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a4f4a]/30"
            />
            <button
              type="submit"
              disabled={creating}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#4a4f4a] px-3 text-sm font-medium text-[#ededed] hover:bg-[#4a4f4a]/90 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Új év
            </button>
            <span className="text-xs text-[#4a4f4a]/60">
              Beállítások klónozva az előző évből, kivéve a foglalható napokat.
            </span>
          </form>

          {error && (
            <p className="mt-3 rounded-lg border border-[color:var(--rose-border,#d4a8a8)] bg-[color:var(--rose-soft,#f5e3e3)] px-3 py-2 text-sm text-[color:var(--rose-strong,#8a3a3a)]">
              {error}
            </p>
          )}

          <div className="mt-4 max-h-[360px] overflow-y-auto rounded-xl border border-[#bfc3c7] bg-white">
            {loading && <p className="p-4 text-sm text-[#4a4f4a]/60">Betöltés…</p>}
            {!loading && years && years.length === 0 && (
              <p className="p-4 text-sm text-[#4a4f4a]/60">Még nincs egyetlen év sem.</p>
            )}
            {!loading &&
              years?.map((y) => {
                const isActive = activeYear === y.year
                const hasData = y.reservationCount > 0 || y.expenseCount > 0
                const deleteDisabled = isActive || hasData || busyYear === y.year
                const deleteTitle = isActive
                  ? "Aktív évet nem lehet törölni"
                  : hasData
                  ? `${y.reservationCount} foglalás és ${y.expenseCount} kiadás tartozik ehhez az évhez`
                  : "Év törlése"

                return (
                  <div
                    key={y.year}
                    className="flex items-center justify-between gap-4 border-b border-[#bfc3c7] px-4 py-3 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-semibold text-[#4a4f4a]">{y.year}</span>
                      {isActive && (
                        <span className="rounded-full border border-[#6e7f6a] bg-[#6e7f6a]/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[#6e7f6a]">
                          aktív
                        </span>
                      )}
                      <span className="text-xs text-[#4a4f4a]/60">
                        {y.reservationCount} foglalás · {y.expenseCount} kiadás
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleActivate(y.year)}
                        disabled={isActive || busyYear === y.year}
                        title={isActive ? "Már aktív" : "Aktiválás"}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#bfc3c7] px-3 text-xs font-medium text-[#4a4f4a] hover:bg-[#4a4f4a]/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        Aktiválás
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(y.year)}
                        disabled={deleteDisabled}
                        title={deleteTitle}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#bfc3c7] text-[#4a4f4a] hover:bg-[#4a4f4a]/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
