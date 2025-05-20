'use client'

import Modal from '@/components/common/Modal'
import { CaseMeta } from '@/data/casesMeta'

interface Props {
  open: boolean
  onClose: () => void
  caseMeta: CaseMeta | null
}

export default function CaseDetailModal({ open, onClose, caseMeta }: Props) {
  if (!caseMeta) return null

  const { title, subtitle, description, tech, link } = caseMeta

  return (
    <Modal open={open} onClose={onClose} width={560}>
      <h2 style={{ marginBottom: '4px' }}>{title}</h2>
      <h3 style={{ fontSize: '14px', color: '#999', marginBottom: '20px' }}>{subtitle}</h3>

      {description && (
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#ccc', marginBottom: '20px' }}>
          {description}
        </p>
      )}

      {tech && tech?.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <strong style={{ fontSize: '13px', color: '#888' }}>사용 기술</strong>
          <ul style={{ fontSize: '13px', color: '#aaa', marginTop: '6px', paddingLeft: '20px' }}>
            {tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '13px',
            color: '#2970ff',
            textDecoration: 'underline',
            display: 'inline-block',
            marginTop: '10px',
          }}
        >
          자세히 보기
        </a>
      )}
    </Modal>
  )
}
