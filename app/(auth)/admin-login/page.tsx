"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        window.location.href = "/admin"
      } else {
        setError(data.error || "Hibás felhasználónév vagy jelszó.")
      }
    } catch {
      setError("Hálózati hiba történt. Kérjük, próbáld újra.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(247,243,235,1),rgba(239,233,222,0.72))] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <Card className="w-full px-8 py-10">
          <div className="px-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <LockKeyhole className="h-7 w-7" />
            </div>
            <p className="section-kicker mt-6">Admin</p>
            <h1 className="text-4xl font-semibold text-primary">Belépés a kezelőfelületre</h1>
            <p className="mt-4 text-base leading-7 text-foreground/70">
              A foglalások, kiadások és szezonbeállítások kezelése innen érhető el.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 px-6">
            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Felhasználónév</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-base"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">Jelszó</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              {isLoading ? "Belépés..." : "Belépés"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
