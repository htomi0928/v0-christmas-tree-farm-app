import Link from "next/link"
import { CalendarDays, DollarSign, Trees, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
    <div className="space-y-6">
      <section>
        <p className="section-kicker">Admin dashboard</p>
        <h1 className="admin-section-title">Gyors áttekintés egy kézben is használható nézetben.</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/70">A legfontosabb számok rögtön felül látszanak, a bevételi bontás pedig újra külön blokkban jelenik meg, hogy ne vesszen el a napi használatban.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((item) => (
          <Card key={item.label} className="admin-card gap-4 px-6 py-6">
            <div className="flex items-center justify-between px-6">
              <span className="rounded-2xl bg-primary/8 p-3 text-primary"><item.icon className="h-5 w-5" /></span>
            </div>
            <div className="px-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/48">{item.label}</p>
              <p className="mt-2 text-4xl font-semibold text-primary">{item.value}</p>
              <p className="mt-2 text-sm text-foreground/62">{item.help}</p>
            </div>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-primary">Bevétel és kiadás</h2>
          <span className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Fontos blokk</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {revenueCards.map((item) => (
            <div key={item.label} className={`rounded-[24px] border border-white/60 bg-gradient-to-br ${item.className} p-[1px] shadow-[0_20px_44px_rgba(16,39,32,0.09)]`}>
              <div className="rounded-[23px] bg-[rgba(255,250,242,0.92)] px-6 py-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em]">{item.label}</p>
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-semibold">{item.value}</p>
                <p className="mt-3 text-sm font-medium opacity-80">{item.expense}</p>
                <p className="mt-1 text-sm font-semibold">{item.net}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card className="admin-card px-7 py-7">
          <div className="px-6">
            <h2 className="text-3xl font-semibold text-primary">Mai fókusz</h2>
            <div className="mt-5 space-y-3 text-base leading-7 text-foreground/72">
              <p>Nézd át a közelgő foglalásokat, ellenőrizd a sorszámokat, és ha kell, gyorsan frissítsd a státuszokat.</p>
              <p>A rendszer mobilról is kényelmes: a foglaláslista kártyás, a részletek oldalon pedig az alsó mentési sáv mindig kéznél marad.</p>
            </div>
          </div>
        </Card>

        <Card className="admin-card px-7 py-7">
          <div className="flex flex-col gap-3 px-6">
            <Button asChild size="lg"><Link href="/admin/reservations">Foglalások megnyitása</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/admin/settings">Szezon beállításai</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/admin/expenses">Kiadások kezelése</Link></Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
