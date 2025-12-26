"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
    >
      <LogOut size={20} />
      <span className="text-sm">Kijelentkezés</span>
    </button>
  )
}
