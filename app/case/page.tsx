import PageTitle from '@/components/common/PageTitle'
import styles from './styles/caseList.module.scss'

export default function CaseListPage() {
  return (
    <section className={styles.caseListWrap}>
      <PageTitle>사건 기록 목록</PageTitle>

      <section>
        <h2 className={styles.subtitle}>목록 설명</h2>
        <p className={styles.text}>
          지금까지 해결한 기술 사건 파일을 정리했습니다. 사건을 선택해 수사 과정을 따라가 보세요.
        </p>
      </section>

      <section>
        <h2 className={styles.subtitle}>사건 파일</h2>
        {/* TODO: 사건 카드 목록 */}
      </section>
    </section>
  )
}
