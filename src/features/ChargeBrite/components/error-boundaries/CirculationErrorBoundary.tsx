/**
 * @fileoverview Circulation Feature Error Boundary
 * 
 * Specialized error boundary for the Circulation feature with
 * circulation-specific error handling and recovery options.
 * 
 * @example
 * ```tsx
 * <CirculationErrorBoundary>
 *   <CirculationDashboard />
 * </CirculationErrorBoundary>
 * ```
 */

import React from 'react';
import { TrendingUp, Database, RefreshCw } from 'lucide-react';
import FeatureErrorBoundary from './FeatureErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { logError, type ErrorContext } from '../../utils/errorHandling';

interface CirculationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Circulation-specific error boundary with tailored error handling
 * for common circulation issues like data loading failures and metric calculations.
 */
const CirculationErrorBoundary: React.FC<CirculationErrorBoundaryProps> = ({
  children,
  fallback,
  onError
}) => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate('/');
  };

  const handleRetry = () => {
    // Circulation-specific retry logic
    // Clear circulation-related cached data
    if ('caches' in window) {
      Promise.all([
        caches.delete('circulation-data'),
        caches.delete('circulation-metrics'),
        caches.delete('revenue-data')
      ]).catch(console.warn);
    }
    
    // Clear localStorage circulation cache
    const circulationKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('circulation_') || 
      key.startsWith('revenue_') ||
      key.startsWith('growth_') ||
      key.startsWith('tanstack_query_circulation') ||
      key.startsWith('tanstack_query_revenue')
    );
    circulationKeys.forEach(key => localStorage.removeItem(key));
  };

  const handleCirculationError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Create circulation-specific error context
    const errorContext: ErrorContext = {
      feature: 'circulation',
      component: 'CirculationErrorBoundary',
      action: 'circulation_error',
      additionalData: {
        componentStack: errorInfo.componentStack,
        isNetworkError: error.message.includes('network') || error.message.includes('fetch'),
        isDataError: error.message.includes('query') || error.message.includes('data'),
        isMetricError: error.message.includes('metric') || error.message.includes('calculation'),
        isRevenueError: error.message.includes('revenue') || error.message.includes('attribution'),
        circulationKeys: Object.keys(localStorage).filter(key => 
          key.startsWith('circulation_') || 
          key.startsWith('revenue_') ||
          key.startsWith('growth_') ||
          key.startsWith('tanstack_query_circulation') ||
          key.startsWith('tanstack_query_revenue')
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
      featureName="Circulation Analytics"
      icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
      onError={handleCirculationError}
      onRetry={handleRetry}
      onNavigateBack={handleNavigateBack}
      fallback={fallback}
      enableToast={true}
    >
      {children}
    </FeatureErrorBoundary>
  );
};

export default CirculationErrorBoundary;