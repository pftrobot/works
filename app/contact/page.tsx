import styles from './styles/contact.module.scss'

export default function ContactPage() {
  return (
    <section className={styles.contactWrap}>
      <h1 className={styles.title}>제보 센터</h1>

      <section>
        <h2 className={styles.subtitle}>접수 안내</h2>
        <p className={styles.text}>기술 수사에 대한 의견, 피드백 등을 자유롭게 남겨주세요.</p>
      </section>

      <section>
        <h2 className={styles.subtitle}>제보 양식</h2>
        {/* TODO: 제보/문의 폼 (이름, 이메일, 메시지) */}
      </section>

      <section>
        <h2 className={styles.subtitle}>연락처</h2>
        {/* TODO: 외부 연락 링크들 */}
      </section>
    </section>
  )
}
