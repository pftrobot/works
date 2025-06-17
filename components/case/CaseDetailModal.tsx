'use client'

import { useState } from 'react'

import { addMedal } from '@/utils/medalUtils'
import { MedalType } from '@/types/medal'
import { CaseMeta } from '@/data/casesMeta'

import Modal from '@/components/common/Modal'
import ConfirmModal from '@/components/common/ConfirmModal'
import TechTagList from '@/components/common/TechTagList'
import styles from './CaseDetailModal.module.scss'

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

  if (quizStep === 'answer' && selectedOption === quiz.answer) {
    const stored = localStorage.getItem('case_medal_track')
    const solvedIds = stored ? (JSON.parse(stored) as Array<string | number>) : []
    if (!solvedIds.includes(caseMeta.id)) {
      addMedal(MedalType.Case, caseMeta.id)
    }
  }

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
            <>
              <p className={styles.question}>{quiz.question}</p>
              <ul className={styles.options}>
                {quiz.options.map((opt, idx) => (
                  <li key={idx}>
                    <button className={styles.optionBtn} onClick={() => handleOptionClick(idx)}>
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className={styles.answerWrap}>
              {selectedOption === quiz.answer ? (
                <p className={styles.answerCorrect}>정답입니다!</p>
              ) : (
                <p className={styles.answerWrong}>
                  오답입니다. 정답은 “{quiz.options[quiz.answer]}”입니다.
                </p>
              )}

              <button className={styles.backBtn} onClick={handleBackToQuestion}>
                질문 다시 보기
              </button>

              <p className={styles.description}>{description}</p>

              {tech && tech.length > 0 && <TechTagList tech={tech} />}

              {link && (
                <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  자세히 보기
                </a>
              )}
            </div>
          )}
        </div>
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
