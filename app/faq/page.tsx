"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll"

const faqs = [
  {
    question: "Lehet bankkártyával fizetni?",
    answer: "Igen. Készpénz és bankkártya is elfogadott a helyszínen.",
  },
  {
    question: "Mi van, ha nem tudok eljönni a foglalt napon?",
    answer:
      "Hívj fel telefonon, és megbeszélünk egy másik napot. Nem ragaszkodunk a dátumhoz.",
  },
  {
    question: "Több fát is vihetek egy foglalással?",
    answer:
      "Igen. Jelezd a várható darabszámot a foglalási űrlapon, hogy felkészülhessünk.",
  },
  {
    question: "Mi van, ha rossz idő van?",
    answer:
      "Esőben és szélben is nyitva vagyunk. Ha tényleg szélsőséges az időjárás, telefonon egyeztetünk.",
  },
  {
    question: "Van házhozszállítás?",
    answer:
      "Külön egyeztetéssel, plusz díjért Zalaegerszegen és közvetlen környékén igen. Érdeklődj telefonon.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-start justify-between text-left hover:text-foreground/80 transition-colors"
      >
        <h3 className="font-semibold text-foreground pr-4 tracking-tight">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="pb-5 text-muted-foreground font-light leading-relaxed">{answer}</p>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-24 sm:py-32 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div className="section-label">Kérdések</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">GYIK</h1>
            <p className="text-lg text-muted-foreground font-light max-w-xl">
              A leggyakoribb kérdések, amiket kapunk.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll>
            <div>
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
