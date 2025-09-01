import { useEffect, useState } from 'react'

type EdgePosition = 'left' | 'right' | 'top' | 'bottom'

/**
 * 가장자리 이스터에그 훅
 * - 마우스가 실제 이스터에그가 위치할 가장자리 근처에 1초간 머물면 등장
 * - 각 가장자리별로 고정된 위치에 이스터에그 배치
 * - 3초 후 자동으로 사라짐
 * - EDGE_MASTER 어워드와 연결되는 히든 기능
 */
export function useEdgeEasterEgg() {
  const [activeEdge, setActiveEdge] = useState<EdgePosition | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    const checkEdgeHover = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const edgeThreshold = 20 // 가장자리 감지 거리 (픽셀)
      const centerRange = 100 // 중앙에서 양쪽으로 허용 범위 (픽셀)
      let edge: EdgePosition | null = null

      // 왼쪽 가장자리: 세로 중앙 ±100px 범위
      if (clientX <= edgeThreshold) {
        const centerY = innerHeight / 2
        if (Math.abs(clientY - centerY) <= centerRange) {
          edge = 'left'
        }
      }
      // 오른쪽 가장자리: 세로 중앙 ±100px 범위
      else if (clientX >= innerWidth - edgeThreshold) {
        const centerY = innerHeight / 2
        if (Math.abs(clientY - centerY) <= centerRange) {
          edge = 'right'
        }
      }
      // 상단 가장자리: 가로 중앙 ±100px 범위
      else if (clientY <= edgeThreshold) {
        const centerX = innerWidth / 2
        if (Math.abs(clientX - centerX) <= centerRange) {
          edge = 'top'
        }
      }
      // 하단 가장자리: 가로 중앙 ±100px 범위
      else if (clientY >= innerHeight - edgeThreshold) {
        const centerX = innerWidth / 2
        if (Math.abs(clientX - centerX) <= centerRange) {
          edge = 'bottom'
        }
      }

      if (edge && edge !== activeEdge) {
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
          setActiveEdge(edge)

          setTimeout(() => {
            setActiveEdge(null)
          }, 3000)
        }, 1000)
      } else if (!edge && timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    }

    window.addEventListener('mousemove', checkEdgeHover, { passive: true })

    return () => {
      window.removeEventListener('mousemove', checkEdgeHover)
      if (timeout) clearTimeout(timeout)
    }
  }, [activeEdge])

  const hideEdgeEgg = () => {
    setActiveEdge(null)
  }

  return {
    activeEdge, // 현재 활성화된 가장자리 위치 ('left'|'right'|'top'|'bottom'|null)
    hideEdgeEgg, // 이스터에그를 숨기는 함수
  }
}
