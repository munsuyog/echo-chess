import React from 'react'

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  type?: "default" | "puzzled" | "spoiler" | "solution"
}

const Modal = ({ children, isOpen, onClose, type }: Props) => {
  if (!isOpen) return null;

  return (
    <div id='modal' className={`${type}`} onClick={onClose}>
      <div className='content' onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal