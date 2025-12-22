'use server'

import { supabaseAdmin } from 'lib/supabaseAdmin'
import { ensureVisitor } from 'lib/visitors'

export type CaseMedalState = {
  ok: boolean
  awarded?: boolean
  error?: string
}

/**
 * Case 퀴즈 정답 시 메달 적립
 * - 같은 case는 한 번만 적립 가능 (source_id + type으로 unique)
 */
export async function claimCaseMedal(caseId: string | number): Promise<CaseMedalState> {
  try {
    if (!caseId) {
      return { ok: false, error: 'Invalid caseId' }
    }

    const visitorId = await ensureVisitor()

    const { error } = await supabaseAdmin.from('medal_events').insert({
      visitor_id: visitorId,
      type: 'case',
      source_id: String(caseId),
      amount: 1,
    })

    if (error) {
      // unique 위반 (이미 적립됨) - 23505
      if ((error as any).code === '23505') {
        return { ok: true, awarded: false }
      }
      console.error('Case medal insert error:', error)
      return { ok: false, error: 'DB error' }
    }

    return { ok: true, awarded: true }
  } catch (e) {
    console.error('Exception Error:: claimCaseMedal::', e)
    return { ok: false, error: 'Server Error' }
  }
}
