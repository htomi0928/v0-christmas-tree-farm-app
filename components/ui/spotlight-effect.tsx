'use client'
import { useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

export function SpotlightEffect({ className, fill = '#6e7f6a' }: { className?: string; fill?: string }) {
  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <radialGradient id='spotlight-grad' cx='50%' cy='35%' r='55%'>
          <stop offset='0%' stopColor={fill} stopOpacity='0.55' />
          <stop offset='40%' stopColor={fill} stopOpacity='0.2' />
          <stop offset='100%' stopColor={fill} stopOpacity='0' />
        </radialGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#spotlight-grad)'
        style={{ animation: 'spotlight-in 1.4s cubic-bezier(0.22,1,0.36,1) both' }}
      />
      <style>{`
        @keyframes spotlight-in {
          from { opacity: 0; transform: scale(0.4) translateY(30px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </svg>
  )
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(110,127,106,0.12)',
}: {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--x', `${x}px`)
    el.style.setProperty('--y', `${y}px`)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn('relative overflow-hidden', className)}
      style={{
        background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), ${spotlightColor}, transparent 60%)`,
      }}
    >
      {children}
    </div>
  )
}
