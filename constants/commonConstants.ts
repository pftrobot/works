export const MENU = {
  LIST: '/case',
  ABOUT: '/about',
  CONTACT: '/contact',
  MEDAL: '/medal',
}

/* Header */
export const TOP_STICKY = 20 // 이 값 이하면 항상 표시
export const DELTA_SKIP = 20 // 미세 스크롤 무시
export const HIDE_AFTER = 100 // 충분히 내려간 후에만 숨김

/* Easing */
export const EASE_LINEAR = [0, 0, 1, 1] as const
export const EASE_OUT = [0, 0, 0.58, 1] as const
export const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const
