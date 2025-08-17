'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconFingerprint, IconUser, IconMessageCircle, IconAward } from '@tabler/icons-react'

import { MENU } from '@constants'

import styles from './Header.module.scss'

const { LIST, ABOUT, CONTACT, MEDAL } = MENU
export default function Header() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          WhoPushed
        </Link>

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
      </div>
    </header>
  )
}
