import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastContainerProps {
  toasts: Toast[];
  darkMode: boolean;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, darkMode }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center p-4 rounded-xl shadow-lg backdrop-blur-md border max-w-sm
            transform transition-all duration-300 ease-in-out
            animate-slide-in-right
            ${toast.type === 'success' 
              ? darkMode 
                ? 'bg-green-900/80 border-green-500/30 text-green-100' 
                : 'bg-green-50/90 border-green-200 text-green-800'
              : darkMode 
                ? 'bg-red-900/80 border-red-500/30 text-red-100'
                : 'bg-red-50/90 border-red-200 text-red-800'
            }
          `}
        >
          <div className="flex-shrink-0 mr-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;