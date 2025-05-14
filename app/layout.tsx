import type { ReactNode } from 'react'
import './globals.scss'
import styles from './layout.module.scss'

import { JetBrains_Mono } from 'next/font/google'

const mono = JetBrains_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata = {
  title: 'Tech Crime Scene - YS',
  description: '기술 문제 해결 과정을 수사히는 것처럼 보여줍니다',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${styles.body} ${mono.variable}`}>
        <header className={styles.header}>
          <h1 className={styles.logo}>수사일지</h1>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>&copy; 2025 Yiseul Oh.</footer>
      </body>
    </html>
  )
}
