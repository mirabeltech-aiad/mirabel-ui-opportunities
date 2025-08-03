

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCirculationDataOrchestrator } from '@/hooks/useCirculationDataOrchestrator';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { HelpTooltip } from '@/components';

interface OptimizedCirculationOverviewProps {
  dateRange?: { startDate?: Date; endDate?: Date };
}

const OptimizedCirculationOverview: React.FC<OptimizedCirculationOverviewProps> = ({ dateRange }) => {
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

  // Calculate growth rate from new subscriptions
  const growthRate = metrics.data ? ((metrics.data.newThisMonth / metrics.data.total) * 100) : 0;
  
  // Calculate retention rate from churn rate (retention = 100 - churn)
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

export default OptimizedCirculationOverview;
