'use client'

import { motion } from 'framer-motion'
import { useFadeInAnimation } from 'hooks/useFadeInAnimation'

interface FadeInViewProps {
  children: React.ReactNode
  as?: keyof typeof motion
  className?: string
  delay?: number
  duration?: number
  y?: number
  [key: string]: any
}

export function FadeInView({
  children,
  as: Component = 'div',
  className = '',
  delay = 0,
  duration = 0.6,
  y = 20,
  ...restProps
}: FadeInViewProps) {
  const animationProps = useFadeInAnimation({ delay, duration, y })
  const MotionComponent = motion[Component] as any

  return (
    <MotionComponent className={className} {...animationProps} {...restProps}>
      {children}
    </MotionComponent>
  )
}
