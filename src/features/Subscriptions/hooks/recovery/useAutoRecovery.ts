/**
 * @fileoverview Auto Recovery Hook
 * 
 * Implements automatic retry mechanisms with configurable timing
 */

import { useEffect } from 'react';

interface AutoRecoveryState {
  hasError: boolean;
  canRetry: boolean;
  isRetrying: boolean;
}

interface UseAutoRecoveryOptions {
  autoRecovery?: boolean;
  retryDelay?: number;
  onAutoRetry?: () => void;
}

/**
 * Hook for automatic error recovery
 */
export const useAutoRecovery = (
  errorState: AutoRecoveryState,
  options: UseAutoRecoveryOptions = {}
) => {
  const {
    autoRecovery = false,
    retryDelay = 1000,
    onAutoRetry
  } = options;

  // Auto-recovery mechanism
  useEffect(() => {
    if (autoRecovery && errorState.hasError && errorState.canRetry && !errorState.isRetrying) {
      const autoRetryTimer = setTimeout(() => {
        if (onAutoRetry) {
          onAutoRetry();
        }
      }, retryDelay * 2); // Double delay for auto-recovery

      return () => clearTimeout(autoRetryTimer);
    }
  }, [autoRecovery, errorState, onAutoRetry, retryDelay]);
};