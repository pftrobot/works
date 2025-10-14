'use client'

import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import classNames from 'classnames'

import { useAnimationContext } from 'contexts/AnimationContext'
import { validateContact, ContactForm } from 'lib/validation'
import { useAddMedal } from 'utils/medalUtils'
import { MedalType, APIResponse } from 'types'
import { containerVariants, leftVariants, rightVariants } from '@constants'

import BasicButton from 'components/common/BasicButton'
import { TypingText } from 'components/common/TypingText'
import { FadeInView } from 'components/common/FadeInView'
import { StaggerList } from 'components/common/StaggerList'
import ConfirmModal from 'components/common/ConfirmModal'
import styles from './ContactMain.module.scss'

const TEXT_ITEMS = [
  <>전하고 싶은 이야기나 문의가 있다면 편하게 남겨 주세요.</>,
  <>내용을 확인하고 바로 응답드리겠습니다.</>,
]
export default function ContactMain() {
  const { setAnimationDone } = useAnimationContext()
  const { mutate: getMedal } = useAddMedal()

  const [formData, setFormData] = useState<ContactForm>({ name: '', email: '', message: '' })
  const [formErrors, setFormErrors] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState<null | APIResponse>(null)
  const [serverError, setServerError] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [limitModalOpen, setLimitModalOpen] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setServerError('')
    setSent(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const validation = validateContact(formData)
    setFormErrors(validation.errors)
    if (!validation.ok) return

    try {
      setSubmitting(true)
      setServerError('')
      setSent(null)

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(validation.data),
      })

      const json = await res.json().catch(() => ({}))

      if (res.status === 429 || json?.code === 'LIMIT') {
        setRemaining(0)
        setSent(APIResponse.FAIL)
        setServerError('하루 전송 한도를 초과했습니다. 내일 다시 시도해주세요.')
        return
      }

      if (!res.ok || !json?.ok) {
        setSent(APIResponse.FAIL)
        setServerError('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
        return
      }

      setSent(APIResponse.OK)
      getMedal({ type: MedalType.Contact, amount: 3 })

      // 잔여 전송 가능 횟수
      const canSubmit = typeof json?.remaining === 'number' ? json.remaining : null
      setRemaining(canSubmit)

      if (canSubmit === 1) {
        setLimitModalOpen(true)
      }

      setFormData({ name: '', email: '', message: '' })
      setFormErrors({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('Post Error:: Contact email:: ', err)
      setSent(APIResponse.FAIL)
      setServerError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const exceededToday = remaining === 0

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, 700)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  return (
    <section className={styles.contactWrap}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className={styles.inner}
      >
        <motion.div variants={leftVariants} className={styles.leftSection}>
          <div className={styles.heroText}>
            <h1 className={styles.mainTitle}>
              <TypingText text="Mission control " as="span" threshold={0.1} staggerDelay={0.04} />
              <TypingText
                text="online"
                as="span"
                className={styles.highlight}
                threshold={0.1}
                staggerDelay={0.02}
                delay={0.6}
              />
              <TypingText text="." as="span" threshold={0.1} staggerDelay={0.02} />
              <br />
              <TypingText
                text="Awaiting your coordinates."
                as="span"
                threshold={0.1}
                staggerDelay={0.02}
              />
            </h1>
          </div>

          <StaggerList
            items={TEXT_ITEMS}
            as="div"
            threshold={0.3}
            staggerDelay={0.15}
            itemDuration={0.5}
            delayChildren={0.4}
          />
        </motion.div>

        <motion.div variants={rightVariants} className={styles.rightSection}>
          <FadeInView className={styles.form}>
            <form onSubmit={handleSubmit} noValidate aria-labelledby="contact-form-title">
              <h2 id="contact-form-title" className="sr-only">
                Contact Form
              </h2>

              <div aria-live="polite">
                {serverError && <p className={styles.errorText}>{serverError}</p>}
                {sent === APIResponse.OK && (
                  <p className={styles.successText}>메시지가 전송되었습니다!</p>
                )}
                {typeof remaining === 'number' && remaining > 0 && sent === APIResponse.OK && (
                  <p className={styles.infoText}>오늘 남은 전송 횟수: {remaining}회</p>
                )}
              </div>

              <FadeInView className={styles.inputGroup} delay={0.3}>
                <label htmlFor="contact-name" className="sr-only">
                  이름
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Name*"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: !!formErrors.name })}
                  aria-invalid={!!formErrors.name}
                  aria-describedby="error-name"
                  required
                />
                {formErrors.name && (
                  <p id="error-name" className={styles.errorText}>
                    {formErrors.name}
                  </p>
                )}
              </FadeInView>

              <FadeInView className={styles.inputGroup} delay={0.45}>
                <label htmlFor="contact-email" className="sr-only">
                  이메일
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={classNames(styles.input, { [styles.error]: !!formErrors.email })}
                  aria-invalid={!!formErrors.email}
                  aria-describedby="error-email"
                  required
                />
                {formErrors.email && (
                  <p id="error-email" className={styles.errorText}>
                    {formErrors.email}
                  </p>
                )}
              </FadeInView>

              <FadeInView className={styles.inputGroup} delay={0.6}>
                <label htmlFor="contact-message" className="sr-only">
                  메시지
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Project Information*"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={classNames(styles.textarea, { [styles.error]: !!formErrors.message })}
                  rows={6}
                  aria-invalid={!!formErrors.message}
                  aria-describedby="error-message"
                  required
                />
                {formErrors.message && (
                  <p id="error-message" className={styles.errorText}>
                    {formErrors.message}
                  </p>
                )}
              </FadeInView>

              <FadeInView delay={0.75}>
                <BasicButton
                  variant="primary"
                  type="submit"
                  disabled={submitting || exceededToday}
                  className={styles.submitButton}
                >
                  {submitting ? 'Sending...' : exceededToday ? 'Limit reached' : 'Send'}
                </BasicButton>
              </FadeInView>
            </form>
          </FadeInView>
        </motion.div>
      </motion.div>

      <ConfirmModal
        open={limitModalOpen}
        onConfirm={() => setLimitModalOpen(false)}
        onCancel={() => setLimitModalOpen(false)}
        message={
          <>
            오늘 전송할 수 있는 횟수가 <strong>한 번</strong> 남았습니다.
          </>
        }
      />
    </section>
  )
}
