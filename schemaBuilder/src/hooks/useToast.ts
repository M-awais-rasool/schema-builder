import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ title, message, type: 'success', duration });
  }, [addToast]);

  const error = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ title, message, type: 'error', duration });
  }, [addToast]);

  const info = useCallback((title: string, message: string, duration?: number) => {
    return addToast({ title, message, type: 'info', duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  };
};