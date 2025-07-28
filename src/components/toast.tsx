"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Language } from '@/lib/translations';

interface ToastProps {
  message: string;
  type?: 'info' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-200 max-w-sm";
    
    switch (type) {
      case 'warning':
        return `${baseStyles} bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200`;
      case 'error':
        return `${baseStyles} bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200`;
      default:
        return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200`;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-amber-600 dark:text-amber-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${
        isAnimating ? 'animate-in slide-in-from-right-full' : 'animate-out slide-out-to-right-full'
      }`}
    >
      <AlertCircle className={`h-4 w-4 flex-shrink-0 ${getIconColor()}`} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/10 rounded p-1 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

// Toast 容器组件
interface ToastContainerProps {
  language?: Language;
}

interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  duration?: number;
}

let toastId = 0;
let toastEvents: EventTarget | null = null;

// 懒加载事件系统，避免服务端渲染问题
const getToastEvents = () => {
  if (!toastEvents && typeof window !== 'undefined') {
    toastEvents = new EventTarget();
  }
  return toastEvents;
};

export const showToast = (message: string, type: 'info' | 'warning' | 'error' = 'info', duration = 3000) => {
  console.log('showToast called:', { message, type, duration });
  
  const events = getToastEvents();
  if (!events) return;
  
  const id = (++toastId).toString();
  const toast: ToastItem = { id, message, type, duration };
  events.dispatchEvent(new CustomEvent('show-toast', { detail: toast }));
  return id;
};

export const ToastContainer: React.FC<ToastContainerProps> = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const events = getToastEvents();
    if (!events) return;

    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastItem>;
      const toast = customEvent.detail;
      setToasts(prev => [...prev, toast]);
    };

    events.addEventListener('show-toast', handleShowToast);
    
    // 清理函数，防止内存泄漏
    return () => {
      events.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;