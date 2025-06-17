'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { useAnimationContext } from '@/contexts/AnimationContext'
import { getMedalCount, getMedalSources } from '@/utils/medalUtils'

import styles from './MedalMain.module.scss'

export default function MedalMain() {
  const { setAnimationDone } = useAnimationContext()
  const [alias, setAlias] = useState('수사 손님')
  const [medals, setMedals] = useState<number>(0)
  const [medalSources, setMedalSources] = useState<Array<'case' | 'contact' | 'egg'>>([])
  const [rank, setRank] = useState<'탐색자' | '조력자' | '공범'>('조력자')

  useEffect(() => {
    const randomAlias = ['수사 손님', '기술 탐색자', '정의의 메신저'][Math.floor(Math.random() * 3)] // TODO : random name
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
    }, 800)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  return (
    <motion.main
      className={styles.medalWrap}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h1 className={styles.title}>나의 메달함</h1>
      <p className={styles.subtitle}>{alias}님, 수사관님께 남긴 흔적입니다.</p>

      <div className={styles.infoBox}>
        <div className={styles.infoItem}>
          <strong>랭크</strong>
          <span>{rank}</span>
        </div>
        <div className={styles.infoItem}>
          <strong>획득 메달</strong>
          <span>{medals}개</span>
        </div>
      </div>

      <div className={styles.medalList}>
        {medalSources.map((type, i) => (
          <div key={i} className={styles.medalItem}>
            🏅{' '}
            <span>
              메달 {i + 1} ({type === 'case' ? '사건' : type === 'contact' ? '제보' : '단서'})
            </span>
          </div>
        ))}
      </div>

      <div className={styles.hintBox}>
        <h3>메달은 이렇게 획득할 수 있어요</h3>
        <ul>
          <li>
            <Link href="/case">사건 목록</Link>을 탐색해보세요.
          </li>
          <li>
            <Link href="/contact">제보</Link>를 남기면 수사에 기여한 것으로 인정돼요.
          </li>
          <li>사이트 곳곳에 숨겨진 단서를 찾아보세요. 예상치 못한 보상이 기다리고 있어요.</li>
        </ul>
      </div>
    </motion.main>
  )
}
