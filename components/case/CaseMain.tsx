'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

import { useAnimationContext } from '@/contexts/AnimationContext'
import { caseList, CaseMeta } from '@/data/casesMeta'

import PageTitle from '@/components/common/PageTitle'
import CaseDetailModal from './CaseDetailModal'
import styles from './CaseMain.module.scss'

const FILTER_KEYWORDS = ['렌더링', '인증', '인터랙션', 'SSR', '데이터', '컴포넌트'] as const
type FilterKeyword = (typeof FILTER_KEYWORDS)[number]

export default function CaseMain() {
  const [selected, setSelected] = useState<CaseMeta | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterKeyword | null>(null)
  const [filteredCases, setFilteredCases] = useState<CaseMeta[]>(caseList)
  const [animationKey, setAnimationKey] = useState(0)
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

  const handleFilterClick = (filter: FilterKeyword) => {
    if (activeFilter === filter) {
      setActiveFilter(null)
      setFilteredCases(caseList)
    } else {
      setActiveFilter(filter)
      const filtered = caseList.filter((caseItem) =>
        caseItem.tech.some((tech) => tech.includes(filter)),
      )
      setFilteredCases(filtered)
    }
    setAnimationKey((prev) => prev + 1)
  }

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

      <motion.div
        className={styles.filterSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className={styles.filterButtons}>
          {FILTER_KEYWORDS.map((filter) => (
            <motion.button
              key={filter}
              type="button"
              className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
              onClick={() => handleFilterClick(filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={animationKey}
          className={styles.caseGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredCases.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              className={styles.card}
              onClick={() => setSelected(item)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: i * 0.08,
              }}
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
                animate="visible"
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
        </motion.div>
      </AnimatePresence>

      {filteredCases.length === 0 && (
        <motion.div
          className={styles.noResults}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>해당 필터에 맞는 사건이 없습니다.</p>
        </motion.div>
      )}

      <CaseDetailModal
        key={selected?.id}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        caseMeta={selected}
      />
    </motion.main>
  )
}
