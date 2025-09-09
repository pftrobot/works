import { ReactNode } from 'react'
import classNames from 'classnames'

import Modal from './Modal'
import styles from './ConfirmModal.module.scss'

interface ConfirmModalProps {
  open: boolean
  onCancel?: () => void
  onConfirm: () => void
  message?: ReactNode
  confirmText?: string
  cancelText?: string
  color?: string
}

export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  message = '정말 진행하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
  color = 'primary',
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onConfirm || onCancel}
      width={320}
      className={classNames(styles.modalWrap, styles[color])}
    >
      <div className={styles.message}>{message}</div>
      <div className={styles.buttonGroup}>
        <button onClick={onConfirm} className={styles.confirmButton}>
          {confirmText}
        </button>
        {onCancel && (
          <button onClick={onCancel} className={styles.cancelButton}>
            {cancelText}
          </button>
        )}
      </div>
    </Modal>
  )
}
