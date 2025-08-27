'use client'

import { useInView } from 'react-intersection-observer'
import { EASE_OUT } from '@constants'

interface StaggerAnimationOptions {
  threshold?: number
  staggerDelay?: number
  delayChildren?: number
  itemDuration?: number
}

export function useStaggerAnimation(options: StaggerAnimationOptions = {}) {
  const { threshold = 0.3, staggerDelay = 0.15, delayChildren = 0.2, itemDuration = 0.5 } = options

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
  })

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: itemDuration,
        ease: EASE_OUT,
      },
    },
  }

  const parentVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  }

  return {
    ref,
    inView,
    itemVariant,
    parentVariant,
    parentAnimateProps: {
      initial: 'hidden' as const,
      animate: inView ? ('visible' as const) : ('hidden' as const),
      variants: parentVariant,
    },
  }
}
