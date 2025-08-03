/**
 * @fileoverview Error State Management Hook
 * 
 * Manages error state and provides error capture functionality
 */

import { useState, useCallback } from 'react';
import { logError, showErrorNotification, type ErrorContext } from '@/utils/errorHandling';

interface ErrorData {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

interface UseErrorStateOptions {
  feature?: string;
  onError?: (error: Error, errorContext?: ErrorContext) => void;
}

interface UseErrorStateReturn {
  errorData: ErrorData;
  captureError: (error: Error, context?: ErrorContext) => void;
  clearError: () => void;
  resetError: () => void;
}

/**
 * Hook for managing error state and capture
 */
export const useErrorState = (options: UseErrorStateOptions = {}): UseErrorStateReturn => {
  const {
    feature = 'unknown',
    onError
  } = options;

  const [errorData, setErrorData] = useState<ErrorData>({
    hasError: false
  });

  const captureError = useCallback((error: Error, context?: ErrorContext) => {
    const errorContext: ErrorContext = {
      feature,
      component: 'useErrorState',
      action: 'error_captured',
      ...context
    };

    // Log error to global system
    const errorId = logError(error, errorContext);

    // Update local error state
    setErrorData({
      hasError: true,
      error,
      errorId
    });

    // Show user notification
    showErrorNotification(error, errorContext);

    // Call custom error handler
    if (onError) {
      onError(error, errorContext);
    }
  }, [feature, onError]);

  const clearError = useCallback(() => {
    setErrorData(prev => ({
      ...prev,
      hasError: false,
      error: undefined,
      errorId: undefined
    }));
  }, []);

  const resetError = useCallback(() => {
    setErrorData({
      hasError: false
    });
  }, []);

  return {
    errorData,
    captureError,
    clearError,
    resetError
  };
};