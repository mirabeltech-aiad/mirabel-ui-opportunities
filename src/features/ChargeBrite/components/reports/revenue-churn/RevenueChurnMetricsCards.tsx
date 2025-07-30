
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users, AlertTriangle, Target } from 'lucide-react';
import { RevenueChurnMetrics } from './types';
import HelpTooltip from '@/components/shared/HelpTooltip';

interface RevenueChurnMetricsCardsProps {
  metrics: RevenueChurnMetrics;
}

const RevenueChurnMetricsCards: React.FC<RevenueChurnMetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Gross Revenue Churn</CardTitle>
            <HelpTooltip helpId="gross-revenue-churn" />
          </div>
          <TrendingDown className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">{metrics.grossRevenueChurnRate}%</div>
          <p className="text-xs text-rose-300">total revenue lost</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Net Revenue Churn</CardTitle>
            <HelpTooltip helpId="net-revenue-churn-rate" />
          </div>
          <Target className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{metrics.netRevenueChurnRate}%</div>
          <p className="text-xs text-purple-300">after expansions</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">MRR Lost</CardTitle>
            <HelpTooltip helpId="mrr-lost" />
          </div>
          <DollarSign className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">${(metrics.mrrLost / 1000).toFixed(0)}K</div>
          <p className="text-xs text-orange-300">monthly recurring</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Avg Revenue per Lost Customer</CardTitle>
            <HelpTooltip helpId="avg-revenue-per-lost-customer" />
          </div>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">${metrics.averageRevenuePerLostCustomer}</div>
          <p className="text-xs text-blue-300">per customer</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Monthly Change</CardTitle>
            <HelpTooltip helpId="monthly-churn-change" />
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{metrics.monthlyChange > 0 ? '+' : ''}{metrics.monthlyChange}%</div>
          <p className="text-xs text-green-300">vs last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueChurnMetricsCards;
