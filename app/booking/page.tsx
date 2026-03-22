"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
    } catch (error) {
      setErrors({ submit: "Hálózati hiba. Kérjük, próbáld újra." })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess && successData) {
    return (
      <div className="min-h-screen bg-background py-12 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 sm:p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-accent mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-primary mb-4">Köszönjük a foglalást!</h1>

            <div className="bg-secondary/20 rounded-lg p-6 text-left mb-8">
              <h2 className="font-bold text-primary mb-4">Foglalás összegzése:</h2>
              <div className="space-y-2 text-foreground/70">
                <p>
                  <span className="font-semibold text-foreground">Név:</span> {successData.name}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Telefonszám:</span> {successData.phone}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Nap:</span>{" "}
                  {new Date(successData.visitDate).toLocaleDateString("hu-HU", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Várható fák száma:</span> {successData.treeCount} db
                </p>
                {settings?.pricePerTree && (
                  <p>
                    <span className="font-semibold text-foreground">Becsült ár:</span>{" "}
                    {(successData.treeCount * settings.pricePerTree).toLocaleString("hu-HU")} Ft
                  </p>
                )}
              </div>
            </div>

            <div className="bg-accent/10 border border-accent rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-primary mb-3">Fontos információk:</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span>Az érkezés 10:00 és 12:00 között. Nem percre pontos időpont szükséges.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span>Fizetés a helyszínen: készpénz vagy bankkártya.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span>Majd Karácsony előtti hétvégén fogjuk kivágni és kiszállítani a fát.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span>
                    Ha kérdésed van, hívj telefonon: <span className="font-semibold">+36 (30) 123 4567</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">Vissza a kezdőlapra</Button>
              </Link>
              <a href="https://www.facebook.com/karacsonyfak" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Kövess Facebookon</Button>
              </a>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">Időpontfoglalás</h1>
          <p className="text-lg text-foreground/70">
            Válassz egy szombati vagy vasárnapi napot, és gyere 10:00 és 12:00 között, amikor kényelmes. Nem foglalunk
            percre pontos időpontot, így van idő beszélgetni.
          </p>
          {settings?.pricePerTree && (
            <p className="text-base font-semibold text-accent mt-4">
              Jelenlegi ár: {settings.pricePerTree.toLocaleString("hu-HU")} Ft per fa
            </p>
          )}
        </div>

        <Card className="p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive text-sm">{errors.submit}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Név <span className="text-accent">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="pl. Kovács István"
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                Telefonszám <span className="text-accent">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="pl. +36 (30) 123 4567"
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? "border-destructive" : "border-border"
                }`}
              />
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                E-mail cím <span className="text-muted-foreground text-xs">(opcionális)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="pl. example@example.com"
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nap <span className="text-accent">*</span>
              </label>
              <CalendarPicker
                selectedDate={formData.visitDate}
                onDateSelect={handleDateSelect}
                availableDates={settings?.availableDays}
              />
              <p className="text-muted-foreground text-xs mt-1">Válassz egy elérhető napot</p>
              {errors.visitDate && <p className="text-destructive text-sm mt-2">{errors.visitDate}</p>}
            </div>

            {settings?.retrievalDays && settings.retrievalDays.length > 0 && (
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-semibold text-foreground mb-2">
                  Átvételi nap <span className="text-accent">*</span>
                </label>
                <select
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.pickupDate ? "border-destructive" : "border-border"
                  }`}
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
                <p className="text-muted-foreground text-xs mt-1">Mikor szeretnéd átvenni a fát?</p>
                {errors.pickupDate && <p className="text-destructive text-sm mt-1">{errors.pickupDate}</p>}
              </div>
            )}

            <div>
              <label htmlFor="treeCount" className="block text-sm font-semibold text-foreground mb-2">
                Várhatóan hány fát szeretnél? <span className="text-accent">*</span>
              </label>
              <select
                id="treeCount"
                name="treeCount"
                value={formData.treeCount}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.treeCount ? "border-destructive" : "border-border"
                }`}
              >
                <option value="1">1 fa</option>
                <option value="2">2 fa</option>
                <option value="3">3 fa</option>
                <option value="4">4+ fa</option>
              </select>
              {errors.treeCount && <p className="text-destructive text-sm mt-1">{errors.treeCount}</p>}
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-foreground mb-2">
                Megjegyzés <span className="text-muted-foreground text-xs">(opcionális)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="pl. magas fa, kb. 2,5 m"
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.notes ? "border-destructive" : "border-border"
                }`}
              />
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className={`mt-1 h-4 w-4 rounded border ${
                    errors.acceptTerms ? "border-destructive" : "border-border"
                  }`}
                />
                <span className="text-sm text-foreground/70">
                  Tudomásul veszem, hogy a foglalás 10:00 és 12:00 közötti érkezést jelent, nem percre pontos időpontot.{" "}
                  <span className="text-accent">*</span>
                </span>
              </label>
              {errors.acceptTerms && <p className="text-destructive text-sm mt-1 ml-7">{errors.acceptTerms}</p>}
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-lg py-3">
                {isLoading ? "Feldolgozás..." : "Foglalás megerősítése"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
