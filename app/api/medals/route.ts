import { NextResponse } from 'next/server'
import { supabaseAdmin } from 'lib/supabaseAdmin'
import { ensureVisitor } from 'lib/visitors'

export async function GET() {
  const visitorId = await ensureVisitor()

  const { data, error } = await supabaseAdmin
    .from('medal_events')
    .select('id,type,source_id,route,egg_id,award_code,amount,created_at')
    .eq('visitor_id', visitorId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const items =
    (data ?? []).map((r) => ({
      id: r.id,
      type: r.type as 'case' | 'contact' | 'egg' | 'special10',
      source_id: r.source_id,
      route: r.route,
      egg_id: r.egg_id,
      award_code: r.award_code,
      amount: r.amount ?? 1,
      awarded_at: r.created_at as string,
    })) ?? []

  const count = items.reduce((acc, it) => acc + (it.amount ?? 1), 0)

  return NextResponse.json({ items, count })
}

export async function POST(req: Request) {
  const visitorId = await ensureVisitor()
  const body = await req.json().catch(() => ({}))
  const { type, sourceId, amount } = body as {
    type: 'case' | 'contact' | 'egg' | 'special10'
    sourceId?: string | number | null
    amount?: number
  }

  if (!type) return NextResponse.json({ error: 'type required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('medal_events')
    .insert({
      visitor_id: visitorId,
      type,
      source_id: sourceId != null ? String(sourceId) : null,
      amount: Math.max(1, Number.isFinite(amount) ? Number(amount) : 1),
    })
    .select('id,type,source_id,amount,created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, item: data })
}
