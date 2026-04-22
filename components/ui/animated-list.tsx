'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export type AnimatedListProps = {
  items: React.ReactNode[]
  className?: string
  itemClassName?: string
  staggerDelay?: number
}

export function AnimatedList({ items, className, itemClassName, staggerDelay = 0.08 }: AnimatedListProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.4,
              delay: i * staggerDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={itemClassName}
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
