"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, CheckCircle2, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { type Reservation, ReservationStatus } from "@/lib/types"
import { formatDateHu, reservationStatusMeta } from "@/lib/site"
import AdminDatePicker from "@/components/admin-date-picker"

interface Props {
  reservation: Reservation
}

export default function ReservationDetailClient({ reservation: initialReservation }: Props) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: initialReservation.name,
    phone: initialReservation.phone,
    email: initialReservation.email || "",
    visitDate: initialReservation.visitDate,
    pickupDate: initialReservation.pickupDate || "",
    treeCount: initialReservation.treeCount,
    status: initialReservation.status,
    treeNumbers: initialReservation.treeNumbers || "",
    notes: initialReservation.notes || "",
    paidTo: initialReservation.paidTo || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [retrievalDays, setRetrievalDays] = useState<string[]>([])
  const [availableDays, setAvailableDays] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/admin/settings").then((response) => response.json()).then((data) => {
      if (data.settings?.retrievalDays) setRetrievalDays(data.settings.retrievalDays.sort())
      if (data.settings?.availableDays) setAvailableDays(data.settings.availableDays.sort())
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/admin/reservations/${initialReservation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        setSuccess("A foglalás mentése sikerült.")
        setTimeout(() => setSuccess(""), 2500)
      } else {
        setError(data.error || "Hiba történt a mentés közben.")
      }
    } catch {
      setError("Hálózati hiba történt.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")
    try {
      const response = await fetch(`/api/admin/reservations/${initialReservation.id}`, { method: "DELETE" })
      const data = await response.json()
      if (data.success) {
        router.push("/admin/reservations")
      } else {
        setError(data.error || "A törlés nem sikerült.")
      }
    } catch {
      setError("Hálózati hiba történt.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="space-y-5 pb-24">
      <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" />
        Vissza a listához
      </Link>

      <section>
        <p className="section-kicker">Foglalás részletei</p>
        <h1 className="admin-section-title">{formData.name}</h1>
        <p className="mt-2 text-base text-foreground/68">Látogatás napja: {formatDateHu(formData.visitDate)}</p>
      </section>

      {error && <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><div className="flex gap-3"><AlertCircle className="h-5 w-5" />{error}</div></div>}
      {success && <div className="rounded-2xl border border-[color:var(--mint-border)] bg-[color:var(--mint-soft)] p-4 text-sm text-[color:var(--mint-strong)]"><div className="flex gap-3"><CheckCircle2 className="h-5 w-5" />{success}</div></div>}

      <Card className="admin-card px-7 py-7">
        <div className="px-6">
          <h2 className="text-2xl font-semibold text-primary">Gyors státuszváltás</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(reservationStatusMeta).map(([value, meta]) => (
              <button key={value} type="button" onClick={() => setFormData((prev) => ({ ...prev, status: value as ReservationStatus }))} className={`status-pill ${meta.pillClassName} ${formData.status === value ? "ring-2 ring-primary/20" : "opacity-80"}`}>
                {meta.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="admin-card px-7 py-7">
          <div className="space-y-5 px-6">
            <h2 className="text-2xl font-semibold text-primary">Alapadatok</h2>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Név</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Telefonszám</label>
              <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">E-mail</label>
              <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-base" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Várható darabszám</label>
              <input type="number" min="1" value={formData.treeCount} onChange={(e) => setFormData({ ...formData, treeCount: Math.max(1, Number.parseInt(e.target.value) || 1) })} className="input-base" />
            </div>
          </div>
        </Card>

        <Card className="admin-card px-7 py-7">
          <div className="space-y-5 px-6">
            <h2 className="text-2xl font-semibold text-primary">Sorszám és megjegyzés</h2>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Fa sorszáma(i)</label>
              <input value={formData.treeNumbers} onChange={(e) => setFormData({ ...formData, treeNumbers: e.target.value })} placeholder="Például 12, 13" className="input-base" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Megjegyzés</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="textarea-base" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Kinek fizettek?</label>
              <select value={formData.paidTo} onChange={(e) => setFormData({ ...formData, paidTo: e.target.value as "János" | "Sanyi" | "" })} className="select-base">
                <option value="">Még nincs rögzítve</option>
                <option value="János">János</option>
                <option value="Sanyi">Sanyi</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="admin-card px-7 py-7">
          <div className="px-6">
            <h2 className="text-2xl font-semibold text-primary">Látogatás napja</h2>
            <div className="mt-4"><AdminDatePicker selectedDate={formData.visitDate} onDateSelect={(date) => setFormData({ ...formData, visitDate: date })} highlightDays={availableDays.length > 0 ? availableDays : undefined} /></div>
          </div>
        </Card>
        <Card className="admin-card px-7 py-7">
          <div className="px-6">
            <h2 className="text-2xl font-semibold text-primary">Átvételi nap</h2>
            <div className="mt-4"><AdminDatePicker selectedDate={formData.pickupDate} onDateSelect={(date) => setFormData({ ...formData, pickupDate: date })} highlightDays={retrievalDays.length > 0 ? retrievalDays : undefined} /></div>
          </div>
        </Card>
      </div>

      <Card className="admin-card px-7 py-7">
        <div className="flex flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Törlés</h2>
            <p className="mt-2 text-sm text-foreground/64">Csak akkor használd, ha biztosan nincs már szükség a foglalásra.</p>
          </div>
          {!showDeleteConfirm ? (
            <Button type="button" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="h-4 w-4" />
              Foglalás törlése
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)}>Mégse</Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? "Törlés..." : "Végleges törlés"}</Button>
            </div>
          )}
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-[72px] z-40 border-t border-primary/10 bg-[rgba(255,253,249,0.96)] px-4 py-3 shadow-[0_-12px_32px_rgba(16,39,32,0.08)] backdrop-blur md:bottom-0 md:left-auto md:right-0 md:w-[420px] md:rounded-tl-[28px] md:border-l">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/admin/reservations")}>Vissza</Button>
          <Button type="button" className="flex-1" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4" />{isSaving ? "Mentés..." : "Mentés"}</Button>
        </div>
      </div>
    </div>
  )
}

