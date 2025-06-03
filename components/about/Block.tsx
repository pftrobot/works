'use client'

import { ReactNode } from 'react'
import { ScrollFadeInSection } from '@/hooks/useScrollFadeIn'

interface Props {
  title: string
  description: string
  children: ReactNode
}

export default function Block({ title, description, children }: Props) {
  return (
    <ScrollFadeInSection>
      <section>
        <h2>{title}</h2>
        <p>{description}</p>
        {children}
      </section>
    </ScrollFadeInSection>
  )
}
