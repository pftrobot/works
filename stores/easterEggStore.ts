import { create } from 'zustand'

export type EggType = 'normal' | 'secret' | 'treasure' | 'fake'
export type EggKind = 'dud' | 'medal' | 'special10'

export type Rect = { left: number; top: number; width: number; height: number }

export type Field = {
  id: string
  baseDensity: number
  rect: Rect
}

export type EggInstance = {
  id: string
  fieldId: string
  x: number
  y: number
  type: EggType
  kind: EggKind
  attrs?: Record<string, string | boolean>
  challenge?: { key: string; clicks: number; windowMs: number }
  awardCode?: string
}

const AREA_PER_EGG = 220_000 // px^2 당 1개 기준
const MAX_PER_FIELD = 14
const RNG_SEED = 0x2f6e_1bcd

const SPECIAL_VARIANTS = [
  { code: 'TEN_Gx4_1p2s', challenge: { key: 'KeyG', clicks: 4, windowMs: 1200 } },
  { code: 'TEN_Ux3_0p9s', challenge: { key: 'KeyU', clicks: 3, windowMs: 900 } },
  { code: 'TEN_Rx5_1p5s', challenge: { key: 'KeyR', clicks: 5, windowMs: 1500 } },
] as const

function makeRng(seed = RNG_SEED) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffff_ffff
  }
}

type State = {
  fields: Record<string, Field>
  eggs: EggInstance[]
  cycleId: string
  cycleEndsAt: number

  registerField: (f: { id: string; baseDensity?: number }) => void
  updateFieldRect: (id: string, rect: Rect) => void
  unregisterField: (id: string) => void

  startCycle: (id: string, ttlMs: number) => void
  spawnAll: () => void
  collectEgg: (eggId: string) => void

  hydrateFromServer: (route: string) => Promise<void>
  flushToServer: (route: string) => Promise<void>
}

export const useEggStore = create<State>((set, get) => ({
  fields: {},
  eggs: [],
  cycleId: '',
  cycleEndsAt: 0,

  registerField: ({ id, baseDensity = 1 }) =>
    set((st) => {
      const prev = st.fields[id]
      return {
        fields: {
          ...st.fields,
          [id]: prev ?? { id, baseDensity, rect: { left: 0, top: 0, width: 0, height: 0 } },
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
      return { fields: next, eggs: st.eggs.filter((e) => e.fieldId !== id) }
    }),

  startCycle: (id, ttlMs) =>
    set((st) => ({
      cycleId: id,
      cycleEndsAt: Date.now() + ttlMs,
      eggs: [],
    })),

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

      for (let i = 0; i < target; i++) {
        const rx = rect.left + Math.floor(rng() * Math.max(1, rect.width - 16))
        const ry = rect.top + Math.floor(rng() * Math.max(1, rect.height - 16))

        const r = rng()
        const type: EggType =
          r < 0.05 ? 'treasure' : r < 0.1 ? 'secret' : r < 0.18 ? 'fake' : 'normal'

        let kind: EggKind = 'medal'
        let challenge: EggInstance['challenge'] | undefined
        let awardCode: string | undefined

        if (type === 'fake') {
          kind = 'dud'
        } else if (type === 'treasure') {
          kind = 'special10'
          const v = SPECIAL_VARIANTS[Math.floor(rng() * SPECIAL_VARIANTS.length)]
          awardCode = v.code
          challenge = v.challenge
        } else {
          kind = 'medal'
        }

        eggs.push({
          id: `${f.id}-${st.cycleId}-${i}`,
          fieldId: f.id,
          x: rx,
          y: ry,
          type,
          kind,
          attrs: {
            secret: type === 'secret',
            treasure: type === 'treasure',
            fake: type === 'fake',
          },
          challenge,
          awardCode,
        })
      }
    })

    set({ eggs })
  },

  collectEgg: (eggId) =>
    set((st) => ({
      eggs: st.eggs.filter((e) => e.id !== eggId),
    })),

  hydrateFromServer: async (_route) => {},
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
