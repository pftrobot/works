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
