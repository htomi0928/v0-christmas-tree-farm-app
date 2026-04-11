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

  const dayNames = ["H", "K", "Sze", "Cs", "P", "Szo", "V"]

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayRaw = getFirstDayOfMonth(currentMonth)
  const firstDay = (firstDayRaw + 6) % 7
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
    <Card className="overflow-hidden border-primary/10 bg-white/75 px-0 py-0">
      <div className="px-5 py-5 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={handlePrevMonth}
            className="rounded-full border border-primary/10 p-2"
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            {currentMonth.getFullYear()}. {monthNames[currentMonth.getMonth()]}
          </p>

          <button
            onClick={handleNextMonth}
            className="rounded-full border border-primary/10 p-2"
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day names header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-foreground/48">
          {dayNames.map((day, index) => (
            <div key={`day-${index}`}>{day}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="mt-3 space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <div key={dayIndex} className="h-11" />
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
                    className={`h-11 rounded-2xl text-sm font-semibold transition ${
                      !inSeason
                        ? "text-foreground/30 cursor-not-allowed"
                        : isUnavailable
                          ? "bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                          : "text-foreground/80 hover:bg-secondary/60 cursor-pointer"
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

      {/* Footer */}
      <div className="border-t border-primary/8 bg-secondary/30 px-5 py-4 sm:px-6">
        {unavailableDays.length > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-foreground/62">
              {unavailableDays.length} nap van kizárva a szezonból.
            </p>
            <Button
              onClick={clearAllUnavailable}
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1 bg-transparent shrink-0"
            >
              <X className="h-4 w-4" />
              Összes törlése
            </Button>
          </div>
        ) : (
          <p className="text-sm text-foreground/62">Kattints egy napra a kizáráshoz a szezonból.</p>
        )}
      </div>
    </Card>
  )
}
