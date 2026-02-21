"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CalendarPickerProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  minDate?: Date
  maxDate?: Date
}

export default function CalendarPicker({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.availableDays) {
          setAvailableDays(data.settings.availableDays)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isSelectable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]

    if (minDate && date < minDate) return false
    if (maxDate && date > maxDate) return false

    // Only allow selection if the day is in availableDays
    if (availableDays.length > 0 && !availableDays.includes(dateStr)) return false

    return true
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDayClick = (day: number) => {
    if (!isSelectable(day)) return

    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]
    onDateSelect(dateStr)
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

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const weeks: (number | null)[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <Card className="p-4 bg-background border border-border">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-secondary rounded-lg transition-colors" type="button">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>

        <h3 className="font-semibold text-foreground">
          {currentMonth.getFullYear()}. {monthNames[currentMonth.getMonth()]}
        </h3>

        <button onClick={handleNextMonth} className="p-2 hover:bg-secondary rounded-lg transition-colors" type="button">
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day, index) => (
          <div key={`day-${index}`} className="text-center text-xs font-semibold text-foreground/60 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => {
              if (!day) {
                return <div key={`empty-${weekIndex}-${dayIndex}`} className="py-2" />
              }

              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              const dateStr = date.toISOString().split("T")[0]
              const isSelected = selectedDate === dateStr
              const canSelect = isSelectable(day)
              const isAvailable = availableDays.includes(dateStr)

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={!canSelect}
                  className={`
                    py-2 rounded-lg font-medium transition-colors text-sm
                    ${canSelect ? "cursor-pointer" : "cursor-not-allowed opacity-30"}
                    ${isSelected ? "bg-accent text-accent-foreground font-bold" : ""}
                    ${!isSelected && canSelect && isAvailable ? "bg-green-100 hover:bg-green-200 text-green-900" : ""}
                    ${!canSelect && !isAvailable ? "bg-secondary/20 text-foreground/30" : ""}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border text-xs text-foreground/60 space-y-1">
        {isLoading ? (
          <p className="text-foreground/50">Elerhetoseg betoltese...</p>
        ) : availableDays.length > 0 ? (
          <p>
            <span className="text-green-700 font-semibold">Zold napok:</span> Elerheto foglalashoz
          </p>
        ) : (
          <p className="text-amber-600">Nincs elerheto nap beallitva. Kerlek, kerj meg az adminisztratort.</p>
        )}
      </div>
    </Card>
  )
}
