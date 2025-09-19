import { useState, useEffect } from 'react';

interface UseContextHeaderOptions {
  key: string;
  defaultVisible?: boolean;
  persistDismissal?: boolean;
}

export const useContextHeader = ({
  key,
  defaultVisible = true,
  persistDismissal = true
}: UseContextHeaderOptions) => {
  const storageKey = `kiro-context-header-${key}`;
  
  const [isVisible, setIsVisible] = useState(() => {
    if (!persistDismissal) return defaultVisible;
    
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaultVisible;
    } catch {
      return defaultVisible;
    }
  });

  const dismiss = () => {
    setIsVisible(false);
    if (persistDismissal) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(false));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const show = () => {
    setIsVisible(true);
    if (persistDismissal) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(true));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  const reset = () => {
    setIsVisible(defaultVisible);
    if (persistDismissal) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  return {
    isVisible,
    dismiss,
    show,
    reset
  };
};

export default useContextHeader;