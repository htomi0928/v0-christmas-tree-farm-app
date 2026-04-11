import Link from "next/link"
import { CalendarDays, DollarSign, Trees, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { listReservations } from "@/lib/reservations"
import { getSettings } from "@/lib/settings"
import { getExpensesSummary } from "@/lib/expenses"
import { ReservationStatus } from "@/lib/types"

async function getStats() {
  const reservations = await listReservations()
  const settings = await getSettings()
  const expensesSummary = await getExpensesSummary()

  const totalReservations = reservations.length
  const totalTrees = reservations.reduce((sum, reservation) => sum + reservation.treeCount, 0)
  const now = new Date()
  const nextWeekend = getNextWeekend(now)
  const upcomingReservations = reservations.filter((reservation) => {
    const visitDate = new Date(reservation.visitDate)
    return visitDate >= nextWeekend.start && visitDate <= nextWeekend.end
  })

  const paidReservations = reservations.filter((reservation) => reservation.status === ReservationStatus.PICKED_UP_PAID)
  const revenueJanos = paidReservations.filter((reservation) => reservation.paidTo === "János").reduce((sum, reservation) => sum + reservation.treeCount * settings.pricePerTree, 0)
  const revenueSanyi = paidReservations.filter((reservation) => reservation.paidTo === "Sanyi").reduce((sum, reservation) => sum + reservation.treeCount * settings.pricePerTree, 0)
  const totalRevenue = revenueJanos + revenueSanyi
  const totalExpenses = expensesSummary.total

  return {
    totalReservations,
    totalTrees,
    upcomingReservations: upcomingReservations.length,
    nextWeekendLabel: `${nextWeekend.start.toLocaleDateString("hu-HU")} - ${nextWeekend.end.toLocaleDateString("hu-HU")}`,
    revenueJanos,
    revenueSanyi,
    totalRevenue,
    totalExpenses,
    janosNet: revenueJanos - expensesSummary.janos,
    sanyiNet: revenueSanyi - expensesSummary.sanyi,
    totalNet: totalRevenue - totalExpenses,
    janosExpenses: expensesSummary.janos,
    sanyiExpenses: expensesSummary.sanyi,
  }
}

function getNextWeekend(date: Date) {
  const current = new Date(date)
  const day = current.getDay()
  const start = new Date(current)
  const end = new Date(current)

  if (day === 0) {
    start.setDate(current.getDate() + 6)
    end.setDate(current.getDate() + 7)
  } else if (day === 6) {
    end.setDate(current.getDate() + 1)
  } else {
    start.setDate(current.getDate() + (6 - day))
    end.setDate(current.getDate() + (7 - day))
  }

  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

function money(value: number) {
  return `${value.toLocaleString("hu-HU")} Ft`
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const overviewCards = [
    { label: "Összes foglalás", value: stats.totalReservations, help: "Minden rögzített foglalás", icon: CalendarDays },
    { label: "Összes várható fa", value: stats.totalTrees, help: "Bejelölt vagy várható darabszámok", icon: Trees },
    { label: "Közelgő foglalások", value: stats.upcomingReservations, help: stats.nextWeekendLabel, icon: TrendingUp },
    { label: "Nettó összesen", value: money(stats.totalNet), help: `Kiadás után maradó összeg`, icon: Wallet },
  ]

  const revenueCards = [
    {
      label: "János bevétele",
      value: money(stats.revenueJanos),
      expense: `Kiadás: ${money(stats.janosExpenses)}`,
      net: `Nettó: ${money(stats.janosNet)}`,
      icon: DollarSign,
      className: "from-[rgba(31,94,61,0.16)] to-[rgba(216,234,216,0.95)] text-[color:var(--mint-strong)]",
    },
    {
      label: "Sanyi bevétele",
      value: money(stats.revenueSanyi),
      expense: `Kiadás: ${money(stats.sanyiExpenses)}`,
      net: `Nettó: ${money(stats.sanyiNet)}`,
      icon: DollarSign,
      className: "from-[rgba(53,89,101,0.14)] to-[rgba(215,231,235,0.95)] text-[color:var(--sky-strong)]",
    },
    {
      label: "Összes bevétel",
      value: money(stats.totalRevenue),
      expense: `Összes kiadás: ${money(stats.totalExpenses)}`,
      net: `Nettó összesen: ${money(stats.totalNet)}`,
      icon: TrendingUp,
      className: "from-[rgba(197,155,77,0.18)] to-[rgba(241,223,182,0.96)] text-[color:var(--champagne-strong)]",
    },
    {
      label: "Összes kiadás",
      value: money(stats.totalExpenses),
      expense: `János: ${money(stats.janosExpenses)}`,
      net: `Sanyi: ${money(stats.sanyiExpenses)}`,
      icon: TrendingDown,
      className: "from-[rgba(185,78,71,0.14)] to-[rgba(244,221,221,0.96)] text-[color:var(--rose-strong)]",
    },
  ]

  return (
    <div className="space-y-10">

      {/* Header */}
      <section className="text-center">
        <div className="section-label justify-center">Áttekintés</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#3a3a3a] mb-3 tracking-tight">Dashboard</h1>
        <p className="text-[#4a4f4a] font-light max-w-md mx-auto">A legfontosabb számok és gyors műveletek egy helyen.</p>
      </section>

      {/* Overview stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((item) => (
          <div key={item.label} className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6">
            <item.icon className="h-5 w-5 text-[#6e7f6a] mb-4" />
            <p className="text-xs font-bold text-[#4a4f4a]/50 tracking-widest uppercase mb-2">{item.label}</p>
            <p className="text-3xl font-bold text-[#3a3a3a] tracking-tight mb-1">{item.value}</p>
            <p className="text-sm text-[#4a4f4a] font-light">{item.help}</p>
          </div>
        ))}
      </section>

      {/* Revenue breakdown */}
      <section>
        <div className="section-label justify-center mb-3">Pénzügyek</div>
        <h2 className="text-2xl font-bold text-[#3a3a3a] tracking-tight mb-6 text-center">Bevétel és kiadás</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {revenueCards.map((item) => (
            <div key={item.label} className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-[#4a4f4a]/50 tracking-widest uppercase">{item.label}</p>
                <item.icon className="h-4 w-4 text-[#6e7f6a]" />
              </div>
              <p className="text-2xl font-bold text-[#3a3a3a] tracking-tight mb-3">{item.value}</p>
              <div className="space-y-1 border-t border-[#bfc3c7] pt-3">
                <p className="text-xs text-[#4a4f4a] font-light">{item.expense}</p>
                <p className="text-xs font-semibold text-[#3a3a3a]">{item.net}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8">
          <div className="section-label justify-center mb-3">Navigáció</div>
          <h2 className="text-xl font-bold text-[#3a3a3a] tracking-tight mb-6 text-center">Gyors műveletek</h2>
          <div className="flex flex-col gap-3">
            <Link href="/admin/reservations" className="inline-flex items-center justify-center h-12 px-7 text-base font-semibold rounded-lg bg-[#4a4f4a] text-[#ededed] hover:bg-[#4a4f4a]/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(74,79,74,0.25)] active:translate-y-0 active:shadow-none transition-all duration-200">
              Foglalások megnyitása
            </Link>
            <Link href="/admin/settings" className="inline-flex items-center justify-center h-12 px-7 text-base font-normal rounded-lg border border-[#4a4f4a]/30 text-[#4a4f4a]/70 hover:text-[#4a4f4a] hover:border-[#4a4f4a]/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
              Szezon beállításai
            </Link>
            <Link href="/admin/expenses" className="inline-flex items-center justify-center h-12 px-7 text-base font-normal rounded-lg border border-[#4a4f4a]/30 text-[#4a4f4a]/70 hover:text-[#4a4f4a] hover:border-[#4a4f4a]/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
              Kiadások kezelése
            </Link>
          </div>
        </div>

        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8">
          <div className="section-label justify-center mb-3">Mai teendők</div>
          <h2 className="text-xl font-bold text-[#3a3a3a] tracking-tight mb-4 text-center">Fókusz</h2>
          <div className="space-y-0">
            {[
              "Nézd át a közelgő foglalásokat és ellenőrizd a sorszámokat.",
              "Frissítsd a státuszokat átvétel után.",
              "Rögzítsd a kiadásokat, hogy a nettó összeg naprakész legyen.",
            ].map((item, i) => (
              <div key={i} className="flex gap-4 py-3 border-b border-[#bfc3c7] last:border-b-0">
                <span className="text-[#6e7f6a] font-bold text-sm flex-shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-[#4a4f4a] font-light">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
