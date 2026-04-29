"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReservationStatus } from "@/lib/types"
import { reservationStatusMeta } from "@/lib/site"
import { useUnsavedChanges } from "@/contexts/unsaved-changes-context"

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] placeholder:text-[#4a4f4a]/40 focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] text-sm transition-all duration-150"
const labelClass = "block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2"

interface QuickReservationFormProps {
  currentAdminPaidTo: "Sanyi" | "János" | null
}

export default function QuickReservationForm({ currentAdminPaidTo }: QuickReservationFormProps) {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
  const adminNamePlaceholder = `Admin foglalás ${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`
  const router = useRouter()
  const { setDirty, navigate } = useUnsavedChanges()
  const alertRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (error) setTimeout(() => alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50)
  }, [error])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    visitDate: "",
    pickupDate: "",
    treeCount: 1,
    notes: "",
    status: ReservationStatus.BOOKED,
    treeNumbers: "",
    paidTo: "",
  })
  const initialFormData = {
    name: "",
    phone: "",
    email: "",
    visitDate: "",
    pickupDate: "",
    treeCount: 1,
    notes: "",
    status: ReservationStatus.BOOKED,
    treeNumbers: "",
    paidTo: "",
  }

  useEffect(() => {
    const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData)
    setDirty(isDirty)
  }, [formData, setDirty])
  useEffect(() => () => setDirty(false), [setDirty])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")

    if (!Number.isInteger(formData.treeCount) || formData.treeCount < 1 || formData.treeCount > 20) {
      setError("A fák száma 1 és 20 között lehet.")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/reservations/quick", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        setError(data.error || data.errors?.join(", ") || "A gyors mentés nem sikerült.")
        return
      }

      setDirty(false)
      router.push(`/admin/reservations/${data.reservation.id}?created=true`)
    } catch {
      setError("Hálózati hiba történt.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = (nextStatus: ReservationStatus) => {
    setFormData((prev) => {
      if (nextStatus === ReservationStatus.BOOKED) {
        return {
          ...prev,
          status: nextStatus,
          visitDate: "",
          pickupDate: "",
          treeNumbers: "",
          paidTo: "",
        }
      }

      if (nextStatus === ReservationStatus.TREE_TAGGED) {
        return {
          ...prev,
          status: nextStatus,
          visitDate: today,
          pickupDate: "",
          treeNumbers: "",
          paidTo: "",
        }
      }

      if (nextStatus === ReservationStatus.CUT) {
        return {
          ...prev,
          status: nextStatus,
          visitDate: today,
          pickupDate: "",
          treeNumbers: "0",
          paidTo: "",
        }
      }

      if (nextStatus === ReservationStatus.PICKED_UP) {
        return {
          ...prev,
          status: nextStatus,
          visitDate: today,
          pickupDate: today,
          treeNumbers: "0",
          paidTo: currentAdminPaidTo || prev.paidTo || "",
        }
      }

      if (nextStatus === ReservationStatus.FREE) {
        return {
          ...prev,
          status: nextStatus,
          visitDate: today,
          pickupDate: today,
          treeNumbers: "0",
          paidTo: "",
        }
      }

      return { ...prev, status: nextStatus }
    })
  }

  const handlePaidToChange = (nextPaidTo: string) => {
    if (nextPaidTo) {
      setFormData((prev) => ({
        ...prev,
        paidTo: nextPaidTo,
        status: ReservationStatus.PICKED_UP,
        treeNumbers: "0",
        pickupDate: prev.pickupDate || today,
      }))
      return
    }

    setFormData((prev) => ({ ...prev, paidTo: nextPaidTo }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div ref={alertRef} className="flex gap-3 p-4 border border-destructive/30 bg-destructive/8 rounded-lg text-sm text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6">
        <label className={labelClass}>Státusz</label>
        <select
          value={formData.status}
          onChange={(e) => handleStatusChange(e.target.value as ReservationStatus)}
          className={inputClass}
        >
          {Object.entries(reservationStatusMeta)
            .filter(([value]) => value !== ReservationStatus.NO_SHOW)
            .map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="min-w-0 border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6 space-y-5">
          <p className="text-xs font-bold text-[#3a3a3a] tracking-widest uppercase">Alapadatok</p>
          <div>
            <label className={labelClass}>Név</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={adminNamePlaceholder}
              className={inputClass}
            />
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
            <label className={labelClass}>Darabszám *</label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.treeCount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  treeCount: Number.parseInt(e.target.value, 10) || 1,
                })
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="min-w-0 border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6 space-y-5">
          <p className="text-xs font-bold text-[#3a3a3a] tracking-widest uppercase">Dátumok és további adatok</p>
          <div>
            <label className={labelClass}>Látogatás napja</label>
            <input type="date" value={formData.visitDate} onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Átvételi nap</label>
            <input type="date" value={formData.pickupDate} onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fa sorszáma</label>
            <input value={formData.treeNumbers} onChange={(e) => setFormData({ ...formData, treeNumbers: e.target.value })} placeholder="Pl. 0 vagy 12, 13" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Kinek fizettek?</label>
            <select value={formData.paidTo} onChange={(e) => handlePaidToChange(e.target.value)} className={inputClass}>
              <option value="">Még nincs rögzítve</option>
              <option value="János">János</option>
              <option value="Sanyi">Sanyi</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Megjegyzes</label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={inputClass + " resize-none"}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => navigate("/admin/reservations")}>
          Vissza
        </Button>
        <Button type="submit" size="lg" className="flex-1" disabled={isSaving}>
          <Save className="h-4 w-4" />
          {isSaving ? "Mentés..." : "Gyors foglalás mentése"}
        </Button>
      </div>
    </form>
  )
}

