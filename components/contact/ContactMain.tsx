'use client'

import { useEffect, useRef, useActionState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import classNames from 'classnames'

import { useAnimationContext } from 'contexts/AnimationContext'
import { submitContact, ContactState } from 'actions/contact'
import { medalsKeys } from 'utils/medalUtils'
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

const initialState: ContactState = { ok: false }

export default function ContactMain() {
  const { setAnimationDone } = useAnimationContext()
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, isPending] = useActionState(submitContact, initialState)

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // 전송 성공 시 처리
  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset()
      queryClient.invalidateQueries({ queryKey: medalsKeys.all })
    }
  }, [state, queryClient])

  // 애니메이션 완료 처리
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, 700)
    return () => clearTimeout(timeout)
  }, [setAnimationDone])

  const exceededToday = state.code === 'LIMIT'
  const showLimitModal = state.ok && state.remaining === 1

  const getErrorMessage = () => {
    switch (state.code) {
      case 'LIMIT':
        return '하루 전송 한도를 초과했습니다. 내일 다시 시도해주세요.'
      case 'SEND_FAILED':
        return '전송에 실패했습니다. 잠시 후 다시 시도해주세요.'
      case 'SERVER_ERROR':
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      default:
        return ''
    }
  }

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
            <form ref={formRef} action={formAction} noValidate aria-labelledby="contact-form-title">
              <h2 id="contact-form-title" className="sr-only">
                Contact Form
              </h2>

              <div aria-live="polite">
                {getErrorMessage() && <p className={styles.errorText}>{getErrorMessage()}</p>}
                {state.ok && <p className={styles.successText}>메시지가 전송되었습니다!</p>}
                {state.ok && typeof state.remaining === 'number' && state.remaining > 0 && (
                  <p className={styles.infoText}>오늘 남은 전송 횟수: {state.remaining}회</p>
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
                  defaultValue={state.values?.name ?? ''}
                  key={`name-${state.ok}`} // 성공시 리셋
                  className={classNames(styles.input, { [styles.error]: !!state.errors?.name })}
                  aria-invalid={!!state.errors?.name}
                  aria-describedby="error-name"
                  required
                />
                {state.errors?.name && (
                  <p id="error-name" className={styles.errorText}>
                    {state.errors.name}
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
                  defaultValue={state.values?.email ?? ''}
                  key={`email-${state.ok}`}
                  className={classNames(styles.input, { [styles.error]: !!state.errors?.email })}
                  aria-invalid={!!state.errors?.email}
                  aria-describedby="error-email"
                  required
                />
                {state.errors?.email && (
                  <p id="error-email" className={styles.errorText}>
                    {state.errors.email}
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
                  defaultValue={state.values?.message ?? ''}
                  key={`message-${state.ok}`}
                  className={classNames(styles.textarea, {
                    [styles.error]: !!state.errors?.message,
                  })}
                  rows={6}
                  aria-invalid={!!state.errors?.message}
                  aria-describedby="error-message"
                  required
                />
                {state.errors?.message && (
                  <p id="error-message" className={styles.errorText}>
                    {state.errors.message}
                  </p>
                )}
              </FadeInView>

              <FadeInView delay={0.75}>
                <BasicButton
                  variant="primary"
                  type="submit"
                  disabled={isPending || exceededToday}
                  className={styles.submitButton}
                >
                  {isPending ? 'Sending...' : exceededToday ? 'Limit reached' : 'Send'}
                </BasicButton>
              </FadeInView>
            </form>
          </FadeInView>
        </motion.div>
      </motion.div>

      <ConfirmModal
        open={showLimitModal}
        message={
          <>
            오늘 전송할 수 있는 횟수가 <strong>한 번</strong> 남았습니다.
          </>
        }
      />
    </section>
  )
}
