

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLifetimeValues } from '@/hooks/useAnalyticsData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Calendar } from 'lucide-react';
import { HelpTooltip } from '@/components';

const LifetimeValueAnalysis = () => {
  const { data: ltvData, isLoading, error } = useLifetimeValues();

  if (isLoading) return <div>Loading lifetime value data...</div>;
  if (error) return <div>Error loading lifetime value data</div>;
  if (!ltvData) return null;

  const chartData = ltvData.map(subscriber => ({
    currentLTV: subscriber.currentLTV,
    predictedLTV: subscriber.predictedLTV,
    monthsActive: subscriber.monthsActive,
    churnProbability: subscriber.churnProbability * 100,
    segment: subscriber.segment
  }));

  const averageLTV = ltvData.reduce((sum, sub) => sum + sub.currentLTV, 0) / ltvData.length;
  const totalRevenue = ltvData.reduce((sum, sub) => sum + sub.totalRevenue, 0);
  const averageMonthlySpend = ltvData.reduce((sum, sub) => sum + sub.averageMonthlySpend, 0) / ltvData.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-ocean-800">Lifetime Value Analysis</h2>
        <HelpTooltip helpId="lifetime-value-analysis" />
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Average Lifetime Value</CardTitle>
              <HelpTooltip helpId="average-lifetime-value" />
            </div>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${averageLTV.toFixed(2)}</div>
            <p className="text-xs text-green-300">Per customer</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
              <HelpTooltip helpId="total-revenue" />
            </div>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-blue-300">Cumulative revenue</p>
          </CardContent>
        </Card>

        <Card size="large" className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-black">Avg Monthly Spend</CardTitle>
              <HelpTooltip helpId="avg-monthly-spend" />
            </div>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${averageMonthlySpend.toFixed(2)}</div>
            <p className="text-xs text-purple-300">Per customer per month</p>
          </CardContent>
        </Card>
      </div>

      {/* LTV vs Predicted LTV Chart */}
      <Card size="large" className="bg-white">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Current vs Predicted Lifetime Value</CardTitle>
            <HelpTooltip helpId="current-vs-predicted-ltv" />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="currentLTV" 
                name="Current LTV" 
                type="number" 
                domain={['dataMin', 'dataMax']}
              />
              <YAxis 
                dataKey="predictedLTV" 
                name="Predicted LTV" 
                type="number" 
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => [`$${value}`, name]}
              />
              <Scatter 
                dataKey="predictedLTV" 
                fill="#3b82f6" 
                name="Predicted LTV"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed LTV Table */}
      <Card size="large" className="bg-white">
        <CardHeader>
          <div className="flex items-center">
            <CardTitle className="text-ocean-800">Subscriber Lifetime Value Details</CardTitle>
            <HelpTooltip helpId="ltv-details" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ltvData.map((subscriber) => (
              <div key={subscriber.subscriberId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{subscriber.subscriberId}</div>
                  <div className="text-sm text-gray-600">
                    {subscriber.monthsActive} months active • ${subscriber.averageMonthlySpend}/month
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {subscriber.segment.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-right">
                  <div>
                    <div className="text-sm font-medium">${subscriber.currentLTV}</div>
                    <div className="text-xs text-gray-500">Current LTV</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">${subscriber.predictedLTV}</div>
                    <div className="text-xs text-gray-500">Predicted LTV</div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${
                      subscriber.churnProbability < 0.3 ? 'text-green-600' : 
                      subscriber.churnProbability < 0.6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(subscriber.churnProbability * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Churn Risk</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LifetimeValueAnalysis;
