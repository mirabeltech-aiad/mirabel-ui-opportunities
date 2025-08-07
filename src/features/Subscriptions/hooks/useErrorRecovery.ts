/**
 * @fileoverview Error Recovery Hook
 * 
 * Provides a React hook for managing error recovery states
 * and implementing graceful degradation patterns.
 */

import { useCallback } from 'react';
import { type ErrorContext } from '@/utils/errorHandling';
import { useRetryLogic } from './recovery/useRetryLogic';
import { useErrorState } from './recovery/useErrorState';
import { useAutoRecovery } from './recovery/useAutoRecovery';

interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  retryCount: number;
  isRecovering: boolean;
  canRetry: boolean;
}

interface UseErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  feature?: string;
  onError?: (error: Error, errorContext?: ErrorContext) => void;
  onRecovery?: () => void;
  autoRecovery?: boolean;
}

interface UseErrorRecoveryReturn {
  errorState: ErrorState;
  captureError: (error: Error, context?: ErrorContext) => void;
  retry: () => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

/**
 * Hook for managing error recovery and graceful degradation
 */
export const useErrorRecovery = (options: UseErrorRecoveryOptions = {}): UseErrorRecoveryReturn => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    feature = 'unknown',
    onError,
    onRecovery,
    autoRecovery = false
  } = options;

  // Initialize sub-hooks
  const { errorData, captureError, clearError, resetError } = useErrorState({
    feature,
    onError
  });

  const { retryState, executeRetry, resetRetries, updateRetryState } = useRetryLogic({
    maxRetries,
    retryDelay,
    onRetry: onRecovery
  });

  // Combined error state for backward compatibility
  const errorState: ErrorState = {
    hasError: errorData.hasError,
    error: errorData.error,
    errorId: errorData.errorId,
    retryCount: retryState.retryCount,
    isRecovering: retryState.isRetrying,
    canRetry: retryState.canRetry
  };

  // Auto-recovery
  useAutoRecovery(
    {
      hasError: errorState.hasError,
      canRetry: errorState.canRetry,
      isRetrying: errorState.isRecovering
    },
    {
      autoRecovery,
      retryDelay,
      onAutoRetry: executeRetry
    }
  );

  const reset = useCallback(() => {
    resetError();
    resetRetries();
  }, [resetError, resetRetries]);

  return {
    errorState,
    captureError,
    retry: executeRetry,
    reset,
    clearError
  };
};

export default useErrorRecovery;