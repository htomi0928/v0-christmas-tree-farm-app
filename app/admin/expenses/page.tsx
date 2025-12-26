"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, AlertCircle } from "lucide-react"
import type { Expense } from "@/lib/types"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    person: "János" as "János" | "Sanyi",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      const response = await fetch("/api/admin/expenses", {
        credentials: "include",
      })
      const data = await response.json()
      if (data.success) {
        setExpenses(data.expenses)
      }
    } catch (error) {
      console.error("Error loading expenses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      setError("Adj meg egy érvényes összeget")
      return
    }

    try {
      const response = await fetch("/api/admin/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          amount: Number.parseFloat(formData.amount),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setExpenses([data.expense, ...expenses])
        setFormData({
          person: "János",
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        })
        setShowForm(false)
      } else {
        setError(data.error || "Hiba történt")
      }
    } catch (error) {
      setError("Hálózati hiba")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Biztosan törölni szeretnéd ezt a kiadást?")) return

    try {
      const response = await fetch(`/api/admin/expenses/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await response.json()
      if (data.success) {
        setExpenses(expenses.filter((e) => e.id !== id))
      }
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  if (isLoading) {
    return <div className="text-foreground/70">Betöltés...</div>
  }

  const janosExpenses = expenses.filter((e) => e.person === "János")
  const sanyiExpenses = expenses.filter((e) => e.person === "Sanyi")

  const janosTotal = janosExpenses.reduce((sum, e) => sum + e.amount, 0)
  const sanyiTotal = sanyiExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Kiadások</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Új kiadás
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-900 mb-1">János kiadások</p>
          <p className="text-2xl font-bold text-green-700">{janosTotal.toLocaleString()} Ft</p>
          <p className="text-xs text-green-600 mt-1">{janosExpenses.length} tétel</p>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-1">Sanyi kiadások</p>
          <p className="text-2xl font-bold text-blue-700">{sanyiTotal.toLocaleString()} Ft</p>
          <p className="text-xs text-blue-600 mt-1">{sanyiExpenses.length} tétel</p>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <p className="text-sm font-medium text-purple-900 mb-1">Összes kiadás</p>
          <p className="text-2xl font-bold text-purple-700">{(janosTotal + sanyiTotal).toLocaleString()} Ft</p>
          <p className="text-xs text-purple-600 mt-1">{expenses.length} tétel</p>
        </Card>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">Új kiadás hozzáadása</h2>

          {error && (
            <div className="mb-4 flex gap-3 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Személy</label>
              <select
                value={formData.person}
                onChange={(e) => setFormData({ ...formData, person: e.target.value as "János" | "Sanyi" })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="János">János</option>
                <option value="Sanyi">Sanyi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Összeg (Ft)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="8000"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Leírás</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Benzin, eszközök, stb."
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Dátum</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Mégse
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Mentés
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Expenses List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-primary">Kiadások listája</h2>

        {expenses.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-foreground/70">Még nincsenek rögzített kiadások</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <Card key={expense.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          expense.person === "János" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {expense.person}
                      </span>
                      <span className="text-sm text-foreground/70">{expense.date}</span>
                    </div>
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <p className="text-lg font-bold text-primary mt-1">{expense.amount.toLocaleString()} Ft</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
