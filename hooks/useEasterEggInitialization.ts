import { useEffect, useRef, useState } from 'react'
import { useEggStore } from 'stores/easterEggStore'
import { BASE_DENSITY, CYCLE_TTL_MS, getFieldIdByPath } from '@constants'

export function useEasterEggInitialization(pathname: string) {
  const [isInitialized, setIsInitialized] = useState(false)
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const currentFieldIdRef = useRef<string | null>(null)

  const fieldId = getFieldIdByPath(pathname)

  const eggs = useEggStore((s) => s.eggs)
  const cycleId = useEggStore((s) => s.cycleId)
  const cycleEndsAt = useEggStore((s) => s.cycleEndsAt)
  const startCycle = useEggStore((s) => s.startCycle)
  const spawnAll = useEggStore((s) => s.spawnAll)
  const registerField = useEggStore((s) => s.registerField)
  const updateFieldRect = useEggStore((s) => s.updateFieldRect)
  const unregisterField = useEggStore((s) => s.unregisterField)

  /**
   * main 요소의 현재 크기를 측정하여 필드 rect 업데이트
   * - scrollHeight 사용으로 스크롤 가능한 전체 높이 포함
   * - 이스터에그가 전체 페이지 영역에 배치될 수 있도록 함
   */
  const updateMainRect = () => {
    const main = document.querySelector('main') as HTMLElement | null
    if (!main) return

    updateFieldRect(fieldId, {
      left: 0,
      top: 0,
      width: main.clientWidth,
      height: main.scrollHeight,
    })
  }

  /**
   * 이스터에그 초기화 및 스폰 함수
   * - 경로와 시간을 기반으로 고유한 사이클 id 생성
   * - 사이클이 만료되지 않았다면 기존 사이클 유지
   * - 이스터에그가 없으면 새로 스폰
   */
  const initializeEggs = async () => {
    const id = `${pathname}-${Math.floor(Date.now() / CYCLE_TTL_MS)}`

    if (id !== cycleId || Date.now() > cycleEndsAt) {
      startCycle(id, CYCLE_TTL_MS)
    } else {
      if (eggs.length === 0) {
        spawnAll()
      }
    }

    setIsInitialized(true)
  }

  // 메인 초기화 효과 - 페이지 변경 시마다 실행
  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement | null
    if (!main) return

    // 이전 페이지의 필드 정리
    if (currentFieldIdRef.current && currentFieldIdRef.current !== fieldId) {
      unregisterField(currentFieldIdRef.current)
    }

    // 모든 시스템 필드 정리
    const { fields } = useEggStore.getState()
    Object.keys(fields).forEach((id) => {
      if (id.startsWith('__') && id !== fieldId) {
        unregisterField(id)
      }
    })

    // 현재 페이지 필드 등록
    registerField({
      id: fieldId,
      baseDensity: BASE_DENSITY,
    })
    currentFieldIdRef.current = fieldId

    /**
     * 초기 크기 설정을 위한 다중 시도
     * - DOM 렌더링과 레이아웃 계산이 비동기적으로 일어나므로
     * - 여러 시점에서 크기를 측정하여 정확한 값 확보
     */
    const setInitialRect = () => {
      updateMainRect()
      setTimeout(updateMainRect, 0)
      setTimeout(updateMainRect, 10)
      setTimeout(updateMainRect, 50)
      setTimeout(updateMainRect, 100)
    }

    const resizeObsv = new ResizeObserver(() => {
      updateMainRect()
    })
    resizeObsv.observe(main)

    setInitialRect()

    // 이스터에그 초기화
    initTimeoutRef.current = setTimeout(async () => {
      await initializeEggs()
      updateMainRect()
      spawnAll()
    }, 150)

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
      resizeObsv.disconnect()
      unregisterField(fieldId)
      currentFieldIdRef.current = null
      setIsInitialized(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, fieldId])

  useEffect(() => {
    const onResize = () => {
      updateMainRect()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [updateMainRect])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkAndUpdate = () => {
      if (isInitialized) {
        updateMainRect()
      }
    }

    window.addEventListener('load', checkAndUpdate)

    /**
     * MutationObserver로 DOM 구조 변화 감지
     * - 동적으로 콘텐츠가 추가/제거될 때 main 크기 변화 가능
     * - 100ms 디바운싱으로 과도한 업데이트 방지
     */
    const observer = new MutationObserver(() => {
      setTimeout(checkAndUpdate, 100)
    })

    const main = document.querySelector('main')
    if (main) {
      observer.observe(main, {
        childList: true,
        subtree: true,
        attributes: false,
      })
    }

    return () => {
      window.removeEventListener('load', checkAndUpdate)
      observer.disconnect()
    }
  }, [isInitialized, updateMainRect])

  return {
    isInitialized, // 초기화 완료 여부
    eggs, // 현재 활성화된 이스터에그 목록
    updateMainRect, // 수동으로 크기 업데이트하는 함수
    fieldId, // 현재 페이지의 필드 ID
  }
}
