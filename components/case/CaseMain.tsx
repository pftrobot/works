'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import { useAnimationContext } from '@/contexts/AnimationContext'
import { useCaseStore, FILTER_KEYWORDS, FilterKeyword } from '@/stores/caseStore'
import { CaseMeta } from '@/lib/supabase'
import { getCaseThumbnailUrlViaAPI } from '@/lib/supabaseStorage'
import { useTypingAnimation } from '@/hooks/useTypingAnimation'

import { FadeInSection } from '@/components/common/FadeInSection'
import PageTitle from '@/components/common/PageTitle'
import CaseDetailModal from './CaseDetailModal'
import styles from './CaseMain.module.scss'

export default function CaseMain() {
  const [selected, setSelected] = useState<CaseMeta | null>(null)
  const [animationKey, setAnimationKey] = useState(0)
  const { setAnimationDone } = useAnimationContext()

  const { cases, filteredCases, activeFilters, isLoading, error, fetchCases, setActiveFilters } =
    useCaseStore()

  // 애니메이션을 한번만 실행시키기 위한 ref
  const animatedCardsRef = useRef<Set<string>>(new Set())

  const handleFilterClick = (filter: FilterKeyword) => {
    if (filter === '전체') {
      setActiveFilters([])
      setAnimationKey((prev) => prev + 1)
      return
    }

    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter]

    setActiveFilters(newFilters)
    setAnimationKey((prev) => prev + 1)
  }

  useEffect(() => {
    fetchCases()
  }, [fetchCases])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, 800)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  const CaseCard = ({ item, onClick }: { item: CaseMeta; onClick: () => void }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
    const { textToSpans, animateProps } = useTypingAnimation({
      threshold: 1,
      staggerDelay: 0.04,
    })

    const cardId = item.id.toString()
    const hasAnimatedBefore = animatedCardsRef.current.has(cardId)

    useEffect(() => {
      if (inView && !hasAnimatedBefore) {
        animatedCardsRef.current.add(cardId)
      }
    }, [inView, hasAnimatedBefore, cardId])

    const shouldAnimate = hasAnimatedBefore || inView

    return (
      <motion.button
        ref={ref}
        key={item.id}
        type="button"
        className={styles.card}
        onClick={onClick}
        initial={{
          opacity: hasAnimatedBefore ? 1 : 0,
          y: hasAnimatedBefore ? 0 : 30,
        }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: hasAnimatedBefore ? 0 : 0.5,
          ease: 'easeOut',
        }}
      >
        <div className={styles.thumbnail}>
          <Image
            src={getCaseThumbnailUrlViaAPI(item.thumbnail)}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/imgs/bg/OBJ02.png'
            }}
          />
        </div>

        <motion.div
          className={styles.textWrap}
          initial={hasAnimatedBefore ? 'visible' : 'hidden'}
          animate={shouldAnimate ? 'visible' : 'hidden'}
          variants={animateProps.variants}
        >
          <motion.div className={styles.slug} variants={animateProps.variants}>
            {textToSpans(item.slug.toUpperCase(), styles.char)}
          </motion.div>
          <div className={styles.descArea}>
            <motion.div className={styles.title} variants={animateProps.variants}>
              {textToSpans(item.title, styles.char)}
            </motion.div>
            <motion.div
              className={`${styles.title} ${styles.sub}`}
              variants={animateProps.variants}
            >
              {textToSpans(item.subtitle, styles.char)}
            </motion.div>
          </div>
        </motion.div>
      </motion.button>
    )
  }

  if (isLoading) {
    return (
      <FadeInSection as="main" className={styles.caseWrap} duration={0.6} y={20}>
        <PageTitle>CASE LIST</PageTitle>
        <div className={styles.loading}>
          <p>사건을 조사하는 중...</p>
        </div>
      </FadeInSection>
    )
  }

  if (error) {
    return (
      <FadeInSection as="main" className={styles.caseWrap} duration={0.6} y={20}>
        <PageTitle>CASE LIST</PageTitle>
        <div className={styles.error}>
          <p>사건을 불러오는데 실패했습니다: {error}</p>
          <button onClick={fetchCases} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      </FadeInSection>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <FadeInSection as="main" className={styles.caseWrap} duration={0.6} y={20}>
        <PageTitle>CASE LIST</PageTitle>

        <FadeInSection as="p" className={styles.description} delay={0.3} duration={0.5}>
          실제 기술 문제들을 사건처럼 분석하고 정리한 수사기록입니다. 사건을 선택해 수사 과정을
          따라가보세요.
        </FadeInSection>

        <FadeInSection className={styles.filterSection} delay={0.4} duration={0.5} y={10}>
          <div className={styles.filterButtons}>
            {FILTER_KEYWORDS.map((filter) => {
              const count =
                filter === '전체'
                  ? cases.length
                  : cases.filter((caseItem) => caseItem.tech.some((tech) => tech.includes(filter)))
                      .length
              const isActive =
                filter === '전체' ? activeFilters.length === 0 : activeFilters.includes(filter)
              return (
                <motion.button
                  key={filter}
                  type="button"
                  className={`${styles.filterButton} ${isActive ? styles.active : ''}`}
                  onClick={() => handleFilterClick(filter)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {`${filter} (${count})`}
                </motion.button>
              )
            })}
          </div>
        </FadeInSection>

        <AnimatePresence mode="wait">
          <motion.div
            key={animationKey}
            className={styles.caseGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredCases.map((item) => (
              <CaseCard key={item.id} item={item} onClick={() => setSelected(item)} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredCases.length === 0 && !isLoading && (
          <FadeInSection className={styles.noResults} duration={0.5}>
            <p>해당 필터에 맞는 사건이 없습니다.</p>
          </FadeInSection>
        )}

        <CaseDetailModal
          key={selected?.id}
          open={Boolean(selected)}
          onClose={() => setSelected(null)}
          caseMeta={selected}
        />
      </FadeInSection>
    </AnimatePresence>
  )
}
