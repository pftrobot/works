import { caseList } from './casesMeta'

export const dnaList = [
  { id: 'dna-1', label: 'Problem Focused', size: '92%', color: '#504630' },
  { id: 'dna-2', label: 'Interaction Focused', size: '68%', color: '#50463080' },
  { id: 'dna-3', label: 'Speed Optimizer', size: '88%', color: '#948159' },
  { id: 'dna-4', label: 'Likes Documents', size: '75%', color: '#94815980' },
  { id: 'dna-5', label: 'Debug Lover', size: '90%', color: '#e8cea1' },
  { id: 'dna-6', label: 'Experience First', size: '73%', color: '#e8cea180' },
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

export const timeline = [
  { id: 1, year: '2019', text: 'JSP + JQuery로 웹 개발 입문 및 게시판 기능 구현' },
  { id: 2, year: '2020', text: 'Vanilla JS 기반 구조 설계 및 컴포넌트화 시도' },
  { id: 3, year: '2021', text: '공통 컴포넌트 및 페이지네이션 등 구조화 경험' },
  { id: 4, year: '2022', text: 'Vue 기반 프로젝트에서 React + Zustand로 마이그레이션' },
  { id: 5, year: '2022', text: 'SSG + Github Actions로 자동 배포 시스템 구축' },
  { id: 6, year: '2023', text: 'PDF WebView, WebGL, Canvas 등 시각화 기능 개발' },
  { id: 7, year: '2023', text: '2천 장 이미지 최적화 및 ScrollTrigger 활용 퍼포먼스 개선' },
  { id: 8, year: '2024', text: 'WebAuthn, OTP 인증 시스템으로 보안 강화 구조 설계' },
  { id: 9, year: '2024', text: 'OpenCV, ChatGPT, DALL·E 기반 자동화 콘텐츠 생성 구현' },
]
