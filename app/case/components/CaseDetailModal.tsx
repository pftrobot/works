'use client'

import Modal from '@/components/common/Modal'
import ConfirmModal from '@/components/common/ConfirmModal'
import TechTagList from '@/components/common/TechTagList'
import { CaseMeta } from '@/data/casesMeta'
import styles from '../styles/CaseDetailModal.module.scss'
import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  caseMeta: CaseMeta | null
}

export default function CaseDetailModal({ open, onClose, caseMeta }: Props) {
  const [quizStep, setQuizStep] = useState<'question' | 'answer'>('question')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [confirmVisible, setConfirmVisible] = useState(false)

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

  return (
    <Modal open={open} onClose={onClose} width={560}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>{title}</h2>
        <h3 className={styles.subtitle}>{subtitle}</h3>

        {quizStep === 'question' ? (
          <>
            <p className={styles.summary}>{summary}</p>
            <p className={styles.question}>{quiz.question}</p>
            <ul className={styles.options}>
              {quiz.options.map((opt, idx) => (
                <li key={idx}>
                  <button onClick={() => handleOptionClick(idx)}>{opt}</button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className={styles.answerResult}>
              {selectedOption === quiz.answer ? (
                <p className={styles.correct}>정답입니다!</p>
              ) : (
                <p className={styles.incorrect}>
                  오답입니다. 정답은 “{quiz.options[quiz.answer]}”입니다.
                </p>
              )}
              <button className={styles.backButton} onClick={handleBackToQuestion}>
                질문 다시 보기
              </button>
            </div>

            <p className={styles.description}>{description}</p>

            {tech && tech.length > 0 && <TechTagList tech={tech} />}

            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                자세히 보기
              </a>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        open={confirmVisible}
        onConfirm={confirmBack}
        onCancel={() => setConfirmVisible(false)}
        message="정답을 다시 선택하시겠습니까?"
      />
    </Modal>
  )
}
