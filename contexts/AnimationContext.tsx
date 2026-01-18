'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AnimationContextValue {
  animationDone: boolean
  setAnimationDone: (done: boolean) => void
  hasSeenIntro: boolean
  setHasSeenIntro: (v: boolean) => void
  guideNoticeVisible: boolean
  setGuideNoticeVisible: (visible: boolean) => void
  guideNoticeReady: boolean
  setGuideNoticeReady: (ready: boolean) => void
}

const AnimationContext = createContext<AnimationContextValue | null>(null)

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [animationDone, setAnimationDone] = useState(false)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)
  const [guideNoticeVisible, setGuideNoticeVisible] = useState(true)
  const [guideNoticeReady, setGuideNoticeReady] = useState(false)

  return (
    <AnimationContext.Provider
      value={{
        animationDone,
        setAnimationDone,
        hasSeenIntro,
        setHasSeenIntro,
        guideNoticeVisible,
        setGuideNoticeVisible,
        guideNoticeReady,
        setGuideNoticeReady,
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}

export const useAnimationContext = () => {
  const ctx = useContext(AnimationContext)
  if (!ctx) throw new Error('AnimationContext not found')
  return ctx
}
