export type MousePosition = { x: number; y: number; time: number }

// 지그재그 패턴 감지
export function recognizeZigzagPattern(
  positions: MousePosition[],
  minDirectionChanges = 3,
): boolean {
  if (positions.length < 5) return false

  let directionChanges = 0
  let lastDirection = 0

  for (let i = 1; i < positions.length; i++) {
    const curr = positions[i]
    const prev = positions[i - 1]
    const deltaX = curr.x - prev.x
    const direction = deltaX > 0 ? 1 : deltaX < 0 ? -1 : 0

    if (direction !== 0 && direction !== lastDirection && lastDirection !== 0) {
      directionChanges++
    }
    lastDirection = direction
  }

  return directionChanges >= minDirectionChanges
}

const PATTERN_RECOGNIZERS: Record<string, (positions: MousePosition[]) => boolean> = {
  zigzag: recognizeZigzagPattern,
}

export function recognizePattern(pattern: string, positions: MousePosition[]): boolean {
  const recognizer = PATTERN_RECOGNIZERS[pattern]
  return recognizer ? recognizer(positions) : false
}

// 일반 에그의 랜덤 모양 생성
export function generateShapeClass(
  type: string,
  eggId: string,
  shapePools: Record<string, readonly string[]>,
): string {
  const pool = shapePools[type] || shapePools.normal

  // eggId를 기반으로 해시값 생성하여 일관된 모양 보장
  let hash = 0
  for (let i = 0; i < eggId.length; i++) {
    const char = eggId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 32bit 정수로 변환
  }

  const idx = Math.abs(hash) % pool.length
  return pool[idx] || 'dot'
}
