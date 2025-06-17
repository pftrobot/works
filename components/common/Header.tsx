'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
            <span>CASE</span>
          </Link>
          <Link href="/about" className={pathname === '/about' ? styles.active : undefined}>
            <span>PROFILE</span>
          </Link>
          <Link href="/contact" className={pathname === '/contact' ? styles.active : undefined}>
            <span>CONTACT</span>
          </Link>
          <Link href="/medal" className={pathname === '/medal' ? styles.active : undefined}>
            <span>MEDAL</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
