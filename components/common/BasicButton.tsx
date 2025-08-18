'use client'

import { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import styles from './BasicButton.module.scss'

type Variant = 'primary' | 'secondary'

interface CommonProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    external?: boolean
  }

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
    external?: never
  }

type BasicButtonProps = AnchorProps | ButtonProps

function isAnchorProps(p: BasicButtonProps): p is AnchorProps {
  return 'href' in p
}

export default function BasicButton(props: BasicButtonProps) {
  const { variant = 'primary', className = '', children } = props
  const classNames = `${styles.button} ${styles[variant]} ${className}`

  const hover =
    !isAnchorProps(props) && props.disabled
      ? undefined
      : { y: -2, boxShadow: '0 4px 12px #ffffff05' }
  const tap = !isAnchorProps(props) && props.disabled ? undefined : { scale: 0.97 }

  return (
    <div className={styles.buttonWrap}>
      <motion.div whileHover={hover} whileTap={tap}>
        {isAnchorProps(props) ? (
          props.external ? (
            <a {...props} className={classNames} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ) : (
            (() => {
              const { href, external: _ext, className: _cn, children: _ch, ...rest } = props
              return (
                <Link href={href} className={classNames} {...rest}>
                  {children}
                </Link>
              )
            })()
          )
        ) : (
          <button {...props} className={classNames}>
            {children}
          </button>
        )}
      </motion.div>
    </div>
  )
}
