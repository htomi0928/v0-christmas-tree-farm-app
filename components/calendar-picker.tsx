"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CalendarPickerProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  minDate?: Date
  maxDate?: Date
  unavailableDates?: string[]
}

export default function CalendarPicker({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  unavailableDates = [],
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [unavailable, setUnavailable] = useState<string[]>(unavailableDates)
  const [isLoading, setIsLoading] = useState(!unavailableDates.length)
  const [seasonStart, setSeasonStart] = useState<Date | null>(null)
  const [seasonEnd, setSeasonEnd] = useState<Date | null>(null)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.unavailableDays) {
          setUnavailable(data.data.unavailableDays)
        }
        if (data.data?.seasonStart) {
          setSeasonStart(new Date(data.data.seasonStart))
        }
        if (data.data?.seasonEnd) {
          setSeasonEnd(new Date(data.data.seasonEnd))
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [unavailableDates])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isSelectable = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]

    if (seasonStart && date < seasonStart) return false
    if (seasonEnd && date > seasonEnd) return false

    if (minDate && date < minDate) return false
    if (maxDate && date > maxDate) return false

    if (unavailable.includes(dateStr)) return false

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

  const dayNames = ["V", "H", "K", "Sz", "Cs", "P", "Sz"]

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const weeks = []
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
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-foreground/60 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => {
              const dateStr =
                day && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split("T")[0]
              const isSelected = day && selectedDate === dateStr
              const canSelect = day && isSelectable(day)
              const isUnavailable = day && unavailable.includes(dateStr)

              return (
                <button
                  key={dayIndex}
                  type="button"
                  onClick={() => day && handleDayClick(day)}
                  disabled={!canSelect}
                  className={`
                    py-2 rounded-lg font-medium transition-colors text-sm
                    ${!day ? "bg-transparent" : ""}
                    ${canSelect ? "cursor-pointer" : "cursor-not-allowed opacity-30"}
                    ${isSelected ? "bg-accent text-accent-foreground font-bold" : ""}
                    ${isUnavailable ? "bg-destructive/20 text-destructive/70 line-through" : ""}
                    ${!isSelected && canSelect && !isUnavailable ? "bg-primary/10 hover:bg-primary/20 text-foreground" : ""}
                    ${!canSelect && day && !isUnavailable ? "text-foreground/40" : ""}
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
        <p>Az adminisztrator beállítja, mely napok nem érhetők el (piros, áthúzott).</p>
        {isLoading ? (
          <p className="text-foreground/50">Elérhetőség betöltése...</p>
        ) : unavailable.length > 0 ? (
          <p className="text-destructive/70">
            <span className="font-semibold">Megjegyzés:</span> Az áthúzott dátumok nem érhetők el.
          </p>
        ) : null}
      </div>
    </Card>
  )
}
