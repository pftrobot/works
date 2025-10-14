import { useEffect, useState } from 'react'
import { useDeviceDetection } from 'hooks/useDeviceDetection'

type EdgePosition = 'left' | 'right' | 'top' | 'bottom'

interface EdgeEggState {
  position: EdgePosition
  x: number
  y: number
  escapeCount: number
}

interface HiddenSpot {
  edge: EdgePosition
  x: number
  y: number
  triggerArea: { x1: number; y1: number; x2: number; y2: number }
}

/**
 * 가장자리 이스터에그 훅
 * - 미리 정해진 2곳의 히든 스팟에서만 이스터에그 등장
 * - 해당 위치 근처에 마우스를 1초간 머물면 이스터에그 나타남
 * - 모바일 디바이스에서는 비활성화
 * - EDGE_MASTER 어워드와 연결되는 히든 기능
 */
export function useEdgeEasterEgg() {
  const [activeEdge, setActiveEdge] = useState<EdgeEggState | null>(null)
  const [hiddenSpots, setHiddenSpots] = useState<HiddenSpot[]>([])
  const { isMobile } = useDeviceDetection()

  // 페이지 로드시 히든 스팟 2곳을 랜덤으로 생성
  useEffect(() => {
    if (isMobile) {
      setHiddenSpots([])
      return
    }

    const generateHiddenSpots = (): HiddenSpot[] => {
      const { innerWidth, innerHeight } = window
      const edges: EdgePosition[] = ['left', 'right', 'top', 'bottom']
      const selectedEdges = edges.sort(() => Math.random() - 0.5).slice(0, 2) // 랜덤으로 2개 선택

      const triggerRadius = 50
      const eggSize = 50

      // 각 엣지별 히든 스팟 생성 함수 매핑
      const edgeSpotGenerators: Record<EdgePosition, () => HiddenSpot> = {
        left: () => {
          const y = Math.random() * (innerHeight - eggSize * 2) + eggSize
          return {
            edge: 'left',
            x: 10,
            y,
            triggerArea: {
              x1: 0,
              y1: y - triggerRadius,
              x2: 20 + triggerRadius,
              y2: y + triggerRadius,
            },
          }
        },
        right: () => {
          const y = Math.random() * (innerHeight - eggSize * 2) + eggSize
          return {
            edge: 'right',
            x: innerWidth - 60,
            y,
            triggerArea: {
              x1: innerWidth - 60 - triggerRadius,
              y1: y - triggerRadius,
              x2: innerWidth,
              y2: y + triggerRadius,
            },
          }
        },
        top: () => {
          const x = Math.random() * (innerWidth - eggSize * 2) + eggSize
          return {
            edge: 'top',
            x,
            y: 10,
            triggerArea: {
              x1: x - triggerRadius,
              y1: 0,
              x2: x + triggerRadius,
              y2: 20 + triggerRadius,
            },
          }
        },
        bottom: () => {
          const x = Math.random() * (innerWidth - eggSize * 2) + eggSize
          return {
            edge: 'bottom',
            x,
            y: innerHeight - 60,
            triggerArea: {
              x1: x - triggerRadius,
              y1: innerHeight - 60 - triggerRadius,
              x2: x + triggerRadius,
              y2: innerHeight,
            },
          }
        },
      }

      return selectedEdges.map((edge) => edgeSpotGenerators[edge]())
    }

    setHiddenSpots(generateHiddenSpots())
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

    let timeout: NodeJS.Timeout | null = null
    let currentSpot: HiddenSpot | null = null

    const checkHiddenSpotHover = (e: MouseEvent) => {
      const { clientX, clientY } = e

      if (activeEdge) {
        return
      }

      // 현재 마우스 위치가 어떤 히든 스팟 영역에 있는지 확인
      const hoveredSpot = hiddenSpots.find(
        (spot) =>
          clientX >= spot.triggerArea.x1 &&
          clientX <= spot.triggerArea.x2 &&
          clientY >= spot.triggerArea.y1 &&
          clientY <= spot.triggerArea.y2,
      )

      if (hoveredSpot && hoveredSpot !== currentSpot) {
        currentSpot = hoveredSpot
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
          // 약간의 랜덤 오프셋 추가 (+-20px)
          const randomOffsetX = (Math.random() - 0.5) * 40
          const randomOffsetY = (Math.random() - 0.5) * 40

          setActiveEdge({
            position: hoveredSpot.edge,
            x: hoveredSpot.x + randomOffsetX,
            y: hoveredSpot.y + randomOffsetY,
            escapeCount: 0,
          })

          setTimeout(() => {
            setActiveEdge(null)
          }, 3000)
        }, 1000)
      } else if (!hoveredSpot && timeout) {
        clearTimeout(timeout)
        timeout = null
        currentSpot = null
      }
    }

    if (hiddenSpots.length > 0) {
      window.addEventListener('mousemove', checkHiddenSpotHover, { passive: true })
    }

    return () => {
      window.removeEventListener('mousemove', checkHiddenSpotHover)
      if (timeout) clearTimeout(timeout)
    }
  }, [hiddenSpots, activeEdge, isMobile])

  const hideEdgeEgg = () => {
    setActiveEdge(null)
  }

  // 이스터에그 위치와 도망 횟수 업데이트 함수
  const updateEdgeEgg = (newX: number, newY: number) => {
    if (activeEdge) {
      setActiveEdge({
        ...activeEdge,
        x: newX,
        y: newY,
        escapeCount: activeEdge.escapeCount + 1,
      })
    }
  }

  return {
    activeEdge: isMobile ? null : activeEdge,
    hideEdgeEgg,
    updateEdgeEgg,
    isMobile,
  }
}
