'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FadeInView } from 'components/common/FadeInView'
import BasicButton from 'components/common/BasicButton'
import styles from './ErrorPage.module.scss'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ERROR_MESSAGES = [
  '고양이가 증거를 엎어뜨려서 사건이 꼬였습니다.',
  '고양이 수사관이 서버실에서 털뭉치를 토해냈어요.',
  '고양이가 키보드 위에서 낮잠을 자다 시스템이 다운됐습니다.',
  '고양이가 중요한 케이블을 가지고 놀다가 연결이 끊어졌네요.',
]

export default function Error({ error, reset }: ErrorProps) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const randomMessage = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]
    setMessage(randomMessage)
  }, [])

  return (
    <div className={styles.errorPage}>
      <FadeInView className={styles.container} duration={0.8}>
        {/* 에러 코드 */}
        <motion.div
          className={styles.errorCode}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        >
          500
        </motion.div>

        {/* 고양이 이미지 */}
        <motion.div
          className={styles.catContainer}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        >
          <Image
            src="/imgs/cat/sit2.png"
            alt="고양이"
            width={300}
            height={300}
            className={styles.catImage}
            priority
          />
        </motion.div>

        {/* 메시지 */}
        <motion.div
          className={styles.messageBox}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h1 className={styles.title}>서버에서 오류가 발생했습니다</h1>
          <p className={styles.message}>{message}</p>

          {error.digest && (
            <details className={styles.errorDetails}>
              <summary>기술적 세부사항</summary>
              <code className={styles.errorCode}>{error.message}</code>
              <p className={styles.digest}>Error ID: {error.digest}</p>
            </details>
          )}
        </motion.div>

        {/* 액션 버튼들 */}
        <motion.div
          className={styles.actions}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <BasicButton onClick={reset} variant="primary">
            다시 시도하기
          </BasicButton>
          <BasicButton onClick={() => (window.location.href = '/')} variant="secondary">
            홈으로 돌아가기
          </BasicButton>
        </motion.div>
      </FadeInView>
    </div>
  )
}
