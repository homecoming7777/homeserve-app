import { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`p-4 rounded shadow-lg text-white ${
            toast.type === 'error' ? 'bg-red-500' : toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            {toast.message}
            <button onClick={() => removeToast(toast.id)} className="ml-4 text-white font-bold">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};