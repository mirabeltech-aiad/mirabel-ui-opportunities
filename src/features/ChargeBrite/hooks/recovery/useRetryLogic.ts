/**
 * @fileoverview Retry Logic Hook
 * 
 * Handles retry mechanisms with configurable delays and limits
 */

import { useState, useCallback } from 'react';

interface RetryState {
  retryCount: number;
  isRetrying: boolean;
  canRetry: boolean;
}

interface UseRetryLogicOptions {
  maxRetries?: number;
  retryDelay?: number;
  onRetry?: () => void;
}

interface UseRetryLogicReturn {
  retryState: RetryState;
  executeRetry: () => Promise<void>;
  resetRetries: () => void;
  updateRetryState: (updates: Partial<RetryState>) => void;
}

/**
 * Hook for managing retry logic with delays and limits
 */
export const useRetryLogic = (options: UseRetryLogicOptions = {}): UseRetryLogicReturn => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onRetry
  } = options;

  const [retryState, setRetryState] = useState<RetryState>({
    retryCount: 0,
    isRetrying: false,
    canRetry: true
  });

  const executeRetry = useCallback(async (): Promise<void> => {
    if (!retryState.canRetry || retryState.isRetrying) {
      return;
    }

    setRetryState(prev => ({
      ...prev,
      isRetrying: true
    }));

    try {
      // Wait for retry delay
      await new Promise(resolve => setTimeout(resolve, retryDelay));

      // Update retry count
      setRetryState(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
        isRetrying: false,
        canRetry: prev.retryCount + 1 < maxRetries
      }));

      // Call retry callback
      if (onRetry) {
        onRetry();
      }

    } catch (retryError) {
      console.error('Retry failed:', retryError);
      setRetryState(prev => ({
        ...prev,
        isRetrying: false
      }));
    }
  }, [retryState.canRetry, retryState.isRetrying, retryDelay, maxRetries, onRetry]);

  const resetRetries = useCallback(() => {
    setRetryState({
      retryCount: 0,
      isRetrying: false,
      canRetry: true
    });
  }, []);

  const updateRetryState = useCallback((updates: Partial<RetryState>) => {
    setRetryState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    retryState,
    executeRetry,
    resetRetries,
    updateRetryState
  };
};