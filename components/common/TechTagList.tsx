'use client'

import { motion } from 'framer-motion'
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation'
import styles from './TechTagList.module.scss'

interface Props {
  tech: string[]
}

export default function TechTagList({ tech }: Props) {
  const staggerAnimation = useStaggerAnimation({
    threshold: 0.1,
    staggerDelay: 0.1,
    delayChildren: 0.4,
    itemDuration: 0.4,
  })

  if (!tech || tech.length === 0) return null

  return (
    <div className={styles.techBlock}>
      <strong className={styles.label}>사용 기술</strong>
      <motion.ul
        className={styles.list}
        ref={staggerAnimation.ref}
        {...staggerAnimation.parentAnimateProps}
      >
        {tech.map((item) => (
          <motion.li key={item} className={styles.tag} variants={staggerAnimation.itemVariant}>
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
