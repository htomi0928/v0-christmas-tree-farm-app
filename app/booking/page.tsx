"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import CalendarPicker from "@/components/calendar-picker"
import { formatPrice } from "@/lib/utils"
import { useUnsavedChanges } from "@/contexts/unsaved-changes-context"

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
  `w-full px-4 py-3 rounded-lg border bg-[#f5f4f1] text-[#3a3a3a] placeholder:text-[#4a4f4a]/40 focus:outline-none focus:ring-2 focus:ring-[#6e7f6a] transition-all duration-150 ${
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

  const [customTreeCount, setCustomTreeCount] = useState(false)
  const [treeDropdownOpen, setTreeDropdownOpen] = useState(false)
  const treeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (treeDropdownRef.current && !treeDropdownRef.current.contains(e.target as Node)) {
        setTreeDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const [errors, setErrors] = useState<FormErrors>({})
  const errorRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        const el = document.querySelector<HTMLElement>('[data-error]')
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 50)
    }
  }, [errors])
  const { setDirty } = useUnsavedChanges()

  const isFormDirty =
    formData.name.trim() !== "" ||
    formData.phone.trim() !== "" ||
    formData.email.trim() !== "" ||
    formData.visitDate !== "" ||
    formData.notes.trim() !== "" ||
    formData.treeCount !== "1" ||
    formData.acceptTerms

  useEffect(() => { setDirty(isFormDirty) }, [isFormDirty, setDirty])
  useEffect(() => () => setDirty(false), [setDirty])

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)

  useEffect(() => {
    if (isSuccess) window.scrollTo({ top: 0, behavior: "smooth" })
  }, [isSuccess])
  const [settings, setSettings] = useState<any>(null)
  const [seasonClosed, setSeasonClosed] = useState(false)

  const infoRows = [
    { label: "Érkezés", value: "10:00 – 12:00 között", href: undefined },
    { label: "Ár", value: `${formatPrice(settings?.pricePerTree ?? 8000)} / fa`, href: undefined },
    { label: "Fizetés", value: "Készpénz vagy bankkártya", href: undefined },
    { label: "Helyszín", value: "GPS-koordinátákkal (kattints ide!)", href: "https://www.google.com/maps/dir/?api=1&destination=46.8981178,16.793078" },
  ]

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(async (res) => {
        // 503 from the settings route means there is no active year configured.
        if (res.status === 503) {
          setSeasonClosed(true)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.success) setSettings(data.settings)
      })
      .catch(() => {})
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = "Név szükséges"
    if (!formData.phone.trim()) newErrors.phone = "Telefonszám szükséges"
    if (!formData.visitDate) newErrors.visitDate = "Nap szükséges"
    if (!formData.treeCount || Number.parseInt(formData.treeCount) < 1)
      newErrors.treeCount = "Minimum 1 fa szükséges"
    if (formData.email && !formData.email.includes("@"))
      newErrors.email = "Érvénytelen email cím"
    if (!formData.acceptTerms) newErrors.acceptTerms = "Elfogadás szükséges"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n })
    }
  }

  const handleDateSelect = (date: string) => {
    setFormData((prev) => ({ ...prev, visitDate: date }))
    if (errors.visitDate) {
      setErrors((prev) => { const n = { ...prev }; delete n.visitDate; return n })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        setDirty(false)
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

  /* ── Success screen ── */
  if (isSuccess && successData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#ededed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left — confirmation message */}
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <CheckCircle2 className="h-5 w-5 text-[#6e7f6a]" />
                <span className="text-xs font-bold text-[#6e7f6a] tracking-widest uppercase">Foglalás rögzítve</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#3a3a3a] mb-4 tracking-tight leading-tight">
                Hamarosan<br />jelentkezünk.
              </h1>
              <p className="text-[#4a4f4a] font-light mb-10 max-w-xs">
                A foglalásod megkaptuk. Felvesszük veled a kapcsolatot a megadott telefonszámon.
              </p>

              <div className="space-y-0 mb-10">
                {[
                  "Érkezz 10:00 és 12:00 között.",
                  "Fizetés helyszínen: készpénz vagy bankkártya.",
                  "A fát karácsony előtti hétvégén vágjuk és adjuk át.",
                  "Kérdés esetén hívj: +36 (30) 123 4567",
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-[#bfc3c7] last:border-b-0">
                    <span className="text-[#6e7f6a] font-bold text-sm flex-shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm text-[#4a4f4a] font-light">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/">
                  <Button className="h-12 px-7 text-base rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(74,79,74,0.25)] active:translate-y-0 active:shadow-none font-semibold">
                    Vissza a főoldalra
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — booking summary */}
            <div className="lg:pt-20 flex justify-center">
            <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-8 w-full">
              <p className="text-xs font-bold text-[#4a4f4a]/40 tracking-widest uppercase mb-6">Foglalás összefoglalója</p>
              <div className="space-y-0">
                {[
                  { label: "Név", value: successData.name },
                  { label: "Telefon", value: successData.phone },
                  {
                    label: "Fa választásának napja",
                    value: new Date(successData.visitDate).toLocaleDateString("hu-HU", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric",
                    }),
                  },
                  ...(successData.pickupDate ? [{
                    label: "Átvételi nap",
                    value: new Date(successData.pickupDate).toLocaleDateString("hu-HU", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric",
                    }),
                  }] : []),
                  { label: "Fák száma", value: `${successData.treeCount} db` },
                  ...(settings?.pricePerTree ? [{
                    label: "Fizetendő összeg",
                    value: formatPrice(successData.treeCount * settings.pricePerTree),
                  }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex gap-6 py-4 border-b border-[#bfc3c7] last:border-b-0">
                    <span className="text-xs font-bold text-[#6e7f6a] uppercase tracking-widest w-40 flex-shrink-0 mt-0.5">
                      {row.label}
                    </span>
                    <span className="text-sm text-[#3a3a3a] font-light">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  /* ── Season closed (no active year) ── */
  if (seasonClosed) {
    return (
      <div className="bg-[#ededed] min-h-[calc(100vh-4rem)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full py-24 text-center">
          <div className="section-label justify-center">Foglalás</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#3a3a3a] mb-4 tracking-tight leading-tight">
            Foglalás jelenleg nem elérhető
          </h1>
          <p className="text-[#4a4f4a] font-light max-w-md mx-auto mb-10">
            A következő szezon foglalása hamarosan nyílik. Hívj minket, ha kérdésed van: +36 (30) 123 4567.
          </p>
          <Link href="/">
            <Button className="h-12 px-7 text-base rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Vissza a főoldalra
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  /* ── Booking form ── */
  return (
    <div className="bg-[#ededed] min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full py-16">

        {/* Top heading */}
        <div className="text-center mb-10">
          <div className="section-label justify-center">Foglalás</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#3a3a3a] mb-4 tracking-tight leading-tight">
            Időpont&shy;foglalás
          </h1>
          <p className="text-[#4a4f4a] font-light max-w-sm mx-auto">
            Válassz egy szombatot vagy vasárnapot. Percre pontos időpont nem kell.
          </p>
        </div>

        {/* Info strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {infoRows.map((row) => {
            const inner = (
              <>
                <p className="text-[10px] font-bold tracking-widest text-[#6e7f6a] uppercase mb-1">{row.label}</p>
                <p className="text-xs font-medium text-[#3a3a3a] leading-snug">{row.value}</p>
              </>
            )
            return row.href ? (
              <a
                key={row.label}
                href={row.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#f5f4f1] border border-[#bfc3c7] rounded-lg px-4 py-3 text-center hover:border-[#6e7f6a] hover:bg-[#6e7f6a]/10 transition-colors duration-150 block"
                style={{ boxShadow: "0 8px 32px rgba(10, 20, 10, 0.10), 0 2px 8px rgba(10, 20, 10, 0.06)" }}
              >
                {inner}
              </a>
            ) : (
              <div key={row.label} className="bg-[#f5f4f1] border border-[#bfc3c7] rounded-lg px-4 py-3 text-center" style={{ boxShadow: "0 8px 32px rgba(10, 20, 10, 0.10), 0 2px 8px rgba(10, 20, 10, 0.06)" }}>
                {inner}
              </div>
            )
          })}
        </div>

        {settings?.pricePerTree && (
          <div className="border border-[#bfc3c7] rounded-lg px-5 py-4 mb-8 text-center bg-[#f5f4f1]" style={{ boxShadow: "0 8px 32px rgba(10, 20, 10, 0.10), 0 2px 8px rgba(10, 20, 10, 0.06)" }}>
            <p className="text-xs font-bold text-[#4a4f4a]/40 tracking-widest uppercase mb-1">Jelenlegi ár</p>
            <p className="text-2xl font-extrabold text-[#3a3a3a] tracking-tight">
              {formatPrice(settings.pricePerTree)}
            </p>
            <p className="text-xs text-[#4a4f4a] font-light mt-0.5">Mérettől függetlenül</p>
          </div>
        )}

        {/* Form card */}
        <div className="border border-[#bfc3c7] bg-[#f5f4f1] rounded-lg p-6 sm:p-10" style={{ boxShadow: "0 8px 32px rgba(10, 20, 10, 0.10), 0 2px 8px rgba(10, 20, 10, 0.06)" }}>
            <form onSubmit={handleSubmit} className="space-y-6">

              {errors.submit && (
                <div ref={errorRef} data-error className="flex gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-destructive text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Name + Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2">
                    Név <span className="text-[#6e7f6a]">*</span>
                  </label>
                  <input
                    id="name" name="name" type="text"
                    value={formData.name} onChange={handleChange}
                    placeholder="pl. Kovács István"
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && <p data-error className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2">
                    Telefon <span className="text-[#6e7f6a]">*</span>
                  </label>
                  <input
                    id="phone" name="phone" type="tel"
                    value={formData.phone} onChange={handleChange}
                    placeholder="+36 (30) 123 4567"
                    className={inputClass(!!errors.phone)}
                  />
                  {errors.phone && <p data-error className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2">
                  E-mail <span className="text-[#4a4f4a] text-xs font-normal normal-case tracking-normal">(opcionális)</span>
                </label>
                <input
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="nev@email.com"
                  className={inputClass(!!errors.email)}
                />
                {errors.email && <p data-error className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Date picker */}
              <div>
                <label className="block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2">
                  Fa kiválasztás napja <span className="text-[#6e7f6a]">*</span>
                </label>
                <CalendarPicker
                  selectedDate={formData.visitDate}
                  onDateSelect={handleDateSelect}
                  availableDates={settings?.availableDays}
                />
                <p className="text-[#4a4f4a] text-xs mt-1">Válassz egy elérhető napot — szombat vagy vasárnap, 10–12 között</p>
                {errors.visitDate && <p data-error className="text-destructive text-xs mt-1">{errors.visitDate}</p>}
              </div>

              {/* Pickup date (conditional) */}
              {settings?.retrievalDays && settings.retrievalDays.length > 0 && (
                <div>
                  <label htmlFor="pickupDate" className="block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2">
                    Átvételi nap <span className="text-[#6e7f6a]">*</span>
                  </label>
                  <select
                    id="pickupDate" name="pickupDate"
                    value={formData.pickupDate} onChange={handleChange}
                    className={inputClass(!!errors.pickupDate)}
                  >
                    <option value="">Válassz átvételi napot...</option>
                    {settings.retrievalDays.sort().map((day: string) => {
                      const [y, m, d] = day.split("-")
                      const date = new Date(Number(y), Number(m) - 1, Number(d))
                      return (
                        <option key={day} value={day}>
                          {date.toLocaleDateString("hu-HU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </option>
                      )
                    })}
                  </select>
                  {errors.pickupDate && <p data-error className="text-destructive text-xs mt-1">{errors.pickupDate}</p>}
                </div>
              )}

              {/* Tree count */}
              <div>
                <label htmlFor="treeCount" className="block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2">
                  Hány fát szeretnél? <span className="text-[#6e7f6a]">*</span>
                </label>
                <select
                  id="treeCount" name="treeCount"
                  value={customTreeCount ? "custom" : formData.treeCount}
                  onChange={(e) => {
                    if (e.target.value === "custom") {
                      setCustomTreeCount(true)
                      setFormData((prev) => ({ ...prev, treeCount: "" }))
                    } else {
                      setCustomTreeCount(false)
                      setFormData((prev) => ({ ...prev, treeCount: e.target.value }))
                    }
                  }}
                  className={inputClass(!!errors.treeCount)}
                >
                  <option value="1">1 fa</option>
                  <option value="2">2 fa</option>
                  <option value="3">3 fa</option>
                  <option value="custom">Egyéni mennyiség megadása</option>
                </select>
                {customTreeCount && (
                  <input
                    type="number"
                    min="1"
                    inputMode="numeric"
                    placeholder="Hány fát szeretnél?"
                    value={formData.treeCount}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, "")
                      setFormData((prev) => ({ ...prev, treeCount: v }))
                    }}
                    className={`${inputClass(!!errors.treeCount)} mt-2`}
                  />
                )}
                {errors.treeCount && <p data-error className="text-destructive text-xs mt-1">{errors.treeCount}</p>}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-xs font-bold text-[#3a3a3a] tracking-widest uppercase mb-2">
                  Megjegyzés <span className="text-[#4a4f4a] text-xs font-normal normal-case tracking-normal">(opcionális)</span>
                </label>
                <textarea
                  id="notes" name="notes"
                  value={formData.notes} onChange={handleChange}
                  placeholder="pl. magas fát keresek, kb. 2,5 m"
                  rows={3}
                  className={inputClass(!!errors.notes)}
                />
              </div>

              {/* Terms checkbox */}
              <div className="border-t border-[#bfc3c7] pt-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    name="acceptTerms" type="checkbox"
                    checked={formData.acceptTerms} onChange={handleChange}
                    className={`mt-1 h-4 w-4 rounded border flex-shrink-0 ${errors.acceptTerms ? "border-destructive" : "border-[#bfc3c7]"}`}
                  />
                  <span className="text-sm text-[#4a4f4a] font-light leading-relaxed">
                    Tudomásul veszem, hogy a foglalás 10:00 és 12:00 közötti érkezést jelent, nem percre pontos időpontot.{" "}
                    <span className="text-[#6e7f6a]">*</span>
                  </span>
                </label>
                {errors.acceptTerms && <p className="text-destructive text-xs mt-2 ml-7">{errors.acceptTerms}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(74,79,74,0.25)] active:translate-y-0 active:shadow-none text-base font-semibold rounded-lg transition-all duration-200"
              >
                {isLoading ? "Feldolgozás..." : "Foglalás megerősítése"}
              </Button>

            </form>
          </div>

      </div>
    </div>
  )
}
