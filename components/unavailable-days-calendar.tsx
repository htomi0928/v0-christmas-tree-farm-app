"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UnavailableDaysCalendarProps {
  unavailableDays: string[]
  seasonStart: string
  seasonEnd: string
  onToggleDay: (dateStr: string) => void
}

export default function UnavailableDaysCalendar({
  unavailableDays,
  seasonStart,
  seasonEnd,
  onToggleDay,
}: UnavailableDaysCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isInSeason = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]
    return dateStr >= seasonStart && dateStr <= seasonEnd
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDayClick = (day: number) => {
    if (!isInSeason(day)) return
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]
    onToggleDay(dateStr)
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

  const clearAllUnavailable = () => {
    unavailableDays.forEach((dateStr) => onToggleDay(dateStr))
  }

  return (
    <Card className="p-6 bg-background border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Nem elérhető napok</h3>
        {unavailableDays.length > 0 && (
          <Button
            onClick={clearAllUnavailable}
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1 bg-transparent"
          >
            <X className="h-4 w-4" />
            Összes törlése
          </Button>
        )}
      </div>

      {/* Selected unavailable days display */}
      {unavailableDays.length > 0 && (
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-xs font-semibold text-destructive mb-2">Kijelölt nem elérhető napok:</p>
          <div className="flex flex-wrap gap-2">
            {unavailableDays.sort().map((dateStr) => (
              <div
                key={dateStr}
                className="flex items-center gap-1 px-3 py-1 bg-destructive/20 text-destructive rounded-full text-xs font-medium"
              >
                {new Date(dateStr + "T00:00:00").toLocaleDateString("hu-HU", {
                  month: "short",
                  day: "numeric",
                })}
                <button
                  onClick={() => onToggleDay(dateStr)}
                  className="hover:opacity-70 transition-opacity"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month/Year Navigation */}
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

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-foreground/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              if (!day) {
                return <div key={dayIndex} className="h-10" />
              }

              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              const dateStr = date.toISOString().split("T")[0]
              const isUnavailable = unavailableDays.includes(dateStr)
              const inSeason = isInSeason(day)

              return (
                <button
                  key={dayIndex}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={!inSeason}
                  className={`
                    h-10 rounded-lg font-semibold transition-colors text-sm
                    ${!inSeason ? "bg-transparent text-foreground/20 cursor-not-allowed" : ""}
                    ${inSeason && !isUnavailable ? "bg-green-100 text-green-900 hover:bg-green-200 cursor-pointer" : ""}
                    ${inSeason && isUnavailable ? "bg-destructive text-white hover:bg-destructive/90 cursor-pointer" : ""}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Help text */}
      <div className="mt-6 pt-4 border-t border-border text-xs text-foreground/60">
        <p>
          <span className="text-green-700 font-semibold">Zöld napok:</span> Elérhető foglalásokhoz
        </p>
        <p>
          <span className="text-destructive font-semibold">Piros napok:</span> Nem elérhető, kattints a bejelöléshez
        </p>
      </div>
    </Card>
  )
}
