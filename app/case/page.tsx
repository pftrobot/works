'use client'

import { useState } from 'react'
import { caseList, CaseMeta } from '@/data/casesMeta'
import PageTitle from '@/components/common/PageTitle'
import CaseDetailModal from './components/CaseDetailModal'
import styles from './styles/CaseList.module.scss'

export default function CasePage() {
  const [selected, setSelected] = useState<CaseMeta | null>(null)

  return (
    <main className={styles.caseWrap}>
      <PageTitle>사건 기록 목록</PageTitle>

      <p className={styles.description}>
        실제 기술 문제들을 사건처럼 분석하고 정리한 수사기록입니다. 사건을 선택해 수사 과정을
        따라가보세요.
      </p>

      <ul className={styles.caseList}>
        {caseList.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => setSelected(item)}>
              <h3>
                [#{item.slug.toUpperCase()}] {item.title} – <span>{item.subtitle}</span>
              </h3>
              <p>{item.summary}</p>
            </button>
          </li>
        ))}
      </ul>

      <CaseDetailModal
        key={selected?.id}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        caseMeta={selected}
      />
    </main>
  )
}
