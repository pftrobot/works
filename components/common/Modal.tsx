'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { IconX } from '@tabler/icons-react'

import styles from './Modal.module.scss'

// 스크롤바 너비 계산
function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0
  return window.innerWidth - document.documentElement.clientWidth
}

// scrollbar-gutter 지원 여부 확인
function hasScrollbarGutterSupport(): boolean {
  if (typeof window === 'undefined') return false
  return CSS.supports && CSS.supports('scrollbar-gutter', 'stable')
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
  const hasGutterSupportRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    scrollbarWidthRef.current = getScrollbarWidth()
    hasGutterSupportRef.current = hasScrollbarGutterSupport()
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const body = document.body

    if (open && !wasOpenRef.current) {
      scrollYRef.current = window.scrollY

      // scrollbar-gutter를 지원하지 않는 브라우저에서만 padding 추가
      if (!hasGutterSupportRef.current) {
        const hasScrollbar = document.body.scrollHeight > window.innerHeight

        if (hasScrollbar && scrollbarWidthRef.current > 0) {
          body.style.paddingRight = `${scrollbarWidthRef.current}px`

          const fixedElements = document.querySelectorAll('[data-fixed-element]')
          fixedElements.forEach((el) => {
            const element = el as HTMLElement
            element.style.paddingRight = `${scrollbarWidthRef.current}px`
          })
        }
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

      // 화면을 잠시 숨김 (깜빡임 방지)
      body.style.visibility = 'hidden'

      // 스크롤 잠금 해제
      body.style.position = ''
      body.style.top = ''
      body.style.width = ''

      // padding 제거
      if (!hasGutterSupportRef.current) {
        body.style.paddingRight = ''

        const fixedElements = document.querySelectorAll('[data-fixed-element]')
        fixedElements.forEach((el) => {
          const element = el as HTMLElement
          element.style.paddingRight = ''
        })
      }

      // 스크롤 잠금 해제
      root.classList.remove('modal-open')

      // 스크롤 위치 복원
      window.scrollTo(0, scrollY)

      // 다음 프레임에서 화면 표시
      requestAnimationFrame(() => {
        body.style.visibility = ''
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

        if (!hasGutterSupportRef.current) {
          body.style.paddingRight = ''

          const fixedElements = document.querySelectorAll('[data-fixed-element]')
          fixedElements.forEach((el) => {
            const element = el as HTMLElement
            element.style.paddingRight = ''
          })
        }

        root.classList.remove('modal-open')
        body.style.position = ''
        body.style.top = ''
        body.style.width = ''
        body.style.visibility = ''

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
