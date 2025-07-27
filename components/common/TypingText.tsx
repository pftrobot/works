'use client'

import { motion } from 'framer-motion'
import { useTypingAnimation } from '@/hooks/useTypingAnimation'

interface TypingTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  className?: string
  charClassName?: string
  threshold?: number
  staggerDelay?: number
}

export function TypingText({
  text,
  as: Component = 'div',
  className = '',
  charClassName = '',
  threshold = 0.5,
  staggerDelay = 0.04,
}: TypingTextProps) {
  const { ref, textToSpans, animateProps } = useTypingAnimation({
    threshold,
    staggerDelay,
    className: charClassName,
  })

  const MotionComponent = motion[Component] as any

  return (
    <MotionComponent ref={ref} className={className} {...animateProps}>
      {textToSpans(text, charClassName)}
    </MotionComponent>
  )
}
