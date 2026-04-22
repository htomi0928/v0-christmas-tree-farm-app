'use client'
import { ReactNode, useRef, useState } from 'react'
import { motion, useInView, Variants, Transition } from 'framer-motion'

export type InViewProps = {
  children: ReactNode
  variants?: { hidden: object; visible: object }
  transition?: Transition
  margin?: string
  once?: boolean
  as?: React.ElementType
  className?: string
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  margin = '-80px',
  once = true,
  className,
}: InViewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin } as any)

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}
