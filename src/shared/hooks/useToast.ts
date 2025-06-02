import { useState } from 'react';

// Interface for toast state
export interface ToastState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

// Custom hook for toast notifications
export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return {
    toast,
    showToast,
    hideToast
  };
};
