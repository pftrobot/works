import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import crypto from 'crypto'

const COOKIE_KEY = 'visitor_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1y

async function ensureVisitor() {
  const jar = await cookies()
  let id = jar.get(COOKIE_KEY)?.value
  if (!id) {
    id = crypto.randomUUID()
    const { error } = await supabaseAdmin
      .from('visitors')
      .upsert({ id }, { onConflict: 'id', ignoreDuplicates: true })

    if (error) {
      console.error('Upsert Error:: Visitors:: ', error)
    }

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

export async function GET(req: Request) {
  const visitorId = await ensureVisitor()
  const { data, error } = await supabaseAdmin
    .from('medals')
    .select('id,type,source_id,awarded_at')
    .eq('visitor_id', visitorId)
    .order('awarded_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data ?? [], count: data?.length ?? 0 })
}

export async function POST(req: Request) {
  const visitorId = await ensureVisitor()
  const body = await req.json().catch(() => ({}))
  const { type, sourceId } = body as {
    type: 'case' | 'contact' | 'egg'
    sourceId?: string | number | null
  }

  if (!type) return NextResponse.json({ error: 'type required' }, { status: 400 })

  // 중복 삽입시 처리
  const { data, error } = await supabaseAdmin
    .from('medals')
    .insert({ visitor_id: visitorId, type, source_id: sourceId ?? null })
    .select('id,type,source_id,awarded_at')
    .single()

  if (error) {
    if ((error as any).code === '23505') {
      return NextResponse.json({ ok: true, duplicate: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, item: data })
}
