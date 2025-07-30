
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import { HelpTooltip } from '@/components';

interface CrossSellMetricsCardsProps {
  overallAttachRate: number;
  crossSellRevenue: number;
  avgProductsPerCustomer: number;
}

const CrossSellMetricsCards: React.FC<CrossSellMetricsCardsProps> = ({
  overallAttachRate,
  crossSellRevenue,
  avgProductsPerCustomer
}) => {
  // Mock additional metric for completeness
  const totalOpportunities = 2840;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Overall Attach Rate</CardTitle>
            <HelpTooltip helpId="overall-attach-rate" />
          </div>
          <Target className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 mb-1">{overallAttachRate}%</div>
          <p className="text-xs text-purple-300">cross-sell success</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Cross-Sell Revenue</CardTitle>
            <HelpTooltip helpId="cross-sell-revenue-metric" />
          </div>
          <DollarSign className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-1">${(crossSellRevenue / 1000).toFixed(0)}K</div>
          <p className="text-xs text-green-300">additional revenue</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Avg Products per Customer</CardTitle>
            <HelpTooltip helpId="avg-products-per-customer" />
          </div>
          <Users className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-1">{avgProductsPerCustomer.toFixed(1)}</div>
          <p className="text-xs text-blue-300">product adoption</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Total Opportunities</CardTitle>
            <HelpTooltip helpId="total-cross-sell-opportunities" />
          </div>
          <TrendingUp className="h-5 w-5 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-rose-600 mb-1">{totalOpportunities.toLocaleString()}</div>
          <p className="text-xs text-rose-300">customer base</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossSellMetricsCards;
