'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import styles from './GuideNotice.module.scss'

export default function GuideNotice() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 4000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.guideNotice}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          이 사이트는 기술 수사관의 기록 보관소입니다. 아래 '관람 가이드'를 참고해보세요.
        </motion.div>
      )}
    </AnimatePresence>
  )
}
