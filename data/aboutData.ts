export const dnaList = [
  { label: '문제 중심형', size: '92%' },
  { label: '인터랙션 집착형', size: '68%' },
  { label: '성능 최적화형', size: '88%' },
  { label: '문서화 중시형', size: '75%' },
  { label: '디버깅 집착형', size: '90%' },
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

export const caseWeapons = [
  {
    id: 2400,
    title: '유령 선수 득점 사건',
    summary: 'Canvas + WebSocket 기반 실시간 게임 동기화 시스템',
    tech: 'Vue, Canvas, WebSocket, API 핸들링',
  },
  {
    id: 2401,
    title: '엘리베이터 인증 실패 사건',
    summary: 'WebAuthn + OTP 기반 이중 인증 시스템, 권한 기반 소켓 접근 제어',
    tech: 'React, WebSocket, Otplib, WebAuthn',
  },
  {
    id: 2402,
    title: 'AI 콘텐츠 왜곡 사건',
    summary: 'OCR → 요약 → 이미지 생성까지 전처리와 프롬프트 설계',
    tech: 'Python, OpenCV, PyTesseract, ChatGPT, DALL·E',
  },
  {
    id: 2403,
    title: '레거시 마이그레이션 실패 사건',
    summary: 'JSP + JQuery 기반을 Next + TypeScript로 이관, SSR 대응 구조 설계',
    tech: 'Next.js, TypeScript, Keep-alive 구조',
  },
]

export const timeline = [
  { id: 1, year: '2019', text: 'JSP + JQuery로 웹 개발 입문' },
  { id: 2, year: '2020', text: 'Vanilla JS 기반 컴포넌트 구조 설계 시도' },
  { id: 3, year: '2021', text: 'React + Zustand 기반 구조로 마이그레이션' },
  { id: 4, year: '2022', text: 'Vue + Nuxt로 SPA 구축 및 인증 구조 설계' },
  { id: 5, year: '2023', text: 'WebSocket / PDF.js / WebGL 기반 인터랙션 구현' },
  { id: 6, year: '2024', text: 'AI + OpenAPI 연동, 자동 콘텐츠 생성 구조 확립' },
]

export const recentCases = [
  {
    id: 2415,
    title: 'API 이중 호출 사건',
    desc: 'useFetch로 등록한 API가 페이지 진입 시 두 번 호출됨',
    tech: 'Nuxt의 컨텍스트 내 중복 실행 이슈',
  },
  {
    id: 2416,
    title: '옵티미스틱 UI 무한 루프 사건',
    desc: '캐시 갱신 후 쿼리 refetch가 반복되어 성능 저하 발생',
    tech: 'React Query, Optimistic Update 처리 미흡',
  },
  {
    id: 2417,
    title: 'WebGL 이벤트 감지 실패 사건',
    desc: 'NPC 클릭 이벤트가 발생하지 않아 상호작용 불가',
    tech: 'Canvas 좌표 정규화 및 충돌 감지 오류',
  },
]

export const guideSteps = [
  '문제 상황이 기술 사건으로 주어집니다.',
  '단서를 수집하고, 상황을 추리해봅니다.',
  '가능한 해결 전략 중 하나를 선택합니다.',
  '실제 해결 과정과 결과를 확인하며 회고합니다.',
]
