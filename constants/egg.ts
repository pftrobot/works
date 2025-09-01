export const CYCLE_TTL_MS = 10 * 60 * 1000 // 10m
export const FIELD_ID = '__main__'
export const BASE_DENSITY = 1

export const MESSAGE_LINES = {
  DUD: [
    '휙— 아무 일도 일어나지 않았다.',
    '모조 알이었습니다. 증거 불충분!',
    '빈 탄창… 다음 단서를 노려보세요.',
    '범인은 현장에 없었다… (꽝)',
  ],
  MEDAL_OK: [
    '메달 1개 획득! 기록부에 반영했어요.',
    '빙고! 메달 +1 적립 완료.',
    '단서 확보! 메달 1개가 추가됐습니다.',
  ],
  MEDAL_DUP: [
    '이미 채증한 단서예요. 중복 적립은 안 돼요.',
    '이미 수집한 흔적입니다. 다음 단서를 찾아볼까요?',
  ],
}

export const SPEC_OK_LINES = (code?: string) => [
  `스페셜(${code ?? 'SECRET'}) 성공! 메달 +10 적립 완료.`,
  `히든 도전 클리어! 메달 10개가 들어왔습니다.`,
]

export const SPEC_DUP_LINES = (code?: string) => [
  `해당 스페셜(${code ?? 'SECRET'})은 이미 적립했어요.`,
  '스페셜 중복 적립은 불가합니다. 다음 비밀을 노려보세요!',
]

export const SHAPE_POOLS = {
  treasure: ['star', 'diamond'],
  secret: ['hex', 'circle', 'diamond'],
  fake: ['dot', 'square'],
  normal: ['dot', 'triangle', 'square', 'cross', 'arrow', 'heart'],
} as const

// 스페셜 챌린지 패턴 정의
export const SPECIAL_CHALLENGES = [
  { code: 'TEN_Gx4_1p2s', challenge: { type: 'keyhold', key: 'KeyG', clicks: 4, windowMs: 1200 } },
  { code: 'TEN_Ux3_0p9s', challenge: { type: 'keyhold', key: 'KeyU', clicks: 3, windowMs: 900 } },
  { code: 'TEN_Rx5_1p5s', challenge: { type: 'keyhold', key: 'KeyR', clicks: 5, windowMs: 1500 } },
  {
    code: 'KONAMI_CODE',
    challenge: {
      type: 'sequence',
      keys: [
        'ArrowUp',
        'ArrowUp',
        'ArrowDown',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowLeft',
        'ArrowRight',
        'KeyB',
        'KeyA',
      ],
      windowMs: 10000,
    },
  },
  {
    code: 'SECRET_COMBO',
    challenge: { type: 'combo', keys: ['ControlLeft', 'ShiftLeft', 'Slash'], windowMs: 1000 },
  },
  { code: 'TYPE_EASTER', challenge: { type: 'typing', word: 'EASTER', windowMs: 5000 } },
  {
    code: 'ARROW_DANCE',
    challenge: {
      type: 'sequence',
      keys: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'],
      repeat: 3,
      windowMs: 4000,
    },
  },
  {
    code: 'NUMBER_SEQ',
    challenge: { type: 'sequence', keys: ['Digit1', 'Digit2', 'Digit3', 'Digit4'], windowMs: 3000 },
  },
  { code: 'SPACE_CADET', challenge: { type: 'rapidkey', key: 'Space', count: 10, windowMs: 2000 } },

  { code: 'DOUBLE_TROUBLE', challenge: { type: 'doubleclick', clicks: 3, windowMs: 800 } },
  { code: 'SCROLL_MASTER', challenge: { type: 'scroll', scrolls: 5, windowMs: 2000 } },
  { code: 'TRIPLE_CLICK', challenge: { type: 'tripleclick', windowMs: 600 } },
  {
    code: 'ZIGZAG_MOUSE',
    challenge: { type: 'mousemove', pattern: 'zigzag', moves: 15, windowMs: 2500 },
  },
]
