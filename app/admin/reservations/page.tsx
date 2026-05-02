import { listReservations } from "@/lib/reservations"
import ReservationFilters from "@/components/reservation-filters"
import { getViewYear } from "@/lib/years"

export default async function ReservationsPage() {
  const year = await getViewYear()
  const reservations = await listReservations({ year })

  return (
    <div className="space-y-6 pb-24">
      <section>
        <p className="section-label">Foglalások - {year}</p>
        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-3">Kereshető, szűrhető, mobilbarát foglaláslistá.</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/70">
          A kártyás nézet telefonon gyorsabban áttekinthető, az asztali nézet pedig ugyanebből a struktúrából épül fel.
        </p>
      </section>

      <ReservationFilters reservations={reservations} />
    </div>
  )
}
