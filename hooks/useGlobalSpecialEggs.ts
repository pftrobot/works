import { useEffect, useRef } from 'react'

import { recognizePattern } from 'utils/patternRecognition'
import { useDeviceDetection } from 'hooks/useDeviceDetection'
import { SPECIAL_CHALLENGES } from '@constants'
import { GlobalSpecialState } from 'types'

/**
 * 전역 스페셜 이스터에그 감지 훅
 * 키보드 조합, 마우스 패턴, 스크롤 등의 인터랙션을 감지하여
 * 스페셜 이스터에그를 트리거함
 * 모바일에서는 마우스 및 스크롤 관련 챌린지 비활성화
 */
export function useGlobalSpecialEggs(
  award: (
    kind: 'special10',
    opts: { awardCode: string },
  ) => Promise<{ ok: boolean; awarded: boolean; amount: number }>,
  notify: (lines: string[]) => void,
  setModalMsg: (msg: string) => void,
  setModalOpen: (open: boolean) => void,
  SPEC_OK_LINES: (code?: string) => string[],
  SPEC_DUP_LINES: (code?: string) => string[],
) {
  const { isMobile } = useDeviceDetection()

  // 모든 스페셜 챌린지의 상태를 관리하는 ref
  // 각 타입별로 별도의 추적 시스템을 가지고 있음
  const stateRef = useRef<GlobalSpecialState>({
    keyholders: {},
    sequences: {},
    combos: {},
    typing: {},
    mouseTracker: { positions: [], challenges: {} },
    rapidKey: {},
    clickTrackers: {},
  })

  // 완료된 챌린지 추적 (중복 방지)
  const completedRef = useRef<Set<string>>(new Set())

  const completeChallenge = async (awardCode: string) => {
    if (completedRef.current.has(awardCode)) return

    completedRef.current.add(awardCode)

    const { ok, awarded } = await award('special10', { awardCode })
    if (!ok) {
      setModalMsg('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.')
      setModalOpen(true)
      return
    }

    notify(awarded ? SPEC_OK_LINES(awardCode) : SPEC_DUP_LINES(awardCode))
  }

  // 초기화
  useEffect(() => {
    const state = stateRef.current
    const now = Date.now()

    // 모든 스페셜 챌린지 등록
    SPECIAL_CHALLENGES.forEach(({ code, challenge }) => {
      // 모바일에서는 마우스/스크롤 관련 챌린지 스킵
      if (
        isMobile &&
        (challenge.type === 'mousemove' ||
          challenge.type === 'doubleclick' ||
          challenge.type === 'tripleclick' ||
          challenge.type === 'scroll')
      ) {
        return
      }

      if (challenge.type === 'keyhold') {
        state.keyholders[code] = {
          awardCode: code,
          key: challenge.key!,
          required: challenge.clicks!,
          count: 0,
          keyDown: false,
          windowMs: challenge.windowMs!,
          deadline: 0,
        }
      } else if (challenge.type === 'sequence') {
        let keys = challenge.keys!
        if (challenge.repeat) {
          keys = Array(challenge.repeat).fill(challenge.keys!).flat()
        }
        state.sequences[code] = {
          awardCode: code,
          keys,
          currentSequence: [],
          windowMs: challenge.windowMs!,
          deadline: 0,
        }
      } else if (challenge.type === 'combo') {
        state.combos[code] = {
          awardCode: code,
          keys: challenge.keys!,
          windowMs: challenge.windowMs!,
        }
      } else if (challenge.type === 'typing') {
        state.typing[code] = {
          awardCode: code,
          word: challenge.word!,
          typedWord: '',
          windowMs: challenge.windowMs!,
          deadline: 0,
        }
      } else if (challenge.type === 'mousemove') {
        state.mouseTracker.challenges[code] = {
          awardCode: code,
          pattern: challenge.pattern!,
          required: challenge.moves!,
          windowMs: challenge.windowMs!,
          deadline: 0,
        }
      } else if (challenge.type === 'rapidkey') {
        state.rapidKey[code] = {
          awardCode: code,
          key: challenge.key!,
          count: 0,
          required: challenge.count!,
          windowMs: challenge.windowMs!,
          deadline: 0,
        }
      } else if (challenge.type === 'doubleclick' || challenge.type === 'tripleclick') {
        state.clickTrackers[code] = {
          awardCode: code,
          type: challenge.type === 'tripleclick' ? 'triple' : 'double',
          required: challenge.type === 'tripleclick' ? 3 : challenge.clicks || 2,
          clickCount: 0,
          lastClickTime: 0,
          windowMs: challenge.windowMs!,
        }
      }
    })
  }, [isMobile])

  // 메인 이벤트 리스너들 등록
  useEffect(() => {
    const onKeyDown = async (e: KeyboardEvent) => {
      const state = stateRef.current
      const now = Date.now()

      Object.values(state.keyholders).forEach(async (holder) => {
        if (e.code === holder.key) {
          if (!holder.keyDown) {
            holder.keyDown = true
            holder.count++
            holder.deadline = now + holder.windowMs

            console.log(`Keyhold ${holder.awardCode}: count=${holder.count}/${holder.required}`)

            if (holder.count >= holder.required) {
              await completeChallenge(holder.awardCode)
              // 리셋
              holder.count = 0
              holder.keyDown = false
              holder.deadline = 0
            }
          }
        }
      })

      Object.values(state.sequences).forEach(async (seq) => {
        if (seq.deadline === 0 || now > seq.deadline) {
          seq.currentSequence = []
          seq.deadline = now + seq.windowMs
        }

        seq.currentSequence.push(e.code)
        const expectedKey = seq.keys[seq.currentSequence.length - 1]

        if (e.code !== expectedKey) {
          seq.currentSequence = []
        } else if (seq.currentSequence.length === seq.keys.length) {
          await completeChallenge(seq.awardCode)
          seq.currentSequence = []
          seq.deadline = 0
        }
      })

      Object.values(state.combos).forEach(async (combo) => {
        const requiredKeys = combo.keys
        const pressedKeys = new Set<string>()

        if (e.ctrlKey) pressedKeys.add('ControlLeft')
        if (e.shiftKey) pressedKeys.add('ShiftLeft')
        if (e.altKey) pressedKeys.add('AltLeft')
        pressedKeys.add(e.code)

        const hasAllKeys = requiredKeys.every((key) => pressedKeys.has(key))
        if (hasAllKeys) {
          await completeChallenge(combo.awardCode)
        }
      })

      Object.values(state.typing).forEach(async (typing) => {
        const char = e.key.toUpperCase()

        // 시간 초과 시 리셋
        if (typing.deadline === 0 || now > typing.deadline) {
          typing.typedWord = ''
          typing.deadline = now + typing.windowMs
        }

        if (typing.word[typing.typedWord.length] === char) {
          typing.typedWord += char
          if (typing.typedWord === typing.word) {
            await completeChallenge(typing.awardCode)
            typing.typedWord = ''
            typing.deadline = 0
          }
        } else {
          typing.typedWord = ''
        }
      })

      Object.values(state.rapidKey).forEach(async (rapid) => {
        if (e.code === rapid.key) {
          // 시간 초과 시 카운트 리셋
          if (rapid.deadline === 0 || now > rapid.deadline) {
            rapid.count = 0
            rapid.deadline = now + rapid.windowMs
          }

          rapid.count++
          if (rapid.count >= rapid.required) {
            await completeChallenge(rapid.awardCode)
            rapid.count = 0
            rapid.deadline = 0
          }
        }
      })
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const state = stateRef.current
      const now = Date.now()

      Object.values(state.keyholders).forEach((holder) => {
        if (e.code === holder.key) {
          holder.keyDown = false

          // 시간 초과시 리셋
          if (now > holder.deadline) {
            holder.count = 0
            holder.deadline = 0
          }
        }
      })
    }

    const onClick = async () => {
      if (isMobile) return

      const state = stateRef.current
      const now = Date.now()

      Object.values(state.clickTrackers).forEach(async (tracker) => {
        // 클릭 간격 임계값 (트리플클릭은 더 짧은 간격)
        const threshold = tracker.type === 'triple' ? 200 : 300

        if (now - tracker.lastClickTime < threshold) {
          tracker.clickCount++
          if (tracker.clickCount >= tracker.required) {
            await completeChallenge(tracker.awardCode)
            tracker.clickCount = 0
          }
        } else {
          tracker.clickCount = 1
        }
        tracker.lastClickTime = now
      })
    }

    const onMouseMove = async (e: MouseEvent) => {
      if (isMobile) return

      const state = stateRef.current
      const now = Date.now()

      // 마우스 위치 기록
      state.mouseTracker.positions.push({ x: e.clientX, y: e.clientY, time: now })

      // 메모리 절약을 위해 최근 50개 위치만 유지
      if (state.mouseTracker.positions.length > 50) {
        state.mouseTracker.positions = state.mouseTracker.positions.slice(-30)
      }

      Object.values(state.mouseTracker.challenges).forEach(async (challenge) => {
        // 시간 윈도우 관리
        if (challenge.deadline === 0 || now > challenge.deadline) {
          challenge.deadline = now + challenge.windowMs
        }

        // 충분한 움직임 데이터가 있고 시간 내라면 패턴 인식 시도
        if (
          state.mouseTracker.positions.length >= challenge.required &&
          now <= challenge.deadline
        ) {
          const positions = state.mouseTracker.positions.slice(-challenge.required)

          // 패턴 인식 함수로 원, 지그재그 등의 패턴 감지
          if (recognizePattern(challenge.pattern, positions)) {
            await completeChallenge(challenge.awardCode)
            state.mouseTracker.positions = []
            challenge.deadline = 0
          }
        }
      })
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    // 모바일이 아닐 때만 마우스 이벤트 등록
    if (!isMobile) {
      window.addEventListener('click', onClick)
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)

      if (!isMobile) {
        window.removeEventListener('click', onClick)
        window.removeEventListener('mousemove', onMouseMove)
      }
    }
  }, [award, notify, setModalMsg, setModalOpen, SPEC_OK_LINES, SPEC_DUP_LINES, isMobile])

  return stateRef
}
