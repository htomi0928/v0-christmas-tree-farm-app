import { listReservations } from "@/lib/reservations"
import ReservationFilters from "@/components/reservation-filters"
import { getViewYear } from "@/lib/years"

export default async function ReservationsPage() {
  const year = await getViewYear()
  const reservations = await listReservations({ year })

  return (
    <div className="space-y-6 pb-24">
      <section>
        <p className="section-kicker">Foglalasok - {year}</p>
        <h1 className="admin-section-title">Keresheto, szurheto, mobilbarat foglalaslista.</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/70">
          A kartyas nezet telefonon gyorsabban attekintheto, az asztali nezet pedig ugyanebbol a strukturabol epul fel.
        </p>
      </section>

      <ReservationFilters reservations={reservations} />
    </div>
  )
}
