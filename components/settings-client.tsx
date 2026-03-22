"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SettingsIcon, CheckCircle2, AlertCircle, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { Settings } from "@/lib/types"

interface Props {
  initialSettings: Settings
}

export default function SettingsClient({ initialSettings }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    availableDays: initialSettings.availableDays || [],
    maxBookingsPerDay: initialSettings.maxBookingsPerDay,
    retrievalDays: initialSettings.retrievalDays || [],
    pricePerTree: initialSettings.pricePerTree,
  })

  // Helper: pick the month of the first sorted date in a list, fallback to current year December
  const firstDateMonth = (dates: string[]): Date => {
    if (dates.length > 0) {
      const first = dates.slice().sort()[0]
      const [y, m] = first.split("-")
      return new Date(Number(y), Number(m) - 1, 1)
    }
    return new Date(new Date().getFullYear(), 11, 1)
  }

  // Independent calendar states for each calendar
  const [availableMonth, setAvailableMonth] = useState(() => firstDateMonth(initialSettings.availableDays || []))
  const [retrievalMonth, setRetrievalMonth] = useState(() => firstDateMonth(initialSettings.retrievalDays || []))

  // Helper to format date as YYYY-MM-DD without timezone shift
  const toDateStr = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const handleToggleAvailableDay = (dateStr: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(dateStr)
        ? prev.availableDays.filter((d) => d !== dateStr)
        : [...prev.availableDays, dateStr],
    }))
  }

  const handleToggleRetrievalDay = (dateStr: string) => {
    setFormData((prev) => ({
      ...prev,
      retrievalDays: prev.retrievalDays.includes(dateStr)
        ? prev.retrievalDays.filter((d) => d !== dateStr)
        : [...prev.retrievalDays, dateStr],
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
        setSuccess("Beallitasok sikeresen mentve")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Hiba a mentes soran")
      }
    } catch (error) {
      setError("Halozati hiba")
      console.error("Error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = [
    "januar",
    "februar",
    "marcius",
    "aprilis",
    "majus",
    "junius",
    "julius",
    "augusztus",
    "szeptember",
    "oktober",
    "november",
    "december",
  ]

  const dayNames = ["V", "H", "K", "Sze", "Cs", "P", "Szo"]

  const buildWeeks = (monthDate: Date) => {
    const daysInMonth = getDaysInMonth(monthDate)
    const firstDay = getFirstDayOfMonth(monthDate)
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    const weeks: (number | null)[][] = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
    return weeks
  }

  const availableWeeks = buildWeeks(availableMonth)
  const retrievalWeeks = buildWeeks(retrievalMonth)

  const clearAllAvailable = () => {
    setFormData((prev) => ({ ...prev, availableDays: [] }))
  }

  const clearAllRetrieval = () => {
    setFormData((prev) => ({ ...prev, retrievalDays: [] }))
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold text-primary mb-8 flex items-center gap-2">
        <SettingsIcon className="h-8 w-8" />
        Beallitasok
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Basic settings */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">Altalanos beallitasok</h2>

            <div className="space-y-6">
              {/* Max Bookings Per Day */}
              <div>
                <label htmlFor="maxBookingsPerDay" className="block text-sm font-semibold text-foreground mb-2">
                  Maximalis foglalas naponta
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
                <p className="text-xs text-foreground/60 mt-1">Hany foglalas megengedett naponta</p>
              </div>

              {/* Price per Tree */}
              <div>
                <label htmlFor="pricePerTree" className="block text-sm font-semibold text-foreground mb-2">
                  Ar per fa (Ft)
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
                <p className="text-xs text-foreground/60 mt-1">A fa egysegarai forintban (pl. 8000)</p>
              </div>
            </div>
          </Card>

          {/* Selected days summary */}
          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Osszefoglalas</h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-green-700">Elerheto napok:</span>
                <span className="ml-2">{formData.availableDays.length} nap</span>
              </div>
              <div>
                <span className="font-semibold text-blue-700">Atveteli napok:</span>
                <span className="ml-2">{formData.retrievalDays.length} nap</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle column - Available Days Calendar */}
        <Card className="p-6 bg-background border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Elerheto napok</h3>
            {formData.availableDays.length > 0 && (
              <Button onClick={clearAllAvailable} variant="outline" size="sm" className="text-xs flex items-center gap-1 bg-transparent">
                <X className="h-4 w-4" />
                Torles
              </Button>
            )}
          </div>
          <p className="text-xs text-foreground/60 mb-4">
            Kattints a napokra a foglalashoz elerheto napok megjelolesehez (zold)
          </p>

          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setAvailableMonth(new Date(availableMonth.getFullYear(), availableMonth.getMonth() - 1, 1))} className="p-2 hover:bg-secondary rounded-lg transition-colors" type="button">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>

            <h3 className="font-semibold text-foreground">
              {availableMonth.getFullYear()}. {monthNames[availableMonth.getMonth()]}
            </h3>

            <button onClick={() => setAvailableMonth(new Date(availableMonth.getFullYear(), availableMonth.getMonth() + 1, 1))} className="p-2 hover:bg-secondary rounded-lg transition-colors" type="button">
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Day names header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, index) => (
              <div key={`avail-day-${index}`} className="text-center text-xs font-semibold text-foreground/60 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {availableWeeks.map((week, weekIndex) => (
              <div key={`avail-week-${weekIndex}`} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={`avail-empty-${weekIndex}-${dayIndex}`} className="h-10" />
                  }

                  const dateStr = toDateStr(availableMonth.getFullYear(), availableMonth.getMonth(), day)
                  const isAvailable = formData.availableDays.includes(dateStr)

                  return (
                    <button
                      key={`avail-${dateStr}`}
                      type="button"
                      onClick={() => handleToggleAvailableDay(dateStr)}
                      className={`
                        h-10 rounded-lg font-semibold transition-colors text-sm cursor-pointer
                        ${isAvailable ? "bg-green-500 text-white hover:bg-green-600" : "bg-secondary/50 text-foreground/60 hover:bg-secondary"}
                      `}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Selected days list */}
          {formData.availableDays.length > 0 && (
            <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg max-h-32 overflow-y-auto">
              <p className="text-xs font-semibold text-green-800 mb-2">Kijelolt napok:</p>
              <div className="flex flex-wrap gap-1">
                {formData.availableDays.sort().map((dateStr) => (
                  <span
                    key={`avail-tag-${dateStr}`}
                    className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs"
                  >
                    {dateStr}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Right column - Retrieval Days Calendar */}
        <Card className="p-6 bg-background border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Atveteli napok</h3>
            {formData.retrievalDays.length > 0 && (
              <Button onClick={clearAllRetrieval} variant="outline" size="sm" className="text-xs flex items-center gap-1 bg-transparent">
                <X className="h-4 w-4" />
                Torles
              </Button>
            )}
          </div>
          <p className="text-xs text-foreground/60 mb-4">
            Kattints a napokra az atveteli napok megjelolesehez (kek)
          </p>

          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setRetrievalMonth(new Date(retrievalMonth.getFullYear(), retrievalMonth.getMonth() - 1, 1))} className="p-2 hover:bg-secondary rounded-lg transition-colors" type="button">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>

            <h3 className="font-semibold text-foreground">
              {retrievalMonth.getFullYear()}. {monthNames[retrievalMonth.getMonth()]}
            </h3>

            <button onClick={() => setRetrievalMonth(new Date(retrievalMonth.getFullYear(), retrievalMonth.getMonth() + 1, 1))} className="p-2 hover:bg-secondary rounded-lg transition-colors" type="button">
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Day names header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, index) => (
              <div key={`retr-day-${index}`} className="text-center text-xs font-semibold text-foreground/60 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {retrievalWeeks.map((week, weekIndex) => (
              <div key={`retr-week-${weekIndex}`} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={`retr-empty-${weekIndex}-${dayIndex}`} className="h-10" />
                  }

                  const dateStr = toDateStr(retrievalMonth.getFullYear(), retrievalMonth.getMonth(), day)
                  const isRetrieval = formData.retrievalDays.includes(dateStr)

                  return (
                    <button
                      key={`retr-${dateStr}`}
                      type="button"
                      onClick={() => handleToggleRetrievalDay(dateStr)}
                      className={`
                        h-10 rounded-lg font-semibold transition-colors text-sm cursor-pointer
                        ${isRetrieval ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-secondary/50 text-foreground/60 hover:bg-secondary"}
                      `}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Selected days list */}
          {formData.retrievalDays.length > 0 && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg max-h-32 overflow-y-auto">
              <p className="text-xs font-semibold text-blue-800 mb-2">Kijelolt napok:</p>
              <div className="flex flex-wrap gap-1">
                {formData.retrievalDays.sort().map((dateStr) => (
                  <span
                    key={`retr-tag-${dateStr}`}
                    className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs"
                  >
                    {dateStr}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-secondary/20 rounded-lg">
        <p className="text-sm text-foreground/70">
          <span className="font-semibold text-primary">Tipp:</span> Kattints egyszer egy napra az "Elerheto napok" vagy "Atveteli napok" naptarban a nap kijelolesehez/eltavolitasahoz. A zold napok a foglalashoz elerheto napok, a kek napok az atveteli napok.
        </p>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
          {isSaving ? "Mentes..." : "Beallitasok mentese"}
        </Button>
      </div>
    </div>
  )
}
