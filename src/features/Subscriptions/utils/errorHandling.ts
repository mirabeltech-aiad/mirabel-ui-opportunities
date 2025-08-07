/**
 * @fileoverview Global Error Handling Utilities
 * 
 * Provides centralized error handling utilities and global error listeners
 * for comprehensive error management across the application.
 * 
 * @example
 * ```typescript
 * import { setupGlobalErrorHandling, logError } from '@/utils/errorHandling';
 * 
 * // Initialize global error handling
 * setupGlobalErrorHandling();
 * 
 * // Log custom error
 * logError(new Error('Custom error'), { feature: 'analytics' });
 * ```
 */

import { toast } from '../hooks/use-toast';

export interface ErrorContext {
  feature?: string;
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  context?: ErrorContext;
  url: string;
  userAgent: string;
}

/**
 * Global error handling configuration
 */
export const errorConfig = {
  enableConsoleLogging: true,
  enableToastNotifications: true,
  enableErrorReporting: false,
  maxErrorLogs: 100,
  reportingEndpoint: '/api/errors'
};

// In-memory error log storage (for development/debugging)
let errorLogs: ErrorLogEntry[] = [];

/**
 * Creates a standardized error log entry
 */
export const createErrorLogEntry = (
  error: Error, 
  context?: ErrorContext
): ErrorLogEntry => {
  return {
    id: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context,
    url: window.location.href,
    userAgent: navigator.userAgent
  };
};

/**
 * Logs an error with context information
 */
export const logError = (error: Error, context?: ErrorContext): string => {
  const logEntry = createErrorLogEntry(error, context);
  
  // Add to in-memory log
  errorLogs.push(logEntry);
  
  // Maintain max log size
  if (errorLogs.length > errorConfig.maxErrorLogs) {
    errorLogs = errorLogs.slice(-errorConfig.maxErrorLogs);
  }
  
  // Console logging
  if (errorConfig.enableConsoleLogging) {
    console.error('🔴 Error logged:', logEntry);
  }
  
  // Report to external service
  if (errorConfig.enableErrorReporting) {
    reportError(logEntry).catch(console.warn);
  }
  
  return logEntry.id;
};

/**
 * Reports error to external monitoring service
 */
export const reportError = async (logEntry: ErrorLogEntry): Promise<void> => {
  try {
    await fetch(errorConfig.reportingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry)
    });
  } catch (reportingError) {
    console.warn('Failed to report error:', reportingError);
  }
};

/**
 * Shows user-friendly error notification
 */
export const showErrorNotification = (
  error: Error, 
  context?: ErrorContext,
  customMessage?: string
): void => {
  if (!errorConfig.enableToastNotifications) return;

  const message = customMessage || getContextualErrorMessage(error, context);
  
  toast({
    title: "Something went wrong",
    description: message,
    variant: "destructive"
  });
};

/**
 * Gets contextual error message based on error type and context
 */
export const getContextualErrorMessage = (
  error: Error, 
  context?: ErrorContext
): string => {
  // Network errors
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return "Please check your internet connection and try again.";
  }
  
  // Feature-specific messages
  if (context?.feature) {
    switch (context.feature) {
      case 'analytics':
        return "Unable to load analytics data. Please try refreshing the page.";
      case 'reports':
        return "Unable to generate or load reports. Please try again later.";
      case 'dashboard':
        return "Dashboard data temporarily unavailable. Other features remain accessible.";
      default:
        return `Issue with ${context.feature}. Please try again or contact support.`;
    }
  }
  
  // Generic message
  return "An unexpected error occurred. Please try again or contact support if the problem persists.";
};

/**
 * Gets recent error logs
 */
export const getErrorLogs = (): ErrorLogEntry[] => {
  return [...errorLogs];
};

/**
 * Clears error logs
 */
export const clearErrorLogs = (): void => {
  errorLogs = [];
};

/**
 * Sets up global error handling listeners
 */
export const setupGlobalErrorHandling = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = new Error(event.reason?.message || 'Unhandled promise rejection');
    logError(error, { feature: 'global', action: 'unhandled_promise_rejection' });
    
    showErrorNotification(error, undefined, 
      "An unexpected error occurred. The development team has been notified."
    );
    
    // Prevent default browser error handling
    event.preventDefault();
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    const error = new Error(event.message);
    error.stack = `${event.filename}:${event.lineno}:${event.colno}`;
    
    logError(error, { 
      feature: 'global', 
      action: 'javascript_error',
      additionalData: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
    
    showErrorNotification(error, undefined, 
      "A technical error occurred. Please refresh the page or contact support."
    );
  });

  // Handle resource loading errors (images, scripts, etc.)
  window.addEventListener('error', (event) => {
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement;
      const error = new Error(`Failed to load resource: ${target.tagName}`);
      
      logError(error, {
        feature: 'global',
        action: 'resource_load_error',
        additionalData: {
          tagName: target.tagName,
          src: (target as any).src || (target as any).href
        }
      });
    }
  }, true);
};

/**
 * Error boundary integration helper
 */
export const handleErrorBoundaryError = (
  error: Error,
  errorInfo: React.ErrorInfo,
  featureName?: string
): string => {
  return logError(error, {
    feature: featureName || 'unknown',
    action: 'component_error',
    additionalData: {
      componentStack: errorInfo.componentStack
    }
  });
};

/**
 * Development helper to trigger test errors
 */
export const triggerTestError = (type: 'sync' | 'async' | 'component' = 'sync'): void => {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Test errors are disabled in production');
    return;
  }

  switch (type) {
    case 'sync':
      throw new Error('Test synchronous error');
    case 'async':
      Promise.reject(new Error('Test asynchronous error'));
      break;
    case 'component':
      // This would need to be triggered from within a React component
      console.log('Component error test - call this from within a React component');
      break;
  }
};