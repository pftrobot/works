import { NextResponse } from 'next/server'
import { supabaseAdmin } from 'lib/supabaseAdmin'
import { ensureVisitor } from 'lib/visitors'

type Body =
  | { kind: 'medal'; route: string; eggId: string; amount?: number }
  | { kind: 'special10'; route: string; awardCode: string }

export async function POST(req: Request) {
  try {
    const visitorId = await ensureVisitor()
    const body = (await req.json().catch(() => ({}))) as Body

    if (body.kind === 'medal') {
      if (!body.route || !body.eggId) {
        return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
      }
      const amount = Math.max(1, body.amount ?? 1)

      const { error } = await supabaseAdmin.from('medal_events').insert({
        visitor_id: visitorId,
        type: 'egg',
        route: body.route,
        egg_id: body.eggId,
        amount,
      })

      if (error) {
        // unique 위반(이미 같은 알 적립)인 경우 23505
        if ((error as any).code === '23505') {
          return NextResponse.json({ ok: true, awarded: false, amount })
        }
        console.error('egg insert error:', error)
        return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 })
      }

      return NextResponse.json({ ok: true, awarded: true, amount })
    }

    if (body.kind === 'special10') {
      if (!body.route || !body.awardCode) {
        return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
      }

      const { error } = await supabaseAdmin.from('medal_events').insert({
        visitor_id: visitorId,
        type: 'special10',
        award_code: body.awardCode,
        amount: 10,
      })

      if (error) {
        if ((error as any).code === '23505') {
          return NextResponse.json({ ok: true, awarded: false, amount: 10 })
        }
        console.error('special10 insert error:', error)
        return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 })
      }

      return NextResponse.json({ ok: true, awarded: true, amount: 10 })
    }

    return NextResponse.json({ ok: false, error: 'Invalid kind' }, { status: 400 })
  } catch (e) {
    console.error('EE::award error', e)
    return NextResponse.json({ ok: false, error: 'Server Error' }, { status: 500 })
  }
}
