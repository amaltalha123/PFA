import ReactDOM from "react-dom";

// Modal générique
const FormModal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  children,
  onClose,
}) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default FormModal;