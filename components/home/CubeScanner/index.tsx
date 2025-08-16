'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { DefaultConfig } from './types'
import { AnimationController } from './engine/AnimationController'
import styles from './CubeScanner.module.scss'

interface CubeScannerProps {
  onScanComplete: () => void
  patternSrc?: string
}

export default function CubeScanner({
  onScanComplete,
  patternSrc = '/imgs/cat/face.png',
}: CubeScannerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<AnimationController | null>(null)

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showGlitch] = useState(false)
  const [showFlash, setShowFlash] = useState(false)

  // 포털 루트 관리 (풀스크린 전환 시)
  const overlayRootRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!isFullscreen) return
    const root = document.createElement('div')
    root.id = 'cube-overlay-root'
    Object.assign(root.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2000',
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'none',
    } as CSSStyleDeclaration)
    document.body.appendChild(root)
    overlayRootRef.current = root
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    return () => {
      document.documentElement.style.overflow = prevOverflow
      root.remove()
      overlayRootRef.current = null
    }
  }, [isFullscreen])

  // 엔진
  useEffect(() => {
    const host = mountRef.current
    if (!host) return

    // host 스타일
    host.style.position = 'absolute'
    host.style.inset = '0'
    host.style.width = '100%'
    host.style.height = '100%'
    host.style.display = 'grid'
    host.style.placeItems = 'center'

    const controller = new AnimationController(
      host,
      patternSrc,
      { ...DefaultConfig },
      {
        onEnterFullscreen: () => setIsFullscreen(true),
        onFlash: (on, durationMs) => {
          setShowFlash(on)
          if (on) setTimeout(() => setShowFlash(false), durationMs)
        },
        onComplete: () => {
          onScanComplete()
        },
      },
    )

    controllerRef.current = controller
    controller.start()

    return () => {
      controller.dispose(host)
      controllerRef.current = null
    }
  }, [onScanComplete, patternSrc])

  // 플래시 레이어
  const CanvasStack = (
    <>
      <div ref={mountRef} />
      {showFlash && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 12,
            mixBlendMode: 'screen',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.52,
              WebkitMaskImage:
                'radial-gradient(65% 65% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 18%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 70%)',
              maskImage:
                'radial-gradient(65% 65% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 18%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,1) 70%)',
            }}
          >
            {/* 사선 그라데이션 플래시 #1 */}
            <div
              style={
                {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '230%',
                  height: '44%',
                  transform: 'translate(-50%, -50%) rotate(32deg) skewX(-4deg)',
                  transformOrigin: 'center',
                  borderRadius: 28,
                  background: [
                    'linear-gradient(180deg, rgba(255,210,120,0.16), rgba(255,165,60,0.09))',
                    'radial-gradient(120% 220% at 50% -10%, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%)',
                    'linear-gradient(to right, rgba(255,240,200,0.34), rgba(255,240,200,0) 22%, rgba(255,240,200,0) 78%, rgba(255,240,200,0.34))',
                    'repeating-linear-gradient(90deg, rgba(255,230,160,0.10) 0 2px, rgba(255,230,160,0) 2px 10px)',
                  ].join(','),
                  filter: 'blur(6px) saturate(128%)',
                  backdropFilter: 'blur(1.5px)',
                } as React.CSSProperties
              }
            />
            {/* 사선 그라데이션 플래시 #2 */}
            <div
              style={
                {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '230%',
                  height: '44%',
                  transform: 'translate(-50%, -50%) rotate(48deg) skewX(-2deg)',
                  transformOrigin: 'center',
                  borderRadius: 28,
                  background: [
                    'linear-gradient(180deg, rgba(255,215,130,0.14), rgba(255,170,70,0.08))',
                    'radial-gradient(160% 260% at 50% 110%, rgba(255,220,160,0.16), rgba(255,220,160,0) 60%)',
                    'linear-gradient(to right, rgba(255,255,255,0.28), rgba(255,255,255,0) 25%, rgba(255,255,255,0) 75%, rgba(255,255,255,0.28))',
                    'repeating-linear-gradient(90deg, rgba(255,200,100,0.08) 0 2px, rgba(255,200,100,0) 2px 12px)',
                  ].join(','),
                  filter: 'blur(7px) saturate(124%)',
                  backdropFilter: 'blur(1px)',
                } as React.CSSProperties
              }
            />
            {/* 하이라이트 라인 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '230%',
                height: '8%',
                transform: 'translate(-50%, -50%) rotate(40deg)',
                borderRadius: 999,
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,250,230,0.52) 45%, rgba(255,240,180,0.45) 50%, rgba(255,230,150,0.52) 55%, rgba(255,255,255,0) 100%)',
                filter: 'blur(5px)',
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      )}
    </>
  )

  return (
    <div className={styles.cubeContainer}>
      {isFullscreen && overlayRootRef.current ? (
        createPortal(CanvasStack, overlayRootRef.current)
      ) : (
        <div className={styles.canvasWrapper}>{CanvasStack}</div>
      )}

      {showGlitch && (
        <div className={styles.glitchOverlay}>
          <motion.div
            className={styles.glitchFlash}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, times: [0, 0.2, 1] }}
          />
        </div>
      )}
    </div>
  )
}
