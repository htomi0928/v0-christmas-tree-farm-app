"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import CalendarPicker from "@/components/calendar-picker"
import { facebookUrl, formatDateWithWeekdayHu, phoneNumber } from "@/lib/site"

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
  const [formData, setFormData] = useState<FormData>({ name: "", phone: "", email: "", visitDate: "", pickupDate: "", treeCount: "1", notes: "", acceptTerms: false })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch("/api/admin/settings").then((res) => res.json()).then((data) => {
      if (data.success) setSettings(data.settings)
    }).catch(() => {})
  }, [])

  const validateForm = () => {
    const next: FormErrors = {}
    if (!formData.name.trim()) next.name = "Kérjük, add meg a nevedet."
    if (!formData.phone.trim()) next.phone = "Kérjük, add meg a telefonszámodat."
    if (!formData.visitDate) next.visitDate = "Válassz egy látogatási napot."
    if (!formData.treeCount || Number.parseInt(formData.treeCount) < 1) next.treeCount = "Legalább 1 fát adj meg."
    if (formData.email && !formData.email.includes("@")) next.email = "Az e-mail cím formátuma nem megfelelő."
    if (!formData.acceptTerms) next.acceptTerms = "Kérjük, erősítsd meg, hogy megértetted a látogatás menetét."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleDateSelect = (date: string) => {
    setFormData((prev) => ({ ...prev, visitDate: date }))
    if (errors.visitDate) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.visitDate
        return next
      })
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
        setSuccessData(data.data)
        setIsSuccess(true)
      } else {
        setErrors({ submit: data.errors?.join(", ") || "Valami nem sikerült a foglalás elküldésekor." })
      }
    } catch {
      setErrors({ submit: "Hálózati hiba történt. Kérjük, próbáld újra." })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess && successData) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <Card className="mx-auto max-w-3xl px-8 py-10">
            <div className="px-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--mint-soft)] text-[color:var(--mint-strong)]"><CheckCircle2 className="h-8 w-8" /></div>
              <p className="section-kicker mt-6">Foglalás rögzítve</p>
              <h1 className="text-4xl font-semibold text-primary sm:text-5xl">Köszönjük, várunk a fenyvesben.</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-foreground/72">A foglalás beérkezett. Az alábbi összegzés segít, hogy minden fontos részlet egy helyen meglegyen.</p>
            </div>

            <div className="grid gap-5 px-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[24px] border border-primary/10 bg-secondary/35 p-6">
                <h2 className="text-2xl font-semibold text-primary">Foglalás összegzése</h2>
                <div className="mt-5 space-y-3 text-base text-foreground/74">
                  <p><span className="font-semibold text-primary">Név:</span> {successData.name}</p>
                  <p><span className="font-semibold text-primary">Telefonszám:</span> {successData.phone}</p>
                  <p><span className="font-semibold text-primary">Látogatás napja:</span> {formatDateWithWeekdayHu(successData.visitDate)}</p>
                  <p><span className="font-semibold text-primary">Várható fák száma:</span> {successData.treeCount} db</p>
                  {settings?.pricePerTree && <p><span className="font-semibold text-primary">Becsült végösszeg:</span> {(successData.treeCount * settings.pricePerTree).toLocaleString("hu-HU")} Ft</p>}
                </div>
              </div>

              <div className="rounded-[24px] border border-[color:var(--champagne-border)] bg-[color:var(--champagne-soft)]/55 p-6">
                <h2 className="text-2xl font-semibold text-primary">Amit érdemes tudni</h2>
                <div className="mt-5 space-y-3 text-base leading-7 text-foreground/78">
                  <p>Aznap 10:00 és 12:00 között érkezz, amikor kényelmes. Nem percre pontos időpontot foglaltál.</p>
                  <p>Fizetni készpénzzel és bankkártyával is lehet.</p>
                  <p>Ha bármi változik, nyugodtan keress minket telefonon: {phoneNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-6 sm:flex-row sm:justify-center">
              <Button asChild size="lg"><Link href="/">Vissza a kezdőlapra</Link></Button>
              <Button asChild size="lg" variant="outline"><a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook oldal</a></Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="section-space">
        <div className="page-shell editorial-grid items-start">
          <div>
            <p className="section-kicker">Időpontfoglalás</p>
            <h1 className="section-title">Egyszerű foglalás, nyugodt látogatás.</h1>
            <p className="section-subtitle mt-5">Válassz egy napot, és gyere ki aznap 10:00 és 12:00 között, amikor kényelmes. Nálunk a foglalás nem szoros időponthoz köt, hanem egy nyugodt érkezési sávot biztosít.</p>

            <Card className="mt-8 bg-primary px-8 py-8 text-primary-foreground">
              <div className="px-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-white/78" />
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Barátságos, kiszámítható folyamat</h2>
                    <p className="mt-3 text-base leading-7 text-white/80">A kiválasztott fa sorszámos jelölést kap. Az egységes ár {settings?.pricePerTree?.toLocaleString("hu-HU") ?? "8000"} Ft / fa, fizetni készpénzzel és bankkártyával is lehet.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="px-7 py-7">
            <form onSubmit={handleSubmit} className="space-y-5 px-6">
              {errors.submit && <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><div className="flex gap-3"><AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" /><span>{errors.submit}</span></div></div>}
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">Név</label><input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Például Kovács István" className="input-base" />{errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}</div>
                <div><label htmlFor="phone" className="mb-2 block text-sm font-semibold text-foreground">Telefonszám</label><input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+36 30 123 4567" className="input-base" />{errors.phone && <p className="mt-2 text-sm text-destructive">{errors.phone}</p>}</div>
              </div>
              <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">E-mail cím <span className="text-foreground/48">(opcionális)</span></label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="pelda@email.hu" className="input-base" />{errors.email && <p className="mt-2 text-sm text-destructive">{errors.email}</p>}</div>
              <div><label className="mb-2 block text-sm font-semibold text-foreground">Látogatás napja</label><CalendarPicker selectedDate={formData.visitDate} onDateSelect={handleDateSelect} availableDates={settings?.availableDays} />{errors.visitDate && <p className="mt-2 text-sm text-destructive">{errors.visitDate}</p>}</div>
              {settings?.retrievalDays && settings.retrievalDays.length > 0 && <div><label htmlFor="pickupDate" className="mb-2 block text-sm font-semibold text-foreground">Tervezett átvételi nap <span className="text-foreground/48">(opcionális)</span></label><select id="pickupDate" name="pickupDate" value={formData.pickupDate} onChange={handleChange} className="select-base"><option value="">Később egyeztetjük</option>{settings.retrievalDays.sort().map((day: string) => <option key={day} value={day}>{formatDateWithWeekdayHu(day)}</option>)}</select></div>}
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label htmlFor="treeCount" className="mb-2 block text-sm font-semibold text-foreground">Várható darabszám</label><select id="treeCount" name="treeCount" value={formData.treeCount} onChange={handleChange} className="select-base"><option value="1">1 fa</option><option value="2">2 fa</option><option value="3">3 fa</option><option value="4">4 fa</option><option value="5">5 vagy több fa</option></select>{errors.treeCount && <p className="mt-2 text-sm text-destructive">{errors.treeCount}</p>}</div>
                <div className="rounded-[24px] border border-primary/10 bg-secondary/35 p-4 text-sm leading-6 text-foreground/72"><p className="font-semibold text-primary">Egységes ár</p><p className="mt-1 text-2xl font-semibold text-primary">{settings?.pricePerTree?.toLocaleString("hu-HU") ?? "8000"} Ft / fa</p><p className="mt-2">A végösszeg mérettől függetlenül ugyanaz marad.</p></div>
              </div>
              <div><label htmlFor="notes" className="mb-2 block text-sm font-semibold text-foreground">Megjegyzés <span className="text-foreground/48">(opcionális)</span></label><textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Például magasabb fát keresünk, vagy több családtagnak is választanánk." className="textarea-base" /></div>
              <label className="flex items-start gap-3 rounded-[22px] border border-primary/10 bg-secondary/30 p-4"><input name="acceptTerms" type="checkbox" checked={formData.acceptTerms} onChange={handleChange} className="mt-1 h-5 w-5 rounded border-primary/30 text-primary" /><span className="text-sm leading-6 text-foreground/76">Megértettem, hogy a foglalás egy napra szól, és aznap 10:00 és 12:00 között érkezünk, amikor kényelmes.</span></label>
              {errors.acceptTerms && <p className="mt-2 text-sm text-destructive">{errors.acceptTerms}</p>}
              <Button type="submit" disabled={isLoading} size="lg" className="w-full">{isLoading ? "Foglalás rögzítése..." : "Foglalás elküldése"}{!isLoading && <ArrowRight className="h-4 w-4" />}</Button>
            </form>
          </Card>
        </div>
      </section>
    </div>
  )
}
