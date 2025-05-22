import Modal from './Modal'
import styles from './ConfirmModal.module.scss'

interface ConfirmModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  message?: string
  confirmText?: string
  cancelText?: string
}

export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  message = '정말 진행하시겠습니까?',
  confirmText = '확인',
  cancelText = '취소',
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} width={320}>
      <div className={styles.message}>{message}</div>
      <div className={styles.buttonGroup}>
        <button onClick={onConfirm} className={styles.confirmButton}>
          {confirmText}
        </button>
        <button onClick={onCancel} className={styles.cancelButton}>
          {cancelText}
        </button>
      </div>
    </Modal>
  )
}
