'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import classNames from 'classnames'

import { CaseMeta } from 'lib/supabase'
import { useAddMedal } from 'utils/medalUtils'
import { MedalType } from 'types'

import Modal from 'components/common/Modal'
import ConfirmModal from 'components/common/ConfirmModal'
import TechTagList from 'components/common/TechTagList'
import styles from './CaseDetailModal.module.scss'

interface Props {
  open: boolean
  onClose: () => void
  caseMeta: CaseMeta | null
}

const INITIAL_STYLE = { opacity: 0, y: 20 } as const
const ANIMATE_STYLE = { opacity: 1, y: 0 } as const
const DURATION = 0.6

export default function CaseDetailModal({ open, onClose, caseMeta }: Props) {
  const [quizStep, setQuizStep] = useState<'question' | 'answer'>('question')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const awardedRef = useRef(false)

  const { mutate: getMedal } = useAddMedal()

  if (!caseMeta) return null

  const { title, subtitle, summary, quiz, description, tech, link } = caseMeta

  const handleOptionClick = (index: number) => {
    setSelectedOption(index)
    setQuizStep('answer')
  }

  const handleBackToQuestion = () => {
    setConfirmVisible(true)
  }

  const confirmBack = () => {
    setQuizStep('question')
    setSelectedOption(null)
    setConfirmVisible(false)
  }

  const isCorrectAnswer = selectedOption === quiz.answer

  useEffect(() => {
    awardedRef.current = false
  }, [open, caseMeta?.id])

  useEffect(() => {
    if (!open || !caseMeta) return
    const isCorrectAnswer = selectedOption === caseMeta.quiz.answer

    if (quizStep === 'answer' && isCorrectAnswer && !awardedRef.current) {
      awardedRef.current = true
      getMedal({ type: MedalType.Case, sourceId: caseMeta.id })
    }
  }, [open, quizStep, selectedOption, caseMeta?.id, getMedal])

  return (
    <Modal open={open} onClose={onClose} width={1120}>
      <div className={styles.modalWrap}>
        <div className={styles.leftColumn}>
          <h2 className={styles.title}>{title}</h2>
          <h3 className={styles.subtitle}>{subtitle}</h3>
          <p className={styles.summary}>{summary}</p>
        </div>

        <div className={styles.rightColumn}>
          {quizStep === 'question' ? (
            <motion.div
              key="question"
              initial={INITIAL_STYLE}
              animate={ANIMATE_STYLE}
              transition={{ duration: DURATION }}
            >
              <p className={styles.question}>Q. {quiz.question}</p>
              <ul className={styles.options}>
                {quiz.options.map((opt, idx) => (
                  <li key={idx}>
                    <button className={styles.optionBtn} onClick={() => handleOptionClick(idx)}>
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              className={classNames(styles.answerWrap, {
                [styles.correct]: isCorrectAnswer,
              })}
              initial={INITIAL_STYLE}
              animate={ANIMATE_STYLE}
              transition={{ duration: DURATION }}
            >
              <motion.div
                initial={INITIAL_STYLE}
                animate={ANIMATE_STYLE}
                transition={{ duration: DURATION }}
              >
                {isCorrectAnswer ? (
                  <p className={styles.answerCorrect}>
                    정답입니다! <br />
                    메달을 획득했습니다
                    <Link className={styles.goMedal} href={'/medal'}>
                      메달함
                    </Link>
                  </p>
                ) : (
                  <p className={styles.answerWrong}>
                    오답입니다 <br />
                    다시 도전해보세요
                  </p>
                )}
              </motion.div>

              <motion.button
                className={styles.backBtn}
                onClick={handleBackToQuestion}
                initial={INITIAL_STYLE}
                animate={ANIMATE_STYLE}
                transition={{ duration: DURATION - 0.2, delay: 0.15 }}
              >
                질문 다시 보기
              </motion.button>

              {isCorrectAnswer && (
                <>
                  <motion.div
                    initial={INITIAL_STYLE}
                    animate={ANIMATE_STYLE}
                    transition={{ duration: DURATION, delay: 0.25 }}
                  >
                    <p className={styles.description}>{description}</p>
                  </motion.div>

                  {((tech && tech.length > 0) || link) && (
                    <motion.div
                      initial={INITIAL_STYLE}
                      animate={ANIMATE_STYLE}
                      transition={{ duration: DURATION, delay: 0.35 }}
                    >
                      {tech && tech.length > 0 && <TechTagList tech={tech} />}

                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.link}
                        >
                          자세히 보기
                        </a>
                      )}
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmVisible}
        onConfirm={confirmBack}
        onCancel={() => setConfirmVisible(false)}
        message={isCorrectAnswer ? '질문을 다시 보시겠습니까?' : '정답을 다시 선택하시겠습니까?'}
      />
    </Modal>
  )
}
