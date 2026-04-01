"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Lehet bankkártyával fizetni?",
    answer: "Igen. Készpénz és bankkártya is elfogadott a helyszínen.",
  },
  {
    question: "Mi van, ha nem tudok eljönni a foglalt napon?",
    answer: "Hívj fel telefonon, és megbeszélünk egy másik napot. Nem ragaszkodunk a dátumhoz.",
  },
  {
    question: "Több fát is vihetek egy foglalással?",
    answer: "Igen. Jelezd a várható darabszámot a foglalási űrlapon, hogy felkészülhessünk.",
  },
  {
    question: "Mi van, ha rossz idő van?",
    answer: "Esőben és szélben is nyitva vagyunk. Ha tényleg szélsőséges az időjárás, telefonon egyeztetünk.",
  },
  {
    question: "Van házhozszállítás?",
    answer: "Külön egyeztetéssel, plusz díjért Zalaegerszegen és közvetlen környékén igen. Érdeklődj telefonon.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-start justify-between text-left hover:text-foreground/80 transition-colors"
      >
        <h3 className="font-semibold text-foreground pr-4 tracking-tight text-sm">{question}</h3>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="pb-4 text-sm text-muted-foreground font-light leading-relaxed">{answer}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — heading */}
          <div>
            <div className="section-label mb-3">Kérdések</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight">
              Gyakran ismételt kérdések
            </h1>
            <p className="text-muted-foreground font-light max-w-xs">
              A leggyakoribb kérdések, amiket kapunk.
            </p>
          </div>

          {/* Right — accordion */}
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
