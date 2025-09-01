export type MousePosition = { x: number; y: number; time: number }

export function recognizeCirclePattern(
  positions: MousePosition[],
  threshold = { distance: 50, movement: 200 },
): boolean {
  if (positions.length < 10) return false

  const start = positions[0]
  const end = positions[positions.length - 1]
  const distance = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)

  const totalMovement = positions.reduce((sum, pos, i) => {
    if (i === 0) return sum
    const prev = positions[i - 1]
    return sum + Math.sqrt((pos.x - prev.x) ** 2 + (pos.y - prev.y) ** 2)
  }, 0)

  return distance < threshold.distance && totalMovement > threshold.movement
}

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

export function recognizePattern(pattern: string, positions: MousePosition[]): boolean {
  switch (pattern) {
    case 'circle':
      return recognizeCirclePattern(positions)
    case 'zigzag':
      return recognizeZigzagPattern(positions)
    default:
      return false
  }
}

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
