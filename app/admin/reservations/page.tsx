import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ReservationStatus } from "@/lib/types"
import { ChevronRight } from "lucide-react"
import { listReservations } from "@/lib/reservations"
import ReservationFilters from "@/components/reservation-filters"

const statusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.BOOKED]: "Foglalt",
  [ReservationStatus.TREE_TAGGED]: "Fa megjelölve",
  [ReservationStatus.CUT]: "Kivágva",
  [ReservationStatus.PICKED_UP_PAID]: "Átvéve és fizetve",
  [ReservationStatus.NO_SHOW]: "Nem jelent meg",
}

const statusColors: Record<ReservationStatus, string> = {
  [ReservationStatus.BOOKED]: "bg-blue-100 text-blue-900",
  [ReservationStatus.TREE_TAGGED]: "bg-yellow-100 text-yellow-900",
  [ReservationStatus.CUT]: "bg-orange-100 text-orange-900",
  [ReservationStatus.PICKED_UP_PAID]: "bg-green-100 text-green-900",
  [ReservationStatus.NO_SHOW]: "bg-red-100 text-red-900",
}

export default async function ReservationsPage() {
  const allReservations = await listReservations()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Foglalások</h1>
        <Link href="/booking">
          <Button className="bg-accent hover:bg-accent/90">Új foglalás hozzáadása</Button>
        </Link>
      </div>

      {/* Filters */}
      <ReservationFilters reservations={allReservations} statusLabels={statusLabels} statusColors={statusColors} />

      {/* Reservations List */}
      {allReservations.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-foreground/70 mb-4">Nincsenek foglalások</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {allReservations.map((reservation) => (
            <Link key={reservation.id} href={`/admin/reservations/${reservation.id}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Név</p>
                      <p className="font-semibold text-foreground truncate">{reservation.name}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Nap</p>
                      <p className="font-semibold text-foreground">
                        {new Date(reservation.visitDate).toLocaleDateString("hu-HU")}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Fák száma</p>
                      <p className="font-semibold text-foreground">{reservation.treeCount}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground/60">Státusz</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[reservation.status]
                        }`}
                      >
                        {statusLabels[reservation.status]}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-foreground/40 flex-shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
