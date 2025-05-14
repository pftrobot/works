import styles from './styles/about.module.scss'

export default function AboutPage() {
  return (
    <section className={styles.about}>
      <h1 className={styles.title}>프로파일</h1>

      <section>
        <h2 className={styles.subtitle}>프로필</h2>
        {/* TODO: 이름, 역할, 경력 요약 */}
      </section>

      <section>
        <h2 className={styles.subtitle}>주요 기술 장비</h2>
        {/* TODO: 사용 기술 스택 */}
      </section>

      <section>
        <h2 className={styles.subtitle}>사건별 기술 무기 분석</h2>
        {/* TODO: 프로젝트별 사용 스택 요약 */}
      </section>
    </section>
  )
}
