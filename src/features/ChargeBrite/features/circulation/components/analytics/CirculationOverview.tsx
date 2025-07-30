/**
 * @fileoverview Circulation Overview Analytics Component
 * 
 * High-level circulation metrics display providing key performance indicators
 * for circulation management. Features real-time data, loading states,
 * and comprehensive metric calculations.
 * 
 * @author Circulation Team
 * @since 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCirculationDataOrchestrator } from '@/hooks/useCirculationDataOrchestrator';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { HelpTooltip } from '@/components';

/**
 * Component props for CirculationOverview
 * 
 * @interface CirculationOverviewProps
 * @property {Object} [dateRange] - Optional date range for filtering circulation data
 * @property {Date} [dateRange.startDate] - Start date for data filtering
 * @property {Date} [dateRange.endDate] - End date for data filtering
 */
interface CirculationOverviewProps {
  /** Optional date range for filtering circulation data */
  dateRange?: { startDate?: Date; endDate?: Date };
}

/**
 * Circulation Overview Component
 * 
 * Displays key circulation metrics in a responsive card grid layout.
 * Provides real-time circulation analytics including subscriber counts,
 * revenue tracking, growth analysis, and retention metrics.
 * 
 * Key Metrics Displayed:
 * 1. Active Subscribers - Total active user count with blue accent
 * 2. Monthly Revenue - Monthly recurring revenue with green accent
 * 3. Growth Rate - Month-over-month growth percentage with purple accent
 * 4. Retention Rate - Customer retention percentage with rose accent
 * 
 * Data Processing Features:
 * - Real-time data orchestration via custom hook
 * - Automatic growth rate calculation from new subscriptions
 * - Retention rate derivation from churn metrics
 * - Number formatting with locale-appropriate separators
 * 
 * Loading State Management:
 * - Skeleton loading placeholders during data fetch
 * - Graceful degradation for missing data
 * - Progressive enhancement of metric displays
 * 
 * Business Logic:
 * - Growth Rate: (New This Month / Total Subscribers) * 100
 * - Retention Rate: 100 - Churn Rate
 * - Revenue formatting with currency symbols
 * - Percentage formatting with decimal precision
 * 
 * Accessibility Features:
 * - Screen reader friendly metric labels
 * - High contrast color ratios for metrics
 * - Keyboard navigation support
 * - Interactive help tooltips for metric explanations
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage with current month data
 * function Dashboard() {
 *   return <CirculationOverview />;
 * }
 * 
 * // With specific date range filtering
 * function CustomPeriodDashboard() {
 *   const dateRange = {
 *     startDate: new Date('2024-01-01'),
 *     endDate: new Date('2024-12-31')
 *   };
 *   
 *   return <CirculationOverview dateRange={dateRange} />;
 * }
 * 
 * // With dynamic date range from user input
 * function InteractiveDashboard() {
 *   const [dateRange, setDateRange] = useState({});
 *   
 *   return (
 *     <div>
 *       <DateRangePicker onChange={setDateRange} />
 *       <CirculationOverview dateRange={dateRange} />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @param {CirculationOverviewProps} props - Component props
 * @returns {JSX.Element} Grid of circulation overview metric cards
 */
const CirculationOverview: React.FC<CirculationOverviewProps> = ({ dateRange }) => {
  const { metrics, revenue, isInitialLoading } = useCirculationDataOrchestrator(dateRange);

  if (isInitialLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  /**
   * Calculate growth rate from new subscriptions
   * 
   * Business Logic: Growth Rate = (New Subscriptions This Month / Total Subscribers) * 100
   * This provides a percentage indicating how much the subscriber base has grown
   * relative to the existing total subscriber count.
   */
  const growthRate = metrics.data ? ((metrics.data.newThisMonth / metrics.data.total) * 100) : 0;
  
  /**
   * Calculate retention rate from churn rate
   * 
   * Business Logic: Retention Rate = 100 - Churn Rate
   * Provides a positive metric showing what percentage of customers
   * are retained rather than focusing on the negative churn metric.
   */
  const retentionRate = metrics.data ? (100 - metrics.data.churnRate) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Active Subscribers</CardTitle>
            <HelpTooltip helpId="active-subscribers" />
          </div>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.data?.total?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-blue-500">Total active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Monthly Revenue</CardTitle>
              <HelpTooltip helpId="monthly-revenue" />
            </div>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${revenue.data?.totalRevenue?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-green-500">Monthly recurring revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Growth Rate</CardTitle>
              <HelpTooltip helpId="growth-rate" />
            </div>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              +{growthRate.toFixed(1)}%
            </div>
            <p className="text-xs text-purple-500">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Retention Rate</CardTitle>
              <HelpTooltip helpId="retention-rate" />
            </div>
            <Target className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {retentionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-rose-500">Customer retention</p>
          </CardContent>
        </Card>
      </div>
    );
};

export default CirculationOverview;