'use client'

import Link from 'next/link'

import Modal from '@/components/common/Modal'
import styles from './GuideModal.module.scss'

interface GuideModalProps {
  open: boolean
  onClose: () => void
}

export default function GuideModal({ open, onClose }: GuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} width={600}>
      <div className={styles.wrap}>
        <h2 className={styles.title}>관람 가이드</h2>
        <p className={styles.description}>
          기술 수사관의 활동 기록을 재미있게 탐험하는 법을 안내합니다.
        </p>
        <ul className={styles.guideList}>
          <li>
            이곳은 기술 문제를 해결해온 과정을 사건처럼 정리한 기록 공간입니다. <br />
            <Link href="/case" className={styles.link}>
              [사건 목록 보기]
            </Link>
          </li>
          <li>관심 있는 주제만 골라서 볼 수 있도록 태그 필터를 지원합니다.</li>
          <li>각 사건을 눌러보면 어떤 일이 있었고, 어떻게 풀어냈는지를 살펴볼 수 있습니다.</li>
          <li>의견을 남기거나 단서를 제공하면, 수사에 기여한 것으로 인정받습니다.</li>
          <li>화면 속 숨은 단서를 찾아내면, 특별한 메달을 획득할 수도 있습니다.</li>
          <li>
            지금까지 모은 기록과 인정은{' '}
            <Link href="/medal" className={styles.link}>
              [나의 메달함]
            </Link>
            에서 확인할 수 있습니다.
          </li>
        </ul>
      </div>
    </Modal>
  )
}
