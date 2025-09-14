import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
      onClick={onClose} // fermer modal si clic en dehors
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-2xl relative"
        onClick={(e) => e.stopPropagation()} // empêcher la fermeture si clic dans le contenu
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;