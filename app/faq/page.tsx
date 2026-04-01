"use client"

import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { faqItems } from "@/lib/site"

export default function FAQPage() {
  return (
    <div>
      <section className="section-space">
        <div className="page-shell content-shell">
          <div className="text-center">
            <p className="section-kicker">GYIK</p>
            <h1 className="section-title">A legfontosabb kérdésekre itt gyorsan választ kapsz.</h1>
            <p className="section-subtitle mt-5">Olyan kérdéseket gyűjtöttünk össze, amelyek a foglalás, a fizetés, az érkezés és a választás során a leggyakrabban felmerülnek.</p>
          </div>

          <div className="mt-10 space-y-4">
            {faqItems.map((item, index) => (
              <Card key={item.question} className={`overflow-hidden px-0 py-0 ${index % 3 === 0 ? "tint-sky" : index % 3 === 1 ? "tint-berry" : "tint-forest"}`}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-xl font-semibold text-primary marker:hidden">
                    <span>{item.question}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/72 text-primary transition group-open:rotate-180"><ChevronDown className="h-5 w-5" /></span>
                  </summary>
                  <div className="border-t border-primary/8 px-6 py-5 text-base leading-8 text-foreground/74">{item.answer}</div>
                </details>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
