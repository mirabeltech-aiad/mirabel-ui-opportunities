/**
 * @fileoverview Dashboard Feature Error Boundary
 * 
 * Specialized error boundary for dashboard components with
 * dashboard-specific error handling and graceful degradation.
 * 
 * @example
 * ```tsx
 * <DashboardErrorBoundary>
 *   <CirculationDashboard />
 * </DashboardErrorBoundary>
 * ```
 */

import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import FeatureErrorBoundary from './FeatureErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { logError, type ErrorContext } from '../../utils/errorHandling';

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
  dashboardType?: 'circulation' | 'admin' | 'general';
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Dashboard-specific error boundary with tailored error handling
 * for common dashboard issues like widget loading failures.
 */
const DashboardErrorBoundary: React.FC<DashboardErrorBoundaryProps> = ({
  children,
  dashboardType = 'general',
  fallback,
  onError
}) => {
  const navigate = useNavigate();

  const getDashboardName = () => {
    switch (dashboardType) {
      case 'circulation':
        return 'Circulation Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const handleNavigateBack = () => {
    if (dashboardType === 'circulation') {
      navigate('/');
    } else {
      navigate('/circulation');
    }
  };

  const handleRetry = () => {
    // Dashboard-specific retry logic
    // Clear dashboard-specific cache
    if ('caches' in window) {
      caches.delete(`${dashboardType}-dashboard-data`).catch(console.warn);
    }
    
    // Clear localStorage dashboard cache
    const dashboardKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${dashboardType}_`) || 
      key.startsWith('dashboard_') ||
      key.startsWith('metrics_')
    );
    dashboardKeys.forEach(key => localStorage.removeItem(key));
  };

  const handleDashboardError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Create dashboard-specific error context
    const errorContext: ErrorContext = {
      feature: 'dashboard',
      component: 'DashboardErrorBoundary',
      action: 'dashboard_error',
      additionalData: {
        componentStack: errorInfo.componentStack,
        dashboardType,
        isWidgetError: error.message.includes('widget') || error.message.includes('metric'),
        isChartError: error.message.includes('chart') || error.message.includes('visualization'),
        dashboardKeys: Object.keys(localStorage).filter(key => 
          key.startsWith(`${dashboardType}_`) || 
          key.startsWith('dashboard_') ||
          key.startsWith('metrics_')
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
      featureName={getDashboardName()}
      icon={<Activity className="h-5 w-5 text-green-500" />}
      onError={handleDashboardError}
      onRetry={handleRetry}
      onNavigateBack={handleNavigateBack}
      fallback={fallback}
      enableToast={true}
    >
      {children}
    </FeatureErrorBoundary>
  );
};

export default DashboardErrorBoundary;