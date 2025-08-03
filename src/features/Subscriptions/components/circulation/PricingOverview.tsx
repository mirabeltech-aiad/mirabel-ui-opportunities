

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Target, TestTube } from 'lucide-react';
import { usePricingMetrics } from '@/hooks/usePricingData';
import { HelpTooltip } from '@/components';

const PricingOverview = () => {
  const { data: metrics, isLoading, error } = usePricingMetrics();

  if (isLoading) return <div>Loading pricing metrics...</div>;
  if (error) return <div>Error loading pricing metrics</div>;
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Optimal Price Point</CardTitle>
            <HelpTooltip helpId="optimal-price-point" />
          </div>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${metrics.optimalPrice}</div>
          <p className="text-xs text-green-500">{metrics.priceConfidence}% confidence</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Price Elasticity</CardTitle>
            <HelpTooltip helpId="price-elasticity" />
          </div>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{metrics.priceElasticity}</div>
          <p className="text-xs text-blue-500">Demand sensitivity</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Revenue Impact</CardTitle>
            <HelpTooltip helpId="pricing-revenue-impact" />
          </div>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">+{metrics.revenueImpact}%</div>
          <p className="text-xs text-purple-500">Projected increase</p>
        </CardContent>
      </Card>

      <Card size="large" className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium text-black">Active A/B Tests</CardTitle>
            <HelpTooltip helpId="pricing-ab-tests" />
          </div>
          <TestTube className="h-4 w-4 text-rose-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">{metrics.activeTests}</div>
          <p className="text-xs text-rose-500">Running experiments</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingOverview;
