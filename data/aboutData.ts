import { TechItem } from 'types'

export const dnaList = [
  { id: 'dna-1', label: 'Problem Focused', size: '92%', color: '#504630' },
  { id: 'dna-2', label: 'Interaction Focused', size: '68%', color: '#50463080' },
  { id: 'dna-3', label: 'Speed Optimizer', size: '88%', color: '#948159' },
  { id: 'dna-4', label: 'Likes Documents', size: '75%', color: '#94815980' },
  { id: 'dna-5', label: 'Debug Lover', size: '90%', color: '#e8cea1' },
  { id: 'dna-6', label: 'Experience First', size: '73%', color: '#e8cea180' },
]

export const techGroups: TechItem[] = [
  {
    category: 'Frontend',
    items: [
      { label: 'Typescript', logo: 'typescript-logo', highlight: true },
      { label: 'React', logo: 'react-logo', highlight: true },
      { label: 'Next', logo: 'next-logo', highlight: true },
      { label: 'Vite', logo: 'vite-logo', highlight: true },
      { label: 'Vue', logo: 'vue-logo' },
      { label: 'Nuxt', logo: 'nuxt-logo' },
      { label: 'Electron', logo: 'electron-logo' },
      { label: 'SCSS', logo: 'scss-logo' },
      { label: 'Emotion', logo: 'css-logo' },
      { label: 'Styled Component', logo: 'styled-component-logo' },
      { label: 'CSS Modules', logo: 'css-logo' },
      { label: 'EUI', logo: 'eui-logo' },
      { label: 'AntD', logo: 'antd-logo' },
    ],
  },
  {
    category: 'State / API',
    items: [
      { label: 'Zustand', logo: 'zustand-logo', highlight: true },
      { label: 'Tanstack Query', logo: 'react-query-logo', highlight: true },
      { label: 'MobX', logo: 'mobx-logo' },
      { label: 'Pinia', logo: 'pinia-logo' },
      { label: 'WebSocket', logo: 'websocket-logo' },
    ],
  },
  {
    category: 'Infra / Tools',
    items: [
      { label: 'Pnpm', logo: 'pnpm-logo', highlight: true },
      { label: 'Yarn berry', logo: 'yarn-logo', highlight: true },
      { label: 'Eslint', logo: 'eslint-logo' },
      { label: 'Prettier', logo: 'prettier-logo' },
      { label: 'Husky', logo: 'github-white-logo' },
      { label: 'Poetry', logo: 'poetry-logo' },
      { label: 'Vercel', logo: 'vercel-logo', highlight: true },
      { label: 'GitHub Actions', logo: 'github-logo', highlight: true },
      { label: 'Turbopack', logo: 'turbopack-logo' },
      { label: 'Storybook', logo: 'storybook-logo' },
      { label: 'PWA', logo: 'pwa-logo' },
      { label: 'Webpack', logo: 'webpack-logo' },
      { label: 'AWS S3', logo: 'aws-logo' },
    ],
  },
  {
    category: 'Etc',
    items: [
      { label: 'Otplib', logo: 'otp-logo' },
      { label: 'WebAuthN', logo: 'auth-logo' },
      { label: 'Supabase API', logo: 'supabase-logo' },
      { label: 'ReChartJs', logo: 'css-logo' },
      { label: 'Google Auth', logo: 'google-auth-logo' },
      { label: 'Corbado', logo: 'otp-logo' },
      { label: 'ThreeJs', logo: 'threejs-logo' },
      { label: 'PDF WebViewer', logo: 'pdf-viewer-logo' },
      { label: 'WebGL', logo: 'css-logo' },
      { label: 'Canvas', logo: 'css-logo' },
    ],
  },
]
