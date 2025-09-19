'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { useEasterEggInitialization } from 'hooks/useEasterEggInitialization'
import { useEdgeEasterEgg } from 'hooks/useEdgeEasterEgg'
import { useEasterEggHandlers } from 'utils/easterEggHandlers'
import { useGlobalSpecialEggs } from 'hooks/useGlobalSpecialEggs'
import { generateShapeClass } from 'utils/patternRecognition'
import { useEggStore } from 'stores/easterEggStore'
import { MESSAGE_LINES, SHAPE_POOLS, SPEC_DUP_LINES, SPEC_OK_LINES } from '@constants'

import ConfirmModal from 'components/common/ConfirmModal'
import styles from './EasterEgg.module.scss'

export default function EasterEggLayer() {
  const pathname = usePathname()
  const flushToServer = useEggStore((state) => state.flushToServer)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMsg, setModalMsg] = useState<ReactNode>('')

  const { eggs } = useEasterEggInitialization(pathname)
  const { activeEdge, hideEdgeEgg, updateEdgeEgg, isMobile } = useEdgeEasterEgg()
  const { award, notify } = useEasterEggHandlers(pathname, setModalMsg, setModalOpen)

  const collectEgg = useEggStore((state) => state.collectEgg)
  const reshuffleEggs = useEggStore((state) => state.reshuffleEggs)

  // 전역 스페셜 이스터에그 감지기
  useGlobalSpecialEggs(award, notify, setModalMsg, setModalOpen, SPEC_OK_LINES, SPEC_DUP_LINES)

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') flushToServer(pathname)
    }
    window.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('visibilitychange', onVis)
      flushToServer(pathname)
    }
  }, [pathname, flushToServer])

  async function onEggClick(egg: ReturnType<typeof useEggStore.getState>['eggs'][number]) {
    collectEgg(egg.id, egg.fieldId)

    // 에그들 위치 재배치
    reshuffleEggs()

    // 가짜 에그 (fake 타입)
    if (egg.kind === 'dud') {
      notify(MESSAGE_LINES.DUD)
      return
    }

    // 당첨 에그 (normal, secret 타입)
    if (egg.kind === 'medal') {
      const { ok, awarded } = await award('medal', {
        eggId: egg.id,
        fieldId: egg.fieldId,
      })
      if (!ok) {
        setModalMsg('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.')
        setModalOpen(true)
        return
      }
      notify(awarded ? MESSAGE_LINES.MEDAL_OK : MESSAGE_LINES.MEDAL_DUP)
      return
    }
  }

  async function onEdgeEggClick() {
    hideEdgeEgg()

    const { ok, awarded } = await award('special10', { awardCode: 'EDGE_MASTER' })
    if (!ok) {
      setModalMsg('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.')
      setModalOpen(true)
      return
    }
    notify(awarded ? SPEC_OK_LINES('EDGE_MASTER') : SPEC_DUP_LINES('EDGE_MASTER'))
  }

  return (
    <>
      <div className={styles.easterEggContainer}>
        {eggs.map((egg) => (
          <button
            key={egg.id}
            className={styles.easterEgg}
            style={{ left: egg.x, top: egg.y }}
            data-secret={String(egg.attrs?.secret)}
            data-fake={String(egg.attrs?.fake)}
            onClick={(e) => {
              e.preventDefault()
              onEggClick(egg)
            }}
            aria-label={`easter-egg-${egg.type}`}
          >
            <div className={`${styles.shape} ${getShapeClassName(egg.type, egg.id)}`} />
          </button>
        ))}

        {!isMobile && activeEdge && (
          <div
            className={`${styles.edgeEgg} ${styles[activeEdge.position]} ${styles.show}`}
            onClick={onEdgeEggClick}
            onMouseEnter={(e) => {
              if (activeEdge.escapeCount >= 2) {
                return
              }

              // 마우스가 이스터에그 위에 올라오면 도망가기
              const currentTarget = e.currentTarget
              const rect = currentTarget.getBoundingClientRect()
              const centerX = rect.left + rect.width / 2
              const centerY = rect.top + rect.height / 2

              // 마우스 위치에서 반대 방향으로 도망가기
              const mouseX = e.clientX
              const mouseY = e.clientY
              const deltaX = centerX - mouseX
              const deltaY = centerY - mouseY
              const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

              if (distance > 0) {
                const escapeDistance = 100 // 도망가는 거리
                const normalizedX = deltaX / distance
                const normalizedY = deltaY / distance
                const newX = centerX + normalizedX * escapeDistance
                const newY = centerY + normalizedY * escapeDistance

                // 화면 경계 체크
                const maxX = window.innerWidth - 60
                const maxY = window.innerHeight - 60
                const clampedX = Math.max(10, Math.min(maxX, newX))
                const clampedY = Math.max(10, Math.min(maxY, newY))

                updateEdgeEgg(clampedX, clampedY)

                currentTarget.style.transition = 'left 0.2s ease-out, top 0.2s ease-out'
                currentTarget.style.left = `${clampedX}px`
                currentTarget.style.top = `${clampedY}px`

                // 트랜지션 후 원래 속도로 복원
                setTimeout(() => {
                  currentTarget.style.transition = ''
                }, 200)
              }
            }}
            style={{
              left: `${activeEdge.x}px`,
              top: `${activeEdge.y}px`,
            }}
          >
            <div className={`${styles.shape} ${styles.star}`} />
          </div>
        )}
      </div>

      <ConfirmModal
        open={modalOpen}
        onConfirm={() => setModalOpen(false)}
        message={modalMsg}
        confirmText="확인"
        color={'gold'}
      />
    </>
  )
}

/**
 * 이스터에그의 시각적 형태를 결정하는 함수
 * - type: 이스터에그의 종류 (normal, secret, fake)
 * - eggId: 고유 id 로 같은 타입이어도 다른 모양을 가질 수 있음
 * - SHAPE_POOLS에서 랜덤하게 선택하여 일관된 모양 생성
 */
function getShapeClassName(type: 'normal' | 'secret' | 'fake', eggId: string): string {
  const shapeClass = generateShapeClass(type, eggId, SHAPE_POOLS)
  // @ts-ignore - styles 객체에 동적으로 접근하므로 ts 체크 무시
  return (styles as any)[shapeClass] ?? styles.dot
}
