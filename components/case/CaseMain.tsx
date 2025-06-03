'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAnimationContext } from '@/contexts/AnimationContext'
import { caseList, CaseMeta } from '@/data/casesMeta'
import PageTitle from '@/components/common/PageTitle'
import CaseDetailModal from './CaseDetailModal'
import styles from './CaseMain.module.scss'

export default function CaseMain() {
  const [selected, setSelected] = useState<CaseMeta | null>(null)
  const [cardInView, setCardInView] = useState<boolean[]>(Array(caseList.length).fill(false))
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { setAnimationDone } = useAnimationContext()

  const charVariant = {
    hidden: { opacity: 0, y: -4 },
    visible: { opacity: 1, y: 0 },
  }

  const textParentVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  }

  const textToSpans = (text: string, className: string) =>
    text.split('').map((char, index) => (
      <motion.span key={index} className={className} variants={charVariant}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    caseList.forEach((_, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCardInView((prev) => {
              const copy = [...prev]
              copy[i] = true
              return copy
            })
            observer.disconnect()
          }
        },
        {
          threshold: 0.2,
        },
      )

      if (cardRefs.current[i]) {
        observer.observe(cardRefs.current[i]!)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, 800)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  return (
    <motion.main
      className={styles.caseWrap}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <PageTitle>CASE LIST</PageTitle>

      <motion.p
        className={styles.description}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        실제 기술 문제들을 사건처럼 분석하고 정리한 수사기록입니다. 사건을 선택해 수사 과정을
        따라가보세요.
      </motion.p>

      <div className={styles.caseGrid}>
        {caseList.map((item, i) => (
          <motion.button
            key={item.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            type="button"
            className={styles.card}
            onClick={() => setSelected(item)}
            initial={{ opacity: 0, y: 30 }}
            animate={cardInView[i] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className={styles.thumbnail}>
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.image}
              />
            </div>

            <motion.div
              className={styles.textWrap}
              initial="hidden"
              animate={cardInView[i] ? 'visible' : 'hidden'}
              variants={textParentVariant}
            >
              <motion.div className={styles.slug} variants={textParentVariant}>
                {textToSpans(item.slug.toUpperCase(), styles.char)}
              </motion.div>
              <motion.div className={styles.title} variants={textParentVariant}>
                {textToSpans(item.title, styles.char)}
              </motion.div>
            </motion.div>
          </motion.button>
        ))}
      </div>

      <CaseDetailModal
        key={selected?.id}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        caseMeta={selected}
      />
    </motion.main>
  )
}
