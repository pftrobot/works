'use client'

import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAnimationContext } from '@/contexts/AnimationContext'
import {
  dnaList,
  techGroups,
  caseWeapons,
  timeline,
  recentCases,
  guideSteps,
} from '@/data/aboutData'
import PageTitle from '@/components/common/PageTitle'
import ProfileCard from '@/components/about/ProfileCard'
import Block from './Block'
import styles from './AboutMain.module.scss'
import { useEffect } from 'react'

export default function AboutMain() {
  const { setAnimationDone } = useAnimationContext()
  const [refProfile, inViewProfile] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [refDna, inViewDna] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, 800)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  return (
    <motion.section
      className={styles.aboutWrap}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <PageTitle className={styles.pageTitle}>PROFILE</PageTitle>

      <motion.div
        ref={refProfile}
        className={styles.profileSection}
        initial={{ opacity: 0, y: 24 }}
        animate={inViewProfile ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <ProfileCard />
      </motion.div>

      <Block
        title="수사 스타일 DNA"
        description="기술 문제를 어떻게 접근하는지, 성향을 수치화해 보았습니다"
      >
        <motion.div
          ref={refDna}
          className={styles.dnaChart}
          initial="hidden"
          animate={inViewDna ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {},
          }}
        >
          {dnaList.map(({ label, size, color }) => (
            <motion.div
              key={label}
              className={styles.dnaItem}
              style={
                {
                  '--para-color': color,
                  '--bar-color': color,
                  '--bar-size': size,
                } as React.CSSProperties
              }
              variants={{
                hidden: { opacity: 0, x: -20, scale: 0.95 },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: { duration: 0.4, ease: 'easeOut' },
                },
              }}
            >
              <div className={styles.labelTop}>
                <span className={styles.skillText}>{'//'} SKILL</span>
                <span className={styles.iconShape} />
              </div>
              <div className={styles.labelLine}>
                <div className={styles.parallelogram} />
                <span className={styles.labelText}>{label.toUpperCase()}</span>
              </div>
              <div className={styles.barLine}>
                <motion.div
                  className={styles.barFill}
                  initial={{ width: 0 }}
                  animate={{ width: size }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <div className={styles.percentage}>{size}</div>
            </motion.div>
          ))}
        </motion.div>
      </Block>

      <Block title="주요 수사 장비" description="다음과 같은 기술 스택과 도구를 주로 사용합니다">
        <div className={styles.techGrid}>
          {techGroups.map(({ category, items }) => (
            <div key={`skill-${category as string}`}>
              <h4>{category}</h4>
              <ul>
                {(items as string[]).map((tech) => (
                  <li key={`skill-item-${tech}`}>{tech}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="사건별 사용 무기"
        description="각 기술 사건에서 사용된 전략과 도구를 정리했습니다"
      >
        <ul className={styles.caseList}>
          {caseWeapons.map(({ id, title, summary, tech }) => (
            <li key={`case-list-${id}`}>
              <strong>
                [Case #{id}] {title}
              </strong>
              <p>{summary}</p>
              <small>사용 기술: {tech}</small>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="성장 연대표" description="기술 수사관으로 성장해온 여정을 정리했습니다.">
        <ul className={styles.timeline}>
          {timeline.map(({ id, year, text }) => (
            <li key={`history-${id}`}>
              <time>{year}</time> {text}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="최근 사건 기록" description="최근 해결한 기술 사건을 요약했습니다">
        <ul className={styles.caseList}>
          {recentCases.map(({ id, title, desc }) => (
            <li key={`recent-case-${id}`}>
              <strong>
                [Case #{id}] {title}
              </strong>
              <p>사건 개요: {desc}</p>
            </li>
          ))}
        </ul>
        <div className={styles.caseMore}>
          <Link href="/case">사건 더보기</Link>
        </div>
      </Block>

      <Block
        title="관람 가이드"
        description="이 사이트는 단순한 이력서가 아닙니다. 각 사건은 실제 기술 문제를 해결한 과정을 시뮬레이션처럼 구성했습니다."
      >
        <ul className={styles.guideList}>
          {guideSteps.map((item, index) => (
            <li key={`guide-${index}`}>
              <strong>{index + 1}단계</strong> {item}
            </li>
          ))}
        </ul>
      </Block>
    </motion.section>
  )
}
