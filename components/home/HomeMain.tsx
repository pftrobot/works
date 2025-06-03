'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAnimationContext } from '@/contexts/AnimationContext'
import BasicButton from '@/components/common/BasicButton'
import styles from './HomeMain.module.scss'

export default function HomeMain() {
  const [displayedText, setDisplayedText] = useState('')
  const fullText = 'Technical problems are a CRIME.'
  const typingSpeed = 80
  const { setAnimationDone } = useAnimationContext()

  useEffect(() => {
    let currentIndex = 0
    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(timer)
        setTimeout(() => setAnimationDone(true), 1300)
      }
    }, typingSpeed)
    return () => clearInterval(timer)
  }, [fullText, typingSpeed, setAnimationDone])

  return (
    <section className={styles.home}>
      <div className={styles.intro}>
        <h2 className={styles.headline}>
          {displayedText}
          <motion.span
            className={styles.cursor}
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            |
          </motion.span>
        </h2>
        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: (fullText.length * typingSpeed) / 1000 + 0.8,
            duration: 0.8,
            ease: 'easeOut',
          }}
        >
          사건 파일을 열고, 기술 수사를 시작하세요.
        </motion.p>
      </div>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: (fullText.length * typingSpeed) / 1000 + 1.1,
          duration: 0.8,
          ease: 'easeOut',
        }}
      >
        <BasicButton href="/case" variant="primary">
          사건 기록 열람
        </BasicButton>
        <BasicButton href="/about" variant="secondary">
          수사관 프로파일
        </BasicButton>
      </motion.div>
    </section>
  )
}
