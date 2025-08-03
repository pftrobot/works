'use client'

import { useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import { useAnimationContext } from '@/contexts/AnimationContext'
import { useStaggerAnimation } from '@/hooks/useStaggerAnimation'
import { dnaList, techGroups, timeline } from '@/data/aboutData'

import PageTitle from '@/components/common/PageTitle'
import { FadeInSection } from '@/components/common/FadeInSection'
import ProfileCard from '@/components/about/ProfileCard'
import TimelineCards from '@/components/about/TimelineCards'
import Block from './Block'
import styles from './AboutMain.module.scss'
import {
  IconBug,
  IconBolt,
  IconPuzzle,
  IconFileText,
  IconCpu,
  IconCompass,
} from '@tabler/icons-react'

const iconMap: Record<string, ReactNode> = {
  'dna-1': <IconPuzzle />,
  'dna-2': <IconBolt />,
  'dna-3': <IconCpu />,
  'dna-4': <IconFileText />,
  'dna-5': <IconBug />,
  'dna-6': <IconCompass />,
} as const

export default function AboutMain() {
  const { setAnimationDone } = useAnimationContext()
  const [refProfile, inViewProfile] = useInView({ triggerOnce: true, threshold: 0.1 })

  const {
    ref: refDna,
    inView: inViewDna,
    itemVariant,
    parentAnimateProps,
  } = useStaggerAnimation({
    threshold: 0.2,
    staggerDelay: 0.15,
    delayChildren: 0,
    itemDuration: 0.4,
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, 600)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  return (
    <FadeInSection as="section" className={styles.aboutWrap} duration={0.8} y={20}>
      <PageTitle>PROFILE</PageTitle>

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
        title="수사 스타일"
        subtitle="DNA"
        description="기술 문제를 어떻게 접근하는지, 성향을 수치화해 보았습니다"
      >
        <motion.div ref={refDna} className={styles.dnaWrap} {...parentAnimateProps}>
          {dnaList.map(({ id, label, size, color }) => (
            <motion.div
              key={id}
              className={styles.dnaItem}
              style={
                {
                  '--para-color': color,
                  '--bar-color': color,
                  '--bar-size': size,
                } as React.CSSProperties
              }
              variants={itemVariant}
            >
              <div className={styles.labelTop}>
                <span className={styles.skillText}>{'//'} SKILL</span>
                <span className={styles.iconShape}>{iconMap[id]}</span>
              </div>
              <div className={styles.labelLine}>
                <motion.div
                  className={styles.parallelogramMain}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.4,
                        ease: 'easeOut',
                      },
                    },
                  }}
                />
                <motion.div
                  className={styles.parallelogramSmall1}
                  variants={{
                    hidden: { opacity: 0, x: 0 },
                    visible: {
                      opacity: 1,
                      x: 5,
                      transition: {
                        delay: 0.2,
                        duration: 0.3,
                        ease: 'easeOut',
                      },
                    },
                  }}
                />
                <motion.div
                  className={styles.parallelogramSmall2}
                  variants={{
                    hidden: { opacity: 0, x: 4 },
                    visible: {
                      opacity: 1,
                      x: 8,
                      transition: {
                        delay: 0.3,
                        duration: 0.3,
                        ease: 'easeOut',
                      },
                    },
                  }}
                />
                <motion.div
                  className={styles.parallelogramSmall3}
                  variants={{
                    hidden: { opacity: 0, x: 8 },
                    visible: {
                      opacity: 1,
                      x: 12,
                      transition: {
                        delay: 0.4,
                        duration: 0.3,
                        ease: 'easeOut',
                      },
                    },
                  }}
                />
                <span className={styles.labelText}>{label.toUpperCase()}</span>
              </div>
              <motion.div
                className={styles.barLine}
                variants={{ hidden: { width: 0 }, visible: { width: '100%' } }}
                transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
              >
                <motion.div
                  className={styles.barFill}
                  initial={{ width: 0 }}
                  animate={inViewDna ? { width: size } : { width: 0 }}
                  transition={{ duration: 0.1, ease: 'easeOut', delay: 0.6 }}
                />
              </motion.div>
              <div className={styles.percentage}>{size}</div>
            </motion.div>
          ))}
        </motion.div>
      </Block>

      <Block
        title="주요 수사 장비"
        subtitle="TECH"
        description="다음과 같은 기술 스택과 도구를 주로 사용합니다"
      >
        <div className={styles.techBox}>
          {techGroups.map(({ category, items }) => (
            <div key={category} className={styles.techItem}>
              <h4>{category}</h4>
              <div className={styles.toolBox}>
                {items.map(({ label, highlight }, index) => (
                  <motion.div
                    key={`tech-item-${label}`}
                    className={
                      highlight ? `${styles.highlight} ${styles.toolItem}` : styles.toolItem
                    }
                    initial={{ rotateY: 90, opacity: 0 }}
                    whileInView={{ rotateY: 0, opacity: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeOut',
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <div className={styles.toolIcon} />
                    <span className={styles.toolName}>{label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block
        title="성장 연대표"
        subtitle="TIMELINE"
        description="기술 수사관으로 성장해온 여정을 정리했습니다."
      >
        <TimelineCards data={timeline} />
      </Block>
    </FadeInSection>
  )
}
