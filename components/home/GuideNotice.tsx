'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { useAnimationContext } from 'contexts/AnimationContext'

import styles from './GuideNotice.module.scss'

const SHOW_DELAY = 3500
const DURATION = 0.6

export default function GuideNotice() {
  const { guideNoticeVisible, setGuideNoticeVisible } = useAnimationContext()

  useEffect(() => {
    const timeout = setTimeout(() => setGuideNoticeVisible(false), SHOW_DELAY)
    return () => clearTimeout(timeout)
  }, [setGuideNoticeVisible])

  return (
    <AnimatePresence>
      {guideNoticeVisible && (
        <motion.div
          className={styles.guideNotice}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: DURATION }}
        >
          이 사이트는 기술 수사관의 기록 보관소입니다. <br className={styles.brM} />
          하단의 '관람 가이드'를 참고해보세요.
        </motion.div>
      )}
    </AnimatePresence>
  )
}
