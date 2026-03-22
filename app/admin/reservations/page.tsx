import { Button } from "@/components/ui/button"
import { ReservationStatus } from "@/lib/types"
import { listReservations } from "@/lib/reservations"
import ReservationFilters from "@/components/reservation-filters"
import Link from "next/link"

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

      {/* Filters + List */}
      <ReservationFilters reservations={allReservations} statusLabels={statusLabels} statusColors={statusColors} />
    </div>
  )
}
