import { cookies } from 'next/headers'
import crypto from 'crypto'
import { supabaseAdmin } from 'lib/supabaseAdmin'

const COOKIE_KEY = 'visitor_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1y

export async function ensureVisitor() {
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
