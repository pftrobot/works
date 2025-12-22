'use server'

import { Resend } from 'resend'
import { supabaseAdmin } from 'lib/supabaseAdmin'
import { contactSchema } from 'lib/validation'
import { ensureVisitor } from 'lib/visitors'

const resend = new Resend(process.env.RESEND_API_KEY)
const DAILY_LIMIT = 5

export type ContactState = {
  ok: boolean
  code?: 'VALIDATION' | 'LIMIT' | 'SEND_FAILED' | 'SERVER_ERROR'
  errors?: { name?: string; email?: string; message?: string }
  values?: { name: string; email: string; message: string } // 추가
  remaining?: number
}

function todayRange() {
  const now = new Date()
  const offsetMs = 9 * 60 * 60 * 1000 // 9h
  const local = new Date(now.getTime() + offsetMs) // UTC+9 (KST)
  local.setUTCHours(0, 0, 0, 0)
  const start = new Date(local.getTime() - offsetMs)
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  return { start, end }
}

export async function submitContact(
  _prevState: ContactState | null,
  formData: FormData,
): Promise<ContactState> {
  // 입력값 추출
  const values = {
    name: (formData.get('name') as string) ?? '',
    email: (formData.get('email') as string) ?? '',
    message: (formData.get('message') as string) ?? '',
  }

  try {
    const visitorId = await ensureVisitor()

    // 폼 데이터 검증
    const parsed = contactSchema.safeParse(values)

    if (!parsed.success) {
      const errors: ContactState['errors'] = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof typeof errors
        if (!errors[field]) errors[field] = issue.message
      }
      return { ok: false, code: 'VALIDATION', errors, values }
    }

    const { name, email, message } = parsed.data

    // 오늘 전송 횟수 확인
    const { start, end } = todayRange()
    const { count: todayCount, error: countError } = await supabaseAdmin
      .from('contact_submissions')
      .select('id', { head: true, count: 'exact' })
      .eq('visitor_id', visitorId)
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString())

    if (countError) {
      console.error('Count Error:: Contact::', countError)
      return { ok: false, code: 'SERVER_ERROR', values }
    }

    if ((todayCount ?? 0) >= DAILY_LIMIT) {
      return { ok: false, code: 'LIMIT', remaining: 0, values }
    }

    // 이메일 전송
    const { error: sendError } = await resend.emails.send({
      from: process.env.CONTACT_FROM!,
      to: process.env.CONTACT_TO!,
      subject: `[CONTACT] ${name} 님의 문의`,
      replyTo: email,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Time: ${new Date().toISOString()}`,
        '',
        message,
      ].join('\n'),
    })

    if (sendError) {
      console.error('Resend Error::', sendError)
      return { ok: false, code: 'SEND_FAILED', values }
    }

    // 전송 로그 저장
    const { error: insertError } = await supabaseAdmin
      .from('contact_submissions')
      .insert({ visitor_id: visitorId, name, email, message })

    if (insertError) {
      // 이메일 전송은 성공, 전송 로그 저장이 실패 -> 사용자에게는 성공으로 응답
      console.error('Insert Error:: Contact::', insertError)
    }

    // Medal 적립
    const { error: medalError } = await supabaseAdmin.from('medal_events').insert({
      visitor_id: visitorId,
      type: 'contact',
      amount: 3,
    })

    if (medalError) {
      console.error('Medal Error:: Contact::', medalError)
    }

    const used = (todayCount ?? 0) + 1
    const remaining = Math.max(DAILY_LIMIT - used, 0)

    return { ok: true, remaining } // 성공 시 폼 리셋
  } catch (e) {
    console.error('Exception Error:: Contact::', e)
    return { ok: false, code: 'SERVER_ERROR', values }
  }
}
