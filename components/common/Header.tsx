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
            <span>사건기록</span>
          </Link>
          <Link href="/lab" className={pathname.startsWith('/lab') ? styles.active : undefined}>
            <IconFlask size={18} stroke={1.5} />
            <span>실험실</span>
          </Link>
          <Link href="/about" className={pathname === '/about' ? styles.active : undefined}>
            <IconUser size={18} stroke={1.5} />
            <span>프로파일</span>
          </Link>
          <Link href="/contact" className={pathname === '/contact' ? styles.active : undefined}>
            <IconMail size={18} stroke={1.5} />
            <span>제보</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
