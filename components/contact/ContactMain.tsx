'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

import { useAnimationContext } from '@/contexts/AnimationContext'
import { addMedal } from '@/utils/medalUtils'
import { MedalType } from '@/types/medal'

import BasicButton from '@/components/common/BasicButton'
import styles from './ContactMain.module.scss'

export default function ContactMain() {
  const { setAnimationDone } = useAnimationContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
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
        className={styles.content}
      >
        <motion.div variants={leftVariants} className={styles.leftSection}>
          <div className={styles.heroText}>
            <h1 className={styles.mainTitle}>
              Mission control <span className={styles.highlight}>online</span>.
              <br />
              Awaiting your coordinates.
            </h1>
          </div>

          <div className={styles.description}>
            <p>
              전하고 싶은 이야기나 문의가 있다면 편하게 남겨 주세요. <br />
              내용을 확인하고 바로 응답드리겠습니다.
            </p>
          </div>
        </motion.div>

        <motion.div variants={rightVariants} className={styles.rightSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="Name*"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <textarea
                name="message"
                placeholder="Project Information*"
                value={formData.message}
                onChange={handleInputChange}
                className={styles.textarea}
                rows={6}
                required
              />
            </div>

            <BasicButton
              variant="primary"
              onClick={(e) => handleSubmit(e)}
              className={styles.submitButton}
            >
              Send
            </BasicButton>
          </form>
        </motion.div>
      </motion.div>
    </section>
  )
}
