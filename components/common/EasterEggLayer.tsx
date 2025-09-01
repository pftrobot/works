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
  const { activeEdge, hideEdgeEgg } = useEdgeEasterEgg()
  const { award, notify, collectEgg } = useEasterEggHandlers(pathname, setModalMsg, setModalOpen)

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
    // 가짜 에그 (fake 타입)
    if (egg.kind === 'dud') {
      collectEgg(egg.id)
      notify(MESSAGE_LINES.DUD)
      return
    }

    // 당첨 에그 (normal, secret 타입)
    if (egg.kind === 'medal') {
      collectEgg(egg.id)
      const { ok, awarded } = await award('medal', { eggId: egg.id })
      if (!ok) {
        setModalMsg('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.')
        setModalOpen(true)
        return
      }
      notify(awarded ? MESSAGE_LINES.MEDAL_OK : MESSAGE_LINES.MEDAL_DUP)
      return
    }

    collectEgg(egg.id)
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

        {activeEdge && (
          <div
            className={`${styles.edgeEgg} ${styles[activeEdge]} ${styles.show}`}
            onClick={onEdgeEggClick}
            style={{
              // 흰색 도형에 주황색 그림자
              filter: 'drop-shadow(0 0 10px #ff8c00) drop-shadow(0 0 20px #ff8c00)',
              // 각 가장자리별 위치 조정 (잘림 방지)
              ...(activeEdge === 'left' && {
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                position: 'fixed' as const,
              }),
              ...(activeEdge === 'right' && {
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                position: 'fixed' as const,
              }),
              ...(activeEdge === 'top' && {
                left: '50%',
                top: '10px',
                transform: 'translateX(-50%)',
                position: 'fixed' as const,
              }),
              ...(activeEdge === 'bottom' && {
                left: '50%',
                bottom: '10px',
                transform: 'translateX(-50%)',
                position: 'fixed' as const,
              }),
            }}
          >
            <div
              className={`${styles.shape} ${styles.star}`}
              style={{
                backgroundColor: 'white',
                border: '2px solid #ff8c00',
              }}
            />
          </div>
        )}
      </div>

      <ConfirmModal
        open={modalOpen}
        onConfirm={() => setModalOpen(false)}
        message={modalMsg}
        confirmText="확인"
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
