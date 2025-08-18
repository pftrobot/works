import { FC, ReactNode } from 'react'
import styles from './PageTitle.module.scss'

interface PageTitleProps {
  children: ReactNode
  className?: string
}

function PageTitle({ children, className }: PageTitleProps) {
  return <h1 className={`${styles.title} ${className || ''}`}>{children}</h1>
}

export default PageTitle
