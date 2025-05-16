import PageTitle from '@/components/common/PageTitle'
import styles from './styles/lab.module.scss'

export default function LabPage() {
  return (
    <section className={styles.labWrap}>
      <PageTitle>실험실</PageTitle>

      <section>
        <h2 className={styles.subtitle}>실험 개요</h2>
        {/* TODO: 실험실 컨셉 및 프로젝트 설명 */}
      </section>

      <section>
        <h2 className={styles.subtitle}>실험 항목</h2>
        {/* TODO: 실험 가능한 카드 리스트 */}
      </section>

      <section>
        <h2 className={styles.subtitle}>실행 결과</h2>
        {/* TODO: 실험 결과 요약 OR 데모 링크 */}
      </section>
    </section>
  )
}
