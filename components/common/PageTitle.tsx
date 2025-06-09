import { FC, ReactNode } from 'react'
import styles from './PageTitle.module.scss'

interface PageTitleProps {
  children: ReactNode
  className?: string
}

const PageTitle: FC<PageTitleProps> = ({ children, className }) => {
  return <h1 className={`${styles.title} ${className || ''}`}>{children}</h1>
}

export default PageTitle
