

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { AnalyticsOverview } from '@/types/analytics';
import { HelpTooltip } from '@/components';
import MetricTooltip from '@/components/MetricTooltip';

interface AnalyticsOverviewCardsProps {
  overview: AnalyticsOverview;
}

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
