import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete("adminSessionId")

  return Response.json({ success: true })
}
