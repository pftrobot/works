'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { useAnimationContext } from '@/contexts/AnimationContext'
import { addMedal } from '@/utils/medalUtils'
import { MedalType } from '@/types/medal'

import BasicButton from '@/components/common/BasicButton'
import FingerprintScan from '@/components/home/FingerprintScan'
import GuideNotice from '@/components/home/GuideNotice'
import styles from './HomeMain.module.scss'

export default function HomeMain() {
  const [phase, setPhase] = useState<'scan' | 'typing' | 'done'>('scan')
  const [displayedText, setDisplayedText] = useState('')
  const [scanText, setScanText] = useState('')
  const [showFingerprint, setShowFingerprint] = useState(false)
  const fullText = 'ACCESS GRANTED'
  const typingSpeed = 100
  const { setAnimationDone, animationDone } = useAnimationContext()

  useEffect(() => {
    if (animationDone) {
      const timeout = setTimeout(() => {
        setPhase('done')
      }, 2800)
      return () => clearTimeout(timeout)
    } else {
      setPhase('scan')
    }
  }, [animationDone])

  useEffect(() => {
    if (phase === 'scan') {
      let i = 0
      const interval = setInterval(() => {
        if (i <= '지문 인식 중...'.length) {
          setScanText('지문 인식 중...'.slice(0, i))
          i++
        } else {
          clearInterval(interval)
          setTimeout(() => setShowFingerprint(true), 300)
        }
      }, 80)
      return () => clearInterval(interval)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'typing') {
      let currentIndex = 0
      const timer = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(timer)
          setTimeout(() => {
            setPhase('done')
            setAnimationDone(true)
          }, 1000)
        }
      }, typingSpeed)
      return () => clearInterval(timer)
    }
  }, [phase, setAnimationDone])

  return (
    <section className={styles.home}>
      <AnimatePresence>
        {phase === 'scan' && (
          <motion.div className={styles.fingerprintWrap}>
            <div className={styles.fingerprintInner}>
              {showFingerprint && <FingerprintScan onScanComplete={() => setPhase('typing')} />}
              {scanText && <p className={styles.scanText}>{scanText}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== 'scan' && (
        <div className={styles.typingWrap}>
          <h2 className={styles.headline}>
            {displayedText}
            <motion.span
              className={styles.cursor}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
            >
              |
            </motion.span>
          </h2>

          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
          >
            사건 파일을 열고, 기술 수사를 시작하세요.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8, ease: 'easeOut' }}
          >
            <BasicButton href="/case" variant="primary">
              사건 기록 열람
            </BasicButton>
            <BasicButton href="/about" variant="secondary">
              수사관 프로파일
            </BasicButton>
          </motion.div>
        </div>
      )}

      {phase === 'done' && <GuideNotice />}

      {/* TODO 테스트용 이스터에그 */}
      <button onClick={() => addMedal(MedalType.Egg)} className={styles.hiddenBtn}>
        사실 이스터에그
      </button>
    </section>
  )
}
