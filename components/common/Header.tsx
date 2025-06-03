'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconNotebook, IconFlask, IconUser, IconMail } from '@tabler/icons-react'
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
            <IconNotebook size={18} stroke={1.5} />
            <span>CASE</span>
          </Link>
          <Link href="/about" className={pathname === '/about' ? styles.active : undefined}>
            <IconUser size={18} stroke={1.5} />
            <span>PROFILE</span>
          </Link>
          <Link href="/contact" className={pathname === '/contact' ? styles.active : undefined}>
            <IconMail size={18} stroke={1.5} />
            <span>CONTACT</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
