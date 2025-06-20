'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconFileText, IconUser, IconMessageCircle, IconAward } from '@tabler/icons-react'

import styles from './Header.module.scss'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          WhoPushed
        </Link>

        <nav className={styles.nav}>
          <Link href="/case" className={pathname.startsWith('/case') ? styles.active : undefined}>
            <IconFileText size={18} className={styles.icon} />
            <span className={styles.label}>CASE</span>
          </Link>
          <Link href="/about" className={pathname === '/about' ? styles.active : undefined}>
            <IconUser size={18} className={styles.icon} />
            <span className={styles.label}>PROFILE</span>
          </Link>
          <Link href="/contact" className={pathname === '/contact' ? styles.active : undefined}>
            <IconMessageCircle size={18} className={styles.icon} />
            <span className={styles.label}>CONTACT</span>
          </Link>
          <Link href="/medal" className={pathname === '/medal' ? styles.active : undefined}>
            <IconAward size={18} className={styles.icon} />
            <span className={styles.label}>MEDAL</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
