'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
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
  const scrollYRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const body = document.body

    if (open) {
      scrollYRef.current = window.scrollY

      root.classList.add('modal-open')
      body.style.position = 'fixed'
      body.style.top = `-${scrollYRef.current}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.overflow = 'hidden'

      return () => {
        if (open) {
          const scrollY = scrollYRef.current
          body.style.position = ''
          body.style.top = ''
          body.style.left = ''
          body.style.right = ''
          body.style.overflow = ''
          root.classList.remove('modal-open')
          window.scrollTo(0, scrollY)
        }
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
      <div style={{ width }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>
          <IconX size={24} stroke={1.5} color={'#ddd'} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
