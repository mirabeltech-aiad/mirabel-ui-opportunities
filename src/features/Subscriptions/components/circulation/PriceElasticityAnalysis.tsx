

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area } from 'recharts';
import { usePriceElasticityData } from '@/hooks/usePricingData';
import { HelpTooltip } from '@/components';

const PriceElasticityAnalysis = () => {
  const { data, isLoading } = usePriceElasticityData();

  if (isLoading || !data) {
    return <div>Loading price elasticity data...</div>;
  }

  const elasticityConfig = {
    demand: { label: "Demand", color: "#3b82f6" },
    revenue: { label: "Revenue", color: "#10b981" }
  };

  const segmentConfig = {
    print: { label: "Print", color: "#8b5cf6" },
    digital: { label: "Digital", color: "#f59e0b" },
    both: { label: "Both", color: "#ef4444" }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Price-Demand Curve</CardTitle>
              <HelpTooltip helpId="price-demand-curve" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={elasticityConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.demandCurve}>
                  <XAxis dataKey="price" label={{ value: 'Price ($)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Demand', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="demand" stroke="var(--color-demand)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-ocean-800">Revenue Optimization Curve</CardTitle>
              <HelpTooltip helpId="revenue-optimization-curve" />
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={elasticityConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueCurve}>
                  <XAxis dataKey="price" label={{ value: 'Price ($)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Revenue', angle: -90, position: 'insideLeft' }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Elasticity by Subscription Type</CardTitle>
            <HelpTooltip helpId="elasticity-by-subscription-type" />
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={segmentConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.elasticityByType}>
                <XAxis dataKey="price" label={{ value: 'Price ($)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Elasticity', angle: -90, position: 'insideLeft' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="print" stroke="var(--color-print)" strokeWidth={2} />
                <Line type="monotone" dataKey="digital" stroke="var(--color-digital)" strokeWidth={2} />
                <Line type="monotone" dataKey="both" stroke="var(--color-both)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-lg text-ocean-800">Print Subscriptions</CardTitle>
              <HelpTooltip helpId="print-elasticity" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Elasticity:</span>
                <span className="font-medium">{data.elasticityMetrics.print.elasticity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Optimal Price:</span>
                <span className="font-medium">${data.elasticityMetrics.print.optimalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Potential:</span>
                <span className="font-medium text-green-600">+{data.elasticityMetrics.print.revenuePotential}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-lg text-ocean-800">Digital Subscriptions</CardTitle>
              <HelpTooltip helpId="digital-elasticity" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Elasticity:</span>
                <span className="font-medium">{data.elasticityMetrics.digital.elasticity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Optimal Price:</span>
                <span className="font-medium">${data.elasticityMetrics.digital.optimalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Potential:</span>
                <span className="font-medium text-green-600">+{data.elasticityMetrics.digital.revenuePotential}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-lg text-ocean-800">Combined Subscriptions</CardTitle>
              <HelpTooltip helpId="combined-elasticity" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Elasticity:</span>
                <span className="font-medium">{data.elasticityMetrics.both.elasticity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Optimal Price:</span>
                <span className="font-medium">${data.elasticityMetrics.both.optimalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Potential:</span>
                <span className="font-medium text-green-600">+{data.elasticityMetrics.both.revenuePotential}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PriceElasticityAnalysis;
