import { NextResponse } from 'next/server'
import { supabaseAdmin } from 'lib/supabaseAdmin'
import { ensureVisitor } from 'lib/visitors'

export async function GET() {
  const visitorId = await ensureVisitor()

  const { data, error } = await supabaseAdmin
    .from('medal_events')
    .select('id,type,source_id,route,egg_id,award_code,amount,created_at')
    .eq('visitor_id', visitorId)
    .order('created_at', { ascending: false })

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
