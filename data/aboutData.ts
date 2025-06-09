import { caseList } from './casesMeta'

export const dnaList = [
  { label: '문제 중심형', size: '92%', color: '#009688' },
  { label: '인터랙션 집착형', size: '68%', color: '#558b2f' },
  { label: '성능 최적화형', size: '88%', color: '#ab47bc' },
  { label: '문서화 중시형', size: '75%', color: '#e53935' },
  { label: '디버깅 집착형', size: '90%', color: '#1e88e5' },
  { label: '경험 중시형', size: '73%', color: '#5e35b1' },
]

export const techGroups = [
  {
    category: 'Frontend',
    items: ['Typescript', 'React', 'Next', 'Vue', 'Nuxt', 'SCSS', 'CSS Modules'],
  },
  {
    category: 'State / API',
    items: ['Zustand', 'React Query', 'Pinia', 'RESTful API', 'WebSocket'],
  },
  {
    category: 'Infra / Tools',
    items: ['Pnpm', 'Yarn berry', 'Poetry', 'Vite', 'Storybook', 'GitHub Actions', 'AWS S3'],
  },
  {
    category: 'Etc',
    items: [
      'ReChartJs',
      'Otplib',
      'Google Auth',
      'next-auth',
      'Corbado',
      'PDF WebViewer',
      'WebGL',
      'Canvas',
    ],
  },
]

export const caseWeapons = caseList.map((item) => ({
  id: item.id,
  title: item.subtitle,
  summary: item.summary,
  tech: item.tech?.join(', ') ?? '-',
}))

export const timeline = [
  { id: 1, year: '2019', text: 'JSP + JQuery로 웹 개발 입문' },
  { id: 2, year: '2020', text: 'Vanilla JS 기반 컴포넌트 구조 설계 시도' },
  { id: 3, year: '2021', text: 'React + Zustand 기반 구조로 마이그레이션' },
  { id: 4, year: '2022', text: 'Vue + Nuxt로 SPA 구축 및 인증 구조 설계' },
  { id: 5, year: '2023', text: 'WebSocket / PDF.js / WebGL 기반 인터랙션 구현' },
  { id: 6, year: '2024', text: 'AI + OpenAPI 연동, 자동 콘텐츠 생성 구조 확립' },
]

export const recentCases = caseList.slice(0, 3).map((item) => ({
  id: item.id,
  title: item.title,
  desc: item.summary,
}))

export const guideSteps = [
  '문제 상황이 기술 사건으로 주어집니다.',
  '단서를 수집하고, 상황을 추리해봅니다.',
  '가능한 해결 전략 중 하나를 선택합니다.',
  '실제 해결 과정과 결과를 확인하며 회고합니다.',
]
