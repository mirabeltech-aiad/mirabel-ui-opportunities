/**
 * @fileoverview Circulation Dashboard Main Component
 * 
 * Primary dashboard component for circulation analytics and management.
 * Provides comprehensive circulation tracking, analytics, and performance
 * monitoring for media companies with lazy loading and performance optimization.
 * 
 * @author Circulation Team
 * @since 1.0.0
 */

import React, { Suspense } from 'react';
import { DashboardSkeleton } from '../ui/dashboard-skeleton';
import { PerformanceAnalytics } from '../../utils/performanceAnalytics';
import { ProductFilterProvider } from '../../contexts/ProductFilterContext';
import ScrollToTopButton from '../ui/ScrollToTopButton';

// Simplified lazy loading without preloading
const CirculationDashboardContent = React.lazy(() => 
  import('./CirculationDashboardContent')
);

/**
 * Circulation Dashboard Component
 * 
 * Main dashboard component providing comprehensive circulation analytics
 * and management capabilities for media companies. Features include:
 * 
 * Performance Features:
 * - Lazy loading for optimal initial load times
 * - Performance analytics tracking and measurement
 * - Suspense-based loading states with skeleton UI
 * - Background dashboard content loading
 * 
 * Context Integration:
 * - Product filter context for cross-component filtering
 * - Shared state management for filter persistence
 * - Centralized product selection handling
 * 
 * User Experience:
 * - Scroll-to-top functionality for long dashboard content
 * - Gradient background for visual appeal
 * - Responsive layout optimization
 * - Loading state management
 * 
 * Analytics Integration:
 * - Performance measurement tracking
 * - Page load time monitoring
 * - Component lifecycle tracking
 * - User interaction analytics
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * function App() {
 *   return <CirculationDashboard />;
 * }
 * 
 * // With error boundary
 * function AppWithErrorHandling() {
 *   return (
 *     <ErrorBoundary>
 *       <CirculationDashboard />
 *     </ErrorBoundary>
 *   );
 * }
 * 
 * // With custom product filters
 * function CustomCirculationApp() {
 *   return (
 *     <ProductFilterProvider initialProducts={['product1', 'product2']}>
 *       <CirculationDashboard />
 *     </ProductFilterProvider>
 *   );
 * }
 * ```
 * 
 * @returns {JSX.Element} The circulation dashboard with lazy-loaded content
 */
const CirculationDashboard = () => {
  React.useEffect(() => {
    PerformanceAnalytics.startMeasurement('CirculationDashboard page load');
    PerformanceAnalytics.markStep('CirculationDashboard component mounted');
    
    return () => {
      PerformanceAnalytics.endMeasurement('CirculationDashboard page load');
    };
  }, []);

  return (
    <ProductFilterProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Suspense fallback={<DashboardSkeleton />}>
          <CirculationDashboardContent />
        </Suspense>
        <ScrollToTopButton />
      </div>
    </ProductFilterProvider>
  );
};

export default CirculationDashboard;