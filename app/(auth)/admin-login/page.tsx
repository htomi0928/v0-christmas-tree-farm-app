"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, LockKeyhole } from "lucide-react"

const inputClass = "w-full px-4 py-3 rounded-lg border border-[#bfc3c7] bg-white text-[#3a3a3a] placeholder:text-[#bfc3c7] focus:outline-none focus:ring-2 focus:ring-[#6e7f6a]/40 focus:border-[#6e7f6a] text-sm transition-colors"
const labelClass = "block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2"

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
    <div className="min-h-screen bg-[#ededed] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8 sm:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#4a4f4a] text-[#ededed] mb-6">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div className="section-label justify-center mb-3">Admin</div>
            <h1 className="text-3xl font-bold text-[#3a3a3a] tracking-tight mb-3">
              Belépés a kezelőfelületre
            </h1>
            <p className="text-sm text-[#4a4f4a]/70 font-light leading-relaxed">
              A foglalások, kiadások és szezonbeállítások kezelése innen érhető el.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex gap-2 items-center">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>Felhasználónév</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                autoComplete="username"
              />
            </div>

            <div>
              <label className={labelClass}>Jelszó</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 px-6 py-3 rounded-lg bg-[#4a4f4a] text-[#ededed] text-sm font-semibold tracking-wide hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Belépés..." : "Belépés"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
