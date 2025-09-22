'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { IconX } from '@tabler/icons-react'

import styles from './Modal.module.scss'

// 스크롤바 너비 계산 함수
function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0

  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)

  const inner = document.createElement('div')
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}

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
  const wasOpenRef = useRef(false)
  const scrollbarWidthRef = useRef(0)

  useEffect(() => {
    setMounted(true)
    scrollbarWidthRef.current = getScrollbarWidth()
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const body = document.body

    if (open && !wasOpenRef.current) {
      // 현재 스크롤 위치 저장
      scrollYRef.current = window.scrollY

      // 스크롤바로 인한 레이아웃 시프트 방지
      const hasScrollbar = document.body.scrollHeight > window.innerHeight
      if (hasScrollbar) {
        root.style.setProperty('--scrollbar-width', `${scrollbarWidthRef.current}px`)
      }

      // 스크롤 잠금 적용
      root.classList.add('modal-open')
      body.style.top = `-${scrollYRef.current}px`
      body.style.position = 'fixed'
      body.style.width = '100%'

      wasOpenRef.current = true
    }

    if (!open && wasOpenRef.current) {
      const scrollY = scrollYRef.current

      // 스크롤 잠금 해제
      root.style.removeProperty('--scrollbar-width')
      root.classList.remove('modal-open')
      body.style.position = ''
      body.style.top = ''
      body.style.width = ''

      // 스크롤 위치 복원 - 브라우저가 렌더링을 완료한 후 실행
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY)
        })
      })

      wasOpenRef.current = false
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

  useEffect(() => {
    return () => {
      if (wasOpenRef.current) {
        const root = document.documentElement
        const body = document.body
        const scrollY = scrollYRef.current

        root.style.removeProperty('--scrollbar-width')
        root.classList.remove('modal-open')
        body.style.position = ''
        body.style.top = ''
        body.style.width = ''

        if (typeof window !== 'undefined') {
          window.scrollTo(0, scrollY)
        }
      }
    }
  }, [])

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
