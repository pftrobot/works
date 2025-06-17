import { MedalType } from '@/types/medal'

const MEDAL_KEY = 'medal_count'
const CASE_TRACK_KEY = 'medal_case_ids'
const MEDAL_LOG_KEY = 'medal_log'

export function getMedalCount(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(MEDAL_KEY) || '0', 10)
}

export function addMedal(type: MedalType, id?: string | number): void {
  if (typeof window === 'undefined') return

  const medalLog = JSON.parse(localStorage.getItem(MEDAL_LOG_KEY) || '[]') as Array<{
    type: MedalType
    id?: string | number
  }>

  if (type === MedalType.Case && id !== undefined) {
    const stored = localStorage.getItem(CASE_TRACK_KEY)
    const solvedIds = stored ? (JSON.parse(stored) as Array<string | number>) : []
    if (solvedIds.includes(id)) return
    solvedIds.push(id)
    localStorage.setItem(CASE_TRACK_KEY, JSON.stringify(solvedIds))
    medalLog.push({ type, id })
  } else {
    medalLog.push({ type })
  }

  localStorage.setItem(MEDAL_LOG_KEY, JSON.stringify(medalLog))
  const current = getMedalCount()
  localStorage.setItem(MEDAL_KEY, String(current + 1))
}

export function getMedalSources(): Array<'case' | 'contact' | 'egg'> {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(MEDAL_LOG_KEY)
  if (!stored) return []
  return JSON.parse(stored).map((entry: { type: 'case' | 'contact' | 'egg' }) => entry.type)
}
