import { Button } from "@/components/ui/button"
import { listReservations } from "@/lib/reservations"
import ReservationFilters from "@/components/reservation-filters"
import { getViewYear } from "@/lib/years"
import Link from "next/link"

export default async function ReservationsPage() {
  const year = await getViewYear()
  const reservations = await listReservations({ year })

  return (
    <div className="space-y-6 pb-24">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Foglalasok - {year}</p>
          <h1 className="admin-section-title">Keresheto, szurheto, mobilbarat foglalaslista.</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/70">
            A kartyas nezet telefonon gyorsabban attekintheto, az asztali nezet pedig ugyanebbol a strukturabol epul fel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="lg"><Link href="/admin/reservations/quick">Gyors foglalas</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/booking">Nyilvanos foglalo oldal</Link></Button>
        </div>
      </section>

      <ReservationFilters reservations={reservations} />
    </div>
  )
}
