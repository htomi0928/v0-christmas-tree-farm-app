"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { type Reservation, ReservationStatus } from "@/lib/types"
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react"

const statusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.BOOKED]: "Foglalt",
  [ReservationStatus.TREE_TAGGED]: "Fa megjelölve",
  [ReservationStatus.CUT]: "Kivágva",
  [ReservationStatus.PICKED_UP_PAID]: "Átvéve és fizetve",
  [ReservationStatus.NO_SHOW]: "Nem jelent meg",
}

interface Props {
  reservation: Reservation
}

export default function ReservationDetailClient({ reservation: initialReservation }: Props) {
  const [reservation, setReservation] = useState(initialReservation)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: initialReservation.name,
    phone: initialReservation.phone,
    email: initialReservation.email || "",
    visitDate: initialReservation.visitDate,
    treeCount: initialReservation.treeCount,
    status: initialReservation.status,
    treeNumbers: initialReservation.treeNumbers || "",
    notes: initialReservation.notes || "",
    paidTo: initialReservation.paidTo || "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/admin/reservations/${initialReservation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Foglalás sikeresen mentve")
        setReservation(data.reservation)
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      } else {
        setError(data.error || "Hiba a mentés során")
      }
    } catch (error) {
      setError("Hálózati hiba")
      console.error("Error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/reservations">
        <Button variant="outline" className="mb-6 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Vissza a listához
        </Button>
      </Link>

      <Card className="p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Foglalás részletei</h1>

        {error && (
          <div className="mb-6 flex gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex gap-3 p-4 bg-green-100 border border-green-600 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Editable Fields */}
        <div className="space-y-6 mb-8">
          {/* Editable name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
              Név
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Editable phone field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
              Telefonszám
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Editable email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Editable visitDate field */}
          <div>
            <label htmlFor="visitDate" className="block text-sm font-semibold text-foreground mb-2">
              Nap
            </label>
            <input
              id="visitDate"
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Editable treeCount field */}
          <div>
            <label htmlFor="treeCount" className="block text-sm font-semibold text-foreground mb-2">
              Várható fák száma
            </label>
            <input
              id="treeCount"
              type="number"
              value={formData.treeCount}
              onChange={(e) =>
                setFormData({ ...formData, treeCount: Math.max(1, Number.parseInt(e.target.value) || 1) })
              }
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-foreground mb-2">
              Státusz
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ReservationStatus,
                })
              }
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="treeNumbers" className="block text-sm font-semibold text-foreground mb-2">
              Fa sorszámok (pl. 12,13,14)
            </label>
            <input
              id="treeNumbers"
              type="text"
              value={formData.treeNumbers}
              onChange={(e) => setFormData({ ...formData, treeNumbers: e.target.value })}
              placeholder="12,13,14"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-foreground mb-2">
              Megjegyzések
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="paidTo" className="block text-sm font-semibold text-foreground mb-2">
              Kinek fizettek?
            </label>
            <select
              id="paidTo"
              value={formData.paidTo}
              onChange={(e) => setFormData({ ...formData, paidTo: e.target.value as "János" | "Sanyi" | "" })}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Válassz --</option>
              <option value="János">János</option>
              <option value="Sanyi">Sanyi</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Link href="/admin/reservations">
            <Button variant="outline">Vissza</Button>
          </Link>
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
            {isSaving ? "Mentés..." : "Mentés"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
