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
          <p className="section-kicker">Foglalások · {year}</p>
          <h1 className="admin-section-title">Kereshető, szűrhető, mobilbarát foglaláslista.</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/70">A kártyás nézet telefonon gyorsabban áttekinthető, az asztali nézet pedig ugyanebből a struktúrából épül fel.</p>
        </div>
        <Button asChild size="lg"><Link href="/booking">Új foglalás</Link></Button>
      </section>

      <ReservationFilters reservations={reservations} />
    </div>
  )
}
