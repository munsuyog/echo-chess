import React from 'react'

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

const Modal = ({ children, isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div id='modal' onClick={onClose}>
      <div className='content' onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-glow"></div>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <div className="modal-pattern"></div>
        </div>
      </div>
    </div>
  )
}

export default Modal