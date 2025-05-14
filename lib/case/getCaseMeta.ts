// lib/case/getCaseMeta.ts

const CASE_META = [
  { slug: 'lh-auth', title: '엘리베이터 인증 실패 사건' },
  { slug: 'fanfan-sim', title: '유령 선수 득점 사건' },
  { slug: 'solvook-refactor', title: '무거운 상태관리 모듈 사건' },
  { slug: 'ai-writer', title: 'AI 생성 텍스트 왜곡 사건' },
]

export function getCaseMeta(slug: string) {
  return CASE_META.find((c) => c.slug === slug)
}
