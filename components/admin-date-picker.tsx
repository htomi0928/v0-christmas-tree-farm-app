"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AdminDatePickerProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  highlightDays?: string[] // optional list of dates to highlight as available
  label?: string
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

const monthNames = [
  "január", "február", "március", "április", "május", "június",
  "július", "augusztus", "szeptember", "október", "november", "december",
]
const dayNames = ["V", "H", "K", "Sze", "Cs", "P", "Szo"]

export default function AdminDatePicker({
  selectedDate,
  onDateSelect,
  highlightDays,
  label,
}: AdminDatePickerProps) {
  // Initialize to: selected date's month → first highlighted day's month → current year December
  const initMonth = () => {
    if (selectedDate) {
      const [y, m] = selectedDate.split("-")
      return new Date(Number(y), Number(m) - 1, 1)
    }
    if (highlightDays && highlightDays.length > 0) {
      const first = highlightDays.slice().sort()[0]
      const [y, m] = first.split("-")
      return new Date(Number(y), Number(m) - 1, 1)
    }
    return new Date(new Date().getFullYear(), 11, 1) // December fallback
  }
  const [currentMonth, setCurrentMonth] = useState(initMonth)

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))

  return (
    <Card className="p-4 bg-background border border-border">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="font-semibold text-foreground text-sm">
          {currentMonth.getFullYear()}. {monthNames[currentMonth.getMonth()]}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-foreground/50 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (!day) return <div key={`e-${wi}-${di}`} className="h-9" />
              const dateStr = toDateStr(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              const isSelected = selectedDate === dateStr
              const isHighlighted = highlightDays ? highlightDays.includes(dateStr) : true

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => onDateSelect(isSelected ? "" : dateStr)}
                  className={`
                    h-9 w-full rounded-lg text-sm font-medium transition-colors
                    ${isSelected
                      ? "bg-primary text-primary-foreground font-bold"
                      : isHighlighted
                        ? "bg-green-100 hover:bg-green-200 text-green-900"
                        : "hover:bg-secondary text-foreground"
                    }
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-foreground/60">
            Kiválasztva:{" "}
            <span className="text-foreground font-medium">
              {(() => {
                const [y, m, d] = selectedDate.split("-")
                return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("hu-HU", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric",
                })
              })()}
            </span>
          </p>
        </div>
      )}
    </Card>
  )
}
