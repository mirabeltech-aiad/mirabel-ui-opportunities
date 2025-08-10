import { useState, useCallback } from 'react';

// Toast types
export type ToastType = 'default' | 'destructive' | 'success' | 'warning';

export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastType;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const toastStore: {
  toasts: Toast[];
  listeners: Set<(toasts: Toast[]) => void>;
} = {
  toasts: [],
  listeners: new Set(),
};

let toastId = 0;

const notify = () => {
  toastStore.listeners.forEach(listener => listener(toastStore.toasts));
};

export const toast = ({
  id = `toast-${++toastId}`,
  title,
  description,
  variant = 'default',
  action,
  ...props
}: Toast) => {
  const newToast: Toast = {
    id,
    title,
    description,
    variant,
    action,
    open: true,
    ...props,
  };

  // Add toast to store
  toastStore.toasts = [newToast, ...toastStore.toasts];
  notify();

  // Auto-remove after 5 seconds unless it's destructive
  if (variant !== 'destructive') {
    setTimeout(() => {
      toastStore.toasts = toastStore.toasts.filter(t => t.id !== id);
      notify();
    }, 5000);
  }

  return {
    id,
    dismiss: () => {
      toastStore.toasts = toastStore.toasts.filter(t => t.id !== id);
      notify();
    },
    update: (updatedToast: Partial<Toast>) => {
      toastStore.toasts = toastStore.toasts.map(t => 
        t.id === id ? { ...t, ...updatedToast } : t
      );
      notify();
    },
  };
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toastStore.toasts);

  useState(() => {
    toastStore.listeners.add(setToasts);
    return () => {
      toastStore.listeners.delete(setToasts);
    };
  });

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toastStore.toasts = toastStore.toasts.filter(t => t.id !== toastId);
    } else {
      toastStore.toasts = [];
    }
    notify();
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
};
