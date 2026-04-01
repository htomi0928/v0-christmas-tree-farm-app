"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AlertCircle, Plus, Trash2, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Expense } from "@/lib/types"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ person: "János" as "János" | "Sanyi", amount: "", description: "", date: new Date().toISOString().split("T")[0] })

  useEffect(() => {
    fetch("/api/admin/expenses", { credentials: "include" }).then((response) => response.json()).then((data) => {
      if (data.success) setExpenses(data.expenses)
    }).catch(() => {}).finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      setError("Adj meg egy érvényes összeget.")
      return
    }

    try {
      const response = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, amount: Number.parseFloat(formData.amount) }),
      })
      const data = await response.json()
      if (data.success) {
        setExpenses([data.expense, ...expenses])
        setFormData({ person: "János", amount: "", description: "", date: new Date().toISOString().split("T")[0] })
        setShowForm(false)
      } else {
        setError(data.error || "A mentés nem sikerült.")
      }
    } catch {
      setError("Hálózati hiba történt.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Biztosan törlöd ezt a kiadást?")) return
    const response = await fetch(`/api/admin/expenses/${id}`, { method: "DELETE", credentials: "include" })
    const data = await response.json()
    if (data.success) setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  if (isLoading) return <div className="text-foreground/70">Betöltés...</div>

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6 pb-24">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-kicker">Kiadások</p>
          <h1 className="admin-section-title">Gyorsan rögzítheto, mobilon is könnyen kezelheto tételek.</h1>
        </div>
        <Button type="button" size="lg" onClick={() => setShowForm((value) => !value)}><Plus className="h-4 w-4" />Új kiadás</Button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="admin-card px-6 py-6"><div className="px-6"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/48">Összes kiadás</p><p className="mt-2 text-4xl font-semibold text-primary">{total.toLocaleString("hu-HU")} Ft</p></div></Card>
        <Card className="admin-card px-6 py-6"><div className="px-6"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/48">Tételek száma</p><p className="mt-2 text-4xl font-semibold text-primary">{expenses.length}</p></div></Card>
        <Card className="admin-card px-6 py-6"><div className="px-6"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground/48">Rögzítés célja</p><p className="mt-2 text-base leading-7 text-foreground/68">Benzin, eszköz, szezonális beszerzés vagy egyéb költség.</p></div></Card>
      </div>

      {showForm && (
        <Card className="admin-card px-7 py-7">
          <form onSubmit={handleSubmit} className="space-y-5 px-6">
            {error && <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><div className="flex gap-3"><AlertCircle className="h-5 w-5" />{error}</div></div>}
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="mb-2 block text-sm font-semibold text-foreground">Kihez tartozik?</label><select value={formData.person} onChange={(e) => setFormData({ ...formData, person: e.target.value as "János" | "Sanyi" })} className="select-base"><option value="János">János</option><option value="Sanyi">Sanyi</option></select></div>
              <div><label className="mb-2 block text-sm font-semibold text-foreground">Dátum</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="input-base" /></div>
            </div>
            <div><label className="mb-2 block text-sm font-semibold text-foreground">Összeg (Ft)</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="input-base" /></div>
            <div><label className="mb-2 block text-sm font-semibold text-foreground">Leírás</label><input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Például benzin vagy kötözoanyag" className="input-base" /></div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" size="lg" onClick={() => setShowForm(false)}>Mégse</Button><Button type="submit" size="lg">Mentés</Button></div>
          </form>
        </Card>
      )}

      <div className="grid gap-3">
        {expenses.map((expense) => (
          <Card key={expense.id} className="admin-card px-6 py-6">
            <div className="flex items-start justify-between gap-4 px-6">
              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="status-pill border-primary/10 bg-secondary/50 text-primary">{expense.person === "János" ? "János" : "Sanyi"}</span><span className="text-sm text-foreground/56">{expense.date}</span></div>
                <p className="mt-3 text-lg font-semibold text-primary">{expense.description}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{expense.amount.toLocaleString("hu-HU")} Ft</p>
              </div>
              <Button type="button" variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(expense.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

