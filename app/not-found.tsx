'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FadeInView } from 'components/common/FadeInView'
import BasicButton from 'components/common/BasicButton'
import styles from './ErrorPage.module.scss'

const CAT_MESSAGES = [
  '사건 현장에서 발자국을 찾고 있던 고양이가 길을 잃었습니다.',
  '수사 중이던 고양이가 털뭉치에 정신이 팔려 증거를 놓쳤네요.',
  '고양이가 낮잠을 자느라 단서를 놓쳤습니다.',
  '고양이 수사관이 캣닢 냄새를 따라가다 길을 잃었어요.',
]

export default function NotFound() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const randomMessage = CAT_MESSAGES[Math.floor(Math.random() * CAT_MESSAGES.length)]
    setMessage(randomMessage)
  }, [])

  return (
    <div className={styles.errorPage}>
      <FadeInView className={styles.container} duration={0.8}>
        <motion.div
          className={styles.errorCode}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          404
        </motion.div>

        <motion.div
          className={`${styles.catContainer} ${styles.notFound}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        >
          <Image
            src="/imgs/cat/lay.png"
            alt="길을 잃은 고양이"
            width={300}
            height={300}
            className={styles.catImage}
            priority
          />
        </motion.div>

        <motion.div
          className={styles.messageBox}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
          <p className={styles.message}>{message}</p>
        </motion.div>

        <motion.div
          className={styles.actions}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <BasicButton href="/" variant="primary">
            홈으로 돌아가기
          </BasicButton>
          <BasicButton href="/case" variant="secondary">
            사건 목록 보기
          </BasicButton>
        </motion.div>
      </FadeInView>
    </div>
  )
}
