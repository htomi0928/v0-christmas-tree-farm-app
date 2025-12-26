"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Lehet-e bankkártyával fizetni?",
    answer: "Igen, készpénzzel és bankkártyával is tudsz fizetni a helyszínen. Mindkét módszer egyformán elfogadott.",
  },
  {
    question: "Mi van, ha mégsem tudok eljönni a foglalt napon?",
    answer:
      "Kérünk, hogy hívj fel minket telefonon, és megbeszélünk egy másik napot. Igyekszünk maximálisan rugalmasak lenni, és szívesen más időpontot ajánlunk.",
  },
  {
    question: "Lehet több fát is vásárolni egy foglalással?",
    answer:
      "Igen, egy foglalással több fát is választhatsz, például családtagoknak. Kérjük, jelezd a várható darabszámot a foglalási űrlapon, hogy felkészülhessünk.",
  },
  {
    question: "Mi történik rossz idő esetén?",
    answer:
      "Alapvetően esőben és hóban is nyitva vagyunk. Ha nagyon szélsőséges az időjárás (vihar, fagypont alatt való hőmérséklet), egyeztetünk telefonon, és módosítunk az időpontot.",
  },
  {
    question: "Van-e házhoz szállítás?",
    answer:
      "Külön egyezzetéssel, plusz díjért Zalaegerszegen és környékén megoldható. Erről telefonon tudsz érdeklődni a szám: +36 (30) 123 4567.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-start justify-between hover:bg-secondary/10 transition-colors"
      >
        <h3 className="text-left font-semibold text-foreground">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-accent flex-shrink-0 ml-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="px-6 pb-6 text-foreground/70 border-t border-border">{answer}</div>}
    </Card>
  )
}

export default function FAQPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-12 sm:py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">GYIK – Gyakran Ismételt Kérdések</h1>
          <p className="text-lg text-foreground/70">Itt találod a legtöbb felmerülő kérdésre a választ.</p>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
