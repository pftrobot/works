'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { IconX } from '@tabler/icons-react'

import styles from './Modal.module.scss'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: number
  className?: string
}

export default function Modal({ open, onClose, children, width = 480, className }: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (open) {
      const scrollY = window.scrollY
      const body = document.body

      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.overflow = 'hidden'

      return () => {
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [open, mounted])

  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div className={classNames(styles.overlay, className)} onClick={onClose}>
      <div className={styles.modal} style={{ width }} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <IconX size={24} stroke={1.5} color={'#ddd'} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
