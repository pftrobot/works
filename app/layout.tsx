import type { ReactNode } from 'react'
import { JetBrains_Mono, Orbitron } from 'next/font/google'
import localFont from 'next/font/local'

import { AnimationProvider } from '@/contexts/AnimationContext'
import { ModalProvider } from '@/contexts/ModalContext'
import LayoutContent from '@/components/common/LayoutContent'

import './globals.scss'
import styles from '@/components/common/LayoutContent.module.scss'

const monoFont = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-title',
})

const pretendard = localFont({
  src: '../public/fonts/Pretendard.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-body',
})

export const metadata = {
  title: 'Tech Crime Scene - YS',
  description: '기술 문제 해결 과정을 수사히는 것처럼 보여줍니다',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body
        className={`${styles.body} ${pretendard.variable} ${monoFont.variable} ${orbitron.variable}`}
      >
        <ModalProvider>
          <AnimationProvider>
            <LayoutContent>{children}</LayoutContent>
          </AnimationProvider>
        </ModalProvider>
      </body>
    </html>
  )
}
