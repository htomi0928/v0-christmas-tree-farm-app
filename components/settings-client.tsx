"use client"

import { useState } from "react"
import { CheckCircle2, SettingsIcon, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

  const firstDateMonth = (dates: string[]) => {
    if (dates.length > 0) {
      const [year, month] = dates.slice().sort()[0].split("-")
      return new Date(Number(year), Number(month) - 1, 1)
    }
    return new Date(new Date().getFullYear(), 11, 1)
  }

  const [availableMonth, setAvailableMonth] = useState(() => firstDateMonth(initialSettings.availableDays || []))
  const [retrievalMonth, setRetrievalMonth] = useState(() => firstDateMonth(initialSettings.retrievalDays || []))

  const toDateStr = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

  const monthNames = [
    "január",
    "február",
    "március",
    "április",
    "május",
    "június",
    "július",
    "augusztus",
    "szeptember",
    "október",
    "november",
    "december",
  ]

  const dayNames = ["V", "H", "K", "Sze", "Cs", "P", "Szo"]

  const buildWeeks = (monthDate: Date) => {
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay()
    const days: (number | null)[] = []

    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)

    const weeks: (number | null)[][] = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
    return weeks
  }

  const toggleDay = (key: "availableDays" | "retrievalDays", dateStr: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(dateStr)
        ? prev[key].filter((day) => day !== dateStr)
        : [...prev[key], dateStr],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("A beállítások mentése sikerült.")
        setTimeout(() => setSuccess(""), 2500)
      } else {
        setError(data.error || "A mentés nem sikerült.")
      }
    } catch {
      setError("Hálózati hiba történt.")
    } finally {
      setIsSaving(false)
    }
  }

  const CalendarBlock = ({
    title,
    subtitle,
    month,
    onMonthChange,
    dates,
    dayKey,
    colorClass,
  }: {
    title: string
    subtitle: string
    month: Date
    onMonthChange: (date: Date) => void
    dates: string[]
    dayKey: "availableDays" | "retrievalDays"
    colorClass: string
  }) => (
    <Card className="admin-card px-6 py-6">
      <div className="space-y-4 px-6">
        <div>
          <h2 className="text-2xl font-semibold text-primary">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-foreground/66">{subtitle}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-full border border-primary/10 p-2"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            {month.getFullYear()}. {monthNames[month.getMonth()]}
          </p>

          <button
            type="button"
            className="rounded-full border border-primary/10 p-2"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-foreground/48">
          {dayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="space-y-2">
          {buildWeeks(month).map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => {
                if (!day) return <div key={`${weekIndex}-${dayIndex}`} className="h-10" />

                const dateStr = toDateStr(month.getFullYear(), month.getMonth(), day)
                const active = dates.includes(dateStr)

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => toggleDay(dayKey, dateStr)}
                    className={`h-10 rounded-2xl text-sm font-semibold transition ${
                      active ? colorClass : "bg-secondary/50 text-foreground/68 hover:bg-secondary"
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6 pb-24">
      <section>
        <p className="section-kicker">Beállítások</p>
        <h1 className="admin-section-title flex items-center gap-3">
          <SettingsIcon className="h-7 w-7" />
          Szezon és foglalási szabályok
        </h1>
      </section>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-[color:var(--mint-border)] bg-[color:var(--mint-soft)] p-4 text-sm text-[color:var(--mint-strong)]">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="admin-card px-7 py-7">
          <div className="space-y-5 px-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Maximális foglalás naponta</label>
              <input
                type="number"
                min="1"
                value={formData.maxBookingsPerDay}
                onChange={(e) => setFormData({ ...formData, maxBookingsPerDay: Number.parseInt(e.target.value) || 0 })}
                className="input-base"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Ár fánként (Ft)</label>
              <input
                type="number"
                min="1"
                value={formData.pricePerTree}
                onChange={(e) => setFormData({ ...formData, pricePerTree: Number.parseInt(e.target.value) || 0 })}
                className="input-base"
              />
            </div>

            <div className="rounded-[24px] border border-primary/10 bg-secondary/35 p-5 text-sm leading-7 text-foreground/70">
              <p>
                <span className="font-semibold text-primary">Elérhető napok:</span> {formData.availableDays.length}
              </p>
              <p>
                <span className="font-semibold text-primary">Átvételi napok:</span> {formData.retrievalDays.length}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-5">
          <CalendarBlock
            title="Foglalható napok"
            subtitle="Ezek a napok jelennek meg a publikus foglalási naptárban."
            month={availableMonth}
            onMonthChange={setAvailableMonth}
            dates={formData.availableDays}
            dayKey="availableDays"
            colorClass="bg-[color:var(--mint-soft)] text-[color:var(--mint-strong)]"
          />

          <CalendarBlock
            title="Átvételi napok"
            subtitle="Ezek a napok választhatók a későbbi átvételhez."
            month={retrievalMonth}
            onMonthChange={setRetrievalMonth}
            dates={formData.retrievalDays}
            dayKey="retrievalDays"
            colorClass="bg-[color:var(--sky-soft)] text-[color:var(--sky-strong)]"
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[72px] z-40 border-t border-primary/10 bg-[rgba(255,253,249,0.96)] px-4 py-3 shadow-[0_-12px_32px_rgba(16,39,32,0.08)] backdrop-blur md:bottom-0 md:left-auto md:right-0 md:w-[420px] md:rounded-tl-[28px] md:border-l">
        <Button type="button" className="w-full" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Mentés..." : "Beállítások mentése"}
        </Button>
      </div>
    </div>
  )
}
