'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import classNames from 'classnames'

import { useAnimationContext } from '@/contexts/AnimationContext'
import { addMedal } from '@/utils/medalUtils'
import { MedalType } from '@/types/medal'

import BasicButton from '@/components/common/BasicButton'
import { TypingText } from '@/components/common/TypingText'
import { FadeInSection } from '@/components/common/FadeInSection'
import styles from './ContactMain.module.scss'

export default function ContactMain() {
  const { setAnimationDone } = useAnimationContext()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: '',
  })

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validate = () => {
    const errors = {
      name: formData.name.trim() ? '' : '이름을 입력해주세요',
      email: formData.email.trim()
        ? isValidEmail(formData.email)
          ? ''
          : '올바른 이메일 형식이 아닙니다'
        : '이메일을 입력해주세요',
      message: formData.message.trim() ? '' : '내용을 입력해주세요',
    }

    setFormErrors(errors)
    return Object.values(errors).every((e) => e === '')
  }

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!validate()) return
    console.log('::: Form submitted:', formData)
    addMedal(MedalType.Contact)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  }

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationDone(true)
    }, 800)
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
              <TypingText text="Mission control " as="span" threshold={0.1} staggerDelay={0.02} />
              <TypingText
                text="online"
                as="span"
                className={styles.highlight}
                threshold={0.1}
                staggerDelay={0.02}
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

          <FadeInSection className={styles.description} delay={1.5} duration={0.6}>
            <p>
              전하고 싶은 이야기나 문의가 있다면 편하게 남겨 주세요. <br />
              내용을 확인하고 바로 응답드리겠습니다.
            </p>
          </FadeInSection>
        </motion.div>

        <motion.div variants={rightVariants} className={styles.rightSection}>
          <FadeInSection className={styles.form} delay={0.5}>
            <form onSubmit={handleSubmit}>
              <FadeInSection className={styles.inputGroup} delay={0.7}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name*"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={classNames(styles.input, {
                    [styles.error]: formErrors.name,
                  })}
                />
                {formErrors.name && <p className={styles.errorText}>{formErrors.name}</p>}
              </FadeInSection>

              <FadeInSection className={styles.inputGroup} delay={0.9}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={classNames(styles.input, {
                    [styles.error]: formErrors.email,
                  })}
                />
                {formErrors.email && <p className={styles.errorText}>{formErrors.email}</p>}
              </FadeInSection>

              <FadeInSection className={styles.inputGroup} delay={1.1}>
                <textarea
                  name="message"
                  placeholder="Project Information*"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={classNames(styles.textarea, {
                    [styles.error]: formErrors.message,
                  })}
                  rows={6}
                />
                {formErrors.message && <p className={styles.errorText}>{formErrors.message}</p>}
              </FadeInSection>

              <FadeInSection delay={1.3}>
                <BasicButton
                  variant="primary"
                  onClick={handleSubmit}
                  className={styles.submitButton}
                >
                  Send
                </BasicButton>
              </FadeInSection>
            </form>
          </FadeInSection>
        </motion.div>
      </motion.div>
    </section>
  )
}
