import Image from 'next/image'
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
        <h2 className={styles.title}>
          오이슬 <span>기술 수사관</span>
        </h2>
        <p className={styles.description}>
          기술 문제는 반드시 흔적을 남깁니다. 그 단서를 포착하고 구조화하는 것, 그것이 제 수사
          방식입니다.
        </p>
        <div className={styles.meta}>
          총 해결 사건 수: <strong>15건</strong>
        </div>
      </div>
    </div>
  )
}
