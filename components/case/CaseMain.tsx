'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import { useAnimationContext } from 'contexts/AnimationContext'
import { useCaseStore, FILTER_KEYWORDS, FilterKeyword } from 'stores/caseStore'
import { CaseMeta } from 'lib/supabase'
import { getCaseThumbnailUrlViaAPI } from 'lib/supabaseStorage'
import { useTypingAnimation } from 'hooks/useTypingAnimation'

import { FadeInView } from 'components/common/FadeInView'
import PageTitle from 'components/common/PageTitle'
import CaseDetailModal from './CaseDetailModal'
import CaseSearch from './CaseSearch'
import styles from './CaseMain.module.scss'

const BASIC_DURATION = 0.5
const SHOW_GNB = 800

export default function CaseMain() {
  const [selected, setSelected] = useState<CaseMeta | null>(null)
  const [animationKey, setAnimationKey] = useState(0) // 리스트 전환 시 grid 전체에 exit/enter 트랜지션 주기 위한 key
  const [filteredCases, setFilteredCases] = useState<CaseMeta[]>([])
  const { setAnimationDone } = useAnimationContext()

  const { cases, activeFilters, isLoading, error, fetchCases, setActiveFilters } = useCaseStore()

  // 카드 등장 애니메이션을 한번만 실행시키기 위한 ref (스크롤 재방문 시 재애니메이션 방지)
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

  const handleSearchChange = useCallback((searchResults: CaseMeta[]) => {
    setFilteredCases(searchResults)
  }, [])

  const handleResetAll = useCallback(() => {
    setActiveFilters([])
  }, [setActiveFilters])

  useEffect(() => {
    fetchCases()
  }, [fetchCases])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, SHOW_GNB)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  const CaseCard = ({ item, onClick }: { item: CaseMeta; onClick: () => void }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })
    const { textToSpans, animateProps } = useTypingAnimation({
      threshold: 1,
      staggerDelay: 0.04,
    })

    const cardId = item.id.toString()
    const hasAnimated = animatedCardsRef.current.has(cardId)

    // 뷰포트 진입시 한 번만 등장 모션
    useEffect(() => {
      if (inView && !hasAnimated) {
        animatedCardsRef.current.add(cardId)
      }
    }, [inView, hasAnimated, cardId])

    const shouldAnimate = hasAnimated || inView

    return (
      <motion.button
        ref={ref}
        key={item.id}
        type="button"
        className={styles.card}
        onClick={onClick}
        initial={{
          opacity: hasAnimated ? 1 : 0,
          y: hasAnimated ? 0 : 30,
        }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: hasAnimated ? 0 : BASIC_DURATION,
          ease: 'easeOut',
        }}
      >
        <div className={styles.thumbnail}>
          <Image
            src={getCaseThumbnailUrlViaAPI(item.thumbnail)} // 썸네일 이미지는 스토리지 서버에서 불러옴
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
          initial={hasAnimated ? 'visible' : 'hidden'}
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

  return (
    <AnimatePresence mode="wait">
      <FadeInView as="main" className={styles.caseWrap} duration={0.6} y={20}>
        <PageTitle>CASE LIST</PageTitle>

        {isLoading ? (
          <div className={styles.loading}>
            <p>사건을 조사하는 중...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>사건을 불러오는데 실패했습니다: {error}</p>
            <button onClick={fetchCases} className={styles.retryButton}>
              다시 시도
            </button>
          </div>
        ) : (
          <>
            <FadeInView as="p" className={styles.description} delay={0.3} duration={BASIC_DURATION}>
              실제 기술 문제들을 사건처럼 분석하고 정리한 수사기록입니다. 사건을 선택해 수사 과정을
              따라가보세요.
            </FadeInView>

            <FadeInView
              className={styles.searchWrapper}
              delay={0.35}
              duration={BASIC_DURATION}
              y={10}
            >
              <CaseSearch
                cases={cases}
                activeFilters={activeFilters}
                onSearchChange={handleSearchChange}
              />
            </FadeInView>

            <FadeInView
              className={styles.filterSection}
              delay={0.4}
              duration={BASIC_DURATION}
              y={10}
            >
              <div className={styles.filterButtons}>
                {FILTER_KEYWORDS.map((filter) => {
                  const count =
                    filter === '전체'
                      ? cases.length
                      : cases.filter((caseItem) =>
                          caseItem.tech.some((tech) => tech.includes(filter)),
                        ).length
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
            </FadeInView>

            {(filteredCases.length !== cases.length || activeFilters.length > 0) && (
              <FadeInView className={styles.resultsCount} delay={0.45} duration={BASIC_DURATION}>
                <p>{filteredCases.length}개의 사건이 발견되었습니다</p>
              </FadeInView>
            )}

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
              <FadeInView className={styles.noResults} duration={BASIC_DURATION}>
                <p>
                  {activeFilters.length > 0
                    ? '검색 조건에 맞는 사건이 없습니다.'
                    : '해당 필터에 맞는 사건이 없습니다.'}
                </p>
                {activeFilters.length > 0 && (
                  <button onClick={handleResetAll} className={styles.resetButton}>
                    검색 초기화
                  </button>
                )}
              </FadeInView>
            )}

            <CaseDetailModal
              key={selected?.id}
              open={Boolean(selected)}
              onClose={() => setSelected(null)}
              caseMeta={selected}
            />
          </>
        )}
      </FadeInView>
    </AnimatePresence>
  )
}
