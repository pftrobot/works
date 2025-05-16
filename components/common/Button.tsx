import { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

const Button = ({ variant = 'primary', children, className, ...rest }: ButtonProps) => {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
