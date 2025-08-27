'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

import { useEggStore } from 'stores/easterEggStore'
import { medalsKeys } from 'utils/medalUtils'

import ConfirmModal from 'components/common/ConfirmModal'
import styles from './EasterEgg.module.scss'

const CYCLE_TTL_MS = 10 * 60 * 1000 // 10m
const FIELD_ID = '__main__'
const BASE_DENSITY = 1

const DUD_LINES = [
  '휙— 아무 일도 일어나지 않았다.',
  '모조 알이었습니다. 증거 불충분!',
  '빈 탄창… 다음 단서를 노려보세요.',
  '범인은 현장에 없었다… (꽝)',
]

const MEDAL_OK_LINES = [
  '메달 1개 획득! 기록부에 반영했어요.',
  '빙고! 메달 +1 적립 완료.',
  '단서 확보! 메달 1개가 추가됐습니다.',
]

const MEDAL_DUP_LINES = [
  '이미 채증한 단서예요. 중복 적립은 안 돼요.',
  '이미 수집한 흔적입니다. 다음 단서를 찾아볼까요?',
]

const SPEC_OK_LINES = (code?: string) => [
  `스페셜(${code ?? 'SECRET'}) 성공! 메달 +10 적립 완료.`,
  `히든 도전 클리어! 메달 10개가 들어왔습니다.`,
]

const SPEC_DUP_LINES = (code?: string) => [
  `해당 스페셜(${code ?? 'SECRET'})은 이미 적립했어요.`,
  '스페셜 중복 적립은 안 됩니다. 다음 비밀을 노려보세요!',
]

