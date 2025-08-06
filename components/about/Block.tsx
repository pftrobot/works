'use client'

import { ReactNode } from 'react'
import { ScrollFadeInSection } from 'hooks/useScrollFadeIn'

interface Props {
  title: string
  subtitle?: string
  description: string
  children: ReactNode
}

export default function Block({ title, subtitle, description, children }: Props) {
  return (
    <ScrollFadeInSection>
      <section>
        <h2>
          {title}
          {subtitle && <span>{subtitle}</span>}
        </h2>
        <p>{description}</p>
        {children}
      </section>
    </ScrollFadeInSection>
  )
}
