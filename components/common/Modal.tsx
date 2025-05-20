'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: number
}

export default function Modal({ open, onClose, children, width = 480 }: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !open) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} style={{ width }} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          닫기
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