export default function EasterEggLayer() {
  const pathname = usePathname()
  const queryClient = useQueryClient()

  // 개별 selector로 구독 (React19 스냅샷 이슈 방지)
  const eggs = useEggStore((s) => s.eggs)
  const cycleId = useEggStore((s) => s.cycleId)
  const cycleEndsAt = useEggStore((s) => s.cycleEndsAt)
  const startCycle = useEggStore((s) => s.startCycle)
  const spawnAll = useEggStore((s) => s.spawnAll)
  const collectEgg = useEggStore((s) => s.collectEgg)
  const hydrateFromServer = useEggStore((s) => s.hydrateFromServer)
  const flushToServer = useEggStore((s) => s.flushToServer)
  const registerField = useEggStore((s) => s.registerField)
  const updateFieldRect = useEggStore((s) => s.updateFieldRect)
  const unregisterField = useEggStore((s) => s.unregisterField)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMsg, setModalMsg] = useState<React.ReactNode>('')

  const specialRef = useRef<{
    activeEggId?: string
    count: number
    deadline: number
    keyDown: boolean
    required: number
    key: string
  } | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const s = specialRef.current
      if (!s) return
      if (e.code === s.key) s.keyDown = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const s = specialRef.current
      if (!s) return
      if (e.code === s.key) s.keyDown = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement | null
    if (!main) return

    const { fields } = useEggStore.getState()
    Object.keys(fields).forEach((id) => id.startsWith('__') && unregisterField(id))

    registerField({ id: FIELD_ID, baseDensity: BASE_DENSITY })

    const setRect = () => {
      updateFieldRect(FIELD_ID, {
        left: 0,
        top: 0,
        width: main.clientWidth,
        height: main.scrollHeight,
      })
    }

    const raf = requestAnimationFrame(setRect)
    const ro = new ResizeObserver(setRect)
    ro.observe(main)
    ;(async () => {
      await hydrateFromServer(pathname)
      const id = `${pathname}-${Math.floor(Date.now() / CYCLE_TTL_MS)}`
      if (id !== cycleId || Date.now() > cycleEndsAt) startCycle(id, CYCLE_TTL_MS)
      else spawnAll()
    })()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      unregisterField(FIELD_ID)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const onResize = () => {
      const main = document.querySelector('main') as HTMLElement | null
      if (!main) return
      updateFieldRect(FIELD_ID, {
        left: 0,
        top: 0,
        width: main.clientWidth,
        height: main.scrollHeight,
      })
      spawnAll()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [spawnAll, updateFieldRect])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') flushToServer(pathname)
    }
    window.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('visibilitychange', onVis)
      flushToServer(pathname)
    }
  }, [pathname, flushToServer])

  async function award(
    kind: 'medal' | 'special10',
    opts: { eggId?: string; awardCode?: string } = {},
  ) {
    const payload =
      kind === 'medal'
        ? { kind, route: pathname, eggId: opts.eggId }
        : { kind, route: pathname, awardCode: opts.awardCode! }

    const res = await fetch('/api/egg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))
    const ok = !!json?.ok
    if (ok) {
      queryClient.invalidateQueries({ queryKey: medalsKeys.all })
    }
    return { ok, awarded: !!json?.awarded, amount: json?.amount ?? 0 }
  }

  function notify(lines: string[]) {
    const text = lines[Math.floor(Math.random() * lines.length)]
    setModalMsg(text)
    setModalOpen(true)
  }

  async function onEggClick(egg: ReturnType<typeof useEggStore.getState>['eggs'][number]) {
    if (egg.kind === 'dud') {
      collectEgg(egg.id)
      notify(DUD_LINES)
      return
    }

    if (egg.kind === 'medal') {
      collectEgg(egg.id)
      const { ok, awarded } = await award('medal', { eggId: egg.id })
      if (!ok) {
        setModalMsg('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.')
        setModalOpen(true)
        return
      }
      notify(awarded ? MEDAL_OK_LINES : MEDAL_DUP_LINES)
      return
    }

    if (egg.kind === 'special10') {
      const now = Date.now()
      const s = specialRef.current
      const required = egg.challenge?.clicks ?? 4
      const key = egg.challenge?.key ?? 'KeyG'
      const windowMs = egg.challenge?.windowMs ?? 1200

      if (!s || !s.activeEggId || s.activeEggId !== egg.id || now > s.deadline) {
        specialRef.current = {
          activeEggId: egg.id,
          count: 1,
          deadline: now + windowMs,
          keyDown: false,
          required,
          key,
        }
        setModalMsg(
          <>
            스페셜 도전 시작! <b>{key.replace('Key', '')}</b> 키를 누른 채 <b>{required - 1}회</b>{' '}
            더 클릭하면 메달 <b>10개</b>!
          </>,
        )
        setModalOpen(true)
        return
      }

      s.count += 1
      if (s.count >= s.required && s.keyDown && now <= s.deadline) {
        collectEgg(egg.id)
        const { ok, awarded } = await award('special10', { awardCode: egg.awardCode })
        specialRef.current = null
        if (!ok) {
          setModalMsg('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.')
          setModalOpen(true)
          return
        }
        notify(awarded ? SPEC_OK_LINES(egg.awardCode) : SPEC_DUP_LINES(egg.awardCode))
      } else if (now > s.deadline) {
        specialRef.current = null
        setModalMsg('시간 초과! 미션이 리셋됐어요. 다시 시도해보세요.')
        setModalOpen(true)
      }
    }
  }

  return (
    <>
      <div className={styles.easterEggContainer}>
        {eggs.map((egg) => (
          <button
            key={egg.id}
            className={styles.easterEgg}
            style={{ left: egg.x, top: egg.y }}
            data-secret={String(egg.attrs?.secret)}
            data-treasure={String(egg.attrs?.treasure)}
            data-fake={String(egg.attrs?.fake)}
            onClick={(e) => {
              e.preventDefault()
              onEggClick(egg)
            }}
            aria-label={`easter-egg-${egg.type}`}
          >
            <div className={`${styles.shape} ${pickShapeClass(egg.type)}`} />
          </button>
        ))}
      </div>

      <ConfirmModal
        open={modalOpen}
        onConfirm={() => setModalOpen(false)}
        message={modalMsg}
        confirmText="확인"
      />
    </>
  )
}

function pickShapeClass(type: 'normal' | 'secret' | 'treasure' | 'fake') {
  const pool =
    type === 'treasure'
      ? ['star', 'diamond']
      : type === 'secret'
        ? ['hex', 'circle', 'diamond']
        : type === 'fake'
          ? ['dot', 'square']
          : ['dot', 'triangle', 'square', 'cross', 'arrow', 'heart']
  const idx = Math.floor(Math.random() * pool.length)
  // @ts-ignore
  return (styles as any)[pool[idx]] ?? styles.dot
}
