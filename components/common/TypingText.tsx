'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTypingAnimation } from 'hooks/useTypingAnimation'

interface TypingTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'strong'
  className?: string
  charClassName?: string
  threshold?: number
  staggerDelay?: number
  delay?: number
  children?: ReactNode
}

export function TypingText({
  text,
  as: Component = 'div',
  className = '',
  charClassName = '',
  threshold = 0.5,
  staggerDelay = 0.04,
  delay = 0,
  children,
}: TypingTextProps) {
  const { ref, textToSpans, animateProps } = useTypingAnimation({
    threshold,
    staggerDelay,
    className: charClassName,
  })

  const MotionComponent = motion[Component] as any

  const delayedVariants =
    delay > 0
      ? {
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: delay,
            },
          },
        }
      : animateProps.variants

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={animateProps.initial}
      animate={animateProps.animate}
      variants={delayedVariants}
    >
      {textToSpans(text, charClassName)}
      {children}
    </MotionComponent>
  )
}
