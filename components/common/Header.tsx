'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconFingerprint, IconUser, IconMessageCircle, IconAward } from '@tabler/icons-react'

import { MENU } from '@constants'
import { useAnimationContext } from 'contexts/AnimationContext'

import styles from './Header.module.scss'

const { LIST, ABOUT, CONTACT, MEDAL } = MENU
const DOWNLOAD_TIP_DURATION = 3500
export default function Header() {
  const pathname = usePathname()
  const { guideNoticeReady } = useAnimationContext()
  const [downloadTipVisible, setDownloadTipVisible] = useState(false)

  const showDownloadTip = pathname === '/' && downloadTipVisible

  useEffect(() => {
    if (pathname !== '/' || !guideNoticeReady) {
      setDownloadTipVisible(false)
      return
    }

    setDownloadTipVisible(true)
    const timeout = setTimeout(() => setDownloadTipVisible(false), DOWNLOAD_TIP_DURATION)
    return () => clearTimeout(timeout)
  }, [pathname, guideNoticeReady])

  return (
    <header className={styles.header} data-fixed-element>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          WhoPushed
        </Link>

        <div className={styles.navGroup}>
          <nav className={styles.nav}>
            <Link href={LIST} className={pathname.startsWith(LIST) ? styles.active : undefined}>
              <IconFingerprint size={18} className={styles.icon} />
              <span className={styles.label}>CASE</span>
            </Link>
            <Link href={ABOUT} className={pathname === ABOUT ? styles.active : undefined}>
              <IconUser size={18} className={styles.icon} />
              <span className={styles.label}>PROFILE</span>
            </Link>
            <Link href={CONTACT} className={pathname === CONTACT ? styles.active : undefined}>
              <IconMessageCircle size={18} className={styles.icon} />
              <span className={styles.label}>CONTACT</span>
            </Link>
            <Link href={MEDAL} className={pathname === MEDAL ? styles.active : undefined}>
              <IconAward size={18} className={styles.icon} />
              <span className={styles.label}>MEDAL</span>
            </Link>
          </nav>
          <div className={styles.downloadWrap}>
            <a
              href="/files/portfolio_ohyiseul.pdf"
              download="ohyiseul_portfolio.pdf"
              className={styles.downloadBtn}
              aria-label="포트폴리오 PDF 다운로드"
            >
              PDF
            </a>
          </div>
        </div>
      </div>
      <div className={styles.tipRow}>
        <span className={styles.downloadTip} data-visible={showDownloadTip}>
          설명 파일을 참고해보세요
        </span>
      </div>
    </header>
  )
}
