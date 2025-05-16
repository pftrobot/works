import type { ReactNode } from 'react'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import './globals.scss'
import styles from './layout.module.scss'

import { JetBrains_Mono } from 'next/font/google'

const mono = JetBrains_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata = {
  title: 'Tech Crime Scene - YS',
  description: '기술 문제 해결 과정을 수사히는 것처럼 보여줍니다',
}

interface RootLayoutProps {
  children: ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className={`${styles.body} ${mono.variable}`}>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
