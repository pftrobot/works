'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './MedalMain.module.scss'

export default function MedalMain() {
  const [alias, setAlias] = useState('수사 손님')
  const [medals, setMedals] = useState<number>(5)
  const [rank, setRank] = useState<'탐색자' | '조력자' | '공범'>('조력자')

  useEffect(() => {
    const randomAlias = ['수사 손님', '기술 탐색자', '정의의 메신저'][Math.floor(Math.random() * 3)] // TODO : random name
    setAlias(randomAlias)
  }, [])

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
        {Array.from({ length: medals }).map((_, i) => (
          <div key={i} className={styles.medalItem}>
            🏅 <span>메달 {i + 1}</span>
          </div>
        ))}
      </div>
    </motion.main>
  )
}
