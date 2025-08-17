'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import classNames from 'classnames'

import { useAnimationContext } from 'contexts/AnimationContext'
import { useAddMedal } from 'utils/medalUtils'
import { MedalType } from 'types/medal'

import BasicButton from 'components/common/BasicButton'
import { TypingText } from 'components/common/TypingText'
import { FadeInView } from 'components/common/FadeInView'
import { StaggerList } from 'components/common/StaggerList'
import styles from './ContactMain.module.scss'

const TEXT_ITEMS = [
  <>전하고 싶은 이야기나 문의가 있다면 편하게 남겨 주세요.</>,
  <>내용을 확인하고 바로 응답드리겠습니다.</>,
]
export default function ContactMain() {
  const { setAnimationDone } = useAnimationContext()
  const { mutate: getMedal } = useAddMedal()

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
    getMedal({ type: MedalType.Contact })
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
            <form onSubmit={handleSubmit}>
              <FadeInView className={styles.inputGroup} delay={0.3}>
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
              </FadeInView>

              <FadeInView className={styles.inputGroup} delay={0.45}>
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
              </FadeInView>

              <FadeInView className={styles.inputGroup} delay={0.6}>
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
              </FadeInView>

              <FadeInView delay={0.75}>
                <BasicButton
                  variant="primary"
                  onClick={handleSubmit}
                  className={styles.submitButton}
                >
                  Send
                </BasicButton>
              </FadeInView>
            </form>
          </FadeInView>
        </motion.div>
      </motion.div>
    </section>
  )
}
