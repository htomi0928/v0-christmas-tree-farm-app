"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import CalendarPicker from "@/components/calendar-picker"

interface FormData {
  name: string
  phone: string
  email: string
  visitDate: string
  pickupDate: string
  treeCount: string
  notes: string
  acceptTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-2 rounded-lg border bg-[#f5f4f1] text-[#3a3a3a] placeholder:text-[#4a4f4a]/40 focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] ${
    hasError ? "border-destructive" : "border-[#bfc3c7]"
  }`

export default function BookingPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    visitDate: "",
    pickupDate: "",
    treeCount: "1",
    notes: "",
    acceptTerms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.settings)
        }
      })
      .catch(() => {})
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Név szükséges"
    if (!formData.phone.trim()) newErrors.phone = "Telefonszám szükséges"
    if (!formData.visitDate) newErrors.visitDate = "Nap szükséges"
    if (!formData.treeCount || Number.parseInt(formData.treeCount) < 1) {
      newErrors.treeCount = "Minimum 1 fa szükséges"
    }
    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Érvénytelen email cím"
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Elfogadás szükséges"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDateSelect = (date: string) => {
    setFormData((prev) => ({
      ...prev,
      visitDate: date,
    }))
    if (errors.visitDate) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.visitDate
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          visitDate: formData.visitDate,
          pickupDate: formData.pickupDate || undefined,
          treeCount: Number.parseInt(formData.treeCount),
          notes: formData.notes || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessData(data.data)
        setIsSuccess(true)
      } else {
        setErrors({ submit: data.errors?.join(", ") || "Hiba történt a foglalás során" })
      }
    } catch {
      setErrors({ submit: "Hálózati hiba. Próbáld újra." })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess && successData) {
    return (
      <div className="min-h-screen bg-[#ededed] py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8 sm:p-12">
            <CheckCircle2 className="h-10 w-10 text-[#6e7f6a] mb-6" />
            <h1 className="text-3xl font-bold text-[#3a3a3a] mb-2 tracking-tight">Foglalás rögzítve.</h1>
            <p className="text-[#4a4f4a] font-light mb-8">Hamarosan felvesszük veled a kapcsolatot.</p>

            <div className="border border-[#bfc3c7] rounded-lg p-6 mb-8 space-y-2">
              <p className="text-sm text-[#4a4f4a]">
                <span className="font-semibold text-[#3a3a3a]">Név:</span> {successData.name}
              </p>
              <p className="text-sm text-[#4a4f4a]">
                <span className="font-semibold text-[#3a3a3a]">Telefon:</span> {successData.phone}
              </p>
              <p className="text-sm text-[#4a4f4a]">
                <span className="font-semibold text-[#3a3a3a]">Nap:</span>{" "}
                {new Date(successData.visitDate).toLocaleDateString("hu-HU", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-[#4a4f4a]">
                <span className="font-semibold text-[#3a3a3a]">Fák száma:</span> {successData.treeCount} db
              </p>
              {settings?.pricePerTree && (
                <p className="text-sm text-[#4a4f4a]">
                  <span className="font-semibold text-[#3a3a3a]">Becsült ár:</span>{" "}
                  {(successData.treeCount * settings.pricePerTree).toLocaleString("hu-HU")} Ft
                </p>
              )}
            </div>

            <div className="border border-[#bfc3c7] rounded-lg p-6 mb-8 space-y-3">
              <p className="text-sm font-semibold text-[#3a3a3a] mb-1">Tudnivalók</p>
              {[
                "Érkezz 10:00 és 12:00 között. Nem kell percre pontosan.",
                "Fizetés helyszínen: készpénz vagy bankkártya.",
                "A fát karácsony előtti hétvégén vágjuk és adjuk át.",
                "Kérdés esetén hívj: +36 (30) 123 4567",
              ].map((item, i) => (
                <p key={i} className="text-sm text-[#4a4f4a] font-light flex gap-3">
                  <span className="text-[#6e7f6a] font-bold flex-shrink-0">→</span>
                  {item}
                </p>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/">
                <Button className="h-12 px-7 text-base rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(74,79,74,0.25)] active:translate-y-0 active:shadow-none font-semibold">Vissza a főoldalra</Button>
              </Link>
              <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
                <Button className="h-12 px-7 text-base rounded-lg border border-[#4a4f4a]/30 bg-transparent text-[#4a4f4a]/70 hover:bg-transparent hover:text-[#4a4f4a] hover:border-[#4a4f4a]/60 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none shadow-none font-normal">Kövess Facebookon</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ededed] py-14 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="section-label">Foglalás</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#3a3a3a] mb-4 tracking-tight">Időpontfoglalás</h1>
          <p className="text-[#4a4f4a] font-light max-w-md">
            Válassz egy szombatot vagy vasárnapot, és gyere 10 és 12 között, amikor jön. Percre pontos időpont nem kell.
          </p>
          {settings?.pricePerTree && (
            <p className="text-sm font-semibold text-[#3a3a3a] mt-3">
              Jelenlegi ár: {settings.pricePerTree.toLocaleString("hu-HU")} Ft / fa
            </p>
          )}
        </div>

        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive text-sm">{errors.submit}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#3a3a3a] mb-2">
                Név <span className="text-[#4a4f4a]">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="pl. Kovács István"
                className={inputClass(!!errors.name)}
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-[#3a3a3a] mb-2">
                Telefonszám <span className="text-[#4a4f4a]">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="pl. +36 (30) 123 4567"
                className={inputClass(!!errors.phone)}
              />
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#3a3a3a] mb-2">
                E-mail <span className="text-[#4a4f4a] text-xs font-normal">(opcionális)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="pl. nev@email.com"
                className={inputClass(!!errors.email)}
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#3a3a3a] mb-2">
                Nap <span className="text-[#4a4f4a]">*</span>
              </label>
              <CalendarPicker
                selectedDate={formData.visitDate}
                onDateSelect={handleDateSelect}
                availableDates={settings?.availableDays}
              />
              <p className="text-[#4a4f4a] text-xs mt-1">Válassz egy elérhető napot</p>
              {errors.visitDate && <p className="text-destructive text-sm mt-2">{errors.visitDate}</p>}
            </div>

            {settings?.retrievalDays && settings.retrievalDays.length > 0 && (
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-semibold text-[#3a3a3a] mb-2">
                  Átvételi nap <span className="text-[#4a4f4a]">*</span>
                </label>
                <select
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className={inputClass(!!errors.pickupDate)}
                >
                  <option value="">Válassz átvételi napot...</option>
                  {settings.retrievalDays.sort().map((day: string) => {
                    const [y, m, d] = day.split("-")
                    const date = new Date(Number(y), Number(m) - 1, Number(d))
                    const formatted = date.toLocaleDateString("hu-HU", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    return (
                      <option key={day} value={day}>
                        {formatted}
                      </option>
                    )
                  })}
                </select>
                <p className="text-[#4a4f4a] text-xs mt-1">Mikor szeretnéd átvenni a fát?</p>
                {errors.pickupDate && <p className="text-destructive text-sm mt-1">{errors.pickupDate}</p>}
              </div>
            )}

            <div>
              <label htmlFor="treeCount" className="block text-sm font-semibold text-[#3a3a3a] mb-2">
                Hány fát szeretnél? <span className="text-[#4a4f4a]">*</span>
              </label>
              <select
                id="treeCount"
                name="treeCount"
                value={formData.treeCount}
                onChange={handleChange}
                className={inputClass(!!errors.treeCount)}
              >
                <option value="1">1 fa</option>
                <option value="2">2 fa</option>
                <option value="3">3 fa</option>
                <option value="4">4+ fa</option>
              </select>
              {errors.treeCount && <p className="text-destructive text-sm mt-1">{errors.treeCount}</p>}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-[#3a3a3a] mb-2">
                Megjegyzés <span className="text-[#4a4f4a] text-xs font-normal">(opcionális)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="pl. magas fát keresek, kb. 2,5 m"
                rows={4}
                className={inputClass(!!errors.notes)}
              />
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className={`mt-1 h-4 w-4 rounded border ${errors.acceptTerms ? "border-destructive" : "border-border"}`}
                />
                <span className="text-sm text-[#4a4f4a] font-light">
                  Tudomásul veszem, hogy a foglalás 10:00 és 12:00 közötti érkezést jelent, nem percre pontos időpontot.{" "}
                  <span className="text-[#3a3a3a]">*</span>
                </span>
              </label>
              {errors.acceptTerms && <p className="text-destructive text-sm mt-1 ml-7">{errors.acceptTerms}</p>}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3"
              >
                {isLoading ? "Feldolgozás..." : "Foglalás megerősítése"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
