/**
 * @fileoverview Analytics Feature Error Boundary
 * 
 * Specialized error boundary for the Analytics feature with
 * analytics-specific error handling and recovery options.
 * 
 * @example
 * ```tsx
 * <AnalyticsErrorBoundary>
 *   <AnalyticsDashboard />
 * </AnalyticsErrorBoundary>
 * ```
 */

import React from 'react';
import { BarChart3, Database, Wifi } from 'lucide-react';
import FeatureErrorBoundary from './FeatureErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { logError, type ErrorContext } from '../../utils/errorHandling';

interface AnalyticsErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Analytics-specific error boundary with tailored error handling
 * for common analytics issues like data loading failures.
 */
const AnalyticsErrorBoundary: React.FC<AnalyticsErrorBoundaryProps> = ({
  children,
  fallback,
  onError
}) => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate('/');
  };

  const handleRetry = () => {
    // Analytics-specific retry logic
    // Clear any cached analytics data
    if ('caches' in window) {
      caches.delete('analytics-data').catch(console.warn);
    }
    
    // Clear localStorage analytics cache
    const analyticsKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('analytics_') || key.startsWith('tanstack_query_')
    );
    analyticsKeys.forEach(key => localStorage.removeItem(key));
  };

  const handleAnalyticsError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Create analytics-specific error context
    const errorContext: ErrorContext = {
      feature: 'analytics',
      component: 'AnalyticsErrorBoundary',
      action: 'analytics_error',
      additionalData: {
        componentStack: errorInfo.componentStack,
        isNetworkError: error.message.includes('network') || error.message.includes('fetch'),
        isDataError: error.message.includes('query') || error.message.includes('data'),
        analyticsKeys: Object.keys(localStorage).filter(key => 
          key.startsWith('analytics_') || key.startsWith('tanstack_query_')
        ).length
      }
    };

    // Log to global error handling system
    logError(error, errorContext);

    // Call parent error handler
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <FeatureErrorBoundary
      featureName="Analytics"
      icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
      onError={handleAnalyticsError}
      onRetry={handleRetry}
      onNavigateBack={handleNavigateBack}
      fallback={fallback}
      enableToast={true}
    >
      {children}
    </FeatureErrorBoundary>
  );
};

export default AnalyticsErrorBoundary;