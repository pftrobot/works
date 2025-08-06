'use client'

import { motion } from 'framer-motion'
import { useStaggerAnimation } from 'hooks/useStaggerAnimation'

interface StaggerListProps {
  items: React.ReactNode[]
  as?: 'ul' | 'ol' | 'div'
  className?: string
  itemClassName?: string
  threshold?: number
  staggerDelay?: number
  delayChildren?: number
  itemDuration?: number
}

export function StaggerList({
  items,
  as: Component = 'ul',
  className = '',
  itemClassName = '',
  threshold = 0.3,
  staggerDelay = 0.15,
  delayChildren = 0.2,
  itemDuration = 0.5,
}: StaggerListProps) {
  const { ref, itemVariant, parentAnimateProps } = useStaggerAnimation({
    threshold,
    staggerDelay,
    delayChildren,
    itemDuration,
  })

  const MotionComponent = motion[Component] as any
  const ItemComponent = Component === 'ul' || Component === 'ol' ? motion.li : motion.div

  return (
    <MotionComponent ref={ref} className={className} {...parentAnimateProps}>
      {items.map((item, index) => (
        <ItemComponent key={index} variants={itemVariant} className={itemClassName}>
          {item}
        </ItemComponent>
      ))}
    </MotionComponent>
  )
}
