'use client'

interface FadeInAnimationOptions {
  delay?: number
  duration?: number
  y?: number
}

export function useFadeInAnimation(options: FadeInAnimationOptions = {}) {
  const { delay = 0, duration = 0.6, y = 20 } = options

  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration,
      ease: 'easeOut',
      ...(delay > 0 && { delay }),
    },
  }
}
