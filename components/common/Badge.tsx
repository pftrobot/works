import { ReactNode } from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  children: ReactNode
  color?: 'default' | 'red'
}

const Badge = ({ children, color = 'default' }: BadgeProps) => {
  return <span className={`${styles.badge} ${styles[color]}`}>{children}</span>
}

export default Badge
