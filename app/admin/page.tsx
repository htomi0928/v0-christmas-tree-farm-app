import { Card } from "@/components/ui/card"
import { Calendar, Trees, TrendingUp, DollarSign, TrendingDown } from "lucide-react"
import { listReservations } from "@/lib/reservations"
import { getSettings } from "@/lib/settings"
import { getExpensesSummary } from "@/lib/expenses"
import { ReservationStatus } from "@/lib/types"

async function getStats() {
  const reservations = await listReservations()
  const settings = await getSettings()
  const expensesSummary = await getExpensesSummary()

  const totalReservations = reservations.length
  const totalTrees = reservations.reduce((sum, r) => sum + r.treeCount, 0)

  // Calculate upcoming weekend
  const now = new Date()
  const nextWeekend = getNextWeekend(now)
  const upcomingWeekend = reservations.filter((r) => {
    const visitDate = new Date(r.visitDate)
    return visitDate >= nextWeekend.start && visitDate <= nextWeekend.end
  }).length

  const paidReservations = reservations.filter((r) => r.status === ReservationStatus.PICKED_UP_PAID)

  const revenueJanos = paidReservations
    .filter((r) => r.paidTo === "János")
    .reduce((sum, r) => sum + r.treeCount * settings.pricePerTree, 0)

  const revenueSanyi = paidReservations
    .filter((r) => r.paidTo === "Sanyi")
    .reduce((sum, r) => sum + r.treeCount * settings.pricePerTree, 0)

  const totalRevenue = revenueJanos + revenueSanyi

  const netJanos = revenueJanos - expensesSummary.janos
  const netSanyi = revenueSanyi - expensesSummary.sanyi
  const netTotal = totalRevenue - expensesSummary.total

  return {
    totalReservations,
    totalTrees,
    upcomingWeekend,
    revenueJanos,
    revenueSanyi,
    totalRevenue,
    expensesJanos: expensesSummary.janos,
    expensesSanyi: expensesSummary.sanyi,
    totalExpenses: expensesSummary.total,
    netJanos,
    netSanyi,
    netTotal,
  }
}

function getNextWeekend(date: Date) {
  const d = new Date(date)
  const day = d.getDay()

  const start = new Date(d)
  const end = new Date(d)

  if (day === 0) {
    // Sunday - next weekend is next Sat-Sun
    start.setDate(d.getDate() + 6)
    end.setDate(d.getDate() + 7)
  } else if (day === 6) {
    // Saturday - this weekend
    end.setDate(d.getDate() + 1)
  } else {
    // Weekday - next Saturday
    start.setDate(d.getDate() + (6 - day))
    end.setDate(d.getDate() + (7 - day))
  }

  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">Áttekintés</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Bevételek és Kiadások</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* János Revenue */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-900">János bevétel</p>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.revenueJanos.toLocaleString()} Ft</p>
            <p className="text-xs text-green-600 mt-1">Kiadás: {stats.expensesJanos.toLocaleString()} Ft</p>
            <p className="text-sm font-semibold text-green-800 mt-1">Nettó: {stats.netJanos.toLocaleString()} Ft</p>
          </Card>

          {/* Sanyi Revenue */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">Sanyi bevétel</p>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.revenueSanyi.toLocaleString()} Ft</p>
            <p className="text-xs text-blue-600 mt-1">Kiadás: {stats.expensesSanyi.toLocaleString()} Ft</p>
            <p className="text-sm font-semibold text-blue-800 mt-1">Nettó: {stats.netSanyi.toLocaleString()} Ft</p>
          </Card>

          {/* Total Revenue */}
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-900">Összes bevétel</p>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-700">{stats.totalRevenue.toLocaleString()} Ft</p>
            <p className="text-xs text-purple-600 mt-1">Kiadás: {stats.totalExpenses.toLocaleString()} Ft</p>
            <p className="text-sm font-semibold text-purple-800 mt-1">Nettó: {stats.netTotal.toLocaleString()} Ft</p>
          </Card>

          {/* Total Expenses */}
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-red-900">Összes kiadás</p>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-700">{stats.totalExpenses.toLocaleString()} Ft</p>
            <div className="text-xs text-red-600 mt-1 space-y-0.5">
              <div>János: {stats.expensesJanos.toLocaleString()} Ft</div>
              <div>Sanyi: {stats.expensesSanyi.toLocaleString()} Ft</div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Reservations */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground/70 text-sm font-medium mb-1">Összes foglalás</p>
              <p className="text-4xl font-bold text-primary">{stats.totalReservations}</p>
            </div>
            <Calendar className="h-10 w-10 text-accent/50" />
          </div>
        </Card>

        {/* Total Trees */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground/70 text-sm font-medium mb-1">Összes várható fa</p>
              <p className="text-4xl font-bold text-primary">{stats.totalTrees}</p>
            </div>
            <Trees className="h-10 w-10 text-accent/50" />
          </div>
        </Card>

        {/* Upcoming Weekend */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground/70 text-sm font-medium mb-1">Foglalások ezen a hétvégén</p>
              <p className="text-4xl font-bold text-primary">{stats.upcomingWeekend}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-accent/50" />
          </div>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="p-6 mt-8 bg-secondary/20">
        <h2 className="font-bold text-lg text-primary mb-4">Üdvözölünk az Admin Panelben!</h2>
        <ul className="space-y-2 text-foreground/70 text-sm">
          <li className="flex gap-2">
            <span className="text-accent">→</span>
            <span>
              <strong>Foglalások:</strong> Tekintsd meg és kezelj minden foglalást, frissítsd a státuszt és a fák
              sorszámait.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">→</span>
            <span>
              <strong>Beállítások:</strong> Állítsd be a szezon kezdetét/végét és maximális foglalásokat naponta.
            </span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
