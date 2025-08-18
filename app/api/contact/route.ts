import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactSchema } from 'lib/validation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}))
    const parsed = contactSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
    }
    const { name, email, message } = parsed.data

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

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (e) {
    console.error('Exception Error:: Contact::', e)
    return NextResponse.json({ ok: false, error: 'Server Error' }, { status: 500 })
  }
}
