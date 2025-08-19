'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import classNames from 'classnames'

import { useAnimationContext } from 'contexts/AnimationContext'
import { DELTA_SKIP, HIDE_AFTER, TOP_STICKY } from '@constants'

import Header from 'components/common/Header'
import Footer from 'components/common/Footer'
import styles from 'components/common/LayoutContent.module.scss'

export default function LayoutContent({ children }: { children: ReactNode }) {
  const { animationDone } = useAnimationContext()
  const pathname = usePathname()
  const [showHeader, setShowHeader] = useState(true)
  const lastYRef = useRef(0)
  const [headerEntered, setHeaderEntered] = useState(false)

  useEffect(() => {
    if (animationDone && !headerEntered) setHeaderEntered(true)
  }, [animationDone, headerEntered])

  useEffect(() => {
    if (!animationDone) return

    // 초기 위치 반영
    lastYRef.current = window.scrollY
    setShowHeader(window.scrollY <= TOP_STICKY)

    const onScroll = () => {
      if (document.documentElement.classList.contains('modal-open')) return

      const y = window.scrollY
      const last = lastYRef.current

      if (y <= TOP_STICKY) {
        setShowHeader(true)
        lastYRef.current = y
        return
      }

      if (Math.abs(y - last) < DELTA_SKIP) return

      if (y > last && y > HIDE_AFTER) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }

      lastYRef.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [animationDone])

  return (
    <div className={styles.layout}>
      {animationDone && (
        <motion.div
          className={styles.headerWrap}
          initial={{ y: '-100%' }}
          animate={{ y: showHeader ? 0 : '-100%' }}
          transition={{ duration: 0.4, ease: 'linear' }}
        >
          <Header />
        </motion.div>
      )}

      <main className={classNames(styles.main, { [styles.isMain]: pathname === '/' })}>
        {children}
      </main>

      {animationDone && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: animationDone ? 1 : 0, y: animationDone ? 0 : '100%' }}
          transition={{ duration: 0.6, ease: 'linear' }}
        >
          <Footer />
        </motion.div>
      )}
    </div>
  )
}
