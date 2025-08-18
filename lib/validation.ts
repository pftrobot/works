import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해주세요'),
  email: z.string().trim().email('올바른 이메일 형식이 아닙니다'),
  message: z.string().trim().min(1, '내용을 입력해주세요'),
})

export type ContactForm = z.infer<typeof contactSchema>

export function validateContact(form: ContactForm) {
  const result = contactSchema.safeParse(form)
  if (result.success)
    return { ok: true as const, data: result.data, errors: { name: '', email: '', message: '' } }

  const e = { name: '', email: '', message: '' } as Record<keyof ContactForm, string>
  for (const issue of result.error.issues) {
    const path = issue.path[0] as keyof ContactForm
    if (!e[path]) e[path] = issue.message
  }
  return { ok: false as const, errors: e }
}
