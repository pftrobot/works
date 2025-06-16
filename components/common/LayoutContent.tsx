'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useAnimationContext } from '@/contexts/AnimationContext'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import styles from '@/app/layout.module.scss'

export default function LayoutContent({ children }: { children: ReactNode }) {
  const { animationDone } = useAnimationContext()

  return (
    <div className={styles.layout}>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: animationDone ? 1 : 0, y: animationDone ? 0 : -40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Header />
      </motion.div>
      <main className={styles.main}>{children}</main>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: animationDone ? 1 : 0, y: animationDone ? 0 : 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Footer />
      </motion.div>
    </div>
  )
}
