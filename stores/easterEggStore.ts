import { create } from 'zustand'

export type EggType = 'normal' | 'secret' | 'fake'
export type EggKind = 'dud' | 'medal' | 'special10'

export type Rect = { left: number; top: number; width: number; height: number }

export type Field = {
  id: string
  baseDensity: number // 기본 밀도 (default: 1.0, 2배 더 많이: 2.0)
  rect: Rect
}

export type EggInstance = {
  id: string
  fieldId: string // 어떤 필드에 속해있는지
  x: number
  y: number
  type: EggType
  kind: EggKind
  attrs?: Record<string, string | boolean>
  challenge?: {
    // 모든 챌린지에 공통으로 있는 속성들
    type:
      | 'keyhold'
      | 'sequence'
      | 'doubleclick'
      | 'tripleclick'
      | 'scroll'
      | 'combo'
      | 'mousemove'
      | 'typing'
      | 'rapidkey'
    windowMs?: number

    // keyhold 타입용
    key?: string
    clicks?: number

    // sequence 타입용
    keys?: readonly string[]
    repeat?: number

    // 기타 타입용
    count?: number
    scrolls?: number
    moves?: number
    pattern?: string
    duration?: number
    word?: string
  }
  awardCode?: string // 성공시 부여할 코드
}

const AREA_PER_EGG = 220_000 // px^2 당 1개 기준
const MAX_PER_FIELD = 14
const RNG_SEED = 0x2f6e_1bcd

function makeRng(seed = RNG_SEED) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffff_ffff
  }
}

type State = {
  fields: Record<string, Field> // 등록된 모든 필드들
  eggs: EggInstance[] // 현재 화면에 있는 모든 이스터에그들
  collectedEggsByField: Record<string, Set<string>> // 필드별 수집된 이스터에그 추적
  cycleId: string // 현재 이스터에그 사이클 id
  cycleEndsAt: number // 사이클 종료 시간

  registerField: (f: { id: string; baseDensity?: number }) => void
  updateFieldRect: (id: string, rect: Rect) => void
  unregisterField: (id: string) => void

  startCycle: (id: string, ttlMs: number) => void
  spawnAll: () => void
  reshuffleEggs: () => void // 에그들 위치 재배치
  collectEgg: (eggId: string, fieldId: string) => void
  clearFieldCollection: (fieldId: string) => void // 특정 필드 기록 초기화
  clearAllCollections: () => void // 모든 필드 기록 초기화 (사이클 변경 시)

  flushToServer: (route: string) => Promise<void>
}

export const useEggStore = create<State>((set, get) => ({
  fields: {},
  eggs: [],
  collectedEggsByField: {},
  cycleId: '',
  cycleEndsAt: 0,

  registerField: ({ id, baseDensity = 1 }) =>
    set((st) => {
      const prev = st.fields[id]
      const collectedEggs = st.collectedEggsByField[id] || new Set<string>()
      return {
        fields: {
          ...st.fields,
          [id]: prev ?? { id, baseDensity, rect: { left: 0, top: 0, width: 0, height: 0 } },
        },
        collectedEggsByField: {
          ...st.collectedEggsByField,
          [id]: collectedEggs,
        },
      }
    }),

  updateFieldRect: (id, rect) =>
    set((st) => {
      const f = st.fields[id]
      if (!f) return {}
      return { fields: { ...st.fields, [id]: { ...f, rect } } }
    }),

  unregisterField: (id) =>
    set((st) => {
      const next = { ...st.fields }
      delete next[id]
      // 필드 해제 시 해당 필드의 이스터에그만 제거
      // 수집 기록은 유지 (다시 방문했을 때 재생성 방지)
      return {
        fields: next,
        eggs: st.eggs.filter((e) => e.fieldId !== id),
      }
    }),

  startCycle: (id, ttlMs) =>
    set((st) => {
      const isSameCycle = st.cycleId === id
      return {
        cycleId: id,
        cycleEndsAt: Date.now() + ttlMs,
        eggs: [],
        collectedEggsByField: isSameCycle ? st.collectedEggsByField : {},
      }
    }),

  /**
   * 모든 등록된 필드에 이스터에그들을 생성하는 핵심 함수
   * - 필드 크기에 따라 이스터에그 개수 계산
   * - 확률적으로 타입 결정 (secret 4%, normal 8%, 나머지 fake)
   */
  spawnAll: () => {
    const st = get()
    const rng = makeRng(hashCycleSeed(st.cycleId))
    const eggs: EggInstance[] = []

    Object.values(st.fields).forEach((f) => {
      const { rect, baseDensity } = f
      if (!rect.width || !rect.height) return

      const area = rect.width * rect.height
      const ideal = (area / AREA_PER_EGG) * baseDensity
      const target = Math.max(0, Math.min(MAX_PER_FIELD, Math.round(ideal + rng() * 2 - 1)))

      const fieldCollectedEggs = st.collectedEggsByField[f.id] || new Set<string>()

      for (let i = 0; i < target; i++) {
        const eggId = `${f.id}-${st.cycleId}-${i}`

        // 이미 수집된 에그는 생성하지 않음
        if (fieldCollectedEggs.has(eggId)) {
          continue
        }

        const rx = rect.left + Math.floor(rng() * Math.max(1, rect.width - 16))
        const ry = rect.top + Math.floor(rng() * Math.max(1, rect.height - 16))

        const r = rng()
        const type: EggType = r < 0.04 ? 'secret' : r < 0.12 ? 'normal' : 'fake'

        let kind: EggKind = 'medal'

        if (type === 'fake') {
          kind = 'dud'
        } else {
          kind = 'medal'
        }

        eggs.push({
          id: eggId,
          fieldId: f.id,
          x: rx,
          y: ry,
          type,
          kind,
          attrs: {
            secret: type === 'secret',
            fake: type === 'fake',
          },
        })
      }
    })

    set({ eggs })
  },

  collectEgg: (eggId, fieldId) =>
    set((st) => {
      // 해당 필드의 수집 기록에 추가
      const fieldCollectedEggs = new Set(st.collectedEggsByField[fieldId] || [])
      fieldCollectedEggs.add(eggId)

      return {
        eggs: st.eggs.filter((e) => e.id !== eggId),
        collectedEggsByField: {
          ...st.collectedEggsByField,
          [fieldId]: fieldCollectedEggs,
        },
      }
    }),

  reshuffleEggs: () => {
    const st = get()
    const rng = makeRng(Date.now()) // 현재 시간을 시드로 사용하여 매번 랜덤한 위치 지정

    const reshuffledEggs = st.eggs.map((egg) => {
      const field = st.fields[egg.fieldId]
      if (!field || !field.rect.width || !field.rect.height) return egg

      const newX = field.rect.left + Math.floor(rng() * Math.max(1, field.rect.width - 16))
      const newY = field.rect.top + Math.floor(rng() * Math.max(1, field.rect.height - 16))

      return {
        ...egg,
        x: newX,
        y: newY,
      }
    })

    set({ eggs: reshuffledEggs })
  },

  clearFieldCollection: (fieldId) =>
    set((st) => ({
      collectedEggsByField: {
        ...st.collectedEggsByField,
        [fieldId]: new Set<string>(),
      },
    })),

  clearAllCollections: () =>
    set(() => ({
      collectedEggsByField: {},
    })),

  flushToServer: async (_route) => {},
}))

function hashCycleSeed(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return h >>> 0
}
