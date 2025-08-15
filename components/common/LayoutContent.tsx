'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import classNames from 'classnames'

import { useAnimationContext } from 'contexts/AnimationContext'

import Header from 'components/common/Header'
import Footer from 'components/common/Footer'
import styles from 'components/common/LayoutContent.module.scss'

export default function LayoutContent({ children }: { children: ReactNode }) {
  const { animationDone } = useAnimationContext()
  const pathname = usePathname()
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [headerEntered, setHeaderEntered] = useState(false)
  const [isCenterContent, setIsCenterContent] = useState(false)

  useEffect(() => {
    if (pathname === '/') {
      if (!isCenterContent) setIsCenterContent(true)
    } else setIsCenterContent(false)
  }, [pathname])

  useEffect(() => {
    if (animationDone && !headerEntered) {
      setHeaderEntered(true)
    }
  }, [animationDone, headerEntered])

  useEffect(() => {
    if (!animationDone) return

    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > lastScrollY && currentY > 50) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }
      setLastScrollY(currentY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [animationDone, lastScrollY])

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
