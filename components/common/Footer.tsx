'use client'

import { useState } from 'react'
import Link from 'next/link'

import { MENU } from '@constants'

import GuideModal from './GuideModal'
import styles from './Footer.module.scss'

const { ABOUT, CONTACT } = MENU
const Footer = () => {
  const [openGuide, setOpenGuide] = useState(false)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.text}>&copy; 2025 Yiseul Oh. 기술 수사는 끝나지 않습니다.</p>
        <nav className={styles.links}>
          <Link href={ABOUT}>프로파일</Link>
          <Link href={CONTACT}>제보</Link>
          <button onClick={() => setOpenGuide(true)} className={styles.guideBtn}>
            관람가이드
          </button>
          <Link href="https://github.com/pftrobot" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
        </nav>
      </div>

      <GuideModal open={openGuide} onClose={() => setOpenGuide(false)} />
    </footer>
  )
}

export default Footer
