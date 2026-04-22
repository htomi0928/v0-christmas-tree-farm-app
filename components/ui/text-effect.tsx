'use client'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion, Variants, Transition, Variant } from 'framer-motion'
import React from 'react'

export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'
export type PerType = 'word' | 'char' | 'line'

export type TextEffectProps = {
  children: string
  per?: PerType
  as?: keyof React.JSX.IntrinsicElements
  variants?: { container?: Variants; item?: Variants }
  className?: string
  preset?: PresetType
  delay?: number
  speedReveal?: number
  speedSegment?: number
  trigger?: boolean
  onAnimationComplete?: () => void
  segmentWrapperClassName?: string
}

const defaultStaggerTimes: Record<PerType, number> = { char: 0.03, word: 0.05, line: 0.1 }

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, y: 20, filter: 'blur(12px)' },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
}

function splitText(text: string, per: PerType) {
  if (per === 'line') return text.split('\n')
  return text.split(/(\s+)/)
}

const AnimationComponent = React.memo(({
  segment, variants, per, segmentWrapperClassName,
}: { segment: string; variants: Variants; per: PerType; segmentWrapperClassName?: string }) => {
  if (per === 'char') {
    return (
      <motion.span className='inline-block whitespace-pre'>
        {segment.split('').map((char, i) => (
          <motion.span key={i} aria-hidden='true' variants={variants} className='inline-block whitespace-pre'>
            {char}
          </motion.span>
        ))}
      </motion.span>
    )
  }
  return (
    <motion.span aria-hidden='true' variants={variants} className={cn('inline-block whitespace-pre', segmentWrapperClassName)}>
      {segment}
    </motion.span>
  )
})
AnimationComponent.displayName = 'AnimationComponent'

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  segmentWrapperClassName,
}: TextEffectProps) {
  const segments = splitText(children, per)
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div
  const base = preset ? presetVariants[preset] : { container: defaultContainerVariants, item: { hidden: { opacity: 0 }, visible: { opacity: 1 } } }
  const stagger = defaultStaggerTimes[per] / speedReveal
  const duration = 0.3 / speedSegment

  const containerVariants: Variants = {
    ...base.container,
    visible: {
      ...(base.container.visible as object),
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }
  const itemVariants: Variants = {
    ...base.item,
    visible: { ...(base.item.visible as object), transition: { duration } },
  }

  return (
    <AnimatePresence mode='popLayout'>
      {trigger && (
        <MotionTag
          initial='hidden' animate='visible' exit='exit'
          variants={containerVariants}
          className={className}
          onAnimationComplete={onAnimationComplete}
        >
          {per !== 'line' && <span className='sr-only'>{children}</span>}
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}`}
              segment={segment}
              variants={itemVariants}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  )
}
