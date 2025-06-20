import type { ReactNode } from 'react'
import { Noto_Sans_KR, JetBrains_Mono, Orbitron } from 'next/font/google'
import { AnimationProvider } from '@/contexts/AnimationContext'
import { ModalProvider } from '@/contexts/ModalContext'
import LayoutContent from '@/components/common/LayoutContent'

import './globals.scss'
import styles from '../components/common/LayoutContent.module.scss'

const monoFont = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const notoFont = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-title',
})

export const metadata = {
  title: 'Tech Crime Scene - YS',
  description: '기술 문제 해결 과정을 수사히는 것처럼 보여줍니다',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body
        className={`${styles.body} ${notoFont.variable} ${monoFont.variable} ${orbitron.variable}`}
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
