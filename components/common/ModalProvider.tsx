'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Modal from './Modal'

interface ModalState {
  content: ReactNode | null
  width?: number
}

interface ModalContextType {
  openModal: (content: ReactNode, options?: { width?: number }) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ content: null })

  const openModal = (content: ReactNode, options?: { width?: number }) => {
    setModal({ content, width: options?.width })
  }

  const closeModal = () => {
    setModal({ content: null })
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal open={!!modal.content} onClose={closeModal} width={modal.width}>
        {modal.content}
      </Modal>
    </ModalContext.Provider>
  )
}

export function useModalContext() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('No context')
  return ctx
}
