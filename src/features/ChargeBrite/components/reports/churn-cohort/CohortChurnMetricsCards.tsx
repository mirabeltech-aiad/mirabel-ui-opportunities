
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Calendar, Target, Activity } from 'lucide-react';
import { CohortChurnMetrics } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface CohortChurnMetricsCardsProps {
  data: CohortChurnMetrics;
}

const CohortChurnMetricsCards: React.FC<CohortChurnMetricsCardsProps> = ({ data }) => {
  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return '0.0%';
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'improving' ? (
      <TrendingUp className="h-5 w-5 text-green-500" />
    ) : (
      <TrendingDown className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Total Cohorts</CardTitle>
            <HelpTooltip helpId="total-cohorts" />
          </div>
          <Calendar className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-1">{data?.totalCohorts || 0}</div>
          <p className="text-xs text-gray-600">
            Active cohorts tracked
          </p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Avg Retention Rate</CardTitle>
            <HelpTooltip helpId="avg-retention-rate" />
          </div>
          <Users className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {formatPercentage(data?.avgRetentionRate)}
          </div>
          <p className="text-xs text-gray-600">
            Across all cohorts
          </p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Best Cohort</CardTitle>
            <HelpTooltip helpId="best-cohort-retention" />
          </div>
          <Target className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {formatPercentage(data?.bestCohortRetention)}
          </div>
          <p className="text-xs text-gray-600">
            Highest retention rate
          </p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Worst Cohort</CardTitle>
            <HelpTooltip helpId="worst-cohort-retention" />
          </div>
          <Target className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600 mb-1">
            {formatPercentage(data?.worstCohortRetention)}
          </div>
          <p className="text-xs text-gray-600">
            Lowest retention rate
          </p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Avg Churn Rate</CardTitle>
            <HelpTooltip helpId="avg-churn-rate" />
          </div>
          <Activity className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {formatPercentage(data?.avgChurnRate)}
          </div>
          <p className="text-xs text-gray-600">
            Overall churn average
          </p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Cohort Trend</CardTitle>
            <HelpTooltip helpId="cohort-trend" />
          </div>
          {getTrendIcon(data?.cohortTrend || 'stable')}
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold mb-1 ${data?.cohortTrend === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
            {data?.cohortTrend === 'improving' ? '+' : '-'}2.3%
          </div>
          <p className="text-xs text-gray-600">
            Month-over-month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CohortChurnMetricsCards;
