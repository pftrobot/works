'use server'

import { supabaseAdmin } from 'lib/supabaseAdmin'
import { ensureVisitor } from 'lib/visitors'

export type EggMedalState = {
  ok: boolean
  awarded?: boolean
  amount?: number
  error?: string
}

export type SpecialMedalState = {
  ok: boolean
  awarded?: boolean
  amount?: number
  error?: string
}

/**
 * 일반 Easter Egg 메달 적립
 * - 같은 egg는 한 번만 적립 가능 (unique 제약)
 */
export async function claimEggMedal(
  route: string,
  eggId: string,
  amount: number = 1,
): Promise<EggMedalState> {
  try {
    if (!route || !eggId) {
      return { ok: false, error: 'Invalid payload' }
    }

    const visitorId = await ensureVisitor()
    const finalAmount = Math.max(1, amount)

    const { error } = await supabaseAdmin.from('medal_events').insert({
      visitor_id: visitorId,
      type: 'egg',
      route,
      egg_id: eggId,
      amount: finalAmount,
    })

    if (error) {
      // unique 위반 (이미 같은 알 적립) - 23505
      if ((error as any).code === '23505') {
        return { ok: true, awarded: false, amount: finalAmount }
      }
      console.error('Egg insert error:', error)
      return { ok: false, error: 'DB error' }
    }

    return { ok: true, awarded: true, amount: finalAmount }
  } catch (e) {
    console.error('Exception Error:: claimEggMedal::', e)
    return { ok: false, error: 'Server Error' }
  }
}

/**
 * 스페셜 메달 적립 (10 메달)
 * - 같은 award_code는 한 번만 적립 가능 (unique 제약)
 */
export async function claimSpecialMedal(
  route: string,
  awardCode: string,
): Promise<SpecialMedalState> {
  try {
    if (!route || !awardCode) {
      return { ok: false, error: 'Invalid payload' }
    }

    const visitorId = await ensureVisitor()

    const { error } = await supabaseAdmin.from('medal_events').insert({
      visitor_id: visitorId,
      type: 'special10',
      route,
      award_code: awardCode,
      amount: 10,
    })

    if (error) {
      // unique 위반 (이미 같은 스페셜 적립) - 23505
      if ((error as any).code === '23505') {
        return { ok: true, awarded: false, amount: 10 }
      }
      console.error('Special10 insert error:', error)
      return { ok: false, error: 'DB error' }
    }

    return { ok: true, awarded: true, amount: 10 }
  } catch (e) {
    console.error('Exception Error:: claimSpecialMedal::', e)
    return { ok: false, error: 'Server Error' }
  }
}
