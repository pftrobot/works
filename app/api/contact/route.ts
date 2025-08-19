import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import crypto from 'crypto'

import { supabaseAdmin } from 'lib/supabaseAdmin'
import { contactSchema } from 'lib/validation'

const resend = new Resend(process.env.RESEND_API_KEY)

const COOKIE_KEY = 'visitor_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1y
const DAILY_LIMIT = 5

async function ensureVisitor() {
  const jar = await cookies()
  let id = jar.get(COOKIE_KEY)?.value
  if (!id) {
    id = crypto.randomUUID()
    await supabaseAdmin
      .from('visitors')
      .upsert({ id }, { onConflict: 'id', ignoreDuplicates: true })

    jar.set({
      name: COOKIE_KEY,
      value: id,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    })
  }
  return id
}

function todayRange() {
  const now = new Date()
  const offsetMs = 9 * 60 * 60 * 1000 // 9h
  const local = new Date(now.getTime() + offsetMs) // UTC+9 기준
  local.setUTCHours(0, 0, 0, 0)
  const start = new Date(local.getTime() - offsetMs)
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  return { start, end }
}

export async function POST(req: Request) {
  try {
    const visitorId = await ensureVisitor()

    const json = await req.json().catch(() => ({}))
    const parsed = contactSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
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
      return NextResponse.json({ ok: false, error: 'Server Error' }, { status: 500 })
    }

    if ((todayCount ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        { ok: false, code: 'LIMIT', remaining: 0, limit: DAILY_LIMIT },
        { status: 429 },
      )
    }

    const { data, error } = await resend.emails.send({
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

    if (error) {
      console.error('Resend Error::', error)
      return NextResponse.json({ ok: false, error: 'Send Failed' }, { status: 500 })
    }

    // 전송 로그 저장
    const { error: insertError } = await supabaseAdmin
      .from('contact_submissions')
      .insert({ visitor_id: visitorId, name, email, message })
    if (insertError) {
      // 이메일 전송은 성공, 전송 로그 저장이 실패 -> 사용자에게는 성공으로 응답
      console.error('Insert Error:: Contact::', insertError)
    }

    const used = (todayCount ?? 0) + 1
    const remaining = Math.max(DAILY_LIMIT - used, 0)

    return NextResponse.json({
      ok: true,
      id: data?.id,
      remaining,
      limit: DAILY_LIMIT,
    })
  } catch (e) {
    console.error('Exception Error:: Contact::', e)
    return NextResponse.json({ ok: false, error: 'Server Error' }, { status: 500 })
  }
}
