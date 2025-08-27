'use client'

import { useEffect, useRef } from 'react'
import type { JSX } from 'react'
import { useEggStore } from 'stores/easterEggStore'
type Props = {
  id: string
  baseDensity?: number
  as?: keyof JSX.IntrinsicElements
  className?: string
  children?: React.ReactNode
}

export default function EggField({ id, baseDensity = 1, as = 'div', className, children }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const registerField = useEggStore((s) => s.registerField)
  const updateFieldRect = useEggStore((s) => s.updateFieldRect)
  const unregisterField = useEggStore((s) => s.unregisterField)

  useEffect(() => {
    registerField({ id, baseDensity })
    const el = ref.current!
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      updateFieldRect(id, {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      })
    })
    ro.observe(el)

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      updateFieldRect(id, {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    onScroll()

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      unregisterField(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, baseDensity])

  const Comp = as as any
  return (
    <Comp ref={ref} className={className} data-egg-field={id}>
      {children}
    </Comp>
  )
}
