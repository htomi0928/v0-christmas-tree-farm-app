import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { validateSession } from "@/lib/auth"
import { getReservationById } from "@/lib/reservations"
import ReservationDetailClient from "@/components/reservation-detail-client"

export default async function ReservationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("admin_session")?.value

  // Server-side auth check
  if (!sessionId || !validateSession(sessionId)) {
    redirect("/admin/login")
  }

  const reservation = await getReservationById(Number.parseInt(params.id))

  if (!reservation) {
    redirect("/admin/reservations")
  }

  return <ReservationDetailClient reservation={reservation} />
}
