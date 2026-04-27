import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser, validateSession } from "@/lib/auth"
import { getReservationById } from "@/lib/reservations"
import { paidToForUsername } from "@/lib/admin-users"
import ReservationDetailClient from "@/components/reservation-detail-client"

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("admin_session")?.value

  // Server-side auth check
  if (!sessionId || !(await validateSession(sessionId))) {
    redirect("/admin-login")
  }

  const { id } = await params
  const reservation = await getReservationById(Number.parseInt(id))

  if (!reservation) {
    redirect("/admin/reservations")
  }

  const currentAdminPaidTo = paidToForUsername(await getSessionUser(sessionId))

  return <ReservationDetailClient reservation={reservation} currentAdminPaidTo={currentAdminPaidTo} />
}
