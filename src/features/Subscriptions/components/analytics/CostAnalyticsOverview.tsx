

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, Target, Calculator } from 'lucide-react';
import { useCostMetrics } from '@/hooks/useCostAnalytics';
import { HelpTooltip } from '@/components';

const CostAnalyticsOverview = () => {
  const { data: metrics, isLoading } = useCostMetrics();

  if (isLoading || !metrics) {
    return <div>Loading cost metrics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Total Costs</CardTitle>
            <HelpTooltip helpId="total-costs" />
          </div>
          <DollarSign className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ${metrics.totalCosts.toLocaleString()}
          </div>
          <p className="text-xs text-red-500">Monthly operating costs</p>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Cost Per Subscriber</CardTitle>
            <HelpTooltip helpId="cost-per-subscriber" />
          </div>
          <Calculator className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            ${metrics.costPerSubscriber.toFixed(2)}
          </div>
          <p className="text-xs text-orange-500">Average monthly cost</p>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Profit Margin</CardTitle>
            <HelpTooltip helpId="profit-margin" />
          </div>
          <Target className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {metrics.profitMargin.toFixed(1)}%
          </div>
          <p className="text-xs text-green-500">Overall profitability</p>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">ROI</CardTitle>
            <HelpTooltip helpId="roi" />
          </div>
          <TrendingDown className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.roi.toFixed(1)}%
          </div>
          <p className="text-xs text-blue-500">Return on investment</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostAnalyticsOverview;
