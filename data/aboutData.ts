import { caseList } from './casesMeta'

export const dnaList = [
  { id: 'dna-1', label: 'Problem Focused', size: '92%', color: '#3f88ff' },
  { id: 'dna-2', label: 'Interaction Focused', size: '68%', color: '#00bfa6' },
  { id: 'dna-3', label: 'Speed Optimizer', size: '88%', color: '#a259ff' },
  { id: 'dna-4', label: 'Likes Documents', size: '75%', color: '#ff6f61' },
  { id: 'dna-5', label: 'Debug Lover', size: '90%', color: '#dab53b' },
  { id: 'dna-6', label: 'Experience First', size: '73%', color: '#0091ea' },
]

export const techGroups = [
  {
    category: 'Frontend',
    items: [
      { label: 'Typescript', highlight: true },
      { label: 'React', highlight: true },
      { label: 'Next', highlight: true },
      { label: 'Vue' },
      { label: 'Nuxt' },
      { label: 'SCSS' },
      { label: 'CSS Modules' },
    ],
  },
  {
    category: 'State / API',
    items: [
      { label: 'Zustand', highlight: true },
      { label: 'React Query', highlight: true },
      { label: 'Pinia' },
      { label: 'RESTful API' },
      { label: 'WebSocket' },
    ],
  },
  {
    category: 'Infra / Tools',
    items: [
      { label: 'Pnpm' },
      { label: 'Yarn berry' },
      { label: 'Poetry' },
      { label: 'Vite', highlight: true },
      { label: 'Storybook' },
      { label: 'GitHub Actions', highlight: true },
      { label: 'AWS S3' },
    ],
  },
  {
    category: 'Etc',
    items: [
      { label: 'ReChartJs' },
      { label: 'Otplib' },
      { label: 'Google Auth' },
      { label: 'next-auth' },
      { label: 'Corbado' },
      { label: 'PDF WebViewer', highlight: true },
      { label: 'WebGL', highlight: true },
      { label: 'Canvas' },
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
