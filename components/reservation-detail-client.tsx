"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, CheckCircle2, Save, Trash2 } from "lucide-react"
import { type Reservation, ReservationStatus } from "@/lib/types"
import { formatDateHu, reservationStatusMeta } from "@/lib/site"
import AdminDatePicker from "@/components/admin-date-picker"

interface Props {
  reservation: Reservation
}

const inputClass = "w-full px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] placeholder:text-[#4a4f4a]/40 focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all duration-150"
const labelClass = "block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2"

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [retrievalDays, setRetrievalDays] = useState<string[]>([])
  const [availableDays, setAvailableDays] = useState<string[]>([])

  useEffect(() => {
    // Load the settings for this reservation's own year, not the admin's current view year —
    // editing a 2025 reservation should still see 2025's available_days.
    fetch(`/api/admin/settings?year=${initialReservation.year}`).then((response) => response.json()).then((data) => {
      if (data.settings?.retrievalDays) setRetrievalDays(data.settings.retrievalDays.sort())
      if (data.settings?.availableDays) setAvailableDays(data.settings.availableDays.sort())
    }).catch(() => {})
  }, [initialReservation.year])

  const requiresTreeNumber = (status: ReservationStatus) =>
    status === ReservationStatus.TREE_TAGGED ||
    status === ReservationStatus.CUT ||
    status === ReservationStatus.PICKED_UP_PAID

  const requiresPaidTo = (status: ReservationStatus) =>
    status === ReservationStatus.PICKED_UP_PAID

  // Parse tree numbers from comma-separated string, filtering invalid entries
  const parseTreeNumbers = (input: string): { numbers: number[]; invalidEntries: string[] } => {
    const parts = input.split(",").map((s) => s.trim()).filter(Boolean)
    const numbers: number[] = []
    const invalidEntries: string[] = []
    for (const part of parts) {
      const num = Number.parseInt(part, 10)
      if (Number.isNaN(num) || num <= 0) {
        invalidEntries.push(part)
      } else {
        numbers.push(num)
      }
    }
    return { numbers, invalidEntries }
  }

  const validate = (data: typeof formData): Record<string, string> => {
    const errors: Record<string, string> = {}

    // Tree numbers validation
    if (requiresTreeNumber(data.status) && !data.treeNumbers.trim()) {
      errors.treeNumbers = "A fa sorszáma kötelező ennél a státusznál."
    } else if (data.treeNumbers.trim()) {
      const { numbers, invalidEntries } = parseTreeNumbers(data.treeNumbers)
      if (invalidEntries.length > 0) {
        errors.treeNumbers = `Érvénytelen sorszám(ok): ${invalidEntries.join(", ")}. Csak pozitív egész számok adhatók meg.`
      } else {
        // Check for duplicates within the input
        const seen = new Set<number>()
        const duplicates: number[] = []
        for (const num of numbers) {
          if (seen.has(num)) {
            if (!duplicates.includes(num)) duplicates.push(num)
          } else {
            seen.add(num)
          }
        }
        if (duplicates.length > 0) {
          errors.treeNumbers = `Duplikált sorszám(ok): ${duplicates.join(", ")}. Minden sorszám csak egyszer szerepelhet.`
        }
      }
    }

    if (requiresPaidTo(data.status) && !data.paidTo) {
      errors.paidTo = "Az \"Átvéve és fizetve\" státuszhoz meg kell adni, kinek fizettek."
    }
    return errors
  }

  const handleStatusChange = (newStatus: ReservationStatus) => {
    setFormData((prev) => ({ ...prev, status: newStatus }))
    // Re-validate with new status so errors appear immediately when switching
    setValidationErrors(validate({ ...formData, status: newStatus }))
  }

  const handleSave = async () => {
    const errors = validate(formData)
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError("Kérlek javítsd a hibás mezőket a mentés előtt.")
      return
    }
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
    <div className="space-y-8 pb-10">

      {/* Back link */}
      <Link href="/admin/reservations" className="inline-flex items-center gap-2 text-sm text-[#4a4f4a]/60 hover:text-[#4a4f4a] transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Vissza a listához
      </Link>

      {/* Header */}
      <section className="text-center">
        <div className="section-label justify-center">Foglalás részletei</div>
        <h1 className="text-4xl font-bold text-[#3a3a3a] tracking-tight mb-2">{formData.name}</h1>
        <p className="text-[#4a4f4a] font-light">Látogatás napja: {formatDateHu(formData.visitDate)}</p>
      </section>

      {/* Alerts */}
      {error && (
        <div className="flex gap-3 p-4 border border-destructive/30 bg-destructive/8 rounded-lg text-sm text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />{error}
        </div>
      )}
      {success && (
        <div className="flex gap-3 p-4 border border-[#6e7f6a]/30 bg-[#6e7f6a]/8 rounded-lg text-sm text-[#6e7f6a]">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />{success}
        </div>
      )}

      {/* Status */}
      <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6">
        <p className="text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-4">Gyors státuszváltás</p>
        <select
          value={formData.status}
          onChange={(e) => handleStatusChange(e.target.value as ReservationStatus)}
          className="w-full px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] transition-all duration-150 cursor-pointer"
        >
          {Object.entries(reservationStatusMeta).map(([value, meta]) => (
            <option key={value} value={value}>{meta.label}</option>
          ))}
        </select>
      </div>

      {/* Basic data + Notes */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6 space-y-5">
          <p className="text-xs font-bold text-[#3a3a3a] tracking-widest uppercase">Alapadatok</p>
          <div>
            <label className={labelClass}>Név</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telefonszám</label>
            <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>E-mail</label>
            <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Várható darabszám</label>
            <input type="number" min="1" value={formData.treeCount} onChange={(e) => setFormData({ ...formData, treeCount: Math.max(1, Number.parseInt(e.target.value) || 1) })} className={inputClass} />
          </div>
        </div>

        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6 space-y-5">
          <p className="text-xs font-bold text-[#3a3a3a] tracking-widest uppercase">Sorszám és megjegyzés</p>
          <div>
            <label className={labelClass}>
              Fa sorszáma(i)
              {requiresTreeNumber(formData.status) && <span className="ml-1 text-destructive">*</span>}
            </label>
            <input
              value={formData.treeNumbers}
              onChange={(e) => {
                const updated = { ...formData, treeNumbers: e.target.value }
                setFormData(updated)
                setValidationErrors(validate(updated))
              }}
              placeholder="Például 12, 13"
              className={`${inputClass} ${validationErrors.treeNumbers ? "border-destructive ring-1 ring-destructive/40" : ""}`}
            />
            {validationErrors.treeNumbers && (
              <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {validationErrors.treeNumbers}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Megjegyzés</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} className={inputClass + " resize-none"} />
          </div>
          <div>
            <label className={labelClass}>
              Kinek fizettek?
              {requiresPaidTo(formData.status) && <span className="ml-1 text-destructive">*</span>}
            </label>
            <select
              value={formData.paidTo}
              onChange={(e) => {
                const updated = { ...formData, paidTo: e.target.value as "János" | "Sanyi" | "" }
                setFormData(updated)
                setValidationErrors(validate(updated))
              }}
              className={`${inputClass} ${validationErrors.paidTo ? "border-destructive ring-1 ring-destructive/40" : ""}`}
            >
              <option value="">Még nincs rögzítve</option>
              <option value="János">János</option>
              <option value="Sanyi">Sanyi</option>
            </select>
            {validationErrors.paidTo && (
              <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {validationErrors.paidTo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Date pickers */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6">
          <p className="text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-4">Látogatás napja</p>
          <AdminDatePicker selectedDate={formData.visitDate} onDateSelect={(date) => setFormData({ ...formData, visitDate: date })} highlightDays={availableDays.length > 0 ? availableDays : undefined} />
        </div>
        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6">
          <p className="text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-4">Átvételi nap</p>
          <AdminDatePicker selectedDate={formData.pickupDate} onDateSelect={(date) => setFormData({ ...formData, pickupDate: date })} highlightDays={retrievalDays.length > 0 ? retrievalDays : undefined} />
        </div>
      </div>

      {/* Delete */}
      <div className="border border-destructive/20 bg-destructive/4 rounded-lg p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-destructive/70 tracking-widest uppercase mb-1">Veszélyes művelet</p>
            <p className="text-sm text-[#4a4f4a] font-light">Csak akkor töröld, ha biztosan nincs már szükség erre a foglalásra.</p>
          </div>
          {!showDeleteConfirm ? (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/8 transition-colors flex-shrink-0">
              <Trash2 className="h-4 w-4" />
              Foglalás törlése
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="inline-flex items-center px-5 py-2.5 rounded-lg border border-[#bfc3c7] text-[#4a4f4a] text-sm font-medium hover:bg-[#4a4f4a]/5 transition-colors">
                Mégse
              </button>
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center px-5 py-2.5 rounded-lg bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-60">
                {isDeleting ? "Törlés..." : "Végleges törlés"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save / Back */}
      <div className="flex gap-3">
        <button type="button" onClick={() => router.push("/admin/reservations")} className="flex-1 inline-flex items-center justify-center h-11 rounded-lg border border-[#bfc3c7] text-[#4a4f4a] text-sm font-medium hover:bg-[#4a4f4a]/5 transition-colors">
          Vissza
        </button>
        <button type="button" onClick={handleSave} disabled={isSaving} className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#4a4f4a] text-[#ededed] text-sm font-semibold hover:bg-[#4a4f4a]/90 transition-colors disabled:opacity-60">
          <Save className="h-4 w-4" />
          {isSaving ? "Mentés..." : "Mentés"}
        </button>
      </div>

    </div>
  )
}
