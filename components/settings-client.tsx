"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SettingsIcon, CheckCircle2, AlertCircle } from "lucide-react"
import type { Settings } from "@/lib/types"
import UnavailableDaysCalendar from "./unavailable-days-calendar"

interface Props {
  initialSettings: Settings
}

export default function SettingsClient({ initialSettings }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    seasonStart: initialSettings.seasonStart,
    seasonEnd: initialSettings.seasonEnd,
    maxBookingsPerDay: initialSettings.maxBookingsPerDay,
    unavailableDays: initialSettings.unavailableDays,
    retrievalStart: initialSettings.retrievalStart,
    retrievalEnd: initialSettings.retrievalEnd,
    pricePerTree: initialSettings.pricePerTree,
  })

  const handleToggleUnavailableDay = (dateStr: string) => {
    setFormData((prev) => ({
      ...prev,
      unavailableDays: prev.unavailableDays.includes(dateStr)
        ? prev.unavailableDays.filter((d) => d !== dateStr)
        : [...prev.unavailableDays, dateStr],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Beállítások sikeresen mentve")
        setTimeout(() => setSuccess(""), 3000)
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
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-8 flex items-center gap-2">
        <SettingsIcon className="h-8 w-8" />
        Beállítások
      </h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Basic settings */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Szezon beállítások</h2>

            <div className="space-y-6">
              {/* Season Start */}
              <div>
                <label htmlFor="seasonStart" className="block text-sm font-semibold text-foreground mb-2">
                  Szezon kezdete
                </label>
                <input
                  id="seasonStart"
                  type="date"
                  value={formData.seasonStart}
                  onChange={(e) => setFormData({ ...formData, seasonStart: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-foreground/60 mt-1">Mikor nyitnak meg a foglalások az évre</p>
              </div>

              {/* Season End */}
              <div>
                <label htmlFor="seasonEnd" className="block text-sm font-semibold text-foreground mb-2">
                  Szezon vége
                </label>
                <input
                  id="seasonEnd"
                  type="date"
                  value={formData.seasonEnd}
                  onChange={(e) => setFormData({ ...formData, seasonEnd: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-foreground/60 mt-1">Mikor zárnak be a foglalások az évre</p>
              </div>

              {/* Max Bookings Per Day */}
              <div>
                <label htmlFor="maxBookingsPerDay" className="block text-sm font-semibold text-foreground mb-2">
                  Maximális foglalás naponta
                </label>
                <input
                  id="maxBookingsPerDay"
                  type="number"
                  value={formData.maxBookingsPerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxBookingsPerDay: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-foreground/60 mt-1">Hány foglalás megengedett naponta</p>
              </div>

              {/* Price per Tree */}
              <div>
                <label htmlFor="pricePerTree" className="block text-sm font-semibold text-foreground mb-2">
                  Ár per fa (Ft)
                </label>
                <input
                  id="pricePerTree"
                  type="number"
                  value={formData.pricePerTree}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricePerTree: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-foreground/60 mt-1">A fa egységárai forintban (pl. 8000)</p>
              </div>
            </div>
          </Card>

          {/* Retrieval Interval Settings */}
          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Átvételi időszak</h2>

            <div className="space-y-6">
              {/* Retrieval Start */}
              <div>
                <label htmlFor="retrievalStart" className="block text-sm font-semibold text-foreground mb-2">
                  Átvétel kezdete
                </label>
                <input
                  id="retrievalStart"
                  type="date"
                  value={formData.retrievalStart}
                  onChange={(e) => setFormData({ ...formData, retrievalStart: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-foreground/60 mt-1">Első nap, amikor az ügyfelek átvehető a fákat</p>
              </div>

              {/* Retrieval End */}
              <div>
                <label htmlFor="retrievalEnd" className="block text-sm font-semibold text-foreground mb-2">
                  Átvétel vége
                </label>
                <input
                  id="retrievalEnd"
                  type="date"
                  value={formData.retrievalEnd}
                  onChange={(e) => setFormData({ ...formData, retrievalEnd: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Utolsó nap az átvételhez (általában karácsony előtti utolsó vasárnap)
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column - Unavailable days calendar */}
        <div>
          <UnavailableDaysCalendar
            unavailableDays={formData.unavailableDays}
            seasonStart={formData.seasonStart}
            seasonEnd={formData.seasonEnd}
            onToggleDay={handleToggleUnavailableDay}
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-secondary/20 rounded-lg">
        <p className="text-sm text-foreground/70">
          <span className="font-semibold text-primary">Tipp:</span> Az "Nem elérhető napok" календарban (jobb oldalt)
          jelölje meg pirossal azokat a napokat, amikor a foglalás nem lehetséges. Ezek az időpontok automatikusan
          leszűrése a foglalási oldalon.
        </p>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
          {isSaving ? "Mentés..." : "Beállítások mentése"}
        </Button>
      </div>
    </div>
  )
}
