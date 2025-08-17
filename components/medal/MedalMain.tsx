'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import classNames from 'classnames'

import { useAnimationContext } from 'contexts/AnimationContext'
import { getMedalCount, getMedalSources } from 'utils/medalUtils'
import { MENU } from '@constants'

import PageTitle from 'components/common/PageTitle'
import { TypingText } from 'components/common/TypingText'
import { StaggerList } from 'components/common/StaggerList'
import styles from './MedalMain.module.scss'

const { LIST, CONTACT } = MENU
const GUIDE_ITEMS = [
  <>
    <Link href={LIST}>사건 목록</Link>을 탐색해보세요.
  </>,
  <>
    <Link href={CONTACT}>제보</Link>를 남기면 수사에 기여한 것으로 인정돼요.
  </>,
  <>사이트 곳곳에 숨겨진 단서를 찾아보세요. 예상치 못한 보상이 기다리고 있어요.</>,
]
export default function MedalMain() {
  const { setAnimationDone } = useAnimationContext()
  const [alias, setAlias] = useState('수사 손님')
  const [medals, setMedals] = useState<number>(0)
  const [medalSources, setMedalSources] = useState<Array<'case' | 'contact' | 'egg'>>([])
  const [rank, setRank] = useState<'탐색자' | '조력자' | '공범'>('조력자')

  const [refInfo, inViewInfo] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [refList, inViewList] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [refHint, inViewHint] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    const randomAlias = ['행인', '기술 탐색자', '정의의 메신저'][Math.floor(Math.random() * 3)] // TODO : random name
    setAlias(randomAlias)
    setMedals(getMedalCount())

    if (typeof window !== 'undefined') {
      setMedalSources(getMedalSources())
      setMedals(getMedalCount())
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, 600)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  return (
    <motion.section
      className={styles.medalWrap}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <PageTitle>MEDAL BOX</PageTitle>

      <motion.div
        ref={refInfo}
        className={styles.infoBox}
        initial={{ opacity: 0, y: 24 }}
        animate={inViewInfo ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.title}>메달함</p>
        <TypingText
          text={`${alias}님, 수사관님께 남긴 흔적입니다.`}
          as={'p'}
          className={styles.subtitle}
          staggerDelay={0.02}
        />
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <TypingText text={'랭크'} as={'strong'} staggerDelay={0.06} delay={0.1} />
            <TypingText
              text={rank}
              as={'span'}
              className={styles.char}
              staggerDelay={0.06}
              delay={0.1}
            />
          </div>
          <div className={classNames(styles.infoItem, styles.medal)}>
            <TypingText text={'획득 메달'} as={'strong'} staggerDelay={0.06} delay={0.2} />
            <TypingText
              text={`${medals}개`}
              as={'span'}
              className={styles.char}
              staggerDelay={0.06}
              delay={0.2}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={refList}
        className={styles.medalList}
        initial={{ opacity: 0, y: 20 }}
        animate={inViewList ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {medalSources.map((type, i) => (
          <motion.div
            key={i}
            className={styles.medalItem}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inViewList ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <p>+ 1</p>
            <span>{type === 'case' ? '사건' : type === 'contact' ? '제보' : '단서'}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        ref={refHint}
        className={styles.hintBox}
        initial={{ opacity: 0, y: 24 }}
        animate={inViewHint ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h3>메달 수집 방법</h3>
        <StaggerList
          items={GUIDE_ITEMS}
          as="ul"
          threshold={0.3}
          staggerDelay={0.15}
          itemDuration={0.5}
        />
      </motion.div>
    </motion.section>
  )
}
