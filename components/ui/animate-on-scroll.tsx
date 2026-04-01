"use client"

import { useEffect, useRef } from "react"

interface AnimateOnScrollProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimateOnScroll({ children, delay = 0, className }: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view")
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }} // transitionDelay, NOT animationDelay — CSS uses transition
    >
      {children}
    </div>
  )
}
