'use client'

import { ReactNode, MouseEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './BasicButton.module.scss'

type Variant = 'primary' | 'secondary'

interface CommonProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

interface LinkProps extends CommonProps {
  href: string
  external?: boolean
  onClick?: never
}

interface ButtonProps extends CommonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  href?: never
}

type BasicButtonProps = LinkProps | ButtonProps

export default function BasicButton(props: BasicButtonProps) {
  const { variant = 'primary', className = '', children } = props

  const classNames = `${styles.button} ${styles[variant]} ${className}`

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 4px 12px #ffffff05' }}
      whileTap={{ scale: 0.97 }}
    >
      {'href' in props ? (
        'external' in props ? (
          <a href={props.href} className={classNames} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ) : (
          <Link href={props.href || ''} className={classNames}>
            {children}
          </Link>
        )
      ) : (
        <button type="button" onClick={props.onClick} className={classNames}>
          {children}
        </button>
      )}
    </motion.div>
  )
}
