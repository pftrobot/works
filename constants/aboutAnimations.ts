import { Variants } from 'framer-motion'

// 평행사변형 애니메이션 variants
export const parallelogramVariants = {
  main: {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  },
  small1: {
    hidden: { opacity: 0, x: 0 },
    visible: {
      opacity: 1,
      x: 5,
      transition: {
        delay: 0.2,
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },
  small2: {
    hidden: { opacity: 0, x: 4 },
    visible: {
      opacity: 1,
      x: 8,
      transition: {
        delay: 0.3,
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },
  small3: {
    hidden: { opacity: 0, x: 8 },
    visible: {
      opacity: 1,
      x: 12,
      transition: {
        delay: 0.4,
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },
} as const

// 바 라인 애니메이션 variants
export const barLineVariants: Variants = {
  hidden: { width: 0 },
  visible: { width: '100%' },
}

// 바 라인 transition
export const barLineTransition = {
  duration: 0.2,
  ease: 'easeOut' as const,
  delay: 0.1,
}

// 바 채우기 transition
export const barFillTransition = {
  duration: 0.1,
  ease: 'easeOut' as const,
  delay: 0.6,
}

// TECH 아이템 애니메이션 설정
export const techItemAnimation = {
  initial: { rotateY: 90, opacity: 0 },
  whileInView: { rotateY: 0, opacity: 1 },
  viewport: { once: true, amount: 0.2 },
}

// TECH 아이템별 트랜지션 생성
export const getTechItemTransition = (index: number) => ({
  duration: 0.6,
  ease: 'easeOut' as const,
  delay: index * 0.1,
})
