import Link from 'next/link'
import styles from './home.module.scss'

export default function HomePage() {
  return (
    <section className={styles.home}>
      <div className={styles.intro}>
        <h2 className={styles.headline}>기술 문제는 범죄다.</h2>
        <p className={styles.tagline}>사건 파일을 열고, 기술 수사를 시작하세요.</p>
      </div>

      <div className={styles.actions}>
        <Link href="/case" className={styles.primaryBtn}>
          사건 기록 보기
        </Link>
        <Link href="/about" className={styles.secondaryBtn}>
          수사관 프로파일
        </Link>
      </div>
    </section>
  )
}
