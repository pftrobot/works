'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAnimationContext } from 'contexts/AnimationContext'
import Modal from 'components/common/Modal'
import { TypingText } from 'components/common/TypingText'
import { StaggerList } from 'components/common/StaggerList'
import { FadeInView } from 'components/common/FadeInView'
import styles from './GuideModal.module.scss'

interface GuideModalProps {
  open: boolean
  onClose: () => void
}

export default function GuideModal({ open, onClose }: GuideModalProps) {
  const { setAnimationDone } = useAnimationContext()
  const router = useRouter()

  const goAndClose = (path: string) => {
    router.push(path)
    onClose()
  }

  const guideItems = [
    <>
      이곳은 기술 문제를 해결해온 과정을 사건처럼 정리한 기록 공간입니다. <br />
      <button onClick={() => goAndClose('case')} className={styles.goBtn}>
        [ 사건 목록 보기 ]
      </button>
    </>,
    '관심 있는 주제만 골라서 볼 수 있도록 태그 필터를 지원합니다.',
    '각 사건을 눌러보면 어떤 일이 있었고, 어떻게 풀어냈는지를 살펴볼 수 있습니다.',
    '의견을 남기거나 단서를 제공하면, 수사에 기여한 것으로 인정받습니다.',
    '화면 속 숨은 단서를 찾아내면, 특별한 메달을 획득할 수도 있습니다.',
    <>
      지금까지 모은 기록과 인정은{' '}
      <button onClick={() => goAndClose('medal')} className={styles.goBtn}>
        나의 메달함
      </button>
      에서 확인할 수 있습니다.
    </>,
  ]

  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        setAnimationDone(true)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [open, setAnimationDone])

  return (
    <Modal open={open} onClose={onClose} width={600}>
      <FadeInView className={styles.wrap} duration={0.6} y={20}>
        <TypingText
          text="관람 가이드"
          as="h2"
          className={styles.title}
          charClassName={styles.titleChar}
          staggerDelay={0.06}
        />

        <TypingText
          text="기술 수사관의 활동 기록을 재미있게 탐험하는 법을 안내합니다."
          as="p"
          className={styles.description}
          charClassName={styles.descChar}
          staggerDelay={0.03}
        />

        <StaggerList
          items={guideItems}
          as="ul"
          className={styles.guideList}
          threshold={0.3}
          staggerDelay={0.15}
          delayChildren={0.7}
          itemDuration={0.5}
        />
      </FadeInView>
    </Modal>
  )
}
