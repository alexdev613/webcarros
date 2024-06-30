import { ReactNode } from 'react';
import { IoMdCloseCircle } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ImageModal({ isOpen, onClose, children}: ModalProps) {
  if (!isOpen) {
    return null;
  };

  return (
    <div
      className='fixed inset-1 flex items-center justify-center bg-black bg-opacity-80 z-50'
      onClick={onClose}
    >
      <div
        className='bg-white p-4 max-h-[85vh] rounded-lg relative'
        onClick={(e) => e.stopPropagation()} // Impede o clique de se propagar para o fundo
      >
        <button
          className='absolute flex justify-center items-center -top-6 -right-7 bg-white p-2 border-2
          border-slate-600 rounded-full text-gray-600 hover:text-gray-900 hover:scale-110 transition-all'
          onClick={onClose}
        >
          <IoMdCloseCircle size={30}/>
        </button>
        {children}
      </div>
    </div>
  )
}