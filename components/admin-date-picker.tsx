"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AdminDatePickerProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  highlightDays?: string[]
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
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

export default function AdminDatePicker({ selectedDate, onDateSelect, highlightDays }: AdminDatePickerProps) {
  const initialMonth = () => {
    if (selectedDate) {
      const [year, month] = selectedDate.split("-")
      return new Date(Number(year), Number(month) - 1, 1)
    }

    if (highlightDays && highlightDays.length > 0) {
      const [year, month] = highlightDays.slice().sort()[0].split("-")
      return new Date(Number(year), Number(month) - 1, 1)
    }

    return new Date(new Date().getFullYear(), 11, 1)
  }

  const [currentMonth, setCurrentMonth] = useState(initialMonth)
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayRaw = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const firstDay = (firstDayRaw + 6) % 7

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const weeks: (number | null)[][] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

  return (
    <Card className="overflow-hidden border-primary/10 bg-white/75 px-0 py-0">
      <div className="px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-full border border-primary/10 p-2"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            {currentMonth.getFullYear()}. {monthNames[currentMonth.getMonth()]}
          </p>

          <button
            type="button"
            className="rounded-full border border-primary/10 p-2"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-foreground/48">
          {dayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => {
                if (!day) return <div key={`${weekIndex}-${dayIndex}`} className="h-10" />

                const dateStr = toDateStr(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                const isSelected = selectedDate === dateStr
                const isHighlighted = highlightDays ? highlightDays.includes(dateStr) : true

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={!isHighlighted}
                    onClick={() => onDateSelect(isSelected ? "" : dateStr)}
                    className={`h-10 rounded-2xl text-sm font-semibold transition ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isHighlighted
                          ? "text-foreground/80 hover:bg-secondary/60"
                          : "text-foreground/30 cursor-not-allowed"
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
}
