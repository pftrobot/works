'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { useAnimationContext } from 'contexts/AnimationContext'
import { useAddMedal } from 'utils/medalUtils'
import { MENU } from '@constants'

import { FadeInView } from 'components/common/FadeInView'
import BasicButton from 'components/common/BasicButton'
import CubeScanner from 'components/home/CubeScanner'
import GuideNotice from 'components/home/GuideNotice'
import styles from './HomeMain.module.scss'

const FULL_TEXT = 'ACCESS AUTHORIZED'
const TYPING_SPEED = 100
const SHOW_DELAY = 1.4
const SHOW_GNB = 500
const { LIST, ABOUT } = MENU

export default function HomeMain() {
  const { setAnimationDone, hasSeenIntro, setHasSeenIntro } = useAnimationContext()
  const [phase, setPhase] = useState<'scan' | 'typing' | 'done'>('scan')
  const [displayedText, setDisplayedText] = useState('')
  const [scanText, setScanText] = useState('')
  const [showScanner, setShowScanner] = useState(false)

  // Initialize
  useEffect(() => {
    if (hasSeenIntro) {
      setAnimationDone(true)
      setPhase('typing')
    } else {
      setAnimationDone(false)
      setPhase('scan')
    }
  }, [hasSeenIntro, setAnimationDone])

  useEffect(() => {
    if (phase !== 'scan') return
    let i = 0
    const interval = setInterval(() => {
      if (i <= '시스템 스캔 중...'.length) {
        setScanText('시스템 스캔 중...'.slice(0, i))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowScanner(true), 300)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'typing') return
    let currentIndex = 0
    const timer = setInterval(() => {
      if (currentIndex <= FULL_TEXT.length) {
        setDisplayedText(FULL_TEXT.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(timer)
        setHasSeenIntro(true) // 큐브 애니메이션 스킵
        setAnimationDone(true)
        setTimeout(() => setPhase('done'), SHOW_GNB)
      }
    }, TYPING_SPEED)
    return () => clearInterval(timer)
  }, [phase, setAnimationDone, setHasSeenIntro])

  useEffect(() => {
    throw new Error('테스트용 에러입니다!')
  }, [])

  return (
    <section className={styles.home}>
      <AnimatePresence>
        {phase === 'scan' && (
          <motion.div className={styles.fingerprintWrap}>
            <div className={styles.fingerprintInner}>
              {showScanner && <CubeScanner onScanComplete={() => setPhase('typing')} />}
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

          <FadeInView
            as="p"
            className={styles.tagline}
            delay={SHOW_DELAY + 0.1}
            duration={0.8}
            y={10}
          >
            사건 파일을 열고, 기술 수사를 시작하세요.
          </FadeInView>

          <FadeInView className={styles.actions} delay={SHOW_DELAY + 0.6} duration={0.8} y={20}>
            <BasicButton href={LIST} variant="primary">
              사건 기록 열람
            </BasicButton>
            <BasicButton href={ABOUT} variant="secondary">
              수사관 프로파일
            </BasicButton>
          </FadeInView>
        </div>
      )}

      {phase === 'done' && <GuideNotice />}
    </section>
  )
}
