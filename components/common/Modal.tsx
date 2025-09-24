'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { IconX } from '@tabler/icons-react'

import styles from './Modal.module.scss'

// 모달 스택 관리
const modalStack = new Map<string, number>()
let savedScrollY = 0
let isBodyLocked = false
let modalCounter = 0

// 스크롤바 너비 계산
const getScrollbarWidth = (): number => {
  if (typeof window === 'undefined') return 0
  return window.innerWidth - document.documentElement.clientWidth
}

// scrollbar-gutter 지원 여부 확인
const hasScrollbarGutterSupport = (): boolean => {
  if (typeof window === 'undefined') return false
  return CSS.supports && CSS.supports('scrollbar-gutter', 'stable')
}

const generateModalId = (): string => {
  return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const getZIndexValue = (layer: string): number => {
  if (typeof window === 'undefined') return 999

  const computedStyle = getComputedStyle(document.documentElement)
  const value = computedStyle.getPropertyValue(`--z-${layer}`).trim()
  return parseInt(value) || 999
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
  const [stackOrder, setStackOrder] = useState(0)
  const modalIdRef = useRef('')
  const scrollbarWidthRef = useRef(0)
  const hasGutterSupportRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    modalIdRef.current = generateModalId()
    scrollbarWidthRef.current = getScrollbarWidth()
    hasGutterSupportRef.current = hasScrollbarGutterSupport()
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const body = document.body
    const modalId = modalIdRef.current

    if (open) {
      // 모달 스택에 추가, 순서 저장
      if (!modalStack.has(modalId)) {
        modalCounter++
        modalStack.set(modalId, modalCounter)
        setStackOrder(modalCounter)
      }

      // 첫 번째 모달인 경우
      if (modalStack.size === 1 && !isBodyLocked) {
        savedScrollY = window.scrollY

        // 스크롤 영역 대체 padding 추가
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
        body.style.top = `-${savedScrollY}px`
        body.style.position = 'fixed'
        body.style.width = '100%'
        isBodyLocked = true
      }
    } else {
      modalStack.delete(modalId)

      // 모든 모달이 닫힌 경우에만 body 잠금 해제
      if (modalStack.size === 0 && isBodyLocked) {
        // 화면 잠시 숨김 (깜빡임 방지)
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

        root.classList.remove('modal-open')

        window.scrollTo(0, savedScrollY)

        // 다음 프레임에서 화면 표시
        requestAnimationFrame(() => {
          body.style.visibility = ''
        })

        isBodyLocked = false
        modalCounter = 0
      }
    }

    // Cleanup
    return () => {
      modalStack.delete(modalId)

      if (modalStack.size === 0 && isBodyLocked) {
        const root = document.documentElement
        const body = document.body

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

        window.scrollTo(0, savedScrollY)
        isBodyLocked = false
        modalCounter = 0
      }
    }
  }, [open, mounted])

  useEffect(() => {
    if (!open) return

    const handleEscape = (event: KeyboardEvent) => {
      // 가장 위의 모달만 ESC 로 닫을 수 있도록
      const maxOrder = Math.max(...Array.from(modalStack.values()))
      if (modalStack.get(modalIdRef.current) === maxOrder) {
        if (event.key === 'Escape') {
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!mounted || !open) return null

  const baseModalZIndex = getZIndexValue('modal')
  const modalZIndex = baseModalZIndex + stackOrder * 100

  return createPortal(
    <div
      className={classNames(styles.overlay, className)}
      onClick={onClose}
      style={{
        zIndex: modalZIndex,
      }}
    >
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
