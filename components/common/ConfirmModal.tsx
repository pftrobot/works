import { ReactNode, useState, useEffect } from 'react'
import classNames from 'classnames'

import Modal from './Modal'
import styles from './ConfirmModal.module.scss'

interface ConfirmModalProps {
  open: boolean
  onCancel?: () => void
  onConfirm?: () => void
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
  const [dismissed, setDismissed] = useState(false)

  // open 이 true 로 바뀌면 dismissed 리셋
  useEffect(() => {
    if (open) {
      setDismissed(false)
    }
  }, [open])

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      setDismissed(true)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      setDismissed(true)
    }
  }

  const handleClose = () => {
    if (onConfirm) {
      onConfirm()
    } else if (onCancel) {
      onCancel()
    } else {
      setDismissed(true)
    }
  }

  return (
    <Modal
      open={open && !dismissed}
      onClose={handleClose}
      width={320}
      className={classNames(styles.modalWrap, styles[color])}
    >
      <div className={styles.message}>{message}</div>
      <div className={styles.buttonGroup}>
        <button onClick={handleConfirm} className={styles.confirmButton}>
          {confirmText}
        </button>
        {onCancel && (
          <button onClick={handleCancel} className={styles.cancelButton}>
            {cancelText}
          </button>
        )}
      </div>
    </Modal>
  )
}
