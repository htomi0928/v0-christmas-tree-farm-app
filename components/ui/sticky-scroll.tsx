'use client'
import { useRef, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { cn } from '@/lib/utils'

export type StickyScrollItem = {
  title: string
  description: string
  content?: React.ReactNode
}

export function StickyScroll({
  items,
  className,
}: {
  items: StickyScrollItem[]
  className?: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className={cn('relative flex gap-16', className)} ref={containerRef}>
      {/* Left — scrolling text */}
      <div className='flex-1'>
        {items.map((item, i) => (
          <div
            key={i}
            className='min-h-[40vh] flex flex-col justify-center py-12'
            onMouseEnter={() => setActiveIndex(i)}
          >
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: activeIndex === i ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center gap-3 mb-3'>
                <span className='text-xs font-bold text-[#6e7f6a] tracking-widest tabular-nums'>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className='h-px flex-1 bg-[#bfc3c7]' />
              </div>
              <h3 className='text-xl font-semibold text-[#3a3a3a] mb-2 tracking-tight'>{item.title}</h3>
              <p className='text-[#4a4f4a] font-light leading-relaxed'>{item.description}</p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Right — sticky visual */}
      <div className='hidden lg:block flex-1 sticky top-24 self-start h-[60vh]'>
        {items.map((item, i) => (
          <motion.div
            key={i}
            className='absolute inset-0 rounded-xl overflow-hidden bg-[#6e7f6a]/10 flex items-center justify-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: activeIndex === i ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {item.content ?? (
              <div className='text-center p-8'>
                <span className='text-5xl font-extrabold text-[#6e7f6a]/30 tracking-tight'>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
