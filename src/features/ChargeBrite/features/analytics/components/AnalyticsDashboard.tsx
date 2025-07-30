/**
 * @fileoverview Analytics Dashboard Main Component
 * 
 * Primary dashboard component providing comprehensive analytics visualization
 * and management capabilities. Orchestrates multiple analytics modules including
 * overview metrics, filtering, and tabbed navigation.
 * 
 * @author Analytics Team
 * @since 1.0.0
 */

import { useState } from 'react';
import { useAnalyticsOverview } from '../hooks/useAnalyticsData';
import AnalyticsTabNavigation from './AnalyticsTabNavigation';
import AnalyticsFilters from './AnalyticsFilters';
import { AnalyticsErrorBoundary } from '@/components/error-boundaries';

/**
 * Analytics Dashboard Component
 * 
 * Main analytics dashboard providing comprehensive subscriber intelligence,
 * behavioral analysis, and predictive modeling capabilities.
 * 
 * Features:
 * - Real-time analytics overview
 * - Interactive date range filtering
 * - Tabbed navigation for different analytics views
 * - Error boundary protection
 * - Loading and error state management
 * 
 * State Management:
 * - activeTab: Controls which analytics view is displayed
 * - dateRange: Manages date filtering across all analytics components
 * - overview: Real-time analytics overview data from API
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * function App() {
 *   return <AnalyticsDashboard />;
 * }
 * 
 * // With error boundary
 * function AppWithErrorHandling() {
 *   return (
 *     <ErrorBoundary>
 *       <AnalyticsDashboard />
 *     </ErrorBoundary>
 *   );
 * }
 * ```
 * 
 * @returns {JSX.Element} The analytics dashboard interface
 */
const AnalyticsDashboard = () => {
  const { data: overview, isLoading, error } = useAnalyticsOverview();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<{startDate?: Date; endDate?: Date}>({});

  /**
   * Handle tab change events
   * 
   * Updates the active tab state and triggers necessary data refreshes
   * for the selected analytics view.
   * 
   * @param {string} value - The tab identifier to activate
   */
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  /**
   * Handle date range filter changes
   * 
   * Updates the date range state which triggers data refresh across
   * all analytics components with the new date parameters.
   * 
   * @param {Date} [startDate] - Start date for filtering (optional)
   * @param {Date} [endDate] - End date for filtering (optional)
   */
  const handleDateRangeChange = (startDate?: Date, endDate?: Date) => {
    setDateRange({ startDate, endDate });
  };

  if (isLoading) {
    return <div>Loading analytics overview...</div>;
  }
  
  if (error) {
    return <div>Error loading analytics overview: {error.message}</div>;
  }

  return (
    <AnalyticsErrorBoundary>
      <div className="space-y-6">
        {/* Analytics Filters */}
        <AnalyticsFilters 
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

        {/* Analytics Tabs */}
        <AnalyticsTabNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          overview={overview}
        />
      </div>
    </AnalyticsErrorBoundary>
  );
};

export default AnalyticsDashboard;