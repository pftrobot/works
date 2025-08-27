'use client'

import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { EASE_LINEAR } from '@constants'

interface TypingAnimationOptions {
  threshold?: number
  staggerDelay?: number
  className?: string
}

export function useTypingAnimation(options: TypingAnimationOptions = {}) {
  const { threshold = 0.5, staggerDelay = 0.04, className = '' } = options

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
  })

  const charVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.01,
        ease: EASE_LINEAR,
      },
    },
  }

  const textParentVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay || 0.1,
      },
    },
  }

  const textToSpans = (text: string, customClassName?: string) =>
    text.split('').map((char, index) => (
      <motion.span key={index} className={customClassName || className} variants={charVariant}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))

  return {
    ref,
    inView,
    textToSpans,
    textParentVariant,
    animateProps: {
      initial: 'hidden' as const,
      animate: inView ? ('visible' as const) : ('hidden' as const),
      variants: textParentVariant,
    },
  }
}
