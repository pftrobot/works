'use client'

import Image from 'next/image'
import { TypingText } from '@/components/common/TypingText'
import styles from './Profile.module.scss'

export default function ProfileCard() {
  return (
    <div className={styles.profileWrap}>
      <div className={styles.imageBox}>
        <Image
          src="/imgs/cat_face.png"
          alt="기술 수사관 프로필"
          width={120}
          height={120}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <TypingText text="오이슬 " as="h2" className={styles.title} delay={0.1}>
          <TypingText text={'기술 수사관'} as={'span'} className={styles.char} delay={0.2} />
        </TypingText>

        <TypingText
          text="기술 문제는 반드시 흔적을 남깁니다. 그 단서를 포착하고 구조화하는 것, 그것이 제 수사 방식입니다."
          as="p"
          className={styles.description}
          staggerDelay={0.015}
        />

        <TypingText
          text="총 해결 사건 수: "
          as="div"
          className={styles.meta}
          charClassName={styles.char}
        >
          <TypingText text={'15건'} as="strong" delay={0.35} />
        </TypingText>
      </div>
    </div>
  )
}
