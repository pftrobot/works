import type { MousePosition } from 'utils/patternRecognition'

export type GlobalSpecialState = {
  keyholders: Record<
    string,
    {
      awardCode: string
      key: string
      required: number
      count: number
      keyDown: boolean
      windowMs: number
      deadline: number
    }
  >

  sequences: Record<
    string,
    {
      awardCode: string
      keys: string[]
      currentSequence: string[]
      windowMs: number
      deadline: number
    }
  >

  combos: Record<
    string,
    {
      awardCode: string
      keys: string[]
      windowMs: number
    }
  >

  typing: Record<
    string,
    {
      awardCode: string
      word: string
      typedWord: string
      windowMs: number
      deadline: number
    }
  >

  mouseTracker: {
    positions: MousePosition[]
    challenges: Record<
      string,
      {
        awardCode: string
        pattern: string
        required: number
        windowMs: number
        deadline: number
      }
    >
  }

  rapidKey: Record<
    string,
    {
      awardCode: string
      key: string
      count: number
      required: number
      windowMs: number
      deadline: number
    }
  >

  clickTrackers: Record<
    string,
    {
      awardCode: string
      type: 'double' | 'triple'
      required: number
      clickCount: number
      lastClickTime: number
      windowMs: number
    }
  >
}
