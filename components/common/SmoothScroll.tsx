'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useLayoutEffect(() => {
    const isTouch =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(hover: none), (pointer: coarse)').matches

    const lenis = new Lenis({
      duration: 0.8, // 스크롤 지속 시간
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      syncTouch: isTouch,
    })

    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    ;(window as any).lenis = lenis

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  // 모달 열림/닫힘 감지
  useEffect(() => {
    const handleModalOpen = () => lenisRef.current?.stop()
    const handleModalClose = () => lenisRef.current?.start()

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const el = m.target as HTMLElement
          el.classList.contains('modal-open') ? handleModalOpen() : handleModalClose()
        }
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return null
}
