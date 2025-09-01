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
        body.style.paddingRight = `${scrollbarWidthRef.current}px`
      }

      // 스크롤 잠금 적용
      root.classList.add('modal-open')
      body.style.position = 'fixed'
      body.style.top = `-${scrollYRef.current}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      body.style.overflow = 'hidden'
      body.style.minHeight = '100dvb'

      wasOpenRef.current = true
    }

    if (!open && wasOpenRef.current) {
      const scrollY = scrollYRef.current

      // 스크롤 잠금 해제
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      body.style.minHeight = ''
      body.style.overflow = ''
      body.style.paddingRight = ''
      root.classList.remove('modal-open')

      // 스크롤 위치 복원 (다음 프레임에서 실행)
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: 'instant' })
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
    // 언마운트시 스크롤 잠금 해제
    return () => {
      if (wasOpenRef.current) {
        const root = document.documentElement
        const body = document.body
        const scrollY = scrollYRef.current

        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.width = ''
        body.style.minHeight = ''
        body.style.overflow = ''
        body.style.paddingRight = ''
        root.classList.remove('modal-open')

        if (typeof window !== 'undefined') {
          requestAnimationFrame(() => {
            window.scrollTo({ top: scrollY, behavior: 'instant' })
          })
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
