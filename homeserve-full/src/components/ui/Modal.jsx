const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};
export default Modal;