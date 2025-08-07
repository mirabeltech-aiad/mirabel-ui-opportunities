/**
 * @fileoverview Error Boundaries Barrel Export
 * 
 * Exports all error boundary components for centralized error handling
 * across the application with feature-specific and global boundaries.
 */

export { default as GlobalErrorBoundary } from './GlobalErrorBoundary';
export { default as FeatureErrorBoundary } from './FeatureErrorBoundary';
export { default as AnalyticsErrorBoundary } from './AnalyticsErrorBoundary';
export { default as CirculationErrorBoundary } from './CirculationErrorBoundary';
export { default as DashboardErrorBoundary } from './DashboardErrorBoundary';

// Re-export reports error boundary for convenience
export { default as ReportsErrorBoundary } from '../../features/reports/components/common/ReportsErrorBoundary';