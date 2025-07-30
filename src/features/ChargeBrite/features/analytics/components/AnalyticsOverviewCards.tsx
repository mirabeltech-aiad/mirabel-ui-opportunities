/**
 * @fileoverview Analytics Overview Cards Component
 * 
 * High-level metric display cards providing key analytics insights at a glance.
 * Features responsive grid layout, semantic color coding, and interactive tooltips.
 * 
 * @author Analytics Team
 * @since 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { AnalyticsOverview } from '../types';
import { HelpTooltip } from '@/components';
import MetricTooltip from '@/components/MetricTooltip';

/**
 * Component props for AnalyticsOverviewCards
 * 
 * @interface AnalyticsOverviewCardsProps
 * @property {AnalyticsOverview} overview - Complete analytics overview data
 */
interface AnalyticsOverviewCardsProps {
  /** Analytics overview data containing all key metrics */
  overview: AnalyticsOverview;
}

/**
 * Analytics Overview Cards Component
 * 
 * Displays key analytics metrics in a responsive card grid layout.
 * Each card represents a critical business metric with visual indicators,
 * help tooltips, and semantic color coding.
 * 
 * Card Types:
 * 1. Total Subscribers - Active subscriber count with blue accent
 * 2. Average LTV - Lifetime value with green accent for revenue
 * 3. Engagement Score - Overall engagement with purple accent
 * 4. Critical Churn Risk - At-risk subscribers with red accent for alerts
 * 
 * Design Features:
 * - Responsive grid layout (1-4 columns based on screen size)
 * - Semantic color coding per metric type
 * - Interactive help tooltips for metric explanations
 * - Large white cards with proper contrast ratios
 * - Consistent typography and spacing
 * 
 * Accessibility:
 * - Proper color contrast ratios
 * - Screen reader friendly markup
 * - Keyboard navigation support via help tooltips
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage with overview data
 * const overview = {
 *   totalSubscribers: 125670,
 *   averageLTV: 315.40,
 *   overallEngagementScore: 72,
 *   churnRisk: { critical: 6200, high: 12680, medium: 28340, low: 78450 }
 * };
 * 
 * function Dashboard() {
 *   return <AnalyticsOverviewCards overview={overview} />;
 * }
 * 
 * // With loading state handling
 * function DashboardWithLoading() {
 *   const { data: overview, isLoading } = useAnalyticsOverview();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   return <AnalyticsOverviewCards overview={overview} />;
 * }
 * ```
 * 
 * @param {AnalyticsOverviewCardsProps} props - Component props
 * @returns {JSX.Element} Grid of analytics overview cards
 */
const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({ overview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card size="large" className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Total Subscribers</CardTitle>
            <HelpTooltip helpId="total-subscribers" />
          </div>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{overview.totalSubscribers.toLocaleString()}</div>
          <p className="text-xs text-blue-500">Active subscribers</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Average LTV</CardTitle>
            <HelpTooltip helpId="average-ltv" />
          </div>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${overview.averageLTV}</div>
          <p className="text-xs text-green-500">Lifetime value</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Engagement Score</CardTitle>
            <HelpTooltip helpId="engagement-score" />
          </div>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{overview.overallEngagementScore}/100</div>
          <p className="text-xs text-purple-500">Overall engagement</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Critical Churn Risk</CardTitle>
            <HelpTooltip helpId="critical-churn-risk" />
          </div>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">{overview.churnRisk.critical}</div>
          <p className="text-xs text-rose-500">At-risk subscribers</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsOverviewCards;